import React, { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, ShieldQuestion, Loader2, Sparkles, RotateCcw, ExternalLink, BookOpen, CheckCircle2, SpellCheck, ArrowRight, ShieldEllipsis, ShieldMinus, Newspaper } from 'lucide-react';
import { checkMisinformation, autocorrectText } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const Checker = () => {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Autocorrect state
  const [suggestion, setSuggestion] = useState(null); // { original, corrected, corrections }
  const [checkingSpelling, setCheckingSpelling] = useState(false);

  const handleCheck = async () => {
    if (!content.trim()) return;
    
    // Step 1: Autocorrect first
    setCheckingSpelling(true);
    setSuggestion(null);
    setResult(null);
    setError(null);
    
    try {
      const spellResult = await autocorrectText(content);
      const spellData = spellResult.data;
      
      if (spellData.changed) {
        // Has corrections — show "Did you mean?" and wait
        setSuggestion(spellData);
        setCheckingSpelling(false);
        return;
      }
      
      // No corrections needed — proceed directly to fact-check
      setCheckingSpelling(false);
      await runFactCheck(content);
    } catch (err) {
      // If autocorrect fails, just proceed with original text
      console.warn('Autocorrect failed, proceeding with original:', err);
      setCheckingSpelling(false);
      await runFactCheck(content);
    }
  };

  const acceptSuggestion = async () => {
    if (!suggestion) return;
    setContent(suggestion.corrected);
    setSuggestion(null);
    await runFactCheck(suggestion.corrected);
  };

  const skipSuggestion = async () => {
    setSuggestion(null);
    await runFactCheck(content);
  };

  const runFactCheck = async (text) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await checkMisinformation(text);
      setResult(response.data);
    } catch (err) {
      setError("Failed to verify content. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setResult(null);
    setError(null);
    setSuggestion(null);
  };

  const getStatusConfig = (label) => {
    const l = (label || '').toLowerCase();
    if (l === 'true') return {
      color: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-700',
      icon: <ShieldCheck className="w-10 h-10 text-emerald-500" />,
      badge: 'bg-emerald-500 text-white',
      title: '✅ Verified as TRUE',
      barColor: 'bg-emerald-500',
    };
    if (l === 'mostly true') return {
      color: 'bg-teal-50 border-teal-200',
      textColor: 'text-teal-700',
      icon: <ShieldCheck className="w-10 h-10 text-teal-500" />,
      badge: 'bg-teal-500 text-white',
      title: '🟢 MOSTLY TRUE',
      barColor: 'bg-teal-500',
    };
    if (l === 'partially correct') return {
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      icon: <ShieldQuestion className="w-10 h-10 text-blue-500" />,
      badge: 'bg-blue-500 text-white',
      title: 'ℹ️ PARTIALLY CORRECT',
      barColor: 'bg-blue-500',
    };
    if (l === 'misleading') return {
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-700',
      icon: <ShieldAlert className="w-10 h-10 text-orange-500" />,
      badge: 'bg-orange-500 text-white',
      title: '⚠️ MISLEADING',
      barColor: 'bg-orange-500',
    };
    if (l === 'false' || l === 'fake') return {
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
      icon: <ShieldAlert className="w-10 h-10 text-red-500" />,
      badge: 'bg-red-500 text-white',
      title: '🚨 Detected as FALSE',
      barColor: 'bg-red-500',
    };
    if (l === 'unverified') return {
      color: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
      icon: <ShieldQuestion className="w-10 h-10 text-amber-500" />,
      badge: 'bg-amber-500 text-white',
      title: '❓ UNVERIFIED',
      barColor: 'bg-amber-500',
    };
    if (l === 'developing') return {
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
      icon: <ShieldQuestion className="w-10 h-10 text-purple-500" />,
      badge: 'bg-purple-500 text-white',
      title: '🔄 DEVELOPING STORY',
      barColor: 'bg-purple-500',
    };
    // Fallback
    return {
      color: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-700',
      icon: <ShieldQuestion className="w-10 h-10 text-gray-500" />,
      badge: 'bg-gray-500 text-white',
      title: '🔍 ANALYZING...',
      barColor: 'bg-gray-500',
    };
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Fake News Checker
        </h2>
        <p className="text-gray-500 mb-6 font-medium">Paste any text, WhatsApp forward, or news headline — we'll auto-correct typos and verify against real facts.</p>
        
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="e.g. '5G twoers are spreadin the coronavrius — scientsts are shoked!' (typos will be auto-corrected)"
            className="w-full h-36 p-5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none font-sans text-gray-800 placeholder-gray-400"
          />
          
          <div className="flex gap-3">
            <button
              onClick={handleCheck}
              disabled={loading || checkingSpelling || !content.trim()}
              className="flex-grow py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 active:scale-[0.98]"
            >
              {checkingSpelling ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Checking spelling...
                </>
              ) : loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Cross-checking facts...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Verify Content
                </>
              )}
            </button>
            {(result || content || suggestion) && (
              <button
                onClick={handleReset}
                className="px-4 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Did You Mean? Suggestion */}
        {suggestion && (
          <motion.div
            key="suggestion"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 space-y-4"
          >
            <div className="flex items-start gap-3">
              <SpellCheck className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-black text-amber-800 mb-1">Did you mean?</h4>
                <p className="text-sm text-amber-700 font-medium">
                  We detected {suggestion.corrections.length} spelling correction{suggestion.corrections.length > 1 ? 's' : ''}:
                </p>
              </div>
            </div>

            {/* Show individual corrections */}
            <div className="flex flex-wrap gap-2 ml-9">
              {suggestion.corrections.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-sm bg-white px-3 py-1.5 rounded-xl border border-amber-200">
                  <span className="text-red-500 line-through font-medium">{c.original}</span>
                  <ArrowRight className="w-3 h-3 text-amber-500" />
                  <span className="text-emerald-700 font-bold">{c.corrected}</span>
                </span>
              ))}
            </div>

            {/* Corrected text preview */}
            <div className="ml-9 p-4 bg-white rounded-2xl border border-amber-100">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Corrected Text</p>
              <p className="text-gray-800 font-medium leading-relaxed">{suggestion.corrected}</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 ml-9">
              <button
                onClick={acceptSuggestion}
                className="flex-grow py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/15 active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                Yes, check this instead
              </button>
              <button
                onClick={skipSuggestion}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all text-sm"
              >
                No, use original
              </button>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-medium flex items-center gap-3"
          >
            <ShieldAlert className="w-5 h-5 shrink-0" />
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 space-y-5"
          >
            {(() => {
              const config = getStatusConfig(result.label);
              return (
                <>
                  {/* Verdict Card */}
                  <div className={`p-8 rounded-3xl border-2 ${config.color}`}>
                    <div className="space-y-5">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">{config.icon}</div>
                        <div className="flex-grow">
                          <h3 className={`text-2xl font-black mb-1 ${config.textColor}`}>
                            {config.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${config.badge}`}>
                              {result.label}
                            </span>
                            <span className="text-sm font-bold text-gray-500">
                              Confidence: {(result.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Confidence Bar */}
                      <div>
                        <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence * 100}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${config.barColor}`}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Low</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">High</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cross-Source Analysis */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
                  >
                    <h4 className="text-base font-black text-gray-800 mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      {result.label === 'True' ? "Supporting Evidence" : result.label === 'False' ? "What's Actually True" : "Cross-Source Analysis"}
                    </h4>
                    <p className="text-gray-700 font-medium leading-relaxed">
                      {result.explanation}
                    </p>
                  </motion.div>

                  {/* Human-Friendly Summary */}
                  {result.humanSummary && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28 }}
                      className="bg-gradient-to-br from-violet-50 to-indigo-50 p-6 rounded-3xl border border-violet-100"
                    >
                      <h4 className="text-sm font-black uppercase tracking-widest text-violet-800 mb-3 flex items-center gap-2">
                        <Newspaper className="w-4 h-4" />
                        In Simple Words
                      </h4>
                      <p className="text-gray-800 font-medium leading-relaxed text-[15px]">
                        {result.humanSummary}
                      </p>
                    </motion.div>
                  )}

                  {/* Verified Sources */}
                  {result.sources && result.sources.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100"
                    >
                      <h4 className="text-sm font-black uppercase tracking-widest text-indigo-800 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified Sources
                      </h4>
                      <div className="space-y-2">
                        {result.sources.map((source, i) => (
                          <a
                            key={i}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-100 hover:border-primary hover:shadow-sm transition-all group"
                          >
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                              <ExternalLink className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors truncate">{source.name}</p>
                              <p className="text-[11px] text-gray-400 truncate">{source.url}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checker;
