import React, { useState, useEffect } from "react";
import { TimelineMilestone } from "../types";
import { Language, TIMELINE_TRANSLATIONS, MILESTONES_TRANSLATED } from "../data/translations";
import { Calendar, MapPin, Copy, Check, FileCheck, Code } from "lucide-react";

interface TimelineSectionProps {
  lang: Language;
}

export default function TimelineSection({ lang }: TimelineSectionProps) {
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<boolean>(false);

  const t = TIMELINE_TRANSLATIONS[lang];
  const milestones = MILESTONES_TRANSLATED[lang];
  const selectedMilestone = milestones[selectedMilestoneIndex] || milestones[0];

  // Safeguard index bounds if milestones length changes
  useEffect(() => {
    if (selectedMilestoneIndex >= milestones.length) {
      setSelectedMilestoneIndex(0);
    }
  }, [lang, milestones.length, selectedMilestoneIndex]);

  const handleCopyJsonLd = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(true);
    setTimeout(() => setCopiedIndex(false), 2000);
  };

  return (
    <section className="py-12 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_30px_rgba(106,90,205,0.02)] p-6 lg:p-12">
      {/* Editorial Header */}
      <div className="max-w-3xl mb-12">
        <span className="text-[#8A1C34] font-mono text-[11px] tracking-[0.25em] uppercase block mb-3 font-semibold">
          {t.chapter}
        </span>
        <h2 className="text-3xl lg:text-4xl text-[#2D2D2D] font-serif font-bold tracking-tight mb-4 whitespace-pre-line">
          {t.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          {t.desc}
        </p>
      </div>

      {/* Row Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Years selector & Timeline line (Left Column, 4/12) */}
        <div className="lg:col-span-4 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-[#E6E6FA] pr-0 lg:pr-8">
          <div className="text-xs font-mono text-gray-400 tracking-widest mb-6 hidden lg:block uppercase">
            {t.header}
          </div>
          {milestones.map((milestone, idx) => {
            const isSelected = selectedMilestoneIndex === idx;
            return (
              <button
                key={milestone.year}
                onClick={() => setSelectedMilestoneIndex(idx)}
                id={`milestone-btn-${milestone.year}`}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-start gap-4 border cursor-pointer ${
                  isSelected
                    ? "bg-[#6A5ACD]/5 border-[#6A5ACD]/25 shadow-xs"
                    : "bg-[#F8F7FF] hover:bg-gray-50 border-gray-100"
                }`}
              >
                <div
                  className={`h-10 w-10 flex items-center justify-center rounded-lg font-serif font-bold text-sm tracking-wide shrink-0 ${
                    isSelected ? "bg-[#8A1C34] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {milestone.year}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-[#6A5ACD]">{milestone.era}</div>
                  <div className="text-xs font-bold text-gray-800 truncate mt-1">{milestone.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Sheet (Right Column, 8/12) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="bg-[#F8F7FF] p-6 lg:p-8 rounded-2xl border border-[#E6E6FA] transition-all">
            {/* Header part */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#6A5ACD] uppercase bg-[#6A5ACD]/10 px-2.5 py-1 rounded-full font-medium">
                  {selectedMilestone.era}
                </span>
                <h3 className="text-xl lg:text-2xl font-serif font-bold text-gray-900 mt-2">
                  {selectedMilestone.subtitle}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <Calendar className="h-4 w-4 text-[#8A1C34]" />
                <span>{t.retrieved}</span>
              </div>
            </div>

            {/* Content text */}
            <p className="text-sm lg:text-base text-gray-700 leading-relaxed font-sans mb-8">
              {selectedMilestone.description}
            </p>

            {/* Telemetry and Evidence tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                <MapPin className="h-4.5 w-4.5 text-[#6A5ACD] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono text-gray-400 tracking-wider font-semibold">{t.coords}</div>
                  <div className="text-xs font-bold text-gray-800 mt-1">{selectedMilestone.coordinates || "Global Ledger Registry"}</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                <FileCheck className="h-4.5 w-4.5 text-[#8A1C34] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono text-gray-400 tracking-wider font-semibold">{t.evidence}</div>
                  <div className="text-xs font-mono font-bold text-gray-700 mt-1 break-all">{selectedMilestone.evidence}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Schema JSON-LD Generator Box */}
          <div className="mt-6 bg-[#2D2D2D] text-white p-6 rounded-2xl relative overflow-hidden shadow-md">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-44 w-44 bg-[#6A5ACD] rounded-full blur-3xl opacity-10" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                <Code className="h-4 w-4 text-[#6A5ACD]" />
                <span>{t.schemaTitle}</span>
              </div>
              <button
                onClick={() => handleCopyJsonLd(selectedMilestone.jsonLdSnippet)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                {copiedIndex ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-gray-300" />
                    <span>{t.copyBtn}</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-[#E6E6FA] leading-relaxed bg-[#1E1E1E] p-4 rounded-xl overflow-x-auto border border-white/5 max-h-[160px]">
              {selectedMilestone.jsonLdSnippet}
            </pre>
            <div className="mt-3 text-[10px] text-gray-400 flex items-center gap-1.5 font-mono">
              <span>{t.schemaDesc}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
