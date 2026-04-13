import React, { useEffect, useState, useCallback } from 'react';
import { TrendingUp, AlertTriangle, ShieldCheck, Heart, Users, Shield, Loader2, RefreshCw, X, ExternalLink, Eye, Clock, Share2, Flame } from 'lucide-react';
import { getTrends } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const Trending = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchTrends = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTrends();
      setTrends(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Unable to load trending topics.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrends();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchTrends, 60000);
    return () => clearInterval(interval);
  }, [fetchTrends]);

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'health': return <Heart className="w-5 h-5 text-red-500" />;
      case 'politics': return <Users className="w-5 h-5 text-blue-500" />;
      case 'scams': return <Shield className="w-5 h-5 text-amber-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'health': return 'from-red-500 to-rose-600';
      case 'politics': return 'from-blue-500 to-indigo-600';
      case 'scams': return 'from-amber-500 to-orange-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getPopularityColor = (pop) => {
    if (pop?.includes('🔥') || pop === 'Very High') return 'bg-red-100 text-red-700 border-red-200';
    if (pop === 'High') return 'bg-orange-100 text-orange-700 border-orange-200';
    if (pop === 'Medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getVerdictStyle = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'true') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    if (s === 'mostly true') return 'bg-teal-100 text-teal-700 border border-teal-200';
    if (s === 'partially correct') return 'bg-blue-100 text-blue-700 border border-blue-200';
    if (s === 'misleading') return 'bg-orange-100 text-orange-700 border border-orange-200';
    if (s === 'false' || s === 'fake') return 'bg-red-100 text-red-700 border border-red-200';
    if (s === 'unverified') return 'bg-amber-100 text-amber-700 border border-amber-200';
    if (s === 'developing') return 'bg-purple-100 text-purple-700 border border-purple-200';
    return 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  const formatShares = (num) => {
    if (num >= 10000) return (num / 1000).toFixed(1) + 'K';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Trending Misinformation
          </h2>
          {lastUpdated && (
            <p className="text-xs font-medium text-gray-400 mt-2 flex items-center gap-1.5 ml-11">
              <Clock className="w-3 h-3" />
              Updated {lastUpdated.toLocaleTimeString()} · Auto-refreshes every 60s
            </p>
          )}
        </div>
        <button
          onClick={fetchTrends}
          disabled={loading}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 text-sm font-bold text-gray-600 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Scanning live sources...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-bold mb-2">{error}</p>
          <button onClick={fetchTrends} className="text-red-500 underline text-sm font-medium">Try again</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {trends.map((item, index) => (
              <motion.div
                key={item.title + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                layout
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="p-2 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-primary/5 transition-colors">
                    {getCategoryIcon(item.category)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getVerdictStyle(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 flex-grow font-medium leading-relaxed line-clamp-3">
                  {item.explanation}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {item.timeAgo && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                      <Clock className="w-3 h-3" />
                      {item.timeAgo}
                    </span>
                  )}
                  <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border ${getPopularityColor(item.popularity)}`}>
                    {item.popularity?.includes('🔥') ? <Flame className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    {item.popularity}
                  </span>
                  {item.shares && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                      <Share2 className="w-3 h-3" />
                      {formatShares(item.shares)} shares
                    </span>
                  )}
                </div>
                
                <div className="pt-3 border-t border-gray-50">
                  <span className="font-bold text-primary text-sm flex items-center gap-1 group-hover:underline">
                    <Eye className="w-3.5 h-3.5" />
                    Read full analysis &raquo;
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${getCategoryColor(selectedItem.category)} p-6 text-white relative`}>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2 bg-white/20 rounded-xl">
                    {getCategoryIcon(selectedItem.category)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                      {selectedItem.category}
                    </span>
                    {selectedItem.timeAgo && (
                      <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedItem.timeAgo}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-black leading-snug">{selectedItem.title}</h3>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider ${getVerdictStyle(selectedItem.status)}`}>
                    📊 Verdict: {selectedItem.status}
                  </span>
                  {selectedItem.shares && (
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      {formatShares(selectedItem.shares)} shares
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">What's Actually True</h4>
                  <p className="text-gray-700 text-base leading-relaxed font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {selectedItem.explanation}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">How to Protect Yourself</h4>
                  <ul className="space-y-2 text-sm font-medium text-gray-600">
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      Always verify claims from multiple credible news sources.
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      Be skeptical of content that triggers strong emotional reactions.
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      Check the original source and publication date before sharing.
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Trending;
