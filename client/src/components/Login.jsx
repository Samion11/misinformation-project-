import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication
    onLogin({ 
      email, 
      role: isAdmin ? 'admin' : 'user', 
      name: isSignUp ? name : (isAdmin ? 'System Admin' : 'VeriSafe User') 
    });
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    if (isAdmin) setIsAdmin(false);
  };

  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
    if (isSignUp) setIsSignUp(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-700 ${isAdmin ? 'bg-slate-900' : 'bg-indigo-50'}`}>
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl ${isAdmin ? 'bg-emerald-500/10' : 'bg-primary/10'}`}
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className={`absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl ${isAdmin ? 'bg-blue-500/10' : 'bg-indigo-500/10'}`}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-4 ${isAdmin ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-primary shadow-primary/20'}`}
          >
             {isAdmin ? <ShieldAlert className="text-white" size={32} /> : <ShieldCheck className="text-white" size={32} />}
          </motion.div>
          <h1 className={`text-3xl font-black tracking-tight ${isAdmin ? 'text-white' : 'text-gray-900'}`}>
            VeriSafe <span className={isAdmin ? 'text-emerald-400' : 'text-primary'}>AI</span>
          </h1>
          <p className={`text-sm font-bold uppercase tracking-[0.2em] mt-2 ${isAdmin ? 'text-emerald-500/80' : 'text-primary/80'}`}>
            {isAdmin ? 'Administrative Terminal' : 'Truth Management System'}
          </p>
        </div>

        {/* Card */}
        <div className={`backdrop-blur-xl rounded-[2.5rem] shadow-2xl border p-8 md:p-10 transition-all duration-500 ${
          isAdmin 
            ? 'bg-slate-800/80 border-slate-700 shadow-emerald-900/10' 
            : 'bg-white/80 border-white/50 shadow-indigo-900/5'
        }`}>
          
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-2 ${isAdmin ? 'text-white' : 'text-gray-900'}`}>
              {isSignUp ? 'Create Account' : (isAdmin ? 'Admin Portal' : 'Welcome Back')}
            </h2>
            <p className={`text-sm font-medium ${isAdmin ? 'text-slate-400' : 'text-gray-500'}`}>
              Please enter your credentials to {isSignUp ? 'get started' : 'access your workspace'}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className={`block text-xs font-black uppercase tracking-widest pl-1 ${isAdmin ? 'text-slate-400' : 'text-gray-400'}`}>Full Name</label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${isAdmin ? 'text-slate-500' : 'text-gray-400'}`} size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold transition-all outline-none border focus:ring-4 ${
                        isAdmin 
                          ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500/10' 
                          : 'bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-primary/5'
                      }`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className={`block text-xs font-black uppercase tracking-widest pl-1 ${isAdmin ? 'text-slate-400' : 'text-gray-400'}`}>Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${isAdmin ? 'text-slate-500' : 'text-gray-400'}`} size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold transition-all outline-none border focus:ring-4 ${
                    isAdmin 
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500/10' 
                      : 'bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-primary/5'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1">
                <label className={`text-xs font-black uppercase tracking-widest ${isAdmin ? 'text-slate-400' : 'text-gray-400'}`}>Password</label>
                {!isSignUp && <button type="button" className={`text-xs font-bold hover:underline ${isAdmin ? 'text-emerald-400' : 'text-primary'}`}>Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isAdmin ? 'text-slate-500' : 'text-gray-400'}`} size={18} />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold transition-all outline-none border focus:ring-4 ${
                    isAdmin 
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500/10' 
                      : 'bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-primary/5'
                  }`}
                />
              </div>
            </div>

            <button 
              type="submit"
              className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
                isAdmin 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20' 
                  : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
              }`}
            >
              {isSignUp ? 'Create My Account' : (isAdmin ? 'Initialize Session' : 'Access Dashboard')}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Social / Toggles */}
          <div className="mt-8 pt-8 border-t border-dashed transition-all duration-500 ${isAdmin ? 'border-slate-700' : 'border-gray-100'}">
            {!isAdmin && (
              <button 
                onClick={toggleMode}
                className={`w-full py-3 text-sm font-bold rounded-xl transition-all border ${
                  isAdmin 
                    ? 'border-slate-700 text-slate-400 hover:bg-slate-900' 
                    : 'border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
              </button>
            )}
            
            <div className="mt-4 flex flex-col gap-3">
              <button 
                onClick={toggleAdmin}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  isAdmin 
                    ? 'bg-primary text-white hover:bg-primary-dark' 
                    : 'bg-slate-900 text-emerald-400 hover:bg-slate-800'
                }`}
              >
                {isAdmin ? <User size={14} /> : <Cpu size={14} />}
                {isAdmin ? 'Switch to Client Access' : 'Switch to Admin Access'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <p className={`mt-8 text-center text-xs font-bold transition-all ${isAdmin ? 'text-slate-500' : 'text-gray-400'}`}>
          Secure communication channel. Powered by Quantum Ledger Tech.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
