import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("React error:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
          <div className="bg-white border border-red-200 rounded-2xl p-6 max-w-2xl w-full">
            <h1 className="font-bold text-red-700">Something crashed — see error:</h1>
            <pre className="mt-3 text-xs bg-slate-950 text-red-300 p-3 rounded-xl overflow-auto">{String(this.state.error?.message || this.state.error)}</pre>
            <pre className="mt-2 text-[10px] text-slate-500 overflow-auto">{String(this.state.error?.stack || "")}</pre>
            <button onClick={()=>location.reload()} className="mt-4 bg-slate-900 text-white px-4 py-2 rounded-full text-xs">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
