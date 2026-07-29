import { Clock, Code, Database, Braces } from "lucide-react"

interface DataFieldProps {
  fieldName: string;
  value: any;
  dataType: string;
  jsonPath: string;
  sourceMethod: string;
  executionTime: number;
}

export function DataField({
  fieldName,
  value,
  dataType,
  jsonPath,
  sourceMethod,
  executionTime,
}: DataFieldProps) {
  
  const formatValue = (val: any) => {
    if (val === null) return <span className="text-red-400 font-mono text-sm">null</span>;
    if (val === undefined) return <span className="text-yellow-400 font-mono text-sm">Unavailable</span>;
    if (typeof val === 'boolean') return <span className="text-purple-400 font-mono text-sm">{val.toString()}</span>;
    if (typeof val === 'number') return <span className="text-blue-400 font-mono text-sm">{val}</span>;
    if (typeof val === 'string') return <span className="text-green-400 font-mono text-sm">"{val}"</span>;
    if (Array.isArray(val)) return <span className="text-muted-foreground font-mono text-sm">[Array({val.length})]</span>;
    if (typeof val === 'object') return <span className="text-muted-foreground font-mono text-sm">{'{Object}'}</span>;
    return String(val);
  };

  return (
    <div className="flex flex-col p-3 border-b border-white/5 hover:bg-white/5 transition-colors gap-2 group">
      <div className="flex items-start justify-between">
        <div className="font-semibold text-sm text-foreground">{fieldName}</div>
        <div className="text-right max-w-[60%] break-all">
          {formatValue(value)}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-black/20 px-1.5 py-0.5 rounded">
          <Database className="w-3 h-3" />
          {dataType}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-black/20 px-1.5 py-0.5 rounded">
          <Braces className="w-3 h-3" />
          {jsonPath}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-black/20 px-1.5 py-0.5 rounded">
          <Code className="w-3 h-3" />
          {sourceMethod}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-black/20 px-1.5 py-0.5 rounded">
          <Clock className="w-3 h-3" />
          {executionTime}ms
        </div>
      </div>
    </div>
  )
}
