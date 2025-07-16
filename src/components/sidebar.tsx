'use client';

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavigationItem {
  navigation: {
    name: string;
    href: string;
  }[]
}

export default function Sidebar({ navigation }: NavigationItem) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Redirect ke halaman login atau home setelah logout
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between">
      <div>
        <div className="p-6">
          <h1 className="text-xl font-bold">Warkop Bangboy</h1>
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

      <div className="p-6">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
