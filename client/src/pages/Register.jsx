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
      // Check email first
      await quizApi.checkEmail(form.email);
      
      // Check if UID has already submitted this week
      await quizApi.checkWeeklyUID(form.uid);
    } catch (err) {
      setChecking(false);
      if (err.response?.status === 409) {
        setError('You have already attempted this week\'s challenge. Try again next week!');
      } else if (!err.response) {
        // Network error - backend not running
        console.warn('Backend not available, allowing registration anyway');
        sessionStorage.setItem('nexasoul_registration', JSON.stringify(form));
        navigate('/instructions');
        return;
      } else {
        setError(err.response?.data?.message || 'Unable to verify details. Please try again.');
      }
      return;
    }

    sessionStorage.setItem('nexasoul_registration', JSON.stringify(form));
    sessionStorage.removeItem('nexasoul_quiz_state');
    navigate('/instructions');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        
        {/* Left decorative section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block lg:col-span-2 space-y-6"
        >
          <div className="bg-gradient-to-br from-primary/10 to-accent-cyan/10 p-6 rounded-2xl relative overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
            <motion.div 
              className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-pulse-slow"
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-black mb-4">Why Register?</h3>
              <ul className="space-y-3">
                {[
                  'Compete with peers',
                  'Test your knowledge',
                  'Win exciting prizes',
                  'Track your progress'
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 text-black font-medium text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent-lime/10 to-accent-yellow/10 p-6 rounded-2xl relative overflow-hidden border-2 border-accent-lime/30 shadow-lg shadow-accent-lime/20">
            <motion.div 
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-lime/30 rounded-full blur-3xl animate-pulse-slow"
              style={{ animationDelay: '1s' }}
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-black mb-4">Challenge Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">Duration</span>
                  <span className="font-bold text-primary">20 min</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">Questions</span>
                  <span className="font-bold text-accent-cyan">20 MCQs</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">Max Score</span>
                  <span className="font-bold text-accent-green">300 pts</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right form section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 sm:p-8 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20 relative overflow-hidden hover-lift">
            {/* Decorative glows */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-lime/20 rounded-full blur-3xl animate-pulse-slow" />

            <div className="relative z-10">
              <div className="text-center mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight text-black">
                  Quiz Registration
                </h1>
                <p className="text-black font-medium">Fill in your details to start the NexaSoul Trivia Challenge.</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-500/10 border-2 border-red-500/30 text-red-500 text-sm font-semibold"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: User },
                    { name: 'uid', label: 'UID', type: 'text', placeholder: 'CU1234567', icon: CreditCard },
                  ].map((field) => (
                    <motion.div
                      key={field.name}
                      whileHover={{ scale: 1.01 }}
                      className="group"
                    >
                      <label className="block text-sm font-semibold text-black mb-1">{field.label}</label>
                      <div className="relative">
                        <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary group-focus-within:text-primary transition-colors" />
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="input-field pl-11 bg-white border-2 border-primary/30 focus:border-primary"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: 'email', label: 'Email ID', type: 'email', placeholder: 'john@example.com', icon: Mail },
                    { name: 'mobile', label: 'Mobile Number', type: 'tel', placeholder: '9876543210', icon: Phone },
                  ].map((field) => (
                    <motion.div
                      key={field.name}
                      whileHover={{ scale: 1.01 }}
                      className="group"
                    >
                      <label className="block text-sm font-semibold text-black mb-1">{field.label}</label>
                      <div className="relative">
                        <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary group-focus-within:text-primary transition-colors" />
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="input-field pl-11 bg-white border-2 border-primary/30 focus:border-primary"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.01 }} className="group">
                    <label className="block text-sm font-semibold text-black mb-1">Department</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary group-focus-within:text-primary transition-colors" />
                      <select
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        className="input-field pl-11 bg-white border-2 border-primary/30 focus:border-primary"
                      >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.01 }} className="group">
                    <label className="block text-sm font-semibold text-black mb-1">Year</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary group-focus-within:text-primary transition-colors" />
                      <select
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        className="input-field pl-11 bg-white border-2 border-primary/30 focus:border-primary"
                      >
                        <option value="">Select Year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={checking}
                  className="btn-primary w-full mt-6 inline-flex items-center justify-center gap-2 hover-glow py-4"
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
