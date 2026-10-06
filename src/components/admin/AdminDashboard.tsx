import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Settings,
  BarChart2,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

type AdminTab = 'overview' | 'moderation' | 'users' | 'communities' | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    posts,
    communities,
    reports,
    resolveReport,
    dismissReport,
    openUserProfile,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-6 px-3 sm:px-6 space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              NOVA Admin Console
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Network health monitoring, automated safety audits, and community governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Network Nominal
          </span>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-1 p-1 bg-[#121620] border border-neutral-800 rounded-xl overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: <BarChart2 className="w-3.5 h-3.5" /> },
          {
            id: 'moderation',
            label: `Reports (${pendingReports.length})`,
            icon: <AlertTriangle className="w-3.5 h-3.5" />,
          },
          { id: 'users', label: 'User Directory', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'communities', label: 'Communities', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'settings', label: 'Platform Controls', icon: <Settings className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#11151f] border border-neutral-800/80">
              <span className="text-xs text-neutral-400">Total Registered Users</span>
              <p className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                {(users.length * 1840).toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                +18.4% this month
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#11151f] border border-neutral-800/80">
              <span className="text-xs text-neutral-400">Daily Active Practitioners</span>
              <p className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                4,210
              </p>
              <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                74% 30-day retention
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#11151f] border border-neutral-800/80">
              <span className="text-xs text-neutral-400">Posts Today</span>
              <p className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                {posts.length * 48}
              </p>
              <span className="text-[11px] text-neutral-400 font-mono mt-1 block">
                Avg 4.8 replies/post
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#11151f] border border-neutral-800/80">
              <span className="text-xs text-neutral-400">Pending Safety Queue</span>
              <p className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {pendingReports.length}
              </p>
              <span className="text-[11px] text-neutral-400 font-mono mt-1 block">
                Avg resolution: 14m
              </span>
            </div>
          </div>

          {/* User Growth & Engagement Chart */}
          <div className="p-5 rounded-2xl bg-[#11151f] border border-neutral-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  7-Day User Growth & Daily Signal Density
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Verified human registrations vs. flagged automated attempts
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-mono tabular-nums">
                +3,840 New Verified
              </span>
            </div>

            {/* SVG Interactive Line / Bar Chart */}
            <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2">
              {[
                { day: 'Mon', val: 55, count: '1.8k' },
                { day: 'Tue', val: 68, count: '2.4k' },
                { day: 'Wed', val: 62, count: '2.1k' },
                { day: 'Thu', val: 82, count: '3.1k' },
                { day: 'Fri', val: 78, count: '2.9k' },
                { day: 'Sat', val: 92, count: '3.8k' },
                { day: 'Sun', val: 98, count: '4.2k' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                >
                  <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div
                    className="w-full bg-neutral-800 group-hover:bg-indigo-500 rounded-t-lg transition-all duration-300 relative"
                    style={{ height: `${item.val}%` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-indigo-400 rounded-t-lg" />
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Moderation & Reports */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Flagged Items Queue ({pendingReports.length} pending)
            </h3>
            <span className="text-xs text-neutral-400">
              Automated heuristics & user reports
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className={`p-4 rounded-2xl border transition-all ${
                  rep.status === 'pending'
                    ? 'bg-[#151926] border-amber-500/40'
                    : 'bg-[#11151f] border-neutral-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-800/60 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-semibold ${
                        rep.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {rep.status}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      Target: {rep.targetTitle}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-neutral-500">
                    Reported {rep.createdAt}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 mb-2 leading-relaxed">
                  Reason: <span className="text-neutral-100">{rep.reason}</span>
                </p>

                {rep.notes && (
                  <p className="text-[11px] text-neutral-400 bg-neutral-900/80 p-2 rounded-lg mb-3 font-mono">
                    System Note: {rep.notes}
                  </p>
                )}

                {rep.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      onClick={() => resolveReport(rep.id)}
                    >
                      Take Action & Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      onClick={() => dismissReport(rep.id)}
                    >
                      Dismiss Report
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Users Directory */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Practitioner Directory
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              {users.length} sample accounts
            </span>
          </div>

          <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-[#11151f]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141924] text-neutral-400 font-medium border-b border-neutral-800">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3 hidden sm:table-cell">Role</th>
                  <th className="p-3 hidden md:table-cell">Followers</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-800/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={u.avatar} name={u.displayName} size="xs" />
                        <div>
                          <p className="font-semibold text-white">
                            {u.displayName}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            @{u.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell text-neutral-400 capitalize">
                      {u.role || 'User'}
                    </td>
                    <td className="p-3 hidden md:table-cell font-mono tabular-nums text-neutral-300">
                      {u.followersCount.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="text-[11px] font-mono text-emerald-400">
                        Active
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openUserProfile(u.id)}
                        className="text-xs text-indigo-400 hover:underline cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Communities Oversight */}
      {activeTab === 'communities' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">
            Active Community Governance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {communities.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-[#11151f] border border-neutral-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-white">{c.name}</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{c.category}</p>
                  <p className="text-[11px] font-mono text-neutral-500 mt-1">
                    {c.memberCount.toLocaleString()} members
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => showToast(`Audit complete for ${c.name}`, 'info')}
                >
                  Audit Room
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Platform Controls / Settings */}
      {activeTab === 'settings' && (
        <div className="p-5 rounded-2xl bg-[#11151f] border border-neutral-800 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-white">
            Platform Security & Heuristic Policies
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141924] border border-neutral-800">
              <div>
                <p className="font-semibold text-neutral-200">
                  AI Automated Content Verification
                </p>
                <p className="text-neutral-400 text-[11px]">
                  Real-time scan of posts against spam heuristics and scam tokens.
                </p>
              </div>
              <span className="text-emerald-400 font-mono">Enabled</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141924] border border-neutral-800">
              <div>
                <p className="font-semibold text-neutral-200">
                  High-Signal Ratio Threshold
                </p>
                <p className="text-neutral-400 text-[11px]">
                  Requires multi-factor algorithmic verification for mass mentions.
                </p>
              </div>
              <span className="text-emerald-400 font-mono">Active (99.2%)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141924] border border-neutral-800">
              <div>
                <p className="font-semibold text-neutral-200">
                  Zero-Pill Metadata Strict Enforcement
                </p>
                <p className="text-neutral-400 text-[11px]">
                  Ensures all card layouts maintain clean typographic discipline.
                </p>
              </div>
              <span className="text-indigo-400 font-mono">Enforced</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
