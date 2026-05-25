import React, { useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutContext } from './Layout'

const links = [
  {
    to: '/dashboard', label: 'Dashboard',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5z" />
      </svg>
    )
  },
  {
    to: '/customers', label: 'Customers',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    to: '/vehicles', label: 'Vehicles',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m8 1H9m4 0h5a1 1 0 001-1v-3.65a1 1 0 00-.22-.624l-3.48-4.35A1 1 0 0014.52 6H13" />
      </svg>
    )
  },
  {
    to: '/services', label: 'Services',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    to: '/invoices', label: 'Payments',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
]

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useContext(LayoutContext)
  const username = localStorage.getItem('username') || 'User'
  const userRole = localStorage.getItem('userRole') || 'GARAGE_OWNER'
  const roleLabel = userRole === 'ADMIN' ? 'Admin' : 'Garage Owner'

  const sidebarContent = (
    <aside className="w-[var(--sidebar-width)] h-full flex flex-col" style={{
      background: 'linear-gradient(180deg, #07111f 0%, #050c1a 100%)',
      borderRight: '1px solid rgba(148, 163, 184, 0.07)',
      width: '240px'
    }}>
      {/* Nav Label */}
      <div className="px-5 pt-5 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
          Navigation
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {links.map((l, idx) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `nav-active-glow flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden animate-slide-left stagger-${idx + 1} ${
                isActive
                  ? 'text-amber-400 border border-amber-500/15'
                  : 'text-slate-400 hover:text-slate-100 border border-transparent hover:border-slate-700/30'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(217,119,6,0.06) 100%)',
            } : {}}
          >
            {({ isActive }) => (
              <>
                {/* Background hover glow */}
                {!isActive && (
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'rgba(30,41,59,0.4)' }} />
                )}
                <span className={`flex-shrink-0 transition-all duration-200 relative z-10 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {l.icon}
                </span>
                <span className="relative z-10">{l.label}</span>
                {isActive && (
                  <span className="ml-auto relative z-10 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-dot" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-3 border-t" style={{ borderColor: 'rgba(148,163,184,0.07)' }} />

      {/* User Info */}
      <div className="p-3 mb-2">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.1)'
        }}>
          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-900" style={{
            background: 'linear-gradient(135deg, #fbbf24, #d97706)'
          }}>
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{username}</div>
            <div className="text-[10px] text-amber-400/70 font-medium">{roleLabel}</div>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        {sidebarContent}
      </div>
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden flex-shrink-0 fixed left-0 top-0 h-full z-50 animate-sidebar-in">
          {sidebarContent}
        </div>
      )}
    </>
  )
}
