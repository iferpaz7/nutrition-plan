import { Apple, Github, Heart } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-t from-muted/50 to-transparent pt-4">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Apple className="h-5 w-5" />
              </div>
              <span className="text-lg text-primary">NutriPlan</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Sistema de gestión de planes nutricionales semanales. Diseñado para nutricionistas y
              profesionales de la salud.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/plans" className="hover:text-primary transition-colors">
                  Planes
                </Link>
              </li>
              <li>
                <Link href="/customers" className="hover:text-primary transition-colors">
                  Clientes
                </Link>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Acciones</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/plans/new" className="hover:text-primary transition-colors">
                  Crear Plan
                </Link>
              </li>
              <li>
                <Link href="/customers/new" className="hover:text-primary transition-colors">
                  Nuevo Cliente
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {currentYear} NutriPlan. Hecho con
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            para nutricionistas.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/iferpaz7/nutrition-plan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
