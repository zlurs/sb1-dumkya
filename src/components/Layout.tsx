import { Outlet, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LayoutDashboard, CalendarDays, Settings, LogOut, ClipboardList, Menu, X } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'
import { AuthForm } from './auth/AuthForm'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

export function Layout() {
  const location = useLocation()
  const { user, signOut } = useStore()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Shifts', href: '/shifts', icon: ClipboardList },
    { name: 'Calendar', href: '/calendar', icon: CalendarDays },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  if (!user) {
    return <AuthForm />
  }

  const NavigationContent = () => (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      'flex gap-x-3 rounded-md p-2 text-sm leading-6',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </li>
        <li className="mt-auto">
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4 px-2 py-3 text-sm">
              <div className="flex-1 truncate">
                <div className="flex items-center gap-x-2">
                  <span className="truncate font-medium">{user.name}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </li>
      </ul>
    </nav>
  )

  const getCurrentPageTitle = () => {
    const currentRoute = navigation.find(item => item.href === location.pathname)
    return currentRoute?.name || 'TipJar'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 border-r border-border/40 bg-card px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <span className="text-xl font-semibold">TipJar</span>
            </div>
            <NavigationContent />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
          <div className="flex h-16 items-center justify-between gap-x-4 px-4">
            <span className="text-xl font-semibold">TipJar</span>
            <div className="flex items-center gap-x-4">
              <span className="text-sm font-medium">{getCurrentPageTitle()}</span>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open menu"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-full max-w-[300px] p-0"
                >
                  <SheetHeader className="border-b border-border/40 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <SheetTitle>Menu</SheetTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    <NavigationContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-72 w-full">
          <main className="pt-[4.5rem] lg:pt-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}