import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { listCustomers } from '../api/customersApi';
import { listVehicles } from '../api/vehiclesApi';
import { listInvoices } from '../api/invoicesApi';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';

// Animated counter component
function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (end === 0) { setDisplay(0); return; }
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / 30));
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span ref={ref}>{display}</span>;
}

export default function Dashboard() {
  const [counts, setCounts] = useState({ customers: 0, vehicles: 0, invoices: 0, revenue: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [cResp, vResp, iResp] = await Promise.all([
          listCustomers().catch(() => []),
          listVehicles().catch(() => []),
          listInvoices().catch(() => []),
        ]);
        const invoices = Array.isArray(iResp) ? iResp : [];
        const revenue = invoices.filter(i => i.status === 'completed').reduce((sum, i) => sum + (i.totalAmount || 0), 0);
        const pending = invoices.filter(i => i.status === 'pending').length;
        setCounts({
          customers: Array.isArray(cResp) ? cResp.length : 0,
          vehicles: Array.isArray(vResp) ? vResp.length : 0,
          invoices: invoices.length,
          revenue,
          pending,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="w-14 h-14 rounded-full border-2 border-slate-800" />
            <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-amber-400 border-t-transparent" style={{ animation: 'spin 0.8s linear infinite' }} />
          </div>
          <div className="text-sm text-slate-500 font-medium">Loading dashboard...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="glass-card rounded-xl p-6 border-red-500/20">
        <div className="text-red-400 flex items-center gap-2 text-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );

  const chartData = [
    { name: 'Customers', value: counts.customers, color: '#3b82f6' },
    { name: 'Vehicles', value: counts.vehicles, color: '#10b981' },
    { name: 'Invoices', value: counts.invoices, color: '#8b5cf6' },
  ];

  const stats = [
    {
      label: 'Total Customers', value: counts.customers, path: '/customers',
      gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(34,211,238,0.06) 100%)',
      border: 'rgba(59,130,246,0.2)',
      iconBg: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      valueColor: '#60a5fa',
      trend: '+12%', trendUp: true,
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      label: 'Total Vehicles', value: counts.vehicles, path: '/vehicles',
      gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(52,211,153,0.06) 100%)',
      border: 'rgba(16,185,129,0.2)',
      iconBg: 'linear-gradient(135deg, #10b981, #34d399)',
      valueColor: '#34d399',
      trend: '+8%', trendUp: true,
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m8 1H9m4 0h5a1 1 0 001-1v-3.65a1 1 0 00-.22-.624l-3.48-4.35A1 1 0 0014.52 6H13" />
        </svg>
      )
    },
    {
      label: 'Total Revenue', value: `₹${counts.revenue.toLocaleString()}`, path: '/invoices',
      gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(251,191,36,0.06) 100%)',
      border: 'rgba(245,158,11,0.2)',
      iconBg: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      valueColor: '#fbbf24',
      trend: '+25%', trendUp: true, isText: true,
      icon: (
        <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Pending Jobs', value: counts.pending, path: '/invoices',
      gradient: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(167,139,250,0.06) 100%)',
      border: 'rgba(139,92,246,0.2)',
      iconBg: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      valueColor: '#a78bfa',
      trend: counts.pending > 0 ? `${counts.pending} active` : 'None',
      trendUp: false,
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  const quickActions = [
    {
      label: 'Customers', desc: 'Manage clients', path: '/customers', color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      label: 'Vehicles', desc: 'Fleet overview', path: '/vehicles', color: 'linear-gradient(135deg, #10b981, #059669)',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m8 1H9m4 0h5a1 1 0 001-1v-3.65a1 1 0 00-.22-.624l-3.48-4.35A1 1 0 0014.52 6H13" />
        </svg>
      )
    },
    {
      label: 'Services', desc: 'Service catalog', path: '/services', color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      label: 'Payments', desc: 'Invoice billing', path: '/invoices', color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-lg px-4 py-3 shadow-2xl">
          <p className="text-xs font-semibold text-slate-400 mb-1">{label}</p>
          <p className="text-xl font-bold text-white">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const barColors = ['#3b82f6', '#10b981', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden animate-slide-up">
        {/* Decorative orb */}
        <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full opacity-40" style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)'
        }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">{greeting} 👋</p>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="gradient-text-amber">{username}</span>
            </h1>
            <p className="text-sm text-slate-500">Here's your garage performance overview</p>
          </div>
          <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.15)'
          }}>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            <div>
              <span className="text-xs font-bold text-emerald-400 block leading-none">All Systems</span>
              <span className="text-[10px] text-emerald-500/70 font-medium">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            onClick={() => navigate(stat.path)}
            className={`stat-card cursor-pointer glass-card rounded-2xl p-5 animate-slide-up stagger-${i + 1}`}
            style={{
              background: stat.gradient,
              border: `1px solid ${stat.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{
                background: stat.iconBg,
                boxShadow: `0 4px 14px ${stat.border}`
              }}>
                {stat.icon}
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                stat.trendUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-slate-500/10'
              }`}>
                {stat.trend}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1 animate-count-up" style={{ color: stat.valueColor }}>
              {stat.isText ? stat.value : <AnimatedNumber value={stat.value} />}
            </div>
            <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 animate-slide-up stagger-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.2)'
              }}>
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              System Statistics
            </h2>
            <span className="text-xs text-slate-600 font-medium">All time</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.05)" />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} fontWeight={500} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.04)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-6 animate-slide-up stagger-6">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.2)'
            }}>
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="group flex items-center gap-3 p-3.5 rounded-xl text-white text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 relative overflow-hidden"
                style={{
                  background: action.color,
                  boxShadow: '0 4px 16px -4px rgba(0,0,0,0.3)'
                }}
              >
                {/* Shimmer on hover */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
                <span className="relative z-10">{action.icon}</span>
                <div className="relative z-10 text-left">
                  <div className="leading-none">{action.label}</div>
                  <div className="text-[10px] opacity-70 font-medium mt-0.5">{action.desc}</div>
                </div>
                <svg className="w-4 h-4 ml-auto relative z-10 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-2xl p-6 animate-slide-up stagger-7">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.2)'
          }}>
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Recent Activity
        </h2>
        <div className="space-y-1.5">
          {[
            { text: 'System initialized successfully', time: 'Just now', color: '#10b981', icon: '✓' },
            { text: 'Dashboard data loaded', time: '1 min ago', color: '#3b82f6', icon: '↻' },
            { text: `${counts.customers} customers, ${counts.vehicles} vehicles tracked`, time: '2 min ago', color: '#f59e0b', icon: '★' },
            { text: 'Ready for operations', time: '3 min ago', color: '#8b5cf6', icon: '⚡' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/20 transition-colors animate-row-in stagger-${i + 1}`}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs" style={{
                background: `${item.color}15`,
                border: `1px solid ${item.color}25`,
                color: item.color
              }}>
                {item.icon}
              </div>
              <span className="text-sm text-slate-300 flex-1">{item.text}</span>
              <span className="text-xs text-slate-600 font-medium">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}