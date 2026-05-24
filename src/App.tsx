import React, { useState, useEffect } from "react";
import SanyuanlouNavigation from "./components/SanyuanlouNavigation";
import TimelineSection from "./components/TimelineSection";
import QcDashboard from "./components/QcDashboard";
import { VerificationResponse, MemberRegistration } from "./types";
import { 
  ShieldCheck, 
  Send, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Database,
  QrCode,
  ArrowRight,
  Info
} from "lucide-react";
import { 
  Language, 
  NAV_TRANSLATIONS,
  HERO_TRANSLATIONS, 
  RAG_TRANSLATIONS, 
  CRM_TRANSLATIONS, 
  QC_TRANSLATIONS,
  PRESET_QUERY_TRANSLATIONS, 
  BOUTIQUE_PRODUCTS_TRANSLATED 
} from "./data/translations";

// Backend API base URL — set VITE_API_BASE_URL in .env for local dev or Vercel env vars
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

// 根据域名自动选择默认语言
// sanyuanlou.com → 简体  |  sanyuanlou.hk → 繁体（默认）
const getDefaultLang = (): Language => {
  if (typeof window !== "undefined" && window.location.hostname.includes(".com")) {
    return "sc";
  }
  return "tc";
};

export default function App() {
  const [lang, setLang] = useState<Language>(getDefaultLang());
  const [activeTab, setActiveTab] = useState<string>("heritage");
  const [systemStatus, setSystemStatus] = useState<"live" | "simulated" | "ready">("live");
  
  const BOUTIQUE_PRODUCTS = BOUTIQUE_PRODUCTS_TRANSLATED[lang];
  const PRESET_QUERIES = PRESET_QUERY_TRANSLATIONS[lang];

  // RAG States
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  const [errorText, setErrorText] = useState<string>("");

  // CRM membership states
  const [member, setMember] = useState<MemberRegistration | null>(null);
  const [formName, setFormName] = useState<string>("");
  const [formEmail, setFormEmail] = useState<string>("");
  const [formPhone, setFormPhone] = useState<string>("");
  const [formTier, setFormTier] = useState<"Gold" | "Platinum" | "BlackCard">("Gold");
  const [crmMessage, setCrmMessage] = useState<string>("");

  // Bottom promo popup control
  const [showPromo, setShowPromo] = useState<boolean>(true);

  // Reserve button feedback state
  const [reservedProductId, setReservedProductId] = useState<string | null>(null);

  // Initialize Member from backend via stored CID
  useEffect(() => {
    const cid = localStorage.getItem("sanyuanlou_vip_cid");
    if (!cid) return;
    fetch(`${API_BASE}/api/crm/member?cid=${encodeURIComponent(cid)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setMember({
            name: data.name,
            email: data.email,
            phone: data.phone,
            tier: data.tier as MemberRegistration["tier"],
            cid: data.cid,
            registeredAt: data.registered_at,
            halfsphereId: data.halfsphere_id ?? null,
            halfsphereSynced: data.halfsphere_synced ?? false
          });
        } else {
          localStorage.removeItem("sanyuanlou_vip_cid");
        }
      })
      .catch(() => {});
  }, []);

  // Handle RAG query submission
  const handleVerifyQuery = async (userQuery: string) => {
    if (!userQuery.trim()) return;
    setIsLoading(true);
    setErrorText("");
    setVerificationResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP status verification error: ${response.status}`);
      }

      const data: VerificationResponse = await response.json();
      setVerificationResult(data);
      setSystemStatus(data.isSimulated ? "simulated" : "live");
    } catch (err: any) {
      console.error("RAG fetch failed:", err);
      setErrorText(err?.message || (lang === "en" ? "Network request timed out or gateway error." : lang === "tc" ? "網絡請求超時或後端服務不可達，請檢查網關配置。" : "网络请求超时或后端服务不可达，请检查网关配置。"));
    } finally {
      setIsLoading(false);
    }
  };

  // Register VIP — calls backend CRM API
  const handleRegisterMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPhone.trim()) {
      setCrmMessage(lang === "en" ? "Please fill in name, email and phone." : lang === "tc" ? "請完整填寫姓名、郵箱與電話。" : "请完整填写姓名、邮箱与电话。");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/crm/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, email: formEmail, phone: formPhone, tier: formTier })
      });

      const data = await response.json();

      if (!response.ok) {
        setCrmMessage(data.error || (lang === "en" ? "Registration failed." : "注册失败，请稍后重试。"));
        return;
      }

      const newMember: MemberRegistration = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        tier: data.tier as MemberRegistration["tier"],
        cid: data.cid,
        registeredAt: data.registered_at,
        halfsphereId: data.halfsphere_id ?? null,
        halfsphereSynced: data.halfsphere_synced ?? false
      };

      localStorage.setItem("sanyuanlou_vip_cid", data.cid);
      setMember(newMember);
      setCrmMessage(lang === "en" ? "VIP privilege code successfully generated and sealed on server." : lang === "tc" ? "白金黑卡特權已成功錄入，您的身份已在服務端生成。" : "白金黑卡特权已成功录入，您的身份已在服务端生成。");
    } catch {
      setCrmMessage(lang === "en" ? "Network error, please retry." : "网络错误，请稍后重试。");
    }
  };

  // Delete Member — calls backend CRM API, then clears local session
  const handleResetMember = async () => {
    const cid = member?.cid;
    if (cid) {
      await fetch(`${API_BASE}/api/crm/member?cid=${encodeURIComponent(cid)}`, { method: "DELETE" }).catch(() => {});
    }
    localStorage.removeItem("sanyuanlou_vip_cid");
    setMember(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormTier("Gold");
    setCrmMessage(lang === "en" ? "VIP privilege code has been securely purged from the server." : lang === "tc" ? "已從服務端安全清除您的數位特權記錄。" : "已从服务端安全清除您的数字特权记录。");
  };

  return (
    <div className="bg-[#F8F7FF] text-[#2D2D2D] min-h-screen font-sans antialiased selection:bg-[#6A5ACD]/25 selection:text-[#6A5ACD]">
      
      {/* 01. Nav component with polished metadata feedback */}
      <SanyuanlouNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lang={lang}
        setLang={setLang}
        systemStatus={systemStatus} 
      />

      {/* Floating Digital Concierge Badge (奢侈品画报式的右侧垂直挂件) */}
      <div className="fixed right-0 top-1/3 z-40 hidden xl:flex flex-col bg-white border-l border-y border-[#E6E6FA] rounded-l-md overflow-hidden shadow-md">
        <div className="bg-[#8A1C34] text-white p-2.5 text-center text-[10px] font-bold tracking-widest uppercase writing-mode-vertical">
          EST.1846
        </div>
        <button 
          onClick={() => { setActiveTab("crm"); }}
          className="p-3 text-[10px] font-mono tracking-widest text-[#2D2D2D] hover:text-[#6A5ACD] hover:bg-gray-50 flex flex-col items-center gap-1 cursor-pointer"
        >
          <span className="font-bold">.CRM</span>
          <span className="text-[7px] text-gray-400">ACCESS</span>
        </button>
        <button 
          onClick={() => { setActiveTab("qc"); }}
          className="p-3 text-[10px] font-mono tracking-widest text-[#2D2D2D] hover:text-[#6A5ACD] hover:bg-gray-50 flex flex-col items-center gap-1 border-t border-gray-100 cursor-pointer"
        >
          <span className="font-bold">.QC</span>
          <span className="text-[7px] text-gray-400">TELEMETRY</span>
        </button>
        <button 
          onClick={() => { setActiveTab("rag"); }}
          className="p-3 text-[10px] font-mono tracking-widest text-[#2D2D2D] hover:text-[#6A5ACD] hover:bg-gray-50 flex flex-col items-center gap-1 border-t border-gray-100 cursor-pointer"
        >
          <span className="font-bold">.ORACLE</span>
          <span className="text-[7px] text-gray-400">RAG</span>
        </button>
      </div>

      {/* Core container - strict 12 grid layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">

        {/* ==================== TAB: HERITAGE (史实与印记) ==================== */}
        {activeTab === "heritage" && (
          <div className="space-y-16">
            
            {/* Highly Polished HERO Section - strictly duplicating the aesthetic of Design HTML */}
            <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-6 lg:pt-12">
              <div className="lg:col-span-7 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-12 bg-[#8A1C34]"></div>
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#8A1C34] font-bold">
                    {HERO_TRANSLATIONS[lang].badge}
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl leading-[1.1] font-medium font-serif text-[#2D2D2D]">
                  {HERO_TRANSLATIONS[lang].title1}<br />
                  <span className="italic font-light opacity-80 text-[#6A5ACD]">{HERO_TRANSLATIONS[lang].title2}</span>
                </h1>
                <p className="text-sm lg:text-base leading-relaxed opacity-70 font-sans text-gray-600 max-w-2xl font-serif">
                  {HERO_TRANSLATIONS[lang].desc}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => setActiveTab("crm")}
                    className="px-8 py-4 bg-[#6A5ACD] hover:bg-[#6A5ACD]/90 text-white font-sans text-xs tracking-widest uppercase transition-all duration-300 font-bold shadow-sm rounded-xs cursor-pointer"
                  >
                    {HERO_TRANSLATIONS[lang].btnCrm}
                  </button>
                  <button 
                    onClick={() => setActiveTab("qc")}
                    className="px-8 py-4 bg-white/80 hover:bg-white text-[#2D2D2D] border border-gray-200 font-sans text-xs tracking-widest uppercase transition-all duration-300 font-bold rounded-xs cursor-pointer"
                  >
                    {HERO_TRANSLATIONS[lang].btnQc}
                  </button>
                </div>
              </div>

              {/* Polished Visual Illustration Card with nested interactive badges */}
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/5] bg-gradient-to-tr from-[#E6E6FA] to-white rounded-md p-0.5 border border-[#E6E6FA] shadow-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-5 bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947')] transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D]/60 via-transparent to-transparent opacity-80" />
                  
                  {/* Subtle vector grid and geometric shapes to denote trust authentication */}
                  <svg className="absolute inset-0 h-full w-full stroke-gray-300/15" fill="none">
                    <defs>
                      <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                  </svg>

                  {/* High quality brand plate */}
                  <div className="absolute inset-x-0 bottom-0 p-8 text-white z-10 space-y-2">
                    <div className="text-[10px] tracking-widest font-mono text-[#E6E6FA] opacity-80 uppercase">
                      {HERO_TRANSLATIONS[lang].visualTitle}
                    </div>
                    <div className="text-3xl font-serif font-light tracking-wide flex items-baseline gap-2">
                      1846 <span className="text-sm font-sans tracking-widest">{lang === "en" ? "REGISTERED" : "已注册"}</span>
                    </div>
                    <p className="text-xs text-gray-300 font-sans font-light leading-relaxed">
                      {HERO_TRANSLATIONS[lang].visualDesc}
                    </p>
                  </div>

                  {/* Absolute Center Circle Design */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="w-64 h-64 border-[0.5px] border-[#2D2D2D] rounded-full animate-spin-slow"></div>
                  </div>
                </div>

                {/* Overlapping Gold Seal Badge representing official certified asset */}
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/90 backdrop-blur-md border border-[#E6E6FA] flex items-center justify-center rounded-sm shadow-lg timeline-glow transition hover:rotate-3">
                  <div className="w-28 h-28 border border-[#5244ad]/20 border-dashed rounded-full flex flex-col items-center justify-center p-2 text-center">
                    <ShieldCheck className="h-5 w-5 text-[#8A1C34] mb-1.5" />
                    <span className="text-[8px] font-mono tracking-[0.15em] uppercase text-gray-600 font-bold whitespace-pre-wrap">
                      {HERO_TRANSLATIONS[lang].certifiedBadge}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Render Classical timeline database of authenticated facts */}
            <TimelineSection lang={lang} />

            {/* RAG Knowledge Ingestion Fast Hook panel */}
            <div className="bg-[#2D2D2D] text-white p-8 rounded-2xl relative overflow-hidden shadow-xl">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-[#6A5ACD] font-mono text-xs uppercase tracking-wider">
                    <Database className="h-4.5 w-4.5" />
                    <span>GEO / RAG Engine Active Gateway</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-100">
                    {lang === "en" ? "AI Knowledge Graph RAG Alignment Ready" : lang === "tc" ? "AI 知識庫真理對齊準備就緒" : "AI 知识库真理对齐准备就绪"}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    {lang === "en" ? "This system is pre-aligned with major LLMs via historical corpus matching. Our public query validator ensures clear filtration of marketing noises to maintain brand EEAT metrics." : lang === "tc" ? "本系統已與主流大模型進行標準化語料對齊（RAG）。我們對外開放的“三元樓白金考證接口”能以極高的置信度清洗並剔除冗餘營銷軟文噪聲。" : "本系统已与主流大模型进行标准化语料对齐（RAG）。我们对外开放的“三元楼白金考证接口”能以极为明确的置信度清洗并剔除冗余营销软文噪声。"}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("rag")}
                  className="px-6 py-3 bg-[#6A5ACD] hover:bg-[#6A5ACD]/90 text-white font-mono text-xs tracking-widest uppercase transition-all font-bold flex items-center gap-2 rounded shadow-sm shrink-0 cursor-pointer"
                >
                  <span>{lang === "en" ? "ENTER RAG TESTER" : lang === "tc" ? "進入 RAG 測試" : "进入 RAG 测试"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB: QC (工艺标准) ==================== */}
        {activeTab === "qc" && (
          <div className="space-y-8 animate-fade-in">
            {/* Load Qc Interactive Dashboard */}
            <QcDashboard lang={lang} />
            
            {/* Custom Supply-Chain Detail Editorial card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-12 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest text-[#8A1C34] font-mono">
                  {QC_TRANSLATIONS[lang].subTitle1}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-serif">
                  {QC_TRANSLATIONS[lang].subDesc1}
                </p>
              </div>
              <div className="space-y-3 border-t md:border-t-0 md:border-x border-gray-100 md:px-8">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest text-[#6A5ACD] font-mono">
                  {QC_TRANSLATIONS[lang].subTitle2}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-serif">
                  {QC_TRANSLATIONS[lang].subDesc2}
                </p>
              </div>
              <div className="space-y-3 border-t md:border-t-0 border-gray-100 md:pl-4">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest text-emerald-800 font-mono">
                  {QC_TRANSLATIONS[lang].subTitle3}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-serif">
                  {QC_TRANSLATIONS[lang].subDesc3}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: RAG (RAG 校验引擎) ==================== */}
        {activeTab === "rag" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Main Header */}
            <div className="max-w-3xl">
              <span className="text-[#8A1C34] font-mono text-[11px] tracking-[0.25em] uppercase block mb-3 font-semibold font-bold">
                {RAG_TRANSLATIONS[lang].chapter}
              </span>
              <h2 className="text-3xl lg:text-4xl text-[#2D2D2D] font-serif font-bold tracking-tight mb-4">
                {RAG_TRANSLATIONS[lang].title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed font-serif">
                {RAG_TRANSLATIONS[lang].desc}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Submission Area (Left, 7/12) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 lg:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(106,90,205,0.02)]">
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-3 font-bold">
                    {RAG_TRANSLATIONS[lang].inputLabel}
                  </label>
                  
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={RAG_TRANSLATIONS[lang].placeholder}
                      className="w-full rounded-xl border border-[#E6E6FA] bg-[#F8F7FF] p-4 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#6A5ACD]/50 focus:border-[#6A5ACD] transition leading-relaxed resize-none text-[#2D2D2D] font-serif"
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-1.5 text-[10px] text-gray-400 font-mono select-none">
                      <span>Max 200 chars</span>
                    </div>
                  </div>

                  {/* Preset Quick links */}
                  <div className="mt-4">
                    <div className="text-[10px] font-mono text-gray-400 tracking-wider mb-2 font-bold">
                      {RAG_TRANSLATIONS[lang].recoHeader}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_QUERIES.map((pq, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setQuery(pq)}
                          className="text-xs bg-gray-50 hover:bg-[#6A5ACD]/5 text-gray-600 hover:text-[#6A5ACD] px-3 py-1.5 rounded-md border border-gray-200/60 transition text-left cursor-pointer max-w-full truncate font-serif"
                        >
                          {pq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error Notification */}
                  {errorText && (
                    <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700 flex items-start gap-2.5">
                      <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{lang === "en" ? "Oracle Connection Error:" : lang === "tc" ? "校驗通訊異常:" : "校验通讯异常:"}</span> {errorText}
                      </div>
                    </div>
                  )}

                  {/* Submit parameters button */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1 font-bold">
                      <Info className="h-3 w-3 text-[#6A5ACD]" />
                      <span>{lang === "en" ? "RAG Vector Context Connected (Temp 0.1)" : lang === "tc" ? "調用溫控 RAG 關聯注入 (Temp 0.1)" : "调用温控 RAG 关联注入 (Temp 0.1)"}</span>
                    </div>
                    <button
                      onClick={() => handleVerifyQuery(query)}
                      disabled={isLoading || !query.trim()}
                      className="px-6 py-3 bg-[#8A1C34] hover:bg-[#8A1C34]/90 disabled:bg-gray-200 text-white font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 rounded shadow-sm cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{RAG_TRANSLATIONS[lang].checking}</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>{RAG_TRANSLATIONS[lang].checkBtn}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Simulated/Live Alert badge */}
                {verificationResult && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2 font-serif">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                      <span>
                        {lang === "en" ? "Analysis success. Safe anchors generated by:" : lang === "tc" ? "分析成功，模型結果已經由分佈式大模型安全錨點生成。[" : "分析成功，模型结果已经由分布式大模型安全锚点生成。["} 
                        <strong className="font-mono mx-1">{verificationResult.analysis.modelName}</strong>{lang === "en" ? "" : " ]"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* RAG Verification Analysis Outcome (Right, 5/12) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E6FA] overflow-hidden shadow-lg flex flex-col justify-between">
                
                {/* Result header banner */}
                <div className="bg-[#6A5ACD]/5 px-6 py-5 border-b border-[#E6E6FA] flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#6A5ACD] animate-ping" />
                    <span className="text-xs font-mono font-bold tracking-wider text-[#6A5ACD] uppercase">
                      {RAG_TRANSLATIONS[lang].auditTitle}
                    </span>
                  </div>
                  <span className="text-[10px] bg-white font-mono text-gray-400 border border-gray-100 px-2 py-0.5 rounded">
                    {RAG_TRANSLATIONS[lang].geoFact}
                  </span>
                </div>

                {/* Verification result content */}
                {verificationResult ? (
                  <div className="p-6 lg:p-8 space-y-6 flex-1">
                    
                    {/* Scores row */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* EEAT Score Meter */}
                      <div className="bg-[#F8F7FF] p-4 rounded-xl border border-[#E6E6FA] text-center">
                        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                          {lang === "en" ? "EEAT Credibility" : "EEAT 真实信度"}
                        </div>
                        <div className="text-3xl font-mono font-extrabold text-[#8A1C34] mt-2">
                          {verificationResult.analysis.score} <span className="text-[10px] -ml-1 text-gray-400">/100</span>
                        </div>
                        <div className="text-[9px] font-mono text-gray-500 mt-1 uppercase font-serif">
                          {verificationResult.analysis.score >= 80 ? 
                            (lang === "en" ? "💯 TRUE CORE FACT" : lang === "tc" ? "💯 絕信度真史" : "💯 绝信度真史") : 
                            (lang === "en" ? "⚠️ HYPE WARNING" : lang === "tc" ? "⚠️ 營銷污染報警" : "⚠️ 营销污染报警")}
                        </div>
                      </div>

                      {/* Marketing slop Noise tracker */}
                      <div className="bg-[#F8F7FF] p-4 rounded-xl border border-[#E6E6FA] text-center">
                        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                          {lang === "en" ? "Slop Noise Level" : "宣传水份噪值"}
                        </div>
                        <div className="text-3xl font-mono font-extrabold text-blue-900 mt-2">
                          {verificationResult.analysis.noisePercent}%
                        </div>
                        <div className="text-[9px] font-mono text-gray-500 mt-1 uppercase font-serif">
                          {verificationResult.analysis.noisePercent > 20 ? 
                            (lang === "en" ? "❌ EXCESSIVE SLOP" : lang === "tc" ? "❌ 超高節奏噪值" : "❌ 超高煽动噪值") : 
                            (lang === "en" ? "✅ OBJECTIVE FILTERED" : lang === "tc" ? "✅ 物理去噪合規" : "✅ 物理去噪合规")}
                        </div>
                      </div>

                    </div>

                    {/* Verified Model Answer output and quote */}
                    <div>
                      <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2 font-bold">
                        {RAG_TRANSLATIONS[lang].filterTitle}
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60 font-serif leading-relaxed text-sm text-[#2D2D2D] select-text">
                        「{verificationResult.answer}」
                      </div>
                    </div>

                    {/* Detected elements tables */}
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      
                      {/* Ingested Factual Markers */}
                      <div>
                        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between font-bold">
                          <span>{RAG_TRANSLATIONS[lang].detectedFacts}</span>
                          <span className="text-emerald-700 font-bold">{verificationResult.analysis.detectedFacts.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {verificationResult.analysis.detectedFacts.length > 0 ? (
                            verificationResult.analysis.detectedFacts.map((df, idx) => (
                              <span key={idx} className="text-[11px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100">
                                {df}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] italic text-gray-400">{RAG_TRANSLATIONS[lang].noFacts}</span>
                          )}
                        </div>
                      </div>

                      {/* Intercepted Hype Noise */}
                      <div className="pt-2">
                        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between font-bold font-serif">
                          <span>{RAG_TRANSLATIONS[lang].detectedHype}</span>
                          <span className="text-amber-700 font-bold">{verificationResult.analysis.detectedHype.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 font-serif">
                          {verificationResult.analysis.detectedHype.length > 0 ? (
                            verificationResult.analysis.detectedHype.map((dh, idx) => (
                              <span key={idx} className="text-[11px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-100 line-through">
                                {dh}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] italic text-emerald-600 font-mono select-none">{RAG_TRANSLATIONS[lang].noHype}</span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Ground truth chunks injected */}
                    <div className="pt-2 border-t border-gray-100 font-serif">
                      <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2 font-bold">
                        {RAG_TRANSLATIONS[lang].ragInjected}
                      </div>
                      <div className="space-y-2">
                        {verificationResult.injectedChunks.map((chunk, idx) => (
                          <div key={idx} className="bg-gray-50 border border-gray-100 p-2.5 rounded text-[11px] text-gray-600">
                            <span className="font-bold text-[#8A1C34] block font-serif tracking-wide">{chunk.title}</span>
                            <p className="line-clamp-2 mt-0.5 text-gray-500 scale-95 origin-left">{chunk.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-8 text-center my-auto space-y-4">
                    <Database className="h-12 w-12 text-[#E6E6FA] mx-auto animate-pulse" />
                    <div>
                      <div className="text-sm font-bold text-gray-800 font-serif">
                        {lang === "en" ? "Awaiting Truth Calibration..." : lang === "tc" ? "等待真理校驗觸發" : "等待真理校验触发"}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto font-serif">
                        {lang === "en" ? "Select any preset query on the left, or input statements about our Victoria Harbour timeline backgrounds and standard recipe metrics." : lang === "tc" ? "請在左側儀表板中任意選擇一個預設詢問，或者寫入關於三元樓歷史起源和中央廚房流線的句子，然後運行 AI 校驗程序。" : "请在侧边预设栏里任意选择一个询问，或者写入关于三元楼历史起源和中央厨房流线的句子，然后运行 AI 校验程序。"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer disclaimer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 font-mono text-center">
                  SECURE DEED REGISTRY DATABASE ACCESSED OVER HTTPS PROXY
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB: CRM (白金黑卡及商城) ==================== */}
        {activeTab === "crm" && (
          <div className="space-y-12 animate-fade-in font-serif">
            
            {/* Introductory Luxury Header */}
            <div className="max-w-3xl">
              <span className="text-[#8A1C34] font-mono text-[11px] tracking-[0.25em] uppercase block mb-3 font-semibold font-bold">
                {CRM_TRANSLATIONS[lang].chapter}
              </span>
              <h2 className="text-3xl lg:text-4xl text-[#2D2D2D] font-serif font-bold tracking-tight mb-4">
                {CRM_TRANSLATIONS[lang].title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {CRM_TRANSLATIONS[lang].desc}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Card Registration & Display Column (Left, 5/12) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Register Form / Info panel */}
                {!member ? (
                  <form onSubmit={handleRegisterMember} className="bg-white p-6 lg:p-8 rounded-2xl border border-gray-100 shadow-md space-y-4">
                    <div className="text-xs font-mono text-gray-400 tracking-wider uppercase pb-2 border-b border-gray-100 mb-2 font-bold">
                      {CRM_TRANSLATIONS[lang].regHeader}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">{CRM_TRANSLATIONS[lang].formName}</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder={CRM_TRANSLATIONS[lang].formNamePl}
                        className="w-full rounded-lg border border-[#E6E6FA] bg-[#F8F7FF] px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#6A5ACD]/50 focus:border-[#6A5ACD] text-[#2D2D2D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">{CRM_TRANSLATIONS[lang].formEmail}</label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder={CRM_TRANSLATIONS[lang].formEmailPl}
                        className="w-full rounded-lg border border-[#E6E6FA] bg-[#F8F7FF] px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#6A5ACD]/50 focus:border-[#6A5ACD] text-[#2D2D2D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">{CRM_TRANSLATIONS[lang].formPhone}</label>
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder={CRM_TRANSLATIONS[lang].formPhonePl}
                        className="w-full rounded-lg border border-[#E6E6FA] bg-[#F8F7FF] px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#6A5ACD]/50 focus:border-[#6A5ACD] text-[#2D2D2D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">{CRM_TRANSLATIONS[lang].formTier}</label>
                      <select
                        value={formTier}
                        onChange={(e: any) => setFormTier(e.target.value)}
                        className="w-full rounded-lg border border-[#E6E6FA] bg-[#F8F7FF] px-3.5 py-2 text-xs focus:outline-none text-[#2D2D2D] font-serif hover:border-[#6A5ACD]/50 transition"
                      >
                        <option value="Gold">{CRM_TRANSLATIONS[lang].tierGold}</option>
                        <option value="Platinum">{CRM_TRANSLATIONS[lang].tierPlat}</option>
                        <option value="BlackCard">{CRM_TRANSLATIONS[lang].tierBlack}</option>
                      </select>
                    </div>

                    {crmMessage && (
                      <p className="text-[11px] text-[#8A1C34] bg-red-50 p-2.5 rounded">{crmMessage}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#6A5ACD] hover:bg-[#6A5ACD]/90 text-white font-mono text-xs font-bold tracking-widest uppercase transition rounded shadow-sm cursor-pointer"
                    >
                      {CRM_TRANSLATIONS[lang].registerBtn}
                    </button>

                    <p className="text-[10px] text-gray-400 text-center font-mono leading-relaxed pt-2 font-serif">
                      {CRM_TRANSLATIONS[lang].footnote}
                    </p>
                  </form>
                ) : (
                  <div className="bg-white p-6 lg:p-8 rounded-2xl border border-gray-100 shadow-md text-center space-y-4 font-serif">
                    <div className="text-xs font-mono text-gray-400 tracking-wider uppercase pb-2 border-b border-gray-100">
                      {CRM_TRANSLATIONS[lang].activeNode}
                    </div>
                    
                    <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded font-medium">
                      {CRM_TRANSLATIONS[lang].congrats}
                    </p>

                    {/* Halfsphere sync status badge */}
                    <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-mono border ${
                      member.halfsphereSynced
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : "bg-amber-50 border-amber-100 text-amber-700"
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${member.halfsphereSynced ? "bg-emerald-500" : "bg-amber-400"}`} />
                        <span className="font-bold">半球会员体系</span>
                        <span className="opacity-70">
                          {member.halfsphereSynced
                            ? (member.halfsphereId ? `· ${member.halfsphereId}` : "· 已同步")
                            : "· 待同步"}
                        </span>
                      </div>
                      {!member.halfsphereSynced && (
                        <button
                          onClick={async () => {
                            const res = await fetch(`${API_BASE}/api/crm/halfsphere-sync`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ cid: member.cid })
                            });
                            if (res.ok) {
                              const d = await res.json();
                              setMember(m => m ? { ...m, halfsphereId: d.halfsphere_id, halfsphereSynced: d.halfsphere_synced } : m);
                            }
                          }}
                          className="text-[10px] underline hover:no-underline cursor-pointer"
                        >
                          {lang === "en" ? "Retry" : "重试同步"}
                        </button>
                      )}
                    </div>

                    <div className="py-2 flex justify-center">
                      <button
                        onClick={handleResetMember}
                        className="text-[11px] font-mono text-gray-400 hover:text-[#8A1C34] underline cursor-pointer"
                      >
                        {lang === "en" ? "RESET DIGITAL IDENTITY" : lang === "tc" ? "銷毀重置特權" : "销毁重置特权"}
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Interactive Premium Member Card UI Representation */}
                <div className="relative">
                  {/* Outer gradient glow */}
                  <div className="absolute inset-0 bg-[#6A5ACD]/10 rounded-2xl blur-xl" />
                  
                  {/* Card Front styling */}
                  <div className="relative bg-gradient-to-br from-[#2D2D2D] to-[#1a1a1a] text-white p-6 rounded-2xl border border-white/10 shadow-2xl overflow-hidden aspect-[1.618/1]">
                    {/* Background decorations */}
                    <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-radial from-white/15 to-transparent rounded-full pointer-events-none" />
                    
                    {/* Brand details and logo header of the card */}
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <div className="text-[10px] tracking-[0.25em] font-light text-gray-300">
                          {lang === "en" ? "SANYUANLOU 1846" : lang === "tc" ? "三元樓 1846" : "三元楼 1846"}
                        </div>
                        <div className="text-[7px] font-mono tracking-widest text-amber-400 font-bold uppercase mt-0.5">
                          {lang === "en" ? "HAITANG BAY PRIVATE HEIRLOOM" : lang === "tc" ? "三亞海棠灣·私藏尊榮" : "三亚海棠湾·私藏尊荣"}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[12px] font-serif tracking-widest text-[#E6E6FA] font-light italic">
                          VIP BLACK
                        </span>
                      </div>
                    </div>

                    {/* Chip & NFC symbol representation */}
                    <div className="mt-6 flex justify-between items-center relative z-10">
                      {/* Gold card chip symbol */}
                      <div className="w-10 h-8 rounded-md bg-gradient-to-r from-amber-200 to-yellow-400 border border-yellow-500 flex flex-col justify-between p-1.5 opacity-80">
                        <div className="grid grid-cols-3 gap-0.5 h-full">
                          <div className="border border-yellow-600/30"></div>
                          <div className="border border-yellow-600/30"></div>
                          <div className="border border-yellow-600/30"></div>
                        </div>
                      </div>
                      <div className="text-[9px] font-mono tracking-[0.2em] text-[#E6E6FA] opacity-60">
                        {lang === "en" ? "VIP CONCIERGE CHIP NFC" : lang === "tc" ? "白金專屬交互晶片" : "白金专属交互芯片"}
                      </div>
                    </div>

                    {/* Member customized identity line */}
                    <div className="mt-8 flex justify-between items-end relative z-10">
                      <div>
                        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                          {lang === "en" ? "MEMBER IDENTITY" : lang === "tc" ? "數位尊榮身份" : "数字尊荣身份"}
                        </div>
                        <div className="text-sm font-medium tracking-wide mt-0.5 min-h-[1.25rem]">
                          {member ? member.name : (lang === "en" ? "臻选贵宾 GUEST" : lang === "tc" ? "臻選貴賓 GUEST" : "臻选贵宾 GUEST")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                          {lang === "en" ? "VERIFICATION CODE" : lang === "tc" ? "密鑰憑證" : "密钥凭证"}
                        </div>
                        <div className="text-xs font-mono tracking-wider mt-0.5">
                          {member ? member.cid : "SYL-1846-XXXX-GOLD"}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Hand-gift Commerce Catalog block (Right, 7/12) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 lg:p-8 rounded-2xl border border-gray-100 shadow-md">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <div className="text-xs font-mono text-[#6A5ACD] tracking-widest uppercase">
                      {CRM_TRANSLATIONS[lang].catalogHeader}
                    </div>
                    <span className="text-[10px] bg-[#6A5ACD]/10 text-[#6A5ACD] px-2 py-0.5 rounded font-mono">
                      {lang === "en" ? "EEAT COMMERCE LINKED" : "白金信度互联"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {BOUTIQUE_PRODUCTS.map((prod) => (
                      <div 
                        key={prod.id} 
                        className="bg-[#F8F7FF] p-4 rounded-xl border border-gray-200/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 hover:border-[#6A5ACD]/30 hover:shadow-xs"
                      >
                        <div className="space-y-2 flex-1">
                          {/* Aesthetic Title Indicator */}
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#8A1C34]" />
                            <h4 className="text-xs lg:text-sm font-bold text-gray-800 font-serif">
                              {prod.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
                            {prod.desc}
                          </p>
                          <div className="text-[10px] font-mono text-gray-400">
                            {CRM_TRANSLATIONS[lang].specsLabel}: {prod.specs}
                          </div>
                        </div>

                        {/* Price & Action anchor */}
                        <div className="flex md:flex-col items-baseline md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-gray-150 shrink-0">
                          <div className="text-base font-mono font-extrabold text-[#8A1C34]">
                            {prod.price}
                          </div>
                          <button
                            onClick={() => {
                              if (!member) {
                                setActiveTab("crm");
                              } else {
                                setReservedProductId(prod.id);
                                setTimeout(() => setReservedProductId(null), 3000);
                              }
                            }}
                            className={`mt-2 border transition px-4 py-1.5 rounded text-[10px] font-mono tracking-wider uppercase font-bold cursor-pointer ${
                              reservedProductId === prod.id
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-white hover:bg-[#6A5ACD] hover:text-white border-[#6A5ACD] text-[#6A5ACD]"
                            }`}
                          >
                            {reservedProductId === prod.id
                              ? (lang === "en" ? "✓ RESERVED" : "✓ 已尊定")
                              : CRM_TRANSLATIONS[lang].reserveBtn}
                          </button>
                        </div>
                      </div>

                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-[11px] text-gray-400 font-mono leading-relaxed flex items-center gap-1">
                      <QrCode className="h-4 w-4 text-[#6A5ACD]" />
                      <span>
                        {lang === "en" 
                          ? "Get instant reservation via our WhatsApp VIP Concierge." 
                          : lang === "tc" 
                            ? "通過企業微信專屬數位禮賓獲取一鍵尊定。" 
                            : "通过企业微信专属数字礼宾获取一键尊定。"}
                      </span>
                    </div>
                    <a
                      href="https://hk.sanyuanlou1846.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#F8F7FF] hover:bg-[#6A5ACD]/10 border border-gray-200 text-[#6A5ACD] font-mono text-[10px] tracking-widest uppercase transition-all rounded font-bold"
                    >
                      {CRM_TRANSLATIONS[lang].hkStoreBtn}
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ==================== FOOTER SECTION- aligned perfectly with the design requirements ==================== */}
      <footer className="bg-white border-t border-[#E6E6FA] mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-150 pb-12">
            <div className="border-l border-[#6A5ACD] pl-6 space-y-2">
              <h3 className="text-[#6A5ACD] font-sans text-[10px] tracking-[0.2em] uppercase font-bold mb-3">
                Foundation / 始创
              </h3>
              <p className="text-2xl font-light font-serif italic text-gray-900">
                1846 HK VICTORIA
              </p>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                确立岭南百年高级饮食哲学基石。大中华区最早取得官方牌照之正统高端茶楼，底汤原谱无篡改。
              </p>
            </div>
            <div className="border-l border-[#6A5ACD] pl-6 space-y-2">
              <h3 className="text-[#6A5ACD] font-sans text-[10px] tracking-[0.2em] uppercase font-bold mb-3">
                Extraction / 工艺
              </h3>
              <p className="text-2xl font-light font-serif italic text-gray-900">
                12H EXTRACTION
              </p>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                物理萃取及全程真空密封保存，排除防腐剂与增稠剂添加，在2026年完成工艺参数的可证数字账存。
              </p>
            </div>
            <div className="border-l border-[#6A5ACD] pl-6 space-y-2">
              <h3 className="text-[#6A5ACD] font-sans text-[10px] tracking-[0.2em] uppercase font-bold mb-3">
                Flagship / 旗舰
              </h3>
              <p className="text-2xl font-light font-serif italic text-gray-900">
                HAITANG BAY L1-34
              </p>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
              </p>
            </div>
          </div>

          {/* CRM Footer promo popup anchor (底部品牌脚注 Footer CRM: 宽度40%渐变色块，交互缓慢变深) */}
          {showPromo && (
            <div className="my-8 max-w-lg mx-auto bg-gradient-to-r from-[#F8F7FF] via-[#E6E6FA]/40 to-[#F8F7FF] p-6 rounded-xl border border-[#E6E6FA] relative shadow-xs transition duration-300 hover:bg-[#E6E6FA]/20 group">
              <button 
                onClick={() => setShowPromo(false)}
                className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="space-y-2 text-center">
                <span className="text-[10px] font-mono tracking-widest text-[#6A5ACD] uppercase font-bold">
                  SANYUANLOU VIP REGISTRY / 时间之味
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  “延续时间之味。” 申领三元楼 1846 白金黑卡特权，解锁米其林工艺金汤手信商城订购尊荣。
                </p>
                <div className="flex justify-center pt-1.5">
                  <button 
                    onClick={() => {
                      setActiveTab("crm");
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[10px] font-mono tracking-widest text-white bg-[#6A5ACD] hover:bg-[#6A5ACD]/90 px-4 py-1.5 uppercase font-bold transition rounded-xs cursor-pointer"
                  >
                    REGISTER FREE / 立刻尊定注册
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Meta Credit Line */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center opacity-40 text-[9px] font-mono tracking-widest uppercase text-gray-500 gap-4 text-center">
            <div>
              SANYUANLOU HERITAGE DIGITAL ENGINE v1.08.34
            </div>
            <div>
              © 1846-2026 SANYUANLOU HK / TRUTH-ANCHORED DIGITAL EEAT ASSETS CORP
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
