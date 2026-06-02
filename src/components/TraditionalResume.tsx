"use client";

import { useState } from "react";
import { Briefcase, GraduationCap, Mail, Phone, Code, Globe, Layers, Award } from "lucide-react";

const EXPERIENCES = [
  {
    id: "hsbc",
    company: "HSBC",
    shortCompany: "HSBC",
    title: "VP & Product Solutions Engineer",
    tenure: "Sep 2022 - Present",
    summary: "Coordinated cross-functional IT/business architectures to eliminate data breaks and digitized custody onboarding workflows using rules-based automation and APIs.",
    initiatives: [
      {
        name: "Initiative A: Custody Client Onboarding Digitization & Turnaround Optimization",
        role: "Product Solutions Engineer",
        context: "A high-priority digitization initiative to streamline the custody client onboarding lifecycle, aimed at reducing turnaround times by utilizing a modern application stack to capture user inputs and process requests.",
        strategy: "Reviewed onboarding processes, designed optimized end-to-end flows, and automated data extraction/selection via rules-based logic and APIs. Guided tactical builds and designed interactive UI/UX mockups using AI-generated code to align teams.",
        impact: "Reduced client onboarding turnaround times, minimized long-term technical debt, and unlocked significant operational capacity.",
        tooling: "JIRA, API Integrations, Rules Engines, AI Mockups, Modern UI/UX stack"
      },
      {
        name: "Initiative B: Systematic Break Remediation & Audit Resolution for OMRC",
        role: "Product Owner / Solutions Engineer",
        context: "A strategic initiative to identify root causes of recurring systematic breaks across sourcing channels and resolve long-standing audit points.",
        strategy: "Partnered with Change Management, IT infrastructure, and Operational teams to strategically ingest critical data assets. Maintained transparency via JIRA Roadmaps.",
        impact: "Delivered an efficiency benefit equivalent to 19 FTE, enhanced data controls, and successfully resolved standing audit constraints.",
        tooling: "JIRA, MS Office, Data3Sixty"
      },
      {
        name: "Initiative C: Manual Process Eradication & Scale Optimization",
        role: "Product Owner / Solutions Engineer",
        context: "An efficiency-driven portfolio project to eliminate manual dependencies, mitigating operational risk by migrating procedures to enterprise platforms.",
        strategy: "Defined selection parameters, KPIs, and guided stakeholders through BRD writing, structured backlog grooming, and technical solution identification.",
        impact: "Migrated 300+ legacy verification controls into a uniform generic control engine within 12 months, unlocking a 3 FTE capacity benefit.",
        tooling: "Data3Sixty, Python, MS Office, JIRA"
      }
    ]
  },
  {
    id: "sionic",
    company: "Sionic Advisor India Private Limited",
    shortCompany: "Sionic / Davies Group",
    title: "Senior Consultant",
    tenure: "Jun 2021 - Aug 2022",
    summary: "Architected regulatory compliance data graphs using Data3Sixty Analyze. Implemented performance tuning patches using Python (Pandas/NumPy) to optimize data ingestion.",
    initiatives: [
      {
        name: "Initiative: Generic Control Frameworks for Regulatory Reporting",
        role: "Senior Consultant",
        context: "A high-priority initiative focused on upgrading efficiency across the enterprise Data Quality Control Framework to accelerate onboarding of regulatory compliance checks.",
        strategy: "Architected and deployed a Generic Control Framework using Data3Sixty Analyze. Designed modular validation elements for reuse across squads and parallel pipelines. Optimized data layers via custom Python computational routines.",
        impact: "Transitioned team away from fragmented control checks to a unified generic validation layer, significantly shortening implementation timelines for new regulatory logic.",
        tooling: "Data3Sixty Analyze, Python (Pandas, NumPy), MS Office, JIRA"
      }
    ]
  },
  {
    id: "bny",
    company: "BNY Mellon Technology",
    shortCompany: "BNY Mellon",
    title: "Business Analyst",
    tenure: "May 2017 - May 2021",
    summary: "Managed business analysis for cross-LoB external API services compliant with PSD2 and ISO 20022. Engineered Tableau liquidity dashboards and python ingestion pipelines.",
    initiatives: [
      {
        name: "Project A: Nexen Data Services",
        role: "Business Analyst",
        context: "A strategic project providing API reports and underlying datasets to clients, acting as a unified one-stop data solution across shared services.",
        strategy: "Designed PSD2-compliant cash API models for holdings/transactions. Revamped external API structures as per ISO 20022 messaging standards. Authored user stories and conducted API testing using Postman. Updated ISO 20022 guidelines via SWIFT Standards Editor.",
        impact: "Provided a unified data distribution channel and enhanced integration compliance across major institutional clients.",
        tooling: "SQL, Oracle Developer, Postman, Python, SWIFT Standards Editor"
      },
      {
        name: "Project B: Data Edge – Cash Dashboard",
        role: "Business Analyst & Project Manager",
        context: "Objective was to make cash deposits and liquidity trends available to the Investment Management group to support informed and timely decisions.",
        strategy: "Designed intuitive Tableau dashboards and MTD/QTD reports involving 2M+ daily calculations. Enhanced rules engines for auto-sweep products, and drafted BRDs, FRDs, and BFSDs.",
        impact: "Provided critical cash and security trend visibility to the Investment Management Group, delivering a robust decision-support platform.",
        tooling: "SQL, Tableau, PPM, JIRA, Confluence, draw.io"
      },
      {
        name: "Project C: Historical Data Load – Class Actions",
        role: "Business Analyst",
        context: "Loaded and scrubbed historical client data from prior custodians so BNY could file class actions on clients' behalf.",
        strategy: "Created client data onboarding checklists, guides, and scrub templates. Utilized Python (Pandas) to analyze and scrub transaction datasets of over 10 million records.",
        impact: "Created reusable data repositories and automated ingestion pipelines to accelerate onboarding speeds.",
        tooling: "Python (Pandas), Jupyter Notebook, Anaconda, SQL, Confluence"
      }
    ]
  },
  {
    id: "accenture",
    company: "Accenture Services Private Limited",
    shortCompany: "Accenture",
    title: "Software Engineer & Functional Analyst",
    tenure: "Dec 2013 - Apr 2016",
    summary: "Core member for position reconciliation and end-of-day processes in Trade Solutions. Managed change requests and authored FSDs/FRDs.",
    initiatives: [
      {
        name: "Project: Position Reconciliation & Trade Solutions Support",
        role: "Software Engineer / Functional Analyst",
        context: "A core financial reconciliation project supporting position matching and end-of-day transaction accounting processing.",
        strategy: "Responsible for managing EOD pipelines and reconciliation engines. Handled client-facing change requests, requirement discovery, testing, and authored detailed FSDs and FRDs.",
        impact: "Reduced operational processing friction and improved reconciliation accuracy across trade solutions.",
        tooling: "SQL, MS Office, Trade Solutions Systems, Excel"
      }
    ]
  }
];

const PERSONAL_PROJECTS = [
  {
    id: "foodapp",
    name: "FoodApp ERP System",
    shortName: "FoodApp ERP",
    category: "Multi-Tenant SaaS",
    tech: "React, Redux, IndexedDB, Node.js, MongoDB, AWS EC2, GitHub Actions",
    summary: "Industry-grade multi-tenant Restaurant ERP with Point of Sale (POS), KDS, offline queue resilience, and secure organization data isolation.",
    highlights: [
      "Designed database architecture to partition boundaries and subscription auth across tenant organizations.",
      "Implemented client-side Redux caching paired with IndexedDB local browser persistence for offline queue support, preventing terminal freezes.",
      "Configured automated GitHub Actions workflows for production database backups and disaster recovery."
    ]
  },
  {
    id: "mailtracker",
    name: "Autonomous Mail Classification & Daily Digest Portal",
    shortName: "Mail Scanner",
    category: "Workflow Automation",
    tech: "Python, Gmail API, Google Drive API, OAuth 2.0, JSON Rules Engine, Dynamic Regex",
    summary: "Gmail scanner running on daily cron to scan traffic, apply hierarchical sender rules, parse transactions via regex, and generate a daily digest.",
    highlights: [
      "Built sender-scoped rules engine with veto/trigger layers and priority conflict resolution.",
      "Parsed credit card receipts and transaction metrics using regular expressions to generate a structured financial ledger.",
      "Generated responsive daily glassmorphic HTML dashboards with one-click unsubscribe integrations, synced automatically to Google Drive."
    ]
  },
  {
    id: "invoice",
    name: "Intelligent Expense Verification & Bill-Tracking Engine",
    shortName: "AI Expense Tracker",
    category: "AI Expense Management",
    tech: "Python, Gemini API (gemini-2.5-flash), FastAPI, Uvicorn, BeautifulSoup, PyPDF",
    summary: "FastAPI portal aggregating receipts from Gmail and PDF statements, utilizing LLMs to classify bills and generate local parsing rules from user feedback.",
    highlights: [
      "Integrated Gemini-2.5-Flash to classify actionable invoices and recurring subscriptions from administrative noise.",
      "Engineered active-learning feedback loop where rejections trigger Gemini to compile generalized, date/number-excluded regex rules cached locally.",
      "Built multi-currency normalizer (Frankfurter API) with rate caching and temporal reminder consolidation within 25-day windows."
    ]
  },
  {
    id: "passgen",
    name: "Context-Aware Secure Password Engine",
    shortName: "Password Tool",
    category: "CLI Security Utility",
    tech: "Python, Google Gemini API, Kilo AI Gateway, python-dotenv",
    summary: "CLI password generator using rate-limit waterfall routing and semantic expansion for memorable, strong credentials.",
    highlights: [
      "Designed fallback routing, prioritizing Kilo API Gateway and dynamically degrading to Gemini in case of rate limits.",
      "Prompted LLMs to execute semantic expansion (synonyms and linked concepts) to generate memorably strong keys.",
      "Optimized console rendering supporting auto-configured UTF-8 output streams on Windows terminals."
    ]
  }
];

export default function TraditionalResume() {
  const [selectedId, setSelectedId] = useState("hsbc");
  const selectedExp = EXPERIENCES.find((exp) => exp.id === selectedId) || EXPERIENCES[0];
  const [selectedProjId, setSelectedProjId] = useState("foodapp");
  const selectedProj = PERSONAL_PROJECTS.find((p) => p.id === selectedProjId) || PERSONAL_PROJECTS[0];

  return (
    <div className="space-y-8 bg-white/70 border border-slate-200/80 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-sm">
      
      {/* Header Info Block */}
      <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-200/60 pb-6">
        <div className="w-24 h-24 rounded-full border-2 border-baltic/30 overflow-hidden bg-slate-50 shrink-0">
          <div className="w-full h-full bg-gradient-to-tr from-baltic/20 to-copper/20 flex items-center justify-center text-slate-400">
             <span className="text-xs font-mono">AV</span>
          </div>
        </div>
        <div className="text-center sm:text-left space-y-1">
          <div className="inline-block bg-baltic/10 text-baltic border border-baltic/20 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
            AVP, HSBC
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ashutosh Vijay</h2>
          <p className="text-slate-600 text-sm max-w-md leading-relaxed">
            Results-driven professional with 11+ years of experience across financial services and technical architecture. Specialist in process engineering, data quality frameworks, and ISO 20022 APIs.
          </p>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-copper" /> +91 9057561735</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-copper" /> vijay.ashutosh13@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Core Technical Matrix */}
      <div>
        <h3 className="text-xs font-bold font-mono tracking-wider text-slate-500 uppercase mb-3 flex items-center gap-2">
          <Code className="w-4 h-4 text-copper" /> Skills &amp; Capabilities
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Product Solutions Engineering", "Business Analysis", "AI & LLM Integration",
            "RAG Pipelines", "API Design (ISO 20022)",
            "Python (Pandas & NumPy)", "ETL Systems", "SQL Databases",
            "Data3Sixty Analyze", "UI/UX Layout & Mockups", "Agile / Scrum",
            "JIRA & Confluence", "PSD2", "Tableau Analytics"
          ].map((skill) => (
            <span key={skill} className="bg-white text-slate-700 border border-slate-200 text-xs px-2.5 py-1 rounded-md hover:border-baltic/40 transition-colors">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Corporate Professional Footprint */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold font-mono tracking-wider text-slate-500 uppercase mb-1 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-copper" /> Professional Experience
        </h3>

        {/* Horizontal Org Selector */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {EXPERIENCES.map((exp) => {
            const isSelected = selectedId === exp.id;
            return (
              <button
                key={exp.id}
                onClick={() => setSelectedId(exp.id)}
                className="flex flex-col items-center shrink-0 group focus:outline-none cursor-pointer animate-fade-in"
              >
                {/* Title */}
                <span className="text-[10px] text-slate-500 font-mono tracking-tight block text-center mb-1 group-hover:text-slate-700 transition-colors">
                  {exp.title}
                </span>
                {/* Org Box */}
                <div
                  className={`px-5 py-2.5 rounded-xl border transition-all text-xs font-bold min-w-[150px] text-center ${
                    isSelected
                      ? "bg-baltic/10 border-baltic text-baltic shadow-sm font-extrabold"
                      : "bg-white/60 border-slate-200 text-slate-600 group-hover:border-slate-300 group-hover:text-slate-800"
                  }`}
                >
                  {exp.shortCompany}
                </div>
                {/* Tenure */}
                <span className="text-[10px] text-slate-500 font-mono tracking-tight block text-center mt-1 group-hover:text-slate-600 transition-colors">
                  {exp.tenure}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Org Details */}
        <div className="bg-white/80 border border-slate-200/80 rounded-xl p-5 md:p-6 space-y-5 transition-all duration-300 shadow-sm">
          
          {/* Summary (not more than 2 lines) */}
          <div className="border-l-2 border-copper/60 pl-4 py-1">
            <p className="text-xs text-slate-700 italic leading-relaxed">
              {selectedExp.summary}
            </p>
          </div>

          {/* Key Details: Projects/Programs */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase">
              Key Projects &amp; Accomplishments
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              {selectedExp.initiatives.map((init, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-4 space-y-3 hover:border-slate-300/80 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-200/50 pb-2">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-baltic transition-colors">
                      {init.name}
                    </span>
                    {init.role && (
                      <span className="text-[9px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/80 shrink-0 self-start sm:self-center">
                        {init.role}
                      </span>
                    )}
                  </div>
                  
                  {init.context && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="text-slate-800 font-medium">Context:</span> {init.context}
                    </p>
                  )}
                  
                  {init.strategy && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="text-slate-800 font-medium">Execution:</span> {init.strategy}
                    </p>
                  )}
                  
                  {init.impact && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="text-copper font-medium">Impact:</span> {init.impact}
                    </p>
                  )}
                  
                  {init.tooling && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono text-slate-500">
                      <span className="text-[9px] text-slate-500">Tools:</span>
                      {init.tooling.split(", ").map((t) => (
                        <span key={t} className="bg-white px-2 py-0.5 rounded border border-slate-200/60">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Projects */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold font-mono tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <Layers className="w-4 h-4 text-copper" /> Personal Projects
        </h3>

        {/* Project Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {PERSONAL_PROJECTS.map((proj) => {
            const isSelected = selectedProjId === proj.id;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => setSelectedProjId(proj.id)}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-baltic/10 border-baltic/50 text-baltic shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                {proj.shortName}
              </button>
            );
          })}
        </div>

        {/* Selected Project Details */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3 transition-all duration-300 shadow-sm">
          <div className="flex justify-between items-start gap-2 border-b border-slate-200/60 pb-2">
            <div>
              <h4 className="text-xs font-bold text-slate-800">{selectedProj.name}</h4>
              <span className="text-[9px] font-mono text-slate-500 uppercase">{selectedProj.category}</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-600 leading-relaxed italic">
            "{selectedProj.summary}"
          </p>

          <div className="space-y-2 pt-1">
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Key Technical Highlights:</span>
            <ul className="list-disc list-outside pl-4 space-y-1.5">
              {selectedProj.highlights.map((highlight, idx) => (
                <li key={idx} className="text-xs text-slate-600 leading-relaxed">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[9px] font-mono text-slate-500 border-t border-slate-200/80">
            <span className="text-slate-500">Tech Stack:</span>
            {selectedProj.tech.split(", ").map((t) => (
              <span key={t} className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Education Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200/60 pt-5 text-xs">
        <div>
          <h3 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2 font-mono uppercase tracking-wider text-[11px]">
            <GraduationCap className="w-4 h-4 text-copper" /> Education
          </h3>
          <p className="font-medium text-slate-800">PGPM / MBA (Finance)</p>
          <p className="text-slate-500">Great Lakes Inst. of Management (2017)</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2 font-mono uppercase tracking-wider text-[11px]">
            <Globe className="w-4 h-4 text-copper" /> Languages
          </h3>
          <p className="text-slate-800">English <span className="text-slate-500 font-mono">(Professional)</span></p>
          <p className="text-slate-800">Hindi <span className="text-slate-500 font-mono">(Native)</span></p>
        </div>
      </div>

    </div>
  );
}