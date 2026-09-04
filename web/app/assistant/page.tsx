"use client";

import { useState } from "react";
import { Bot, Send, FileText, Info, Sparkles } from "lucide-react";

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
      const res = await fetch("http://localhost:8000/assistant/chat", {
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
      const errorMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        sender: "assistant",
        text: "I couldn't find sufficient evidence in the available PAIMANA records or the backend service is currently offline.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-6">
      {/* Left Panel: Conversation Workspace */}
      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Workspace Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">PRODECHX Project Intelligence Assistant</h2>
              <p className="text-[11px] text-slate-500">Grounded RAG Analyst Workspace (Strict Citation Enforcement)</p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
            RAG Engine v2.0
          </span>
        </div>

        {/* Conversation Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl rounded-lg p-4 shadow-sm border ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-slate-50 text-slate-900 border-slate-200"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed font-sans">{msg.text}</div>
                <div className={`text-[10px] mt-2 text-right ${msg.sender === "user" ? "text-blue-200" : "text-slate-400"}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 text-slate-500 rounded-lg p-3 border border-slate-200 text-xs flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Retrieving PAIMANA evidence & synthesizing grounded analysis...</span>
              </div>
            </div>
          )}
        </div>

        {/* Pre-populated Prompt Chips */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 text-[11px]">
          {EXAMPLE_QUESTIONS.map((eq, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(eq)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded transition font-medium text-left"
            >
              {eq}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a question about PAIMANA projects, ML risk scores, or report facts..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded transition flex items-center space-x-1 disabled:opacity-50"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel: Cited Evidence & Sources Vault */}
      <div className="w-80 bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col overflow-hidden hidden lg:flex">
        <div className="border-b border-slate-100 pb-3 mb-3">
          <h3 className="text-xs font-bold text-slate-900 flex items-center">
            <FileText className="w-4 h-4 text-blue-600 mr-2" />
            Retrieved PAIMANA Evidence & Citations
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Verified report page sources supporting assistant claims.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 text-xs">
          {activeSources.length > 0 ? (
            activeSources.map((src, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex justify-between items-center font-bold text-blue-700 font-mono text-[11px]">
                  <span>{src.citation_tag}</span>
                  <span className="text-slate-500 font-normal">Page {src.page_number}</span>
                </div>
                <div className="text-[11px] text-slate-700 font-sans italic line-clamp-4">
                  &ldquo;{src.snippet}&rdquo;
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs flex flex-col items-center justify-center h-full space-y-2">
              <Info className="w-6 h-6 text-slate-300" />
              <span>Ask a question to view retrieved PAIMANA report page citations.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
