"use client";

import { useState } from "react";
import { useAuth } from "../../components/auth/AuthContext";
import { ShieldCheck, Lock, User, Sparkles, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError(true);
        setSubmitting(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Animated Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6 transition-all duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/30 mb-2">
            <span className="text-white font-black text-xl tracking-wider">PX</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">PRODECHX</h1>
          <p className="text-xs text-slate-400 font-medium">
            MoSPI Infrastructure Risk & Early-Warning Platform
          </p>
        </div>

        {/* Demo Credentials Info Pill */}
        <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-3.5 flex items-center space-x-3 text-xs">
          <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div className="text-slate-300">
            <span className="font-semibold text-blue-300 block">Default Auditor Access:</span>
            <span>Username: <strong className="text-white font-mono bg-blue-900/60 px-1.5 py-0.5 rounded">admin</strong> | Password: <strong className="text-white font-mono bg-blue-900/60 px-1.5 py-0.5 rounded">admin</strong></span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/50 border border-red-800/50 text-red-300 text-xs p-3 rounded-xl flex items-center space-x-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>Invalid credentials. Please use username <strong>admin</strong> and password <strong>admin</strong>.</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/25 disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Security Note */}
        <div className="pt-2 text-center border-t border-slate-800/80">
          <div className="inline-flex items-center text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1" />
            Protected by Supabase Auth & RBAC Security Policy
          </div>
        </div>
      </div>
    </div>
  );
}
