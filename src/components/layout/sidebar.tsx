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
    <aside
      className="w-64 h-screen flex flex-col sticky top-0 flex-shrink-0"
      style={{
        backgroundColor: "var(--card)",
        borderRight: "2px solid var(--border-color)",
      }}
    >
      {/* Logo */}
      <div
        className="p-5 flex items-center gap-3"
        style={{ borderBottom: "2px solid var(--border-color)" }}
      >
        <div
          className="w-9 h-9 flex items-center justify-center"
          style={{
            backgroundColor: "var(--accent)",
            border: "2px solid var(--border-color)",
            boxShadow: "2px 2px 0px var(--border-color)",
          }}
        >
          <Terminal className="w-5 h-5" style={{ color: "#0a0a0a" }} />
        </div>
        <div>
          <h1
            className="text-base font-bold leading-none tracking-tight"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            yfun-api
          </h1>
          <p
            className="text-[10px] uppercase tracking-widest mt-0.5"
            style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
          >
            Terminal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto nb-scroll p-3 space-y-0.5">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all duration-75",
                "uppercase tracking-wide"
              )}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                letterSpacing: "0.04em",
                ...(isActive
                  ? {
                      backgroundColor: "var(--accent)",
                      color: "#0a0a0a",
                      border: "2px solid var(--border-color)",
                      boxShadow: "2px 2px 0px var(--border-color)",
                    }
                  : {
                      backgroundColor: "transparent",
                      color: "var(--muted-foreground)",
                      border: "2px solid transparent",
                    }),
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "var(--muted)"
                  e.currentTarget.style.color = "var(--foreground)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.color = "var(--muted-foreground)"
                }
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {link.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        className="p-3 flex justify-between items-center"
        style={{
          borderTop: "2px solid var(--border-color)",
          backgroundColor: "var(--muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
        }}
      >
        <span
          className="font-bold uppercase tracking-widest px-2 py-1"
          style={{ border: "1.5px solid var(--border-color)", backgroundColor: "var(--card)" }}
        >
          v0.1.0-alpha
        </span>
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-[0.6rem] font-bold">
          <span
            className="w-2 h-2"
            style={{
              backgroundColor: "var(--accent-green)",
              border: "1px solid var(--border-color)",
              display: "inline-block",
            }}
          />
          Connected
        </span>
      </div>
    </aside>
  )
}
