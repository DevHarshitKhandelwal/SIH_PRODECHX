"use client";

import { useState } from "react";
import { Bot, Send, FileText, Info, Sparkles, ShieldCheck } from "lucide-react";

interface EvidenceSource {
  citation_tag: string;
  period: string;
  page_number: number;
  project_code: string;
  snippet: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  sources?: EvidenceSource[];
  timestamp: string;
}

const EXAMPLE_QUESTIONS = [
  "What is the largest budget project in PAIMANA?",
  "Why is project 612786 high risk?",
  "What is the current physical progress of project 612786?",
  "Which projects are high risk in the Ministry of Railways?",
  "Which sectors have the highest concentration of high-risk projects?"
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "assistant",
      text: "Welcome to PRODECHX Project Intelligence Analyst Workspace. I synthesize grounded answers using PAIMANA PDF records, Supabase project data, ML risk scores (prodechx-randomforest-v2.0), and SHAP feature attributions.\n\nHow may I assist your infrastructure audit today?",
      timestamp: "Just now"
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSources, setActiveSources] = useState<EvidenceSource[]>([]);

  const handleSendMessage = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          sender: "assistant",
          text: data.answer,
          sources: data.sources,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (data.sources && data.sources.length > 0) {
          setActiveSources(data.sources);
        }
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: "assistant",
        text: "I couldn't find sufficient evidence in the available PAIMANA records.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex flex-col lg:flex-row gap-6 transition-all duration-300">
      {/* Left Panel: Conversation Workspace */}
      <div className="flex-1 glass-card rounded-2xl flex flex-col overflow-hidden min-h-[550px] shadow-2xl">

        {/* Workspace Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/20 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-black text-slate-900 dark:text-white text-sm sm:text-base tracking-tight">PRODECHX Project Intelligence Assistant</h2>
                <span className="hidden sm:inline-flex items-center text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                  <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-400" /> Grounded
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Strict PAIMANA Report & Supabase Citation Enforcement</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-600 dark:text-blue-300 border border-blue-500/30 rounded-xl text-xs font-mono font-bold shadow-sm">
            RAG Engine v2.0
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-blue-600/20"
                    : "glass-card text-slate-800 dark:text-slate-100 shadow-md border border-slate-200/80 dark:border-slate-800/80"
                }`}
              >
                <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed tracking-wide font-normal">{msg.text}</div>

                {/* Evidence Sources Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-200/80 dark:border-slate-700/80">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      Grounded Evidence Citations:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.sources.map((src, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 rounded-lg text-[11px] font-mono font-bold shadow-sm"
                        >
                          [{src.citation_tag}]
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <span
                  className={`text-[10px] block mt-2.5 text-right font-mono ${
                    msg.sender === "user" ? "text-blue-200" : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="glass-card rounded-2xl p-4 border border-blue-500/30 flex items-center space-x-3 shadow-lg">
                <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
                <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold">Synthesizing grounded answer from PAIMANA PDFs & Supabase DB...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Queries & Input Area */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap gap-2 mb-3.5">
            {EXAMPLE_QUESTIONS.map((eq, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(eq)}
                className="text-xs bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 px-3.5 py-1.5 rounded-full text-slate-700 dark:text-slate-300 transition-all duration-200 shadow-sm font-medium hover:scale-105 active:scale-95"
              >
                {eq}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2.5">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask a question about PAIMANA projects, cost overruns, or risk factors..."
              className="flex-1 bg-white/90 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-700/80 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputQuery.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-2xl flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-blue-500/25 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-bold">Ask</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Active Citation Evidence Inspector */}
      <div className="w-full lg:w-80 glass-card rounded-2xl p-4 sm:p-5 flex flex-col shadow-2xl">
        <div className="flex items-center space-x-2 pb-3.5 border-b border-slate-200/80 dark:border-slate-800/80">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Grounded Evidence Inspector</h3>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-3.5">
          {activeSources.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="w-9 h-9 text-slate-300 dark:text-slate-600 mx-auto mb-2.5" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">No active citation inspects.</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Ask a question to inspect source PAIMANA PDF excerpts.</p>
            </div>
          ) : (
            activeSources.map((src, i) => (
              <div key={i} className="p-3.5 bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl text-xs space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{src.citation_tag}</span>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-mono font-bold">p. {src.page_number}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] italic bg-white dark:bg-slate-900 p-2.5 border border-slate-200/60 dark:border-slate-800/80 rounded-xl leading-relaxed">
                  &quot;{src.snippet}&quot;
                </p>
                <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                  <span>Project: {src.project_code}</span>
                  <span>Period: {src.period}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

