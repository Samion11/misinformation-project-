import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  FileCheck, 
  Clock, 
  BarChart3, 
  Settings, 
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('overview');

  const stats = [
    { id: 'reports', label: 'Total Reports', value: '1,284', change: '+12%', icon: <FileCheck className="text-emerald-500" /> },
    { id: 'users', label: 'Active Users', value: '45,200', change: '+5%', icon: <Users className="text-blue-500" /> },
    { id: 'uptime', label: 'System Uptime', value: '99.9%', change: 'Stable', icon: <Activity className="text-emerald-500" /> },
    { id: 'threats', label: 'Threats Blocked', value: '234', change: '+8%', icon: <ShieldAlert className="text-red-500" /> },
  ];

  const reportsData = [
    { name: 'Health', count: 480 },
    { name: 'Politics', count: 390 },
    { name: 'Scams', count: 210 },
    { name: 'Technology', count: 130 },
    { name: 'Other', count: 74 }
  ];

  const activeUsersData = [
    { name: 'Health News', users: 15200 },
    { name: 'Gaming', users: 11400 },
    { name: 'Geopolitics', users: 9800 },
    { name: 'Technology', users: 6300 },
    { name: 'Finance', users: 2500 }
  ];

  const threatsData = [
    { day: 'Mon', threats: 24 },
    { day: 'Tue', threats: 15 },
    { day: 'Wed', threats: 42 },
    { day: 'Thu', threats: 38 },
    { day: 'Fri', threats: 55 },
    { day: 'Sat', threats: 88 },
    { day: 'Sun', threats: 22 }
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl shadow-black/50">
          <p className="text-slate-300 text-xs font-bold mb-1">{label || payload[0].name}</p>
          <p className="text-emerald-400 font-black">
            {payload[0].value.toLocaleString()} {payload[0].name === 'users' || payload[0].dataKey === 'users' ? 'Users' : 'Events'}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.id}
            onClick={() => {
              if (stat.id !== 'uptime') setActiveView(stat.id);
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-slate-900 p-6 rounded-3xl border border-slate-800 transition-all group ${
              stat.id !== 'uptime' ? 'cursor-pointer hover:border-emerald-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:bg-emerald-500/10 transition-colors">
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.change.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-400'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white">{stat.value}</p>
            {stat.id !== 'uptime' && (
              <p className="text-[10px] text-emerald-500 font-bold uppercase mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                View Graphs &raquo;
              </p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Clock className="text-emerald-500" />
                Recent Reports Triage
              </h3>
              <button onClick={() => setActiveView('reports')} className="text-sm font-bold text-emerald-500 hover:underline">View All &raquo;</button>
            </div>
            <div className="space-y-4">
              {[
                { title: "Universal Health Scam", user: "@sara_k", time: "2m ago", priority: "High" },
                { title: "Deepfake Video Alert", user: "@mike_r", time: "15m ago", priority: "Critical" },
                { title: "Fake Token Airdrop", user: "@crypto_v", time: "1h ago", priority: "Medium" },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:bg-slate-900 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-black">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-emerald-500 transition-colors">{row.title}</p>
                      <p className="text-xs text-slate-500 font-medium">Submitted by {row.user} • {row.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    row.priority === 'Critical' ? 'bg-red-500/10 text-red-500' : 
                    row.priority === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {row.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-emerald-500 rounded-[2.5rem] p-8 text-slate-950 shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
            <BarChart3 className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform duration-700" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Integrity Score</h3>
            <p className="text-5xl font-black mb-6">98.4</p>
            <div className="h-2 w-full bg-slate-950/20 rounded-full mb-6">
              <div className="h-full w-[98%] bg-slate-950 rounded-full"></div>
            </div>
            <button className="w-full py-3 bg-slate-950 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all">
              System Audit
            </button>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Settings className="text-slate-500" />
              Quick Controls
            </h3>
            <div className="space-y-3">
              {['Maintenance Mode', 'AI Scraper API', 'Public Signup'].map(label => (
                <div key={label} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-sm font-bold text-slate-300">{label}</span>
                  <div className="w-10 h-5 bg-emerald-500/20 border border-emerald-500/50 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderReportsView = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
          <FileCheck className="text-emerald-500" /> Report Volume by Section
        </h3>
        <p className="text-slate-400 mb-8 max-w-lg">
          Analyzes the distribution of user-submitted reports across various content categories to identify targeted misinformation clusters.
        </p>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#0f172a' }} content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]}>
                {reportsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-6">Recent Reports Log</h3>
        <div className="space-y-3">
          {[
            { id: 'RPT-8291', type: 'Health', desc: 'Fake cancer cure article', status: 'Pending' },
            { id: 'RPT-8290', type: 'Politics', desc: 'Doctored election photos', status: 'Resolved' },
            { id: 'RPT-8289', type: 'Scams', desc: 'Phishing link in comments', status: 'Resolved' },
            { id: 'RPT-8288', type: 'Technology', desc: 'Fake 5G conspiracy post', status: 'Pending' }
          ].map((log, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex gap-4 items-center">
                <span className="text-slate-500 font-mono text-xs">{log.id}</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-bold">{log.type}</span>
                <span className="text-white text-sm font-medium">{log.desc}</span>
              </div>
              <span className={`text-xs font-bold ${log.status === 'Resolved' ? 'text-emerald-500' : 'text-orange-500'}`}>{log.status}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderUsersView = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 w-full">
          <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
            <Users className="text-blue-500" /> Active Audience by News Section
          </h3>
          <p className="text-slate-400 mb-8">
            This live metric breaks down exactly how many viewers are actively checking, reading, or reporting 
            content across our core intelligence sections right now.
          </p>
          <div className="space-y-4">
            {activeUsersData.map((data, i) => (
              <div key={i} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-slate-300 font-bold">{data.name}</span>
                </div>
                <span className="text-white font-black group-hover:text-emerald-500 transition-colors">{data.users.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[400px] flex-1 w-full flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activeUsersData}
                cx="50%"
                cy="50%"
                innerRadius={110}
                outerRadius={150}
                paddingAngle={5}
                dataKey="users"
                stroke="none"
              >
                {activeUsersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeUsersData.slice(0, 4).map((data, i) => (
          <div key={i} className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{data.name} Traffic</p>
            <p className="text-3xl font-black text-white">{((data.users / 45200) * 100).toFixed(1)}%</p>
            <div className="w-full bg-slate-950 h-1.5 mt-4 rounded-full overflow-hidden flex">
              <div className="h-full rounded-full" style={{ width: `${(data.users/45200)*100}%`, backgroundColor: COLORS[i % COLORS.length] }}></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderThreatsView = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
          <ShieldAlert className="text-red-500" /> Threats Blocked (7-Day Trend)
        </h3>
        <p className="text-slate-400 mb-8 max-w-lg">
          Tracks the volume of malicious bots, coordinated manipulation campaigns, and highly evasive scams effectively restricted by VeriSafe over the past week.
        </p>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={threatsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={4} dot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20">
          <p className="text-red-500 text-xs font-black uppercase tracking-widest mb-2">High Severity Blocked</p>
          <p className="text-3xl font-black text-white">42</p>
          <p className="text-slate-400 text-xs mt-2">Bot networks, Phishing rings</p>
        </div>
        <div className="bg-orange-500/10 p-6 rounded-3xl border border-orange-500/20">
          <p className="text-orange-500 text-xs font-black uppercase tracking-widest mb-2">Medium Severity Blocked</p>
          <p className="text-3xl font-black text-white">108</p>
          <p className="text-slate-400 text-xs mt-2">Spam accounts, deepfakes</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Low Severity Blocked</p>
          <p className="text-3xl font-black text-white">84</p>
          <p className="text-slate-400 text-xs mt-2">Automated scrapers</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 pb-20">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Admin Terminal</h1>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">VeriSafe Governance</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl border border-slate-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-xs font-bold text-slate-300">SYSTEM: ONLINE</span>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Super Admin</p>
              </div>
              <button 
                onClick={onLogout}
                className="p-2.5 bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-xl transition-all border border-slate-700"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {activeView === 'overview' ? (
              <>
                <h2 className="text-4xl font-black text-white mb-2">Workspace Overview</h2>
                <p className="text-slate-400 text-lg font-medium">Real-time governance analytics and system health metrics.</p>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                  {stats.find(s => s.id === activeView)?.icon}
                  {stats.find(s => s.id === activeView)?.label || 'Detail View'}
                </h2>
                <p className="text-slate-400 text-lg font-medium">Detailed metrics, graphs, and system insights.</p>
              </>
            )}
          </div>
          
          <AnimatePresence>
            {activeView !== 'overview' && (
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => setActiveView('overview')}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-white rounded-xl font-bold transition-all shadow-lg whitespace-nowrap"
              >
                <ArrowLeft size={18} />
                Back to Overview
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {activeView === 'overview' && <motion.div key="overview">{renderOverview()}</motion.div>}
          {activeView === 'reports' && <motion.div key="reports">{renderReportsView()}</motion.div>}
          {activeView === 'users' && <motion.div key="users">{renderUsersView()}</motion.div>}
          {activeView === 'threats' && <motion.div key="threats">{renderThreatsView()}</motion.div>}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default AdminDashboard;
