'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Apple, Users, ClipboardList, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur shadow-sm supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuToggle}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Apple className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline-block text-lg text-primary">NutriPlan</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 ml-8">
          <HeaderNav />
        </nav>

        {/* Right side - could add user menu, notifications, etc. */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">
            Sistema de Planes Nutricionales
          </span>
        </div>
      </div>
    </header>
  )
}

function HeaderNav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/plans', label: 'Planes', icon: ClipboardList },
    { href: '/customers', label: 'Clientes', icon: Users },
  ]

  return (
    <>
      {links.map((link) => {
        const isActive =
          pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        )
      })}
    </>
  )
}
