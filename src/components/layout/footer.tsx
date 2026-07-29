export function Footer() {
  return (
    <footer className="h-12 border-t border-border/50 bg-background flex items-center justify-between px-6 text-xs text-muted-foreground flex-shrink-0">
      <div className="flex items-center gap-4">
        <span>yfun-test-playground</span>
        <span className="text-border/50">|</span>
        <span>Node Env: {process.env.NODE_ENV || 'development'}</span>
      </div>
      <div className="flex items-center gap-2">
        <span>Powered by yfun-api</span>
      </div>
    </footer>
  )
}
