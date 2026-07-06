import { motion } from 'framer-motion';
import { type KeyboardEvent, useRef, useState } from 'react';
import { cn } from '../lib/utils';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const OTPInput = ({
  length = 6,
  value,
  onChange,
  className,
  disabled = false,
}: OTPInputProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOTPValues] = useState<string[]>(
    value.split('').concat(Array(length - value.length).fill('')),
  );

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) return;

    const newOTP = [...otpValues];
    newOTP[index] = val;
    setOTPValues(newOTP);

    const otpString = newOTP.join('');
    onChange(otpString);

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOTP = [...otpValues];
      newOTP[index - 1] = '';
      setOTPValues(newOTP);
      onChange(newOTP.join(''));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    const pastedArray = pastedData.split('');

    const newOTP = [...otpValues];
    pastedArray.forEach((char, idx) => {
      if (idx < length) {
        newOTP[idx] = char;
      }
    });

    setOTPValues(newOTP);
    onChange(newOTP.join(''));

    const lastFilledIndex = newOTP.findIndex((val) => !val);
    if (lastFilledIndex === -1) {
      inputRefs.current[length - 1]?.focus();
    } else {
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  return (
    <div className={cn('flex gap-3 justify-center', className)}>
      {Array(length)
        .fill(null)
        .map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <input
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
              ref={(el) => (inputRefs.current[index] = el)}
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              maxLength={1}
              value={otpValues[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              onPaste={handlePaste}
              disabled={disabled}
              className={cn(
                'w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-primary/30',
                'bg-white/80 backdrop-blur-sm text-text-primary',
                disabled && 'opacity-50 cursor-not-allowed',
                focusedIndex === index
                  ? 'border-primary shadow-lg shadow-primary/25 scale-105'
                  : 'border-sand-dark/40 hover:border-primary/50',
                otpValues[index]
                  ? 'border-primary bg-primary/5'
                  : 'border-sand-dark/40',
              )}
            />
          </motion.div>
        ))}
    </div>
  );
};
