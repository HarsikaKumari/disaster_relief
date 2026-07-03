import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  Globe,
  CheckCircle,
  Loader2,
  Sparkles,
  Building2,
  Users,
  Heart,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

// ============================================
// CONTACT PAGE
// ============================================

export const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className='w-5 h-5' />,
      title: 'Email',
      details: 'support@disasterrelief.org',
      link: 'mailto:support@disasterrelief.org',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: <Phone className='w-5 h-5' />,
      title: 'Phone',
      details: '+91 1800 123 4567',
      link: 'tel:+9118001234567',
      color: 'bg-success/10 text-success',
    },
    {
      icon: <MapPin className='w-5 h-5' />,
      title: 'Office',
      details: 'New Delhi, India',
      link: 'https://maps.google.com',
      color: 'bg-error/10 text-error',
    },
    {
      icon: <Clock className='w-5 h-5' />,
      title: 'Working Hours',
      details: '24/7 - Always Available',
      link: '#',
      color: 'bg-info/10 text-info',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-sand-light via-white to-secondary/20'>
      {/* ========== HERO SECTION ========== */}
      <section className='relative py-16 md:py-24 bg-gradient-olive text-white overflow-hidden'>
        <div className='absolute inset-0 bg-white/5' />
        <div className='absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
        <div className='absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2' />

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6'>
              <Sparkles className='w-4 h-4' />
              Get in Touch
            </div>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-4'>
              Contact Us
              <br />
              <span className='text-sand-light'>We're Here to Help</span>
            </h1>
            <p className='text-white/70 text-lg max-w-2xl mx-auto leading-relaxed'>
              Have questions or want to get involved? Reach out to us and we'll
              get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========== CONTACT INFO CARDS ========== */}
      <section className='py-12 bg-white border-y border-sand-dark/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {contactInfo.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel={
                  item.link.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className='bg-white/60 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group'
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </div>
                <h4 className='text-sm font-semibold text-text-primary'>
                  {item.title}
                </h4>
                <p className='text-xs text-text-tertiary mt-1'>
                  {item.details}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CONTACT FORM + OFFICE ========== */}
      <section className='py-16 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-2 gap-12'>
            {/* ===== FORM ===== */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className='bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 border border-white/40'>
                <div className='flex items-center gap-3 mb-6 pb-4 border-b border-white/20'>
                  <div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center'>
                    <MessageCircle className='w-5 h-5 text-primary' />
                  </div>
                  <div>
                    <h2 className='text-lg font-bold text-text-primary'>
                      Send a Message
                    </h2>
                    <p className='text-xs text-text-tertiary'>
                      We'll respond within 24 hours
                    </p>
                  </div>
                  <Badge className='ml-auto bg-success/10 text-success border-success/20 text-[10px]'>
                    <Clock className='w-2.5 h-2.5 mr-1' />
                    Fast Response
                  </Badge>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className='py-8 text-center'
                  >
                    <div className='w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto'>
                      <CheckCircle className='w-10 h-10 text-success' />
                    </div>
                    <h3 className='text-xl font-bold text-text-primary mt-4'>
                      Message Sent!
                    </h3>
                    <p className='text-sm text-text-secondary mt-2'>
                      Thank you for reaching out. We'll get back to you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className='space-y-4'
                  >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-1.5'>
                        <Label className='text-sm font-medium text-text-primary'>
                          Full Name *
                        </Label>
                        <Input
                          id='name'
                          value={formData.name}
                          onChange={handleChange}
                          placeholder='Enter your name'
                          className='bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-11 text-sm'
                          required
                        />
                      </div>
                      <div className='space-y-1.5'>
                        <Label className='text-sm font-medium text-text-primary'>
                          Email *
                        </Label>
                        <Input
                          id='email'
                          type='email'
                          value={formData.email}
                          onChange={handleChange}
                          placeholder='Enter your email'
                          className='bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-11 text-sm'
                          required
                        />
                      </div>
                    </div>

                    <div className='space-y-1.5'>
                      <Label className='text-sm font-medium text-text-primary'>
                        Subject
                      </Label>
                      <Input
                        id='subject'
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder='What is this regarding?'
                        className='bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-11 text-sm'
                      />
                    </div>

                    <div className='space-y-1.5'>
                      <Label className='text-sm font-medium text-text-primary'>
                        Message *
                      </Label>
                      <textarea
                        id='message'
                        value={formData.message}
                        onChange={handleChange}
                        placeholder='Tell us how we can help...'
                        rows={4}
                        className='w-full bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm placeholder:text-text-tertiary/50 resize-none'
                        required
                      />
                    </div>

                    <Button
                      type='submit'
                      disabled={loading}
                      className='w-full bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl shadow-lg shadow-primary/20 h-12 font-medium transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]'
                    >
                      {loading ? (
                        <>
                          <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className='w-4 h-4 mr-2' />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* ===== RIGHT SIDE ===== */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='space-y-6'
            >
              {/* Office Location */}
              <div className='bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-primary/5 border border-white/40'>
                <h3 className='text-lg font-bold text-text-primary mb-4 flex items-center gap-2'>
                  <Building2 className='w-5 h-5 text-primary' />
                  Our Office
                </h3>
                <div className='aspect-video rounded-2xl overflow-hidden bg-sand-light/50 border border-white/30'>
                  <div className='w-full h-full flex items-center justify-center text-text-tertiary flex-col gap-2'>
                    <MapPin className='w-12 h-12 text-text-tertiary/30' />
                    <p className='text-sm'>📍 New Delhi, India</p>
                    <p className='text-xs text-text-tertiary/50'>
                      Click to view on map
                    </p>
                  </div>
                </div>
                <div className='mt-4 space-y-2 text-sm text-text-secondary'>
                  <p className='flex items-center gap-2'>
                    <Building2 className='w-4 h-4 text-text-tertiary' />
                    Disaster Relief Coordination Platform
                  </p>
                  <p className='flex items-center gap-2'>
                    <MapPin className='w-4 h-4 text-text-tertiary' />
                    New Delhi, India - 110001
                  </p>
                </div>
              </div>

              {/* Quick Response */}
              <div className='bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-6 text-white shadow-xl shadow-primary/20'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0'>
                    <Users className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h4 className='font-semibold'>24/7 Emergency Support</h4>
                    <p className='text-white/70 text-sm'>
                      Call us anytime for urgent help
                    </p>
                  </div>
                </div>
                <div className='mt-4 flex items-center gap-3'>
                  <Phone className='w-5 h-5 text-sand-light' />
                  <span className='text-lg font-bold'>+91 1800 123 4567</span>
                </div>
                <div className='mt-2 flex items-center gap-3'>
                  <Mail className='w-5 h-5 text-sand-light' />
                  <span className='text-sm text-white/80'>
                    emergency@disasterrelief.org
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className='py-16 bg-gradient-olive text-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold mb-4'>
            Want to Make a Difference?
          </h2>
          <p className='text-white/70 text-lg max-w-2xl mx-auto mb-8'>
            Join our team of volunteers and help us save lives during disasters.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/register'>
              <button className='bg-white text-primary hover:bg-sand-light px-8 py-3 rounded-xl font-medium shadow-lg shadow-black/20 hover:shadow-black/30 transition-all duration-300 inline-flex items-center gap-2'>
                <Users className='w-5 h-5' />
                Become a Volunteer
              </button>
            </Link>
            <Link to='/about'>
              <button className='bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 px-8 py-3 rounded-xl font-medium transition-all duration-300 inline-flex items-center gap-2'>
                <Heart className='w-5 h-5' />
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
