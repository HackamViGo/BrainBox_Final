'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

interface Props {
  children: ReactNode
  screenName: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ScreenErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in screen [${this.props.screenName}]:`, error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="glass-panel p-10 rounded-[2.5rem] max-w-lg w-full text-center space-y-6 border border-red-500/20 shadow-2xl shadow-red-500/10">
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Screen Crash</h2>
              <p className="text-white/40 text-sm">
                The <span className="text-white/60 font-mono">{this.props.screenName}</span> screen encountered an unexpected error.
                The rest of the system is still operational.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="bg-black/20 rounded-2xl p-4 text-left overflow-auto max-h-40">
                <code className="text-xs text-red-400 font-mono whitespace-pre-wrap">
                  {this.state.error?.message}
                </code>
              </div>
            )}

            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="w-full h-14 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/90 active:scale-95 transition-all"
            >
              <RefreshCcw className="w-5 h-5" />
              Reload Screen
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
