"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef } from "react";
import { FileText, MessageSquareCode } from "lucide-react";

import TraditionalResume from "@/components/TraditionalResume";
import AiCopilot from "@/components/AiCopilot";

export default function SmartResumeDashboard() {
  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [jobDescription, setJobDescription] = useState("");
  const [input, setInput] = useState("");
  const [activeMobileTab, setActiveMobileTab] = useState<"resume" | "ai">("resume");

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const extractTextFromUIMessage = (message: any): string => {
    if (typeof message.content === "string") return message.content;
    if (!message.parts) return "";
    return message.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text || "")
      .join("");
  };

  const handleAnalyzeFitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    sendMessage({
      text: `Please analyze this Job Description and give me a clear breakdown of why Ashutosh Vijay is a fit. Map his professional experience (such as Custody Client Onboarding Digitization, OMRC Systematic Break Remediation, Generic Control Frameworks, Nexen API Services, and Trade Solutions) and personal projects (such as FoodApp Multi-tenant ERP, Autonomous Mail Classification Portal, and AI Invoice Extractor) directly to the job's technical and domain requirements:\n\n${jobDescription}`,
    });

    setJobDescription("");
    textareaRef.current?.blur();
  };


  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({ text: input });
    setInput("");
  };

  return (
    <main className="min-h-screen bg-azure text-slate-900 font-sans p-4 md:p-8 pb-24 lg:pb-8 selection:bg-baltic/20 selection:text-baltic">

      {/* Upper Brand Info */}
      <header className="max-w-7xl lg:max-w-none w-full mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-5 gap-3">
        <div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-sandy to-copper bg-clip-text text-transparent tracking-tight">
            Portfolio Intelligence Engine
          </h1>
        </div>
      </header>

      {/* Main Container Core Grid */}
      <div className="max-w-7xl lg:max-w-none w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* RESPONSIVE DISPLAY GRID INTERCEPTOR */}

        {/* Component 1 View wrapper (Traditional Resume) */}
        <div className={`lg:col-span-3 ${activeMobileTab === "resume" ? "block" : "hidden lg:block"}`}>
          <TraditionalResume />
        </div>

        {/* Component 2 View wrapper (AI RAG Stream Endpoint) */}
        <div className={`lg:col-span-2 ${activeMobileTab === "ai" ? "block" : "hidden lg:block"}`}>
          <AiCopilot
            messages={messages}
            status={status}
            input={input}
            setInput={setInput}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            handleChatSubmit={handleChatSubmit}
            handleAnalyzeFitment={handleAnalyzeFitment}
            sendMessage={sendMessage}
            extractText={extractTextFromUIMessage}
            scrollRef={scrollRef}
            textareaRef={textareaRef}
          />
        </div>

      </div>

      {/* MOBILE PERSISTENT COMPONENT SWITCHER TAB BAR (Only displays below lg size breakpoint) */}
      <nav className="fixed bottom-4 left-4 right-4 bg-white/90 border border-slate-200/80 p-1.5 rounded-2xl flex gap-1 backdrop-blur-md shadow-2xl lg:hidden z-50">
        <button
          type="button"
          onClick={() => setActiveMobileTab("resume")}
          className={`flex-1 flex items-center justify-center gap-2 text-xs font-mono py-3 px-4 rounded-xl transition-all ${activeMobileTab === "resume"
              ? "bg-gradient-to-r from-baltic/20 to-sandy/20 border border-baltic/30 text-baltic font-bold"
              : "text-slate-500 hover:text-slate-700"
            }`}
        >
          <FileText className="w-4 h-4" /> Credentials
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab("ai")}
          className={`flex-1 flex items-center justify-center gap-2 text-xs font-mono py-3 px-4 rounded-xl transition-all ${activeMobileTab === "ai"
              ? "bg-gradient-to-r from-baltic/20 to-sandy/20 border border-baltic/30 text-baltic font-bold"
              : "text-slate-500 hover:text-slate-700"
            }`}
        >
          <MessageSquareCode className="w-4 h-4" /> AI Copilot
        </button>
      </nav>

    </main>
  );
}