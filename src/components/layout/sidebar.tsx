"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Search,
  History,
  FileText,
  DollarSign,
  PieChart,
  Newspaper,
  Users,
  LineChart,
  SearchCode,
  Globe,
  Terminal,
  Settings
} from "lucide-react"

const sidebarLinks = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Ticker Explorer", href: "/explorer", icon: Search },
  { name: "Historical Data", href: "/historical", icon: History },
  { name: "Financial Statements", href: "/financials", icon: FileText },
  { name: "Dividends", href: "/dividends", icon: DollarSign },
  { name: "Options", href: "/options", icon: PieChart },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Holders", href: "/holders", icon: Users },
  { name: "Analysts", href: "/analysts", icon: LineChart },
  { name: "Search", href: "/search", icon: SearchCode },
  { name: "Market", href: "/market", icon: Globe },
  { name: "Debug Console", href: "/debug", icon: Terminal },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen border-r border-border/50 bg-background/80 backdrop-blur-xl flex flex-col sticky top-0 flex-shrink-0">
      <div className="p-6 border-b border-border/50">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          yfun-api Terminal
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-border/50 text-xs text-muted-foreground flex justify-between items-center">
        <span>v0.1.0-alpha</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Connected
        </span>
      </div>
    </aside>
  )
}
