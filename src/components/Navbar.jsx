import React, { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutContext } from './Layout'

const pageLabels = {
  '/dashboard': 'Dashboard',
  '/customers': 'Customers',
  '/vehicles': 'Vehicles',
  '/services': 'Services',
  '/invoices': 'Payments',
}

export default function Navbar() {
  const { setSidebarOpen, sidebarOpen } = useContext(LayoutContext)
  const [showProfile, setShowProfile] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    window.location.href = '/login'
  }

  const username  = localStorage.getItem('username')  || 'User'
  const userRole  = localStorage.getItem('userRole')  || 'GARAGE_OWNER'
  const userEmail = localStorage.getItem('userEmail') || ''

  const roleLabel = userRole === 'ADMIN' ? 'Admin' : 'Garage Owner'
  const roleColor = userRole === 'ADMIN'
    ? 'text-[#b54e00] bg-[#ffece5] border-[#ffb690]/50'
    : 'text-[#004ac6] bg-[#dbe1ff] border-[#b4c5ff]/50'

  const currentPage = pageLabels[location.pathname] || 'Dashboard'
  const initials    = username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header
      className="sticky top-0 z-50 flex-shrink-0"
      style={{
        background: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(195, 198, 215, 0.55)',
        height: 'var(--navbar-height)',
        boxShadow: '0 1px 12px rgba(15, 23, 42, 0.06)',
      }}
    >
      <div className="flex items-center justify-between px-4 h-full gap-4">

        {/* ── Left: Hamburger + Logo ── */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg transition-all duration-200"
            style={{ color: 'var(--on-surface-variant)' }}
            onMouseEnter={e => e.currentTarget.style.background='var(--surface-container-low)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {sidebarOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>

          {/* Logo + Brand */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              {/* Car / wrench icon */}
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold leading-none font-geist" style={{ color: 'var(--on-surface)' }}>
                AutoGear<span style={{ color: 'var(--primary-container)' }}>Pro</span>
              </div>
              <div className="text-[9px] font-medium tracking-widest uppercase leading-none mt-0.5" style={{ color: 'var(--outline)' }}>
                Garage System
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 mx-1" style={{ background: 'var(--outline-variant)' }} />

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5 text-sm">
            <span style={{ color: 'var(--outline)' }}>Home</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--outline-variant)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-semibold" style={{ color: 'var(--on-surface)' }}>{currentPage}</span>
          </div>
        </div>

        {/* ── Right: Controls ── */}
        <div className="flex items-center gap-2">

          {/* Role Badge */}
          <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold font-geist ${roleColor}`}>
            {userRole === 'ADMIN' ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            )}
            {roleLabel}
          </div>

          {/* Notification Bell */}
          <button
            className="relative p-2 rounded-lg transition-all duration-200"
            style={{ color: 'var(--on-surface-variant)' }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--primary-fixed)'; e.currentTarget.style.color='var(--primary-container)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--on-surface-variant)'; }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="notification-dot" />
          </button>

          {/* System Status */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold font-geist"
            style={{ background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.2)', color: '#065f46' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            Online
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl transition-all duration-200 group"
              style={{ border: '1px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--surface-container-low)'; e.currentTarget.style.borderColor='var(--outline-variant)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 font-geist"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
              >
                {initials}
              </div>
              <span className="hidden md:block text-sm font-medium transition-colors font-inter" style={{ color: 'var(--on-surface)' }}>
                {username}
              </span>
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                style={{ color: 'var(--outline)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {showProfile && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                <div
                  className="absolute right-0 mt-2 w-64 z-50 animate-scale-in rounded-2xl overflow-hidden"
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(195, 198, 215, 0.7)',
                    boxShadow: 'var(--shadow-level-3)',
                  }}
                >
                  {/* Profile header */}
                  <div className="p-4" style={{ borderBottom: '1px solid rgba(195, 198, 215, 0.5)' }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white font-geist"
                        style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold font-geist" style={{ color: 'var(--on-surface)' }}>{username}</div>
                        <div className="text-xs truncate max-w-[160px] font-inter" style={{ color: 'var(--outline)' }}>{userEmail}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {/* Role badge */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold font-geist mb-1 ${roleColor}`}>
                      {userRole === 'ADMIN' ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                      {roleLabel}
                    </div>

                    {/* Sign out */}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors font-inter"
                      style={{ color: 'var(--error)' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--error-container)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
