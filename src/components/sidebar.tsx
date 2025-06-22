'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavigationItem {
  navigation: {
    name: string;
    href: string;
  }[]
}

export default function Sidebar({navigation}:NavigationItem) {
  const pathname = usePathname()
  
  return (
    <div className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <h1 className="text-xl font-bold">☕ Coffee Shop</h1>
      </div>
      <nav className="mt-6">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'block px-6 py-3 text-sm font-medium hover:bg-gray-700',
              pathname === item.href ? 'bg-gray-700 text-white' : 'text-gray-300'
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

