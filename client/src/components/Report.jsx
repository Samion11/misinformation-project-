import React, { useState } from 'react';
import { Send, FileWarning, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { submitReport } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const Report = () => {
  const [formData, setFormData] = useState({ title: '', content: '', type: 'Text' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      await submitReport(formData);
      setSuccess(true);
      setFormData({ title: '', content: '', type: 'Text' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Failed to submit report. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FileWarning className="w-6 h-6 text-primary" />
        Report Suspicious Content
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 truncate">Subject / Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. WhatsApp forward about health cure"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-sans"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 truncate">Type of Content</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-sans font-medium"
          >
            <option>Text / Message</option>
            <option>URL / Article</option>
            <option>Image (Simulated)</option>
            <option>Social Media Post</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 truncate">Suspicious Text or Link</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Paste the content here for review..."
            className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none font-sans"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-gray-200"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Report
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Thank you! Our AI and moderators will review this soon.
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl font-bold flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Report;
