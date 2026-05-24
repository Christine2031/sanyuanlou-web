import React from "react";
import { ShieldCheck, Anchor, Database, CreditCard, Activity, Globe } from "lucide-react";
import { Language, NAV_TRANSLATIONS } from "../data/translations";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  systemStatus: "live" | "simulated" | "ready";
}

export default function SanyuanlouNavigation({ activeTab, setActiveTab, lang, setLang, systemStatus }: NavigationProps) {
  const t = NAV_TRANSLATIONS[lang];

  return (
    <nav className="border-b border-[#E6E6FA] bg-white sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(106,90,205,0.03)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex h-24 items-center justify-between">

          {/* Brand Identity */}
          <div className="flex items-center gap-4">
            <div className="bg-[#8A1C34] text-white p-2.5 rounded-sm flex items-center justify-center font-serif text-lg font-bold tracking-widest shadow-sm">
              三
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-serif tracking-[0.25em] font-extrabold text-[#2D2D2D]">
                SANYUANLOU <span className="font-sans text-xs font-light tracking-wide text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-sm">1846</span>
              </div>
              <div className="text-[10px] tracking-widest text-[#6A5ACD] font-mono uppercase mt-0.5 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> {t.badge}{lang === "en" ? " & Digital Assets" : ""}
              </div>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="hidden md:flex gap-1 lg:gap-3">
            {[
              { id: "heritage", label: t.heritage, sub: lang === "en" ? "Heritage" : "", icon: Anchor },
              { id: "qc",       label: t.qc,       sub: lang === "en" ? "QC Telemetry" : "", icon: Activity },
              { id: "rag",      label: t.rag,       sub: lang === "en" ? "AI Oracle" : "",    icon: Database },
              { id: "crm",      label: t.crm,       sub: lang === "en" ? "Concierge" : "",    icon: CreditCard },
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  id={`nav-btn-${tab.id}`}
                  className={`px-4 py-2 rounded-md transition-all duration-300 text-left flex items-center gap-2.5 border ${
                    isActive
                      ? "bg-[#6A5ACD]/5 border-[#6A5ACD]/20 text-[#6A5ACD]"
                      : "border-transparent text-gray-500 hover:text-[#2D2D2D] hover:bg-gray-50"
                  }`}
                >
                  <IconComponent className={`h-4.5 w-4.5 ${isActive ? "text-[#6A5ACD]" : "text-gray-400"}`} />
                  <div>
                    <div className="text-sm font-semibold tracking-wide leading-tight">{tab.label}</div>
                    {tab.sub && (
                      <div className="text-[9px] font-mono tracking-wider opacity-60 leading-none mt-0.5">{tab.sub}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Language toggle + badges */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "sc" ? "tc" : lang === "tc" ? "en" : "sc")}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-[#6A5ACD]/5 border border-[#E6E6FA] hover:border-[#6A5ACD]/30 text-gray-500 hover:text-[#6A5ACD] active:scale-95 rounded-md px-2.5 py-1.5 text-[11px] font-mono transition-all duration-200 cursor-pointer group"
            >
              <Globe className="h-3 w-3 text-gray-400 group-hover:text-[#6A5ACD]/70 transition-colors" />
              <span className="font-bold">{lang === "sc" ? "简" : lang === "tc" ? "繁" : "EN"}</span>
            </button>

            <span className="hidden lg:inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-mono font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/10 gap-1.5 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              {t.secure}
            </span>

            <div className="text-right font-mono text-[11px] text-gray-400 hidden 2xl:block">
              <div>{t.utc}</div>
              <div className="text-gray-600">{t.location}</div>
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex md:hidden border-t border-gray-100 py-3 gap-1 overflow-x-auto">
          {[
            { id: "heritage", label: t.heritage, icon: Anchor },
            { id: "qc",       label: t.qc,       icon: Activity },
            { id: "rag",      label: t.rag,       icon: Database },
            { id: "crm",      label: t.crm,       icon: CreditCard },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[75px] py-1.5 px-2 rounded text-center transition-all ${
                  isActive ? "bg-[#6A5ACD] text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <div className="text-xs font-semibold leading-tight">{tab.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
