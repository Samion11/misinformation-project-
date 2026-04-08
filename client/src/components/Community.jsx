import React, { useState } from 'react';
import { Users, Shield, Globe, Cpu, HeartPulse, Search, Lock, Star, ChevronRight, CheckCircle2, FileText, Download, Plus, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Community = ({ user, setActiveTab }) => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeCommunity, setActiveCommunity] = useState(null);

  const communities = [
    {
      id: 'health',
      name: 'Health Mythbusters',
      icon: <HeartPulse size={24} className="text-rose-500" />,
      color: 'bg-rose-500/10 border-rose-500/20',
      members: '12.4k',
      active: '840',
      description: 'Dedicated to analyzing and debunking viral medical claims, bogus cures, and health conspiracies.'
    },
    {
      id: 'geopolitics',
      name: 'Geopolitics Watch',
      icon: <Globe size={24} className="text-blue-500" />,
      color: 'bg-blue-500/10 border-blue-500/20',
      members: '34.2k',
      active: '2,100',
      description: 'Monitoring global misinformation campaigns, synthetic media, and state-sponsored propaganda.'
    },
    {
      id: 'scam',
      name: 'Cyber Scam Hunters',
      icon: <Shield size={24} className="text-emerald-500" />,
      color: 'bg-emerald-500/10 border-emerald-500/20',
      members: '18.9k',
      active: '1,200',
      description: 'The frontline against phishing links, fraudulent airdrops, and financial deception schemes.'
    },
    {
      id: 'tech',
      name: 'Deepfake Detectives',
      icon: <Cpu size={24} className="text-purple-500" />,
      color: 'bg-purple-500/10 border-purple-500/20',
      members: '8.1k',
      active: '490',
      description: 'Specialists in identifying AI-generated imagery, voice cloning, and synthetic video manipulation.'
    }
  ];

  const handleJoinClick = (group) => {
    // Check if the user has a premium or pro role
    // Since we are mocking, we accept 'premium', 'pro', or 'verified'
    const isPremium = user?.role === 'premium' || user?.role === 'pro';
    
    if (!isPremium) {
      setSelectedGroup(group);
      setShowPaywall(true);
    } else {
      setActiveCommunity(group);
    }
  };

  if (activeCommunity) {
    return (
      <div className="animate-in fade-in duration-500">
        <button 
          onClick={() => setActiveCommunity(null)}
          className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to Task Forces
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
          {/* Header */}
          <div className={`p-6 border-b border-gray-100 flex items-center justify-between overflow-hidden relative`}>
            {/* Soft background match */}
            <div className={`absolute inset-0 opacity-10 ${activeCommunity.color.split(' ')[0]}`}></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                {activeCommunity.icon}
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">{activeCommunity.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    {activeCommunity.active} Active Now
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-xs font-medium text-gray-500">End-to-end encrypted channel</span>
                </div>
              </div>
            </div>
            
            <div className="flex -space-x-2 relative z-10 hidden sm:flex">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=${i+20}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 space-y-6">
            <div className="text-center pb-4">
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Today</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/20 max-w-2xl mr-auto">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-black text-gray-900">System Bot</span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">Moderator</span>
                <span className="text-xs text-gray-400">09:00 AM</span>
              </div>
              <p className="text-sm font-medium text-gray-600">
                Welcome to the {activeCommunity.name} hub! Please adhere to OPSEC guidelines. Do not share raw malware links without defanging them first.
              </p>
            </div>

            <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 max-w-2xl ml-auto">
              <div className="flex items-center justify-end gap-2 mb-2">
                <span className="text-xs text-gray-400">10:45 AM</span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">Pro Analyst</span>
                <span className="text-sm font-black text-primary">You</span>
              </div>
              <p className="text-sm font-medium text-primary-900 text-right">
                I'm tracking a new cluster of deepfaked audio clips targeting the upcoming local elections. Anyone have the source origin IPs?
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/20 max-w-2xl mr-auto relative">
              <div className="absolute -left-2 top-1/2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-gray-50 -translate-y-1/2"></div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-black text-gray-900">Alex_Intel</span>
                <span className="text-xs text-gray-400">10:48 AM</span>
              </div>
              <p className="text-sm font-medium text-gray-600">
                Yeah, catching similar signals on secure channels. I've compiled the IOCs (Indicators of Compromise) into a CSV. Dumping it in the secure vault now.
              </p>
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 text-emerald-600 rounded-lg shadow-sm border border-gray-100">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Election_Audio_IOCs.csv</p>
                    <p className="text-[10px] text-gray-500">24 KB • Scanned and Clean</p>
                  </div>
                </div>
                <Download size={16} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </div>
            </div>

          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <textarea 
                  placeholder={`Send an encrypted message to ${activeCommunity.name}...`}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 pr-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium text-gray-900 resize-none h-14"
                ></textarea>
                <div className="absolute right-3 top-2.5 flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <button className="w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-all active:scale-95 shrink-0">
                <Send size={20} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-primary to-emerald-600 rounded-3xl p-10 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-sm border border-white/20">
              Elite Status Required
            </span>
          </div>
          <h2 className="text-4xl font-black mb-4 leading-tight">Join the Frontlines of Truth</h2>
          <p className="text-primary-100 text-lg font-medium leading-relaxed mb-8">
            Collaborate with expert fact-checkers, access real-time raw intelligence feeds, and help combat global 
            misinformation alongside our most dedicated community members.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-emerald-600 bg-gray-200 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-emerald-600 bg-white text-emerald-600 flex items-center justify-center text-xs font-black shadow-sm">
                +45k
              </div>
            </div>
            <p className="text-sm font-bold text-emerald-50">Active Analysts Worldwide</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Search size={20} className="text-gray-400" />
          Available Task Forces
        </h3>
        <span className="text-sm font-medium text-gray-500">4 Active Channels</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((group) => (
          <div 
            key={group.id} 
            className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group relative overflow-hidden flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl border ${group.color}`}>
                {group.icon}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end text-sm font-bold text-gray-900 mb-1">
                  <Users size={14} className="text-gray-400" />
                  {group.members}
                </div>
                <div className="flex items-center gap-1.5 justify-end text-xs font-medium text-emerald-600">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  {group.active} online
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-bold text-gray-900 mb-2">{group.name}</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
              {group.description}
            </p>
            
            <button 
              onClick={() => handleJoinClick(group)}
              className="w-full py-3.5 bg-gray-50 hover:bg-primary hover:text-white text-gray-900 text-sm font-bold rounded-xl border border-gray-100 hover:border-primary transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
            >
              {user?.role === 'premium' || user?.role === 'pro' ? 'Access Hub' : 'Request Access'} <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Premium Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setShowPaywall(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 shadow-inner">
                <Lock className="text-amber-500" size={32} />
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                Premium Access Required
              </h3>
              
              <p className="text-gray-500 font-medium leading-relaxed mb-6">
                The <strong className="text-gray-900">{selectedGroup?.name}</strong> community is highly vetted to prevent bad actors from manipulating consensus. 
                You need a VeriSafe Pro or Premium account to join verified task forces.
              </p>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-8 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Star size={16} className="text-amber-500 fill-amber-500" /> Unlock Community Chat
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Trusted Analyst Badge
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Globe size={16} className="text-blue-500" /> Real-time Intel Feeds
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPaywall(false)}
                  className="flex-1 py-3.5 bg-white text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-xl border border-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowPaywall(false);
                    setActiveTab('pricing');
                  }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  Upgrade to Pro
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
