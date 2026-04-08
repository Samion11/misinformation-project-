import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  Crown, 
  Zap, 
  Shield, 
  Lock, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Star,
  Rocket,
  Globe,
  BarChart3,
  Download,
  Headphones,
  Clock,
  IndianRupee,
  ArrowRight,
  CreditCard
} from 'lucide-react';

const Pricing = ({ setUser }) => {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    let timer1;
    let timer2;
    // Auto-simulate webhook if user creates UPI QR Code
    if (checkoutPlan && paymentMethod === 'upi' && !paymentSuccess) {
      timer1 = setTimeout(() => {
        setIsProcessing(true); // Verification state
        
        timer2 = setTimeout(() => {
          setIsProcessing(false);
          setPaymentSuccess(true);
          if (setUser) {
            setUser((prev) => ({ ...prev, role: checkoutPlan.id }));
          }
          
          setTimeout(() => {
             setCheckoutPlan(null);
             setPaymentSuccess(false);
          }, 3000);
        }, 1500); // 1.5s verify
      }, 5000); // 5 seconds wait to scan
    }
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [checkoutPlan, paymentMethod, paymentSuccess]);

  const handlePlanClick = (plan) => {
    if (plan.id === 'free') {
      // Free plan doesn't need checkout
      alert("You are already on the Free plan!");
      return;
    }
    setCheckoutPlan(plan);
    setPaymentSuccess(false);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      if (setUser) {
        setUser((prev) => ({ ...prev, role: checkoutPlan.id }));
      }
      
      // Auto close modal after showing success message
      setTimeout(() => {
        setCheckoutPlan(null);
        setPaymentSuccess(false);
      }, 3000);
    }, 2000);
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: <Zap className="w-6 h-6" />,
      monthlyPrice: 0,
      yearlyPrice: 0,
      badge: null,
      accent: 'gray',
      description: 'Get started with basic misinformation detection',
      features: [
        { text: '5 fact-checks per day', included: true },
        { text: 'Basic text summarization', included: true },
        { text: 'Trending misinformation dashboard', included: true },
        { text: 'Standard response speed', included: true },
        { text: 'Autocorrect & spell check', included: true },
        { text: 'Unlimited checks', included: false },
        { text: 'Credibility score insights', included: false },
        { text: 'Priority AI processing', included: false },
        { text: 'Multi-language support', included: false },
        { text: 'Export reports', included: false },
      ],
      buttonText: 'Get Started',
      buttonStyle: 'bg-gray-900 hover:bg-gray-800 text-white',
      cardStyle: 'bg-white border-gray-200',
      iconBg: 'bg-gray-100 text-gray-700',
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: <Sparkles className="w-6 h-6" />,
      monthlyPrice: 199,
      yearlyPrice: 1990,
      badge: 'Most Popular',
      accent: 'primary',
      description: 'For power users who need unlimited verification',
      features: [
        { text: 'Unlimited fact-checks', included: true },
        { text: 'Advanced AI summarization', included: true },
        { text: 'Trending + detailed analytics', included: true },
        { text: 'Priority AI processing (2x faster)', included: true },
        { text: 'Credibility score insights', included: true },
        { text: 'Source quality ratings', included: true },
        { text: 'Autocorrect & spell check', included: true },
        { text: 'Multi-language support', included: false },
        { text: 'Personalized dashboard', included: false },
        { text: 'Export reports', included: false },
      ],
      buttonText: 'Upgrade to Pro',
      buttonStyle: 'bg-primary hover:bg-primary-dark text-white shadow-xl shadow-primary/25',
      cardStyle: 'bg-white border-primary/30 shadow-xl shadow-primary/10 ring-2 ring-primary/20',
      iconBg: 'bg-primary/10 text-primary',
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: <Crown className="w-6 h-6" />,
      monthlyPrice: 399,
      yearlyPrice: 3990,
      badge: null,
      accent: 'amber',
      description: 'Complete suite for organizations & researchers',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Early access to new features', included: true },
        { text: 'Multi-language support (10+ langs)', included: true },
        { text: 'Personalized dashboard & alerts', included: true },
        { text: 'Download & export reports (PDF/CSV)', included: true },
        { text: 'Priority 24/7 support', included: true },
        { text: 'Team collaboration (5 seats)', included: true },
        { text: 'API access (1000 calls/month)', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Dedicated account manager', included: true },
      ],
      buttonText: 'Go Premium',
      buttonStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-amber-500/20',
      cardStyle: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-700',
    },
  ];

  const faqs = [
    {
      q: 'Can I change my plan at any time?',
      a: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the remaining balance will be credited to your account.',
    },
    {
      q: 'How does the yearly billing work?',
      a: 'Yearly plans are billed once a year and come with a ~17% discount compared to monthly billing. You pay for 10 months and get 12 — saving you 2 months of subscription cost.',
    },
    {
      q: 'What happens when I hit my daily limit on the Free plan?',
      a: 'Once you\'ve used up your 5 daily fact-checks, you\'ll need to wait until the next day or upgrade to Pro for unlimited access. Your dashboard and trending feed remain accessible without limits.',
    },
    {
      q: 'Is my payment information secure?',
      a: 'Absolutely. We use Razorpay/Stripe for payment processing with industry-standard 256-bit SSL encryption. We never store your card details on our servers.',
    },
    {
      q: 'Can I get a refund if I\'m not satisfied?',
      a: 'Yes, we offer a 7-day refund policy on all paid plans. If you\'re not satisfied, contact our support team within 7 days of purchase for a full refund — no questions asked.',
    },
  ];

  const trustBadges = [
    { icon: <Lock className="w-4 h-4" />, text: 'Secure Payment' },
    { icon: <RotateCcw className="w-4 h-4" />, text: 'Cancel Anytime' },
    { icon: <Shield className="w-4 h-4" />, text: '7-Day Refund' },
    { icon: <Clock className="w-4 h-4" />, text: 'Instant Activation' },
  ];

  const getPrice = (plan) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 0) return null;
    const yearlyMonthly = plan.yearlyPrice / 12;
    const saved = plan.monthlyPrice - yearlyMonthly;
    return Math.round(saved);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold text-sm rounded-full mb-6"
        >
          <Rocket className="w-4 h-4" />
          Choose Your Plan
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4"
        >
          Detect Misinformation<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">At Every Scale</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 font-medium text-lg max-w-xl mx-auto leading-relaxed"
        >
          Start free and scale up as you need. All plans include our core AI engine.
        </motion.p>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-4 mt-8"
        >
          <span className={`text-sm font-bold transition-colors ${!isYearly ? 'text-gray-900' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              isYearly ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              style={{ left: isYearly ? '32px' : '4px' }}
            />
          </button>
          <span className={`text-sm font-bold transition-colors ${isYearly ? 'text-gray-900' : 'text-gray-400'}`}>
            Yearly
          </span>
          {isYearly && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full border border-emerald-200"
            >
              Save ~17%
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className={`relative rounded-3xl border-2 p-8 flex flex-col ${plan.cardStyle} ${
              plan.id === 'pro' ? 'md:-mt-4 md:mb-0 md:pb-12' : ''
            }`}
          >
            {/* Badge */}
            {plan.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/30">
                  <Star className="w-3.5 h-3.5 fill-white" />
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${plan.iconBg}`}>
                {plan.icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">{plan.name}</h3>
                <p className="text-xs text-gray-500 font-medium">{plan.description}</p>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-500">₹</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isYearly ? 'yearly' : 'monthly'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-5xl font-black text-gray-900 tracking-tight"
                  >
                    {isYearly && plan.monthlyPrice > 0 
                      ? Math.round(plan.yearlyPrice / 12) 
                      : plan.monthlyPrice}
                  </motion.span>
                </AnimatePresence>
                <span className="text-sm font-bold text-gray-400">/month</span>
              </div>
              {isYearly && plan.monthlyPrice > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2"
                >
                  <span className="text-xs font-bold text-gray-400 line-through mr-2">
                    ₹{plan.monthlyPrice * 12}/year
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    ₹{plan.yearlyPrice}/year — Save ₹{plan.monthlyPrice * 12 - plan.yearlyPrice}
                  </span>
                </motion.div>
              )}
              {plan.monthlyPrice === 0 && (
                <p className="text-xs font-bold text-gray-400 mt-2">Free forever • No credit card required</p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 mb-6" />

            {/* Features */}
            <ul className="space-y-3 flex-grow mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  {feature.included ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-0.5 bg-gray-300 rounded-full" />
                    </div>
                  )}
                  <span className={`text-sm font-medium ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button 
              onClick={() => handlePlanClick(plan)}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${plan.buttonStyle}`}
            >
              {plan.buttonText}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-6 mb-20"
      >
        {trustBadges.map((badge, i) => (
          <div key={i} className="flex items-center gap-2 text-gray-500">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              {badge.icon}
            </div>
            <span className="text-sm font-bold">{badge.text}</span>
          </div>
        ))}
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl border border-gray-200 overflow-hidden mb-20"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Plan Comparison
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-500 uppercase tracking-wider w-1/3">Feature</th>
                <th className="text-center py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Free</th>
                <th className="text-center py-4 px-4 text-sm font-bold text-primary uppercase tracking-wider bg-primary/5">Pro</th>
                <th className="text-center py-4 px-4 text-sm font-bold text-amber-600 uppercase tracking-wider">Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Daily Fact-Checks', free: '5/day', pro: 'Unlimited', premium: 'Unlimited' },
                { feature: 'Summarization', free: 'Basic', pro: 'Advanced', premium: 'Advanced + Multi-lang' },
                { feature: 'Trending Dashboard', free: '✅', pro: '✅', premium: '✅ + Custom Alerts' },
                { feature: 'Credibility Insights', free: '—', pro: '✅', premium: '✅' },
                { feature: 'AI Response Speed', free: 'Standard', pro: '2x Faster', premium: '3x Faster' },
                { feature: 'Multi-Language', free: '—', pro: '—', premium: '10+ Languages' },
                { feature: 'Export Reports', free: '—', pro: '—', premium: 'PDF & CSV' },
                { feature: 'API Access', free: '—', pro: '—', premium: '1000 calls/mo' },
                { feature: 'Support', free: 'Community', pro: 'Email', premium: '24/7 Priority' },
                { feature: 'Team Seats', free: '1 user', pro: '1 user', premium: '5 users' },
              ].map((row, i) => (
                <tr key={i} className={`border-t border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                  <td className="py-3.5 px-6 text-sm font-bold text-gray-700">{row.feature}</td>
                  <td className="py-3.5 px-4 text-center text-sm font-medium text-gray-500">{row.free}</td>
                  <td className="py-3.5 px-4 text-center text-sm font-bold text-primary bg-primary/5">{row.pro}</td>
                  <td className="py-3.5 px-4 text-center text-sm font-medium text-amber-700">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-3xl mx-auto mb-10"
      >
        <div className="text-center mb-10">
          <h3 className="text-3xl font-black text-gray-900 mb-3">Frequently Asked Questions</h3>
          <p className="text-gray-500 font-medium">Everything you need to know about our pricing plans.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-base font-bold text-gray-800 pr-4">{faq.q}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  openFaq === i ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                }`}>
                  {openFaq === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <p className="text-sm font-medium text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => !isProcessing && setCheckoutPlan(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className={`p-6 border-b border-gray-100 ${checkoutPlan.id === 'premium' ? 'bg-amber-50' : 'bg-primary/5'}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${checkoutPlan.iconBg}`}>
                    {checkoutPlan.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Total Due</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">₹{isYearly ? checkoutPlan.yearlyPrice : checkoutPlan.monthlyPrice}</p>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900">Upgrade to {checkoutPlan.name}</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  Billed {isYearly ? 'yearly' : 'monthly'}. Cancel anytime.
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {paymentSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-10 h-10 text-emerald-500 stroke-[3]" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">Payment Successful!</h4>
                    <p className="text-gray-500 font-medium">Your account has been upgraded. Redirecting...</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handlePayment} className="space-y-4">
                    {/* Payment Method Toggle */}
                    <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
                          paymentMethod === 'card' 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" /> Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
                          paymentMethod === 'upi' 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {/* A generic icon for mobile / QR */}
                        <Rocket className="w-4 h-4" /> UPI / QR
                      </button>
                    </div>

                    {paymentMethod === 'card' ? (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
                          <input type="email" required placeholder="you@company.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-gray-900" />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Card Information</label>
                          <div className="relative">
                            <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input type="text" required placeholder="0000 0000 0000 0000" pattern="\d*" maxLength="16" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-gray-900 font-mono tracking-widest" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Expiry Date</label>
                            <input type="text" required placeholder="MM/YY" maxLength="5" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-gray-900 text-center tracking-widest" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">CVC</label>
                            <input type="text" required placeholder="123" maxLength="4" pattern="\d*" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-gray-900 text-center tracking-widest" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-2xl border border-gray-100 min-h-[300px]">
                        {isProcessing ? (
                          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                            <h4 className="text-lg font-black text-gray-900">Verifying Payment...</h4>
                            <p className="text-sm font-medium text-gray-500 mt-2">
                              Do not press back or close this window while we confirm your transaction securely with the bank network.
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="w-48 h-48 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-4 p-3 shadow-sm relative overflow-hidden group">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=mock@upi&pn=VeriSafeAI&am=${isYearly ? checkoutPlan.yearlyPrice : checkoutPlan.monthlyPrice}&cu=INR`} 
                                alt="UPI QR Code" 
                                className="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity"
                              />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></div>
                              <p className="text-sm font-bold text-amber-600">Waiting for you to scan...</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/120px-UPI-Logo-vector.svg.png" alt="UPI" className="h-4 object-contain opacity-50 grayscale" />
                              <p className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                GPay, PhonePe, Paytm
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    <div className="pt-4">
                      {paymentMethod === 'upi' ? (
                        <button 
                          type="button" 
                          onClick={() => {
                             setCheckoutPlan(null);
                             setIsProcessing(false);
                          }}
                          disabled={isProcessing}
                          className="w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-500 hover:border-red-200 disabled:opacity-50"
                        >
                          Cancel Payment
                        </button>
                      ) : (
                        <button 
                          type="submit" 
                          disabled={isProcessing}
                          className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 text-white ${checkoutPlan.id === 'premium' ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20' : 'bg-primary shadow-lg shadow-primary/20'} ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" /> Pay ₹{isYearly ? checkoutPlan.yearlyPrice : checkoutPlan.monthlyPrice}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pricing;
