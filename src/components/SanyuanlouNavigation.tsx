import React from "react";
import { Anchor, Database, CreditCard, Activity, Globe } from "lucide-react";
import { Language, NAV_TRANSLATIONS } from "../data/translations";
import { SanyuanlouMark } from "./SanyuanlouMark";

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
          {/* Brand Identity — 横版三元楼印章 */}
          <div className="flex flex-col gap-1 shrink-0">
            <SanyuanlouMark height={46} className="drop-shadow-sm" />
            <div className="text-[9px] tracking-[0.2em] font-mono text-[#9B7533] uppercase pl-0.5">
              HONGKONG · EST. 1846
            </div>
          </div>

          {/* Luxury Classical tabs */}
          <div className="hidden md:flex gap-1 lg:gap-3">
            {[
              { id: "heritage", label: t.heritage, sub: lang === "en" ? "Heritage" : "", icon: Anchor },
              { id: "qc", label: t.qc, sub: lang === "en" ? "QC Telemetry" : "", icon: Activity },
              { id: "rag", label: t.rag, sub: lang === "en" ? "AI Oracle" : "", icon: Database },
              { id: "crm", label: t.crm, sub: lang === "en" ? "Concierge" : "", icon: CreditCard },
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
                      ? "bg-[#7B1A26]/5 border-[#7B1A26]/20 text-[#7B1A26]"
                      : "border-transparent text-gray-500 hover:text-[#2D2D2D] hover:bg-gray-50"
                  }`}
                >
                  <IconComponent className={`h-4.5 w-4.5 ${isActive ? "text-[#D4A843]" : "text-gray-400"}`} />
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

          {/* Authority Indicator & Language + Live Telemetry Badge */}
          <div className="flex items-center gap-3">
            {/* Language toggle — single cycling button */}
            <button
              onClick={() => setLang(lang === "sc" ? "tc" : lang === "tc" ? "en" : "sc")}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-[#7B1A26]/5 border border-gray-200 hover:border-[#D4A843]/50 text-gray-500 hover:text-[#7B1A26] active:scale-95 rounded-md px-2.5 py-1.5 text-[11px] font-mono transition-all duration-200 cursor-pointer group"
            >
              <Globe className="h-3 w-3 text-gray-400 group-hover:text-[#D4A843] transition-colors" />
              <span className="font-bold">{lang === "sc" ? "简" : lang === "tc" ? "繁" : "EN"}</span>
            </button>

            {/* EEAT badge — only on lg+ to avoid crowding on medium screens */}
            <span className="hidden lg:inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-mono font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/10 gap-1.5 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              {t.secure}
            </span>

            {/* UTC/location — only on 2xl+ */}
            <div className="text-right font-mono text-[11px] text-gray-400 hidden 2xl:block">
              <div>{t.utc}</div>
              <div className="text-gray-600">{t.location}</div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden border-t border-gray-100 py-3 gap-1 overflow-x-auto">
          {[
            { id: "heritage", label: t.heritage, icon: Anchor },
            { id: "qc", label: t.qc, icon: Activity },
            { id: "rag", label: t.rag, icon: Database },
            { id: "crm", label: t.crm, icon: CreditCard },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[75px] py-1.5 px-2 rounded text-center transition-all ${
                  isActive ? "bg-[#7B1A26] text-[#D4A843]" : "text-gray-500 hover:bg-gray-50"
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
