'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  ClipboardList,
  Users,
  PlusCircle,
  Settings,
  HelpCircle,
  X,
  Apple,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  {
    title: 'Principal',
    items: [
      { href: '/', label: 'Inicio', icon: Home, tourId: 'sidebar-home' },
      { href: '/plans', label: 'Planes', icon: ClipboardList, tourId: 'sidebar-plans' },
      { href: '/customers', label: 'Clientes', icon: Users, tourId: 'sidebar-customers' },
    ],
  },
  {
    title: 'Acciones Rápidas',
    items: [
      { href: '/plans/new', label: 'Nuevo Plan', icon: PlusCircle, tourId: 'sidebar-new-plan' },
      {
        href: '/customers/new',
        label: 'Nuevo Cliente',
        icon: PlusCircle,
        tourId: 'sidebar-new-customer',
      },
    ],
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-sm md:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold" onClick={onClose}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Apple className="h-5 w-5" />
            </div>
            <span className="text-lg text-primary">NutriPlan</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center gap-2 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Apple className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-primary">NutriPlan</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        data-tour={item.tourId}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary',
                          isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 mt-auto">
          <div className="flex flex-col gap-1">
            <Link
              href="/config"
              data-tour="sidebar-config"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              Configuración
            </Link>
            <Link
              href="/help"
              data-tour="sidebar-help"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              Ayuda
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
