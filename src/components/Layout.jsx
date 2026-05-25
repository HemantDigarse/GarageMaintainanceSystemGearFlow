import React, { useState, createContext, useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export const LayoutContext = createContext({ sidebarOpen: false, setSidebarOpen: () => {} })

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--surface)' }}>
        <Navbar />
        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="sidebar-mobile-overlay md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <Sidebar />
          <main
            className="flex-1 overflow-y-auto"
            style={{ background: 'var(--surface)' }}
          >
            {/* Subtle background decorations */}
            <div
              className="pointer-events-none fixed inset-0 z-0"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 20% 20%, rgba(37,99,235,0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0,74,198,0.025) 0%, transparent 50%)',
              }}
            />
            <div className="relative z-10 p-6 max-w-7xl mx-auto animate-page-enter">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  )
}
