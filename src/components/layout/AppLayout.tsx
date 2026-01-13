'use client'

import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { FirstTimeTour } from '@/components/FirstTimeTour'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* First-time user tour */}
      <FirstTimeTour />

      {/* Header - visible on mobile, hidden on desktop with sidebar */}
      <div className="md:hidden">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen md:min-h-0">
          {/* Desktop Header */}
          <header className="hidden md:flex sticky top-0 z-40 h-14 items-center gap-4 border-b bg-white px-6">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-muted-foreground">
                Sistema de Planes Nutricionales
              </h1>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto">{children}</main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  )
}
