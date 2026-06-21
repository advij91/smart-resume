"use client";

import { useState, ReactNode } from "react";
import { Terminal, Loader2, Shield, Cpu, Send, RefreshCw, MessageSquare } from "lucide-react";

export interface MessageType {
  id: string;
  role: string;
  parts?: Array<{ type?: string; text?: string }>;
  content?: string;
  text?: string;
}

interface AiCopilotProps {
  messages: MessageType[];
  status: string;
  input: string;
  setInput: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  handleChatSubmit: (e: React.FormEvent) => void;
  handleAnalyzeFitment: (e: React.FormEvent) => void;
  sendMessage: (msg: { text: string }) => void;
  extractText: (m: MessageType) => string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export default function AiCopilot({
  messages,
  status,
  input,
  setInput,
  jobDescription,
  setJobDescription,
  handleChatSubmit,
  handleAnalyzeFitment,
  sendMessage,
  extractText,
  scrollRef,
  textareaRef
}: AiCopilotProps) {
  const isLoading = status === "streaming" || status === "submitted";
  const [viewMode, setViewMode] = useState<"fitment" | "chat">("fitment");

  return (
    <div className="flex flex-col h-[75vh] md:h-[80vh] min-h-[550px] bg-white/70 border border-slate-200/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm">

      {/* Top Panel Status Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-copper" />
          <span className="text-sm font-bold tracking-tight font-mono">AI-COPILOT.EXE</span>
        </div>
        <div className="flex items-center gap-3">
          {viewMode === "chat" && (
            <button
              onClick={() => {
                setViewMode("fitment");
                setInput("");
              }}
              className="text-[10px] text-slate-500 hover:text-sandy font-mono flex items-center gap-1 cursor-pointer border border-slate-200 bg-white px-2 py-0.5 rounded transition-colors"
            >
              <RefreshCw className="w-2.5 h-2.5" /> Back to Fitment
            </button>
          )}
          {isLoading && (
            <span className="text-[11px] bg-baltic/10 text-baltic font-mono px-2.5 py-1 rounded-full border border-baltic/30 flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" /> RUNNING COMPUTE
            </span>
          )}
        </div>
      </div>

      {/* Conditionally Toggle View States based on viewMode state */}
      {viewMode === "fitment" ? (
        <div className="flex-1 p-6 flex flex-col justify-center max-w-md mx-auto w-full text-center">
          <Shield className="w-10 h-10 text-copper/85 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Evaluate Alignment Score</h3>
          <p className="text-slate-600 text-xs mt-2 mb-5 leading-relaxed">
            Drop a target requirement list or job layout here. The cross-checked RAG parser will match against {"Ashutosh's"} embedded project metrics instantly.
          </p>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setViewMode("chat");
              handleAnalyzeFitment(e);
            }} 
            className="space-y-3 text-left"
          >
            <textarea
              ref={textareaRef}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste text criteria (e.g. Needs experience building data workflows, APIs, or SaaS architectures)..."
              className="w-full h-36 bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:border-baltic placeholder:text-slate-400 transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={!jobDescription.trim() || isLoading}
              className="w-full bg-gradient-to-r from-sandy to-copper text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-lg shadow-sandy/5"
            >
              <Cpu className="w-3.5 h-3.5" /> Analyze Fitment Matrix
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-mono"><span className="bg-white px-2 text-slate-400">OR</span></div>
          </div>

          <button
            type="button"
            onClick={() => setViewMode("chat")}
            disabled={isLoading}
            className="text-xs text-slate-500 hover:text-baltic transition-colors font-mono underline decoration-slate-200 underline-offset-4 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Ask Questions About Ashutosh (Start Chat)
          </button>
        </div>
      ) : (
        /* Dynamic Stream Output Window */
        <div className="flex-1 flex flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/20 flex flex-col">

            {/* Show Query Examples if no messages yet */}
            {messages.length === 0 && (
              <div className="flex-1 p-6 flex flex-col justify-center space-y-4 max-w-md mx-auto w-full my-auto animate-fade-in">
                <div className="text-center space-y-2 mb-2">
                  <MessageSquare className="w-10 h-10 text-copper mx-auto opacity-85" />
                  <h3 className="text-sm font-bold text-slate-800">Interactive Query Portal</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Ask anything about {"Ashutosh's"} technical expertise, project architecture, or domain capabilities. Select an example prompt or type your question below:
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    "What is Ashutosh's experience with AI, and how proficient is he in practically applying it to build working prototypes?",
                    "What is Ashutosh's experience with API integrations and ISO 20022?",
                    "Explain his role in custody client onboarding at HSBC.",
                    "How does Ashutosh handle change management and technical debt?"
                  ].map((query, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage({ text: query })}
                      className="w-full text-left bg-white border border-slate-200 hover:border-baltic/50 text-slate-700 hover:text-baltic p-3 rounded-xl text-xs transition-all font-mono leading-normal cursor-pointer flex items-start gap-2 group shadow-sm"
                    >
                      <span className="text-copper font-bold shrink-0 group-hover:translate-x-0.5 transition-transform">→</span>
                      <span>{query}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Chat Messages */}
            {messages.map((m) => {
              const isUser = m.role === "user";
              const textContent = extractText(m);

              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl p-3.5 text-xs md:text-sm leading-relaxed shadow-sm ${isUser
                      ? "bg-copper text-white rounded-br-none border border-copper/80"
                      : "bg-white text-slate-800 rounded-bl-none border border-slate-200 font-sans"
                    }`}>
                    <div className={`text-[9px] font-mono tracking-wider uppercase mb-1 ${isUser ? "opacity-80 text-orange-50" : "opacity-60 text-slate-500"}`}>
                      {isUser ? "User Requirement" : "AI Agent Engine"}
                    </div>
                    {isUser ? (
                      <div className="whitespace-pre-wrap">{textContent}</div>
                    ) : (
                      <MarkdownRenderer content={textContent} />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading placeholder */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-xl rounded-bl-none p-3.5 text-slate-600 text-xs font-mono flex items-center gap-2 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-copper rounded-full animate-ping" />
                  Streaming vector evaluation...
                </div>
              </div>
            )}
          </div>

          {/* Form Ingestion Footer */}
          <form onSubmit={handleChatSubmit} className="border-t border-slate-200 p-3 bg-slate-50 flex gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? "Evaluating parameters..." : "Ask any questions about Ashutosh's experience, skills, or projects..."}
              disabled={isLoading}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-baltic text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-sandy text-slate-950 p-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center aspect-square"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function parseInlineMarkdown(text: string) {
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px] text-copper">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: ReactNode[] = [];
  let currentList: ReactNode[] = [];

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="list-disc pl-4 my-1.5 space-y-1">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      flushList(index);
      elements.push(
        <h4 key={index} className="text-xs md:text-sm font-bold text-slate-900 mt-2.5 mb-1">
          {parseInlineMarkdown(trimmed.substring(4))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList(index);
      elements.push(
        <h3 key={index} className="text-sm md:text-base font-bold text-slate-950 mt-3.5 mb-1.5">
          {parseInlineMarkdown(trimmed.substring(3))}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      flushList(index);
      elements.push(
        <h2 key={index} className="text-base md:text-lg font-bold text-slate-950 mt-3.5 mb-1.5">
          {parseInlineMarkdown(trimmed.substring(2))}
        </h2>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(
        <li key={`li-${index}`} className="text-xs md:text-sm text-slate-700">
          {parseInlineMarkdown(trimmed.substring(2))}
        </li>
      );
    } else if (trimmed === '') {
      flushList(index);
    } else {
      flushList(index);
      elements.push(
        <p key={index} className="mb-1.5 leading-relaxed text-slate-700">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  });

  flushList(lines.length);

  return <div className="space-y-0.5">{elements}</div>;
}