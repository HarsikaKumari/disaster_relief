import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  Target,
  Users,
  Heart,
  Globe,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Building2,
  Handshake,
  BadgeCheck,
} from 'lucide-react';

export const About = () => {
  const stats = [
    {
      icon: <Users className='w-6 h-6' />,
      value: '2,000+',
      label: 'Active Volunteers',
    },
    {
      icon: <Globe className='w-6 h-6' />,
      value: '50+',
      label: 'Countries Covered',
    },
    {
      icon: <Clock className='w-6 h-6' />,
      value: '24/7',
      label: 'Emergency Support',
    },
    {
      icon: <Award className='w-6 h-6' />,
      value: '500+',
      label: 'Emergencies Handled',
    },
  ];

  const values = [
    {
      icon: <Heart className='w-8 h-8' />,
      title: 'Compassion',
      description: 'We put humanity first in everything we do.',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: <Shield className='w-8 h-8' />,
      title: 'Integrity',
      description: 'Transparent and accountable in all our actions.',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: <Target className='w-8 h-8' />,
      title: 'Excellence',
      description: 'Striving for the highest standards in relief efforts.',
      color: 'bg-success/10 text-success',
    },
    {
      icon: <Handshake className='w-8 h-8' />,
      title: 'Collaboration',
      description: 'Working together for greater impact.',
      color: 'bg-info/10 text-info',
    },
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Platform Launched',
      description: 'Started with a vision to revolutionize disaster response.',
    },
    {
      year: '2021',
      title: 'First Major Response',
      description: 'Successfully coordinated relief during floods in Kerala.',
    },
    {
      year: '2022',
      title: 'Global Expansion',
      description: 'Expanded operations to 10 countries across Asia.',
    },
    {
      year: '2023',
      title: 'AI Integration',
      description: 'Implemented AI for faster emergency response.',
    },
    {
      year: '2024',
      title: '50+ Countries',
      description: 'Reached over 50 countries with our coordination platform.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

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
              About Us
            </div>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-4'>
              Making a Difference
              <br />
              <span className='text-sand-light'>When It Matters Most</span>
            </h1>
            <p className='text-white/70 text-lg max-w-2xl mx-auto leading-relaxed'>
              We are a global platform dedicated to coordinating disaster relief
              efforts, connecting volunteers, organizations, and communities in
              times of crisis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className='py-12 bg-white border-y border-sand-dark/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className='text-center'
              >
                <div className='flex justify-center mb-3 text-primary'>
                  {stat.icon}
                </div>
                <div className='text-2xl md:text-3xl font-bold text-primary'>
                  {stat.value}
                </div>
                <div className='text-sm text-text-secondary mt-1'>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MISSION & VISION ========== */}
      <section className='py-16 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-2 gap-12'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4'>
                <Target className='w-6 h-6 text-primary' />
              </div>
              <h2 className='text-2xl font-bold text-primary mb-3'>
                Our Mission
              </h2>
              <p className='text-text-secondary leading-relaxed'>
                To streamline disaster response through innovative technology,
                connecting relief organizations, volunteers, and affected
                communities to ensure timely and effective aid delivery.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className='w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4'>
                <Globe className='w-6 h-6 text-accent' />
              </div>
              <h2 className='text-2xl font-bold text-primary mb-3'>
                Our Vision
              </h2>
              <p className='text-text-secondary leading-relaxed'>
                A world where no community faces disaster alone — where
                technology bridges gaps, saves lives, and builds resilience for
                future generations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== VALUES SECTION ========== */}
      <section className='py-16 md:py-20 bg-sand-light/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-12'
          >
            <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4'>
              <Heart className='w-4 h-4' />
              Our Values
            </div>
            <h2 className='text-3xl font-bold text-primary'>
              What We Stand For
            </h2>
          </motion.div>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
            className='grid md:grid-cols-4 gap-6'
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow border border-sand-dark/20'
              >
                <div
                  className={`w-12 h-12 rounded-xl ${value.color} flex items-center justify-center mb-4`}
                >
                  {value.icon}
                </div>
                <h3 className='text-lg font-semibold text-text-primary mb-2'>
                  {value.title}
                </h3>
                <p className='text-sm text-text-secondary'>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== MILESTONES ========== */}
      <section className='py-16 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-12'
          >
            <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4'>
              <Award className='w-4 h-4' />
              Our Journey
            </div>
            <h2 className='text-3xl font-bold text-primary'>Key Milestones</h2>
          </motion.div>

          <div className='relative'>
            {/* Timeline Line */}
            <div className='absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2' />

            <div className='space-y-8'>
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-start md:items-center gap-4 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div
                    className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                  >
                    <div className='bg-white rounded-xl p-5 shadow-soft border border-sand-dark/20 hover:shadow-medium transition-shadow'>
                      <span className='text-primary font-bold text-lg'>
                        {milestone.year}
                      </span>
                      <h3 className='font-semibold text-text-primary mt-1'>
                        {milestone.title}
                      </h3>
                      <p className='text-sm text-text-secondary mt-1'>
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center z-10 mx-4 md:mx-0 flex-shrink-0'>
                    <CheckCircle className='w-4 h-4 text-white' />
                  </div>

                  <div className='hidden md:block w-5/12' />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className='py-16 bg-gradient-olive text-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold mb-4'>Join Our Mission</h2>
          <p className='text-white/70 text-lg max-w-2xl mx-auto mb-8'>
            Be part of a global community making a real difference in disaster
            relief.
          </p>
          <Link to='/register'>
            <button className='bg-white text-primary hover:bg-sand-light px-8 py-3 rounded-xl font-medium shadow-lg shadow-black/20 hover:shadow-black/30 transition-all duration-300 inline-flex items-center gap-2'>
              Get Involved
              <ArrowRight className='w-5 h-5' />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};
