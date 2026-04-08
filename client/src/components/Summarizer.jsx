import React, { useState } from 'react';
import { Target, FileText, CheckCircle2, Copy, Loader2, List, Sparkles, RotateCcw, Zap } from 'lucide-react';
import { summarizeInformation } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const Summarizer = () => {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await summarizeInformation(content);
      setResult(response.data);
    } catch (err) {
      setError("Failed to summarize content. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setResult(null);
    setError(null);
  };

  const handleCopy = () => {
    const text = `Summary: ${result.summary}\n\nKey Points:\n${result.bullets.map(b => `- ${b}`).join('\n')}\n\nKey Insight: ${result.keyInsight}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          Information Overload Reducer
        </h2>
        <p className="text-gray-500 mb-6 font-medium">Extract key insights from long articles or multiple news sources instantly.</p>
        
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste a long article, news report, or multiple paragraphs here for instant summarization..."
              className="w-full h-48 p-5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none font-sans text-gray-800 placeholder-gray-400"
            />
            {content && (
              <div className="absolute bottom-3 right-3 text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-100">
                {wordCount} words
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSummarize}
              disabled={loading || !content.trim()}
              className="flex-grow py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Extracting insights...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Summary
                </>
              )}
            </button>
            {(result || content) && (
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
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-medium"
          >
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            key="summary-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Executive Summary
              </h3>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm font-bold ${
                  copied 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy All"}
              </button>
            </div>
            
            {/* Summary Block */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                {result.summary}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Points */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100"
              >
                <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Key Points
                </h4>
                <ul className="space-y-3">
                  {result.bullets.map((bullet, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex gap-3 text-indigo-800 leading-snug font-medium"
                    >
                      <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold border border-indigo-200 shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {bullet}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Key Insight */}
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100"
              >
                <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  What Matters Most
                </h4>
                <p className="text-emerald-800 text-lg leading-relaxed font-bold">
                  {result.keyInsight}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Summarizer;
