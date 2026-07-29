"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import { ChevronDown, ChevronRight, Clock } from "lucide-react"
import { DataField } from "./data-field"
import { cn } from "@/lib/utils"

interface DataSectionProps {
  title: string;
  sourceMethod: string;
  executionTime: number;
  data: any;
  defaultOpen?: boolean;
}

export function DataSection({
  title,
  sourceMethod,
  executionTime,
  data,
  defaultOpen = false,
}: DataSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Flatten logic specifically for the top level of this section, 
  // or just render the first-level keys if the data is an object.
  // If it's an array, render array items.
  const renderFields = () => {
    if (!data) return <div className="p-4 text-muted-foreground">No data available</div>;

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

    if (typeof data === 'object') {
      return (
        <div className="flex flex-col">
          {Object.entries(data).map(([key, value]) => (
            <DataField
              key={key}
              fieldName={key}
              value={value}
              dataType={value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value}
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
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-black/20 hover:bg-black/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <h2 className="text-lg font-bold">{title}</h2>
          <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
            {sourceMethod}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Clock className="w-4 h-4" />
          {executionTime}ms
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col lg:flex-row border-t border-white/10">
          <div className="flex-1 border-b lg:border-b-0 lg:border-r border-white/10 max-h-[600px] overflow-y-auto custom-scrollbar">
            {renderFields()}
          </div>
          <div className="w-full lg:w-[40%] bg-[#0d0d0d] p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            <div className="text-xs text-muted-foreground mb-2 font-mono uppercase tracking-wider">Raw JSON</div>
            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
