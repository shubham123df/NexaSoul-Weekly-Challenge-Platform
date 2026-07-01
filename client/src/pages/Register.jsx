import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, CreditCard, GraduationCap, Building2, Rocket, Sparkles, Shield } from 'lucide-react';
import { quizApi } from '../api/client';

const departments = [
  'Computer Science Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other',
];

const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    uid: '',
    email: '',
    mobile: '',
    department: '',
    year: '',
  });
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.uid || !form.email || !form.mobile || !form.department || !form.year) {
      return 'All fields are required';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return 'Please enter a valid email';
    }

    if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, ''))) {
      return 'Please enter a valid 10-digit mobile number';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setChecking(true);
    try {
      await quizApi.checkEmail(form.email);
    } catch (err) {
      setChecking(false);
      if (err.response?.status === 409) {
        setError('This email has already submitted this week\'s quiz. Check the leaderboard!');
      } else if (!err.response) {
        // Network error - backend not running
        console.warn('Backend not available, allowing registration anyway');
        sessionStorage.setItem('nexasoul_registration', JSON.stringify(form));
        navigate('/instructions');
        return;
      } else {
        setError(err.response?.data?.message || 'Unable to verify email. Please try again.');
      }
      return;
    }

    sessionStorage.setItem('nexasoul_registration', JSON.stringify(form));
    navigate('/instructions');
  };

  return (
    <div className="max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 sm:p-8 relative overflow-hidden hover-lift"
      >
        {/* Decorative glows */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-nexa-blue/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-nexa-green/10 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-nexa-blue text-sm font-semibold mb-4"
            >
              <Sparkles className="w-4 h-4" />
              Week 1 Challenge
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Quiz <span className="text-gradient">Registration</span>
            </h1>
            <p className="text-nexa-muted">Fill in your details to start the NexaSoul Trivia Challenge.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: User },
              { name: 'uid', label: 'UID', type: 'text', placeholder: 'CU1234567', icon: CreditCard },
              { name: 'email', label: 'Email ID', type: 'email', placeholder: 'john@example.com', icon: Mail },
              { name: 'mobile', label: 'Mobile Number', type: 'tel', placeholder: '9876543210', icon: Phone },
            ].map((field) => (
              <motion.div
                key={field.name}
                whileHover={{ scale: 1.01 }}
                className="group"
              >
                <label className="block text-sm text-nexa-muted mb-1">{field.label}</label>
                <div className="relative">
                  <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-nexa-muted group-focus-within:text-nexa-blue transition-colors" />
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="input-field pl-11"
                  />
                </div>
              </motion.div>
            ))}

            <motion.div whileHover={{ scale: 1.01 }} className="group">
              <label className="block text-sm text-nexa-muted mb-1">Department</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-nexa-muted group-focus-within:text-nexa-blue transition-colors" />
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="input-field pl-11"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} className="group">
              <label className="block text-sm text-nexa-muted mb-1">Year</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-nexa-muted group-focus-within:text-nexa-blue transition-colors" />
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="input-field pl-11"
                >
                  <option value="">Select Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={checking}
              className="btn-primary w-full mt-6 inline-flex items-center justify-center gap-2 hover-glow"
            >
              {checking ? (
                <span className="animate-pulse">Verifying...</span>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Continue to Instructions
                  <Rocket className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
