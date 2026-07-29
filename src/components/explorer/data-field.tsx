import { Clock, Code, Database, Braces } from "lucide-react"

const MetaBadge = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
  <div
    className="flex items-center gap-1 px-1.5 py-0.5"
    style={{
      border: "1.5px solid var(--border-color)",
      backgroundColor: "var(--muted)",
      fontFamily: "var(--font-mono)",
      fontSize: "0.65rem",
      color: "var(--muted-foreground)",
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.06em",
    }}
  >
    <Icon className="w-2.5 h-2.5" />
    {children}
  </div>
)

interface DataFieldProps {
  fieldName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  dataType: string
  jsonPath: string
  sourceMethod: string
  executionTime: number
}

export function DataField({
  fieldName,
  value,
  dataType,
  jsonPath,
  sourceMethod,
  executionTime,
}: DataFieldProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatValue = (val: any) => {
    if (val === null)
      return (
        <span style={{ color: "var(--accent-red)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 700 }}>
          null
        </span>
      )
    if (val === undefined)
      return (
        <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 700 }}>
          undefined
        </span>
      )
    if (typeof val === "boolean")
      return (
        <span style={{ color: "var(--accent-blue)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 700 }}>
          {val.toString()}
        </span>
      )
    if (typeof val === "number")
      return (
        <span style={{ color: "var(--accent-blue)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 700 }}>
          {val}
        </span>
      )
    if (typeof val === "string")
      return (
        <span style={{ color: "var(--accent-green)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
          &ldquo;{val}&rdquo;
        </span>
      )
    if (Array.isArray(val))
      return (
        <span style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
          [Array({val.length})]
        </span>
      )
    if (typeof val === "object")
      return (
        <span style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
          {"{Object}"}
        </span>
      )
    return String(val)
  }

  return (
    <div
      className="flex flex-col p-3 gap-2 group"
      style={{
        borderBottom: "1.5px solid var(--border-color)",
        transition: "background-color 75ms ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--muted)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="font-black text-sm"
          style={{ fontFamily: "var(--font-mono)", color: "var(--foreground)" }}
        >
          {fieldName}
        </div>
        <div className="text-right max-w-[60%] break-all">{formatValue(value)}</div>
      </div>

      <div className="flex flex-wrap gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
        <MetaBadge icon={Database}>{dataType}</MetaBadge>
        <MetaBadge icon={Braces}>{jsonPath}</MetaBadge>
        <MetaBadge icon={Code}>{sourceMethod}</MetaBadge>
        <MetaBadge icon={Clock}>{executionTime}ms</MetaBadge>
      </div>
    </div>
  )
}
