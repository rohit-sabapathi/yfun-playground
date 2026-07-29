"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import { ChevronDown, ChevronRight, Clock } from "lucide-react"
import { DataField } from "./data-field"
import { cn } from "@/lib/utils"

interface DataSectionProps {
  title: string
  sourceMethod: string
  executionTime: number
  data: any
  defaultOpen?: boolean
}

export function DataSection({
  title,
  sourceMethod,
  executionTime,
  data,
  defaultOpen = false,
}: DataSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const renderFields = () => {
    if (!data)
      return (
        <div
          className="p-4"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
        >
          No data available
        </div>
      )

    if (Array.isArray(data)) {
      return (
        <div className="flex flex-col">
          {data.map((item, idx) => (
            <DataField
              key={idx}
              fieldName={`[${idx}]`}
              value={item}
              dataType={typeof item}
              jsonPath={`${title}[${idx}]`}
              sourceMethod={sourceMethod}
              executionTime={executionTime}
            />
          ))}
        </div>
      )
    }

    if (typeof data === "object") {
      return (
        <div className="flex flex-col">
          {Object.entries(data).map(([key, value]) => (
            <DataField
              key={key}
              fieldName={key}
              value={value}
              dataType={value === null ? "null" : Array.isArray(value) ? "array" : typeof value}
              jsonPath={`${title}.${key}`}
              sourceMethod={sourceMethod}
              executionTime={executionTime}
            />
          ))}
        </div>
      )
    }

    return (
      <DataField
        fieldName="Value"
        value={data}
        dataType={typeof data}
        jsonPath={title}
        sourceMethod={sourceMethod}
        executionTime={executionTime}
      />
    )
  }

  return (
    <div
      style={{
        border: "2px solid var(--border-color)",
        backgroundColor: "var(--card)",
        boxShadow: "var(--shadow-sm)",
        marginBottom: "1rem",
      }}
    >
      {/* Header / Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 transition-colors"
        style={{
          backgroundColor: isOpen ? "var(--accent)" : "var(--muted)",
          borderBottom: isOpen ? "2px solid var(--border-color)" : "none",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = "var(--accent)"
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = "var(--muted)"
        }}
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronDown className="w-5 h-5" style={{ color: "#0a0a0a" }} />
          ) : (
            <ChevronRight className="w-5 h-5" style={{ color: "var(--foreground)" }} />
          )}
          <h2
            className="text-base font-black uppercase tracking-wide"
            style={{
              fontFamily: "var(--font-sans)",
              color: isOpen ? "#0a0a0a" : "var(--foreground)",
            }}
          >
            {title}
          </h2>
          <span
            className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{
              border: "1.5px solid",
              borderColor: isOpen ? "#0a0a0a" : "var(--border-color)",
              backgroundColor: isOpen ? "rgba(0,0,0,0.15)" : "var(--card)",
              fontFamily: "var(--font-mono)",
              color: isOpen ? "#0a0a0a" : "var(--muted-foreground)",
            }}
          >
            {sourceMethod}
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
          style={{
            fontFamily: "var(--font-mono)",
            color: isOpen ? "#0a0a0a" : "var(--muted-foreground)",
          }}
        >
          <Clock className="w-3.5 h-3.5" />
          {executionTime}ms
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="flex flex-col lg:flex-row" style={{ borderTop: "none" }}>
          {/* Fields */}
          <div
            className="flex-1 nb-scroll"
            style={{
              borderRight: "2px solid var(--border-color)",
              maxHeight: "600px",
              overflowY: "auto",
            }}
          >
            {renderFields()}
          </div>
          {/* Raw JSON */}
          <div
            className="w-full lg:w-[40%] p-4 nb-scroll"
            style={{
              backgroundColor: "var(--muted)",
              maxHeight: "600px",
              overflowY: "auto",
            }}
          >
            <div
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
            >
              Raw JSON
            </div>
            <pre
              className="text-xs whitespace-pre-wrap break-all"
              style={{ fontFamily: "var(--font-mono)", color: "var(--accent-green)" }}
            >
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
