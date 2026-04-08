import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  FileText, 
  Send, 
  Info, 
  Globe, 
  ExternalLink, 
  Menu, 
  X, 
  Bell,
  LogOut,
  CreditCard,
  RefreshCw,
  Users
} from 'lucide-react';
import Checker from './components/Checker';
import Summarizer from './components/Summarizer';
import Trending from './components/Trending';
import Report from './components/Report';
import Pricing from './components/Pricing';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import Community from './components/Community';

const App = () => {
  const [user, setUser] = useState({ loggedIn: false, role: null, name: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTipIdx, setCurrentTipIdx] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const tips = [
    "Most misinformation spreads through emotional triggers. If a news makes you very angry or very happy, verify it first!",
    "Check the date. Old news stories are frequently recirculated out of context to spread modern panic.",
    "Look closely at the URL. Fake news networks use domains that look almost identical to major news sites (e.g., abcnews.com.co).",
    "Reverse image search is your best friend. 'Breaking' disaster photos might be from a movie or an incident 5 years ago.",
    "If a claim guarantees a 100% cure or secret discovery, it's often a scam. Science rarely uses absolute guarantees."
  ];

  const nextTip = () => {
    setCurrentTipIdx((prev) => (prev + 1) % tips.length);
  };

  const handleLogin = (userData) => {
    setUser({ loggedIn: true, ...userData });
  };

  const handleLogout = () => {
    setUser({ loggedIn: false, role: null, name: '' });
  };

  if (!user.loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'checker', label: 'Fake News Checker', icon: <ShieldCheck size={20} /> },
    { id: 'summarizer', label: 'Summarizer', icon: <FileText size={20} /> },
    { id: 'report', label: 'Report Content', icon: <Send size={20} /> },
    { id: 'community', label: 'Community', icon: <Users size={20} /> },
    { id: 'pricing', label: 'Pricing', icon: <CreditCard size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Trending />;
      case 'checker': return <Checker />;
      case 'summarizer': return <Summarizer />;
      case 'report': return <Report />;
      case 'pricing': return <Pricing setUser={setUser} />;
      case 'community': return <Community user={user} setActiveTab={setActiveTab} />;
      default: return <Trending />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col font-sans">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">VeriSafe AI</h1>
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Misinformation Detection & Management</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-primary shadow-sm border border-gray-100' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 text-gray-400 hover:text-primary transition-colors relative"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h4 className="font-bold text-gray-900">Notifications</h4>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase">3 New</span>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {[
                      { title: "Report Resolved", desc: "Report RPT-8290 'Doctored election photos' was marked as resolved.", time: "2m ago", unread: true },
                      { title: "Premium Unlocked", desc: "Welcome to Elite Status! You can now access closed task forces.", time: "1h ago", unread: true },
                      { title: "Threat Detected", desc: "Active phishing network flagged in Financial channels.", time: "3h ago", unread: true },
                    ].map((notif, i) => (
                      <div key={i} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${notif.unread ? 'bg-primary/5' : ''}`}>
                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notif.unread ? 'bg-primary animate-pulse' : 'bg-gray-300'}`}></div>
                        <div>
                          <p className={`text-sm ${notif.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.desc}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer border-t border-gray-50">
                    <span className="text-xs font-bold text-primary">View All Alerts &raquo;</span>
                  </div>
                </div>
              )}
            </div>
            <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mt-1">Verified Client</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold group"
              >
                <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <button className="md:hidden p-2 text-gray-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content Area */}
          <div className="flex-grow min-w-0">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black text-gray-900 leading-tight mb-2">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-gray-500 font-medium max-w-2xl leading-relaxed">
                  {activeTab === 'dashboard' && "Stay ahead of global misinformation trends and trending hoaxes. Our AI continuously monitors social channels for suspicious activities."}
                  {activeTab === 'checker' && "Paste any text, URL, or social media post to verify its authenticity using our multi-layered AI verification system."}
                  {activeTab === 'summarizer' && "Reduce information overload. Upload long articles or multiple news snippets to get a concise, factual executive summary."}
                  {activeTab === 'report' && "Help the community by reporting suspicious content you found online. Your reports help train our AI to detect new types of misinformation."}
                  {activeTab === 'community' && "Join verified task forces led by security experts to hunt down synthetic media, bot networks, and fraudulent activities together."}
                  {activeTab === 'pricing' && "Choose the plan that works best for you. Upgrade anytime to unlock unlimited fact-checks and premium AI features."}
                </p>
              </div>
              <div className="flex items-center gap-3 pb-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  AI Live Monitor: Active
                </span>
              </div>
            </div>

            {renderContent()}
          </div>

          {/* Sidebar / Info Panel */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info size={18} className="text-primary" />
                Quick Tip
              </h3>
              <p className="text-gray-600 text-sm font-medium leading-relaxed mb-6 min-h-[80px]">
                {tips[currentTipIdx]}
              </p>
              <button 
                onClick={nextTip}
                className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-xl border border-gray-100 transition-all flex items-center justify-center gap-2 group-hover:border-gray-200"
              >
                Next Tip <RefreshCw size={14} className="text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 overflow-hidden relative">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Build Trust Together</h3>
              <p className="text-gray-600 text-sm font-medium leading-relaxed mb-6">
                Users have submitted over <strong>1,240</strong> reports this week! Join our contributor community to get early access.
              </p>
              <div className="flex -space-x-3 mb-6">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-xs font-black shadow-sm">
                  +12k
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('community')}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
              >
                Join Community
              </button>
            </div>

            <div className="pt-6 flex items-center justify-center gap-6">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors"><Globe size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors uppercase text-[10px] font-black tracking-widest">Docs</a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors uppercase text-[10px] font-black tracking-widest">API</a>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <ShieldCheck size={20} />
            <span className="font-bold text-sm tracking-tight">VeriSafe AI © 2026</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Terms</a>
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">About</a>
          </div>
          <p className="text-xs font-medium text-gray-400">Powered by Google Gemini Pro</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
