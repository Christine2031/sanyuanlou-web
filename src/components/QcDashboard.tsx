import React, { useState } from "react";
import { Sliders, Thermometer, Flame, ShieldAlert, CheckCircle2, RotateCw, AlertTriangle } from "lucide-react";
import { Language, QC_TRANSLATIONS } from "../data/translations";

interface QcDashboardProps {
  lang: Language;
}

export default function QcDashboard({ lang }: QcDashboardProps) {
  const [duration, setDuration] = useState<number>(12); // Hours (6 to 18)
  const [temp, setTemp] = useState<number>(2.5); // °C (0.1 to 10)
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const t = QC_TRANSLATIONS[lang];

  // Computed parameters based on interactive simulation
  const collagenSolubility = Math.min(20, (duration * 1.15) + (temp < 4 ? 0.4 : -0.1 * temp)).toFixed(1);
  const gelatinViscosity = duration >= 12 ? t.param3OptText : t.param3WarnText;
  const systemState = duration < 12 ? "warning" : temp > 4.0 ? "high-risk" : "nominal-perfect";

  const handleRecalibrate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setDuration(12);
      setTemp(2.5);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <section className="bg-[#F8F7FF] border border-[#E6E6FA] rounded-2xl p-6 lg:p-12">
      {/* Title block */}
      <div className="max-w-3xl mb-10">
        <span className="text-[#8A1C34] font-mono text-[11px] tracking-[0.25em] uppercase block mb-3 font-semibold">
          {t.chapter}
        </span>
        <h2 className="text-3xl lg:text-4xl text-[#2D2D2D] font-serif font-bold tracking-tight mb-4">
          {t.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          {t.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Metric cards (Left, 7/12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-2">
            {t.sensorsHeader}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Param 1: Extraction */}
            <div className={`p-4 rounded-xl border bg-white ${systemState === "warning" ? "border-amber-200" : "border-gray-100"}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-500">{t.param1Name}</span>
                {duration < 12 ? (
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-sm font-mono font-bold flex items-center gap-1">
                    <AlertTriangle className="h-2.5 w-2.5" /> {t.param1Warning}
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" /> {t.param1Optimal}
                  </span>
                )}
              </div>
              <div className="text-xl font-mono font-bold text-gray-900 mt-2">
                {duration} {t.param1Val}
              </div>
              <div className="text-[11px] text-gray-400 mt-1 font-mono">
                {t.param1Sensor}
              </div>
            </div>

            {/* Param 2: Storage Temp */}
            <div className={`p-4 rounded-xl border bg-white ${temp > 4.0 ? "border-rose-200" : "border-gray-100"}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-500">{t.param2Name}</span>
                {temp > 4.0 ? (
                  <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-sm font-mono font-bold flex items-center gap-1">
                    <ShieldAlert className="h-2.5 w-2.5" /> {t.param2Warning}
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" /> {t.param2Optimal}
                  </span>
                )}
              </div>
              <div className="text-xl font-mono font-bold text-gray-900 mt-2">
                {temp} {t.param2Val}
              </div>
              <div className="text-[11px] text-gray-400 mt-1 font-mono">
                {t.param2Sensor}
              </div>
            </div>

            {/* Param 3: Collagen solubility */}
            <div className="p-4 rounded-xl border bg-white border-gray-100">
              <div className="text-xs font-semibold text-gray-500 mb-2">{t.param3Name}</div>
              <div className="text-xl font-mono font-bold text-[#6A5ACD] mt-2">
                {collagenSolubility} g / 100ml
              </div>
              <div className="text-xs text-gray-500 mt-2 font-mono flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#6A5ACD]" />
                {gelatinViscosity}
              </div>
            </div>

            {/* Param 4: Additives detection */}
            <div className="p-4 rounded-xl border bg-white border-gray-100">
              <div className="text-xs font-semibold text-gray-500 mb-2">{t.param4Name}</div>
              <div className="text-xl font-mono font-bold text-[#8A1C34] mt-2">
                0.00 ppb
              </div>
              <div className="text-xs font-semibold text-emerald-700 mt-2 flex items-center gap-1 bg-emerald-50 max-w-max px-2 py-0.5 rounded font-sans scale-95 origin-left">
                <span>{t.param4Sub}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 justify-between items-center hidden md:flex">
            <div>
              <div className="text-xs font-bold text-gray-800">{t.registryHash}</div>
              <div className="text-[11px] text-gray-400 font-mono mt-1">
                Hash: SHA-256 Sanyuanlou-QC-Ver-1.049.213 [2026-05-23]
              </div>
            </div>
            <button
              onClick={handleRecalibrate}
              disabled={isProcessing}
              className="px-4 py-2 bg-[#6A5ACD]/10 hover:bg-[#6A5ACD]/20 text-[#6A5ACD] rounded-lg transition duration-200 text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className={`h-3 w-3 ${isProcessing ? "animate-spin" : ""}`} />
              {isProcessing ? t.recalibrating : t.recalibrateBtn}
            </button>
          </div>
        </div>

        {/* Regulatory valve console (Right, 5/12) */}
        <div className="lg:col-span-5 bg-white p-6 lg:p-8 rounded-2xl border border-[#E6E6FA] flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-[#6A5ACD] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sliders className="h-4 w-4" /> {t.panelTitle}
            </div>

            {/* Slider 1: Extraction Hours */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-amber-500" />
                  {t.slider1Title}
                </span>
                <span className="font-mono text-xs font-bold text-[#6A5ACD]">{duration} Hours</span>
              </div>
              <input
                type="range"
                min="6"
                max="18"
                step="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6A5ACD]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>{t.slider1Label1}</span>
                <span className="text-[#8A1C34] font-bold">{t.slider1Label2}</span>
                <span>{t.slider1Label3}</span>
              </div>
            </div>

            {/* Slider 2: Temp Control */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Sliders className="h-3.5 w-3.5 text-blue-500" />
                  {t.slider2Title}
                </span>
                <span className="font-mono text-xs font-bold text-[#6A5ACD]">{temp} °C</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10.0"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6A5ACD]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>{t.slider2Label1}</span>
                <span className="text-[#8A1C34] font-bold">{t.slider2Label2}</span>
                <span>{t.slider2Label3}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
            {systemState === "warning" && (
              <div className="text-amber-700">
                <div className="font-bold flex items-center gap-1 mb-1">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {lang === "sc" ? "偏离 QC 标准预警" : lang === "tc" ? "偏離 QC 標準預警" : "Deviation Warning"}
                </div>
                {t.warningText}
              </div>
            )}
            {systemState === "high-risk" && (
              <div className="text-[#8A1C34]">
                <div className="font-bold flex items-center gap-1 mb-1">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  {lang === "sc" ? "冷藏超限安全通告" : lang === "tc" ? "冷藏超限安全通告" : "Temperature Hazard Alert"}
                </div>
                {t.highRiskText}
              </div>
            )}
            {systemState === "nominal-perfect" && (
              <div className="text-emerald-800">
                <div className="font-bold flex items-center gap-1 mb-1">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {lang === "sc" ? "金汤品质达到巅峰" : lang === "tc" ? "金湯品質達到巔峰" : "Extraction Quality Zenith"}
                </div>
                {t.optimalText}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
