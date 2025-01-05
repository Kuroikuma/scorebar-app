"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/app/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-[#1a1625] p-4 text-white">
      <ul className="flex space-x-4">
        <li>
          <Link 
            href="/" 
            className={cn(
              "hover:text-gray-300 transition-colors",
              pathname === "/" && "font-bold underline"
            )}
          >
            Control Panel
          </Link>
        </li>
        <li>
          <Link 
            href="/overlay" 
            className={cn(
              "hover:text-gray-300 transition-colors",
              pathname === "/overlay" && "font-bold underline"
            )}
          >
            Overlay
          </Link>
        </li>
      </ul>
    </nav>
  )
}

