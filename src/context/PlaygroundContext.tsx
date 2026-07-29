"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface PlaygroundState {
  selectedTicker: string | null
  isLoading: boolean
  errors: Error[]
  cacheEnabled: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cacheState: Record<string, any>
}

interface PlaygroundContextType extends PlaygroundState {
  setSelectedTicker: (ticker: string | null) => void
  setIsLoading: (loading: boolean) => void
  addError: (error: Error) => void
  clearErrors: () => void
  setCacheEnabled: (enabled: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateCacheState: (key: string, data: any) => void
}

const defaultState: PlaygroundState = {
  selectedTicker: null,
  isLoading: false,
  errors: [],
  cacheEnabled: true,
  cacheState: {},
}

const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined)

export function PlaygroundProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlaygroundState>(defaultState)

  const value: PlaygroundContextType = {
    ...state,
    setSelectedTicker: (ticker) => setState(s => ({ ...s, selectedTicker: ticker })),
    setIsLoading: (loading) => setState(s => ({ ...s, isLoading: loading })),
    addError: (error) => setState(s => ({ ...s, errors: [...s.errors, error] })),
    clearErrors: () => setState(s => ({ ...s, errors: [] })),
    setCacheEnabled: (enabled) => setState(s => ({ ...s, cacheEnabled: enabled })),
    updateCacheState: (key, data) => setState(s => ({
      ...s,
      cacheState: { ...s.cacheState, [key]: data }
    }))
  }

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  )
}

export function usePlayground() {
  const context = useContext(PlaygroundContext)
  if (context === undefined) {
    throw new Error("usePlayground must be used within a PlaygroundProvider")
  }
  return context
}
