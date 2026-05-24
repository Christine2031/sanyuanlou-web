import React from "react";

/**
 * 三元楼 横版标志 — 从圆形印章上段"扣"出来的格栅横标
 *
 * 尺寸比例：138 × 48  (固定宽高比，height prop 控制实际像素)
 *
 * 配色：深朱砂红底 #7B1A26 + 浓金字 #D4A843
 * 工艺感：四角 L 形括号，竖向分隔线，双层细边框
 */

const W = 138; // viewBox 宽
const H = 48;  // viewBox 高
const D1 = 46; // 第一道竖分隔 x
const D2 = 92; // 第二道竖分隔 x

const RED  = "#7B1A26"; // 深朱砂红 (仿漆器)
const GOLD = "#D4A843"; // 浓金    (富贵金)

// 各格字符水平中心
const CX1 = D1 / 2;           // 三 → 23
const CX2 = (D1 + D2) / 2;   // 元 → 69
const CX3 = (D2 + W) / 2;    // 楼 → 115

interface SanyuanlouMarkProps {
  height?: number;
  className?: string;
}

export function SanyuanlouMark({ height = 48, className = "" }: SanyuanlouMarkProps) {
  const width = Math.round((height / H) * W);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="三元楼"
    >
      {/* ── 深红底色 ── */}
      <rect x="0" y="0" width={W} height={H} fill={RED} rx="2" />

      {/* ── 外框线 ── */}
      <rect x="1.5" y="1.5" width={W - 3} height={H - 3}
            stroke={GOLD} strokeWidth="0.9" fill="none" rx="1" />

      {/* ── 内衬细边（双层效果） ── */}
      <rect x="4.5" y="4.5" width={W - 9} height={H - 9}
            stroke={GOLD} strokeWidth="0.3" fill="none" opacity="0.55" />

      {/* ── 四角 L 形括号（与圆形印章同语言） ── */}
      <path d={`M1.5,15 V1.5 H15`}             stroke={GOLD} strokeWidth="2.2" strokeLinecap="square" />
      <path d={`M${W - 15},1.5 H${W - 1.5} V15`} stroke={GOLD} strokeWidth="2.2" strokeLinecap="square" />
      <path d={`M1.5,${H - 15} V${H - 1.5} H15`}             stroke={GOLD} strokeWidth="2.2" strokeLinecap="square" />
      <path d={`M${W - 15},${H - 1.5} H${W - 1.5} V${H - 15}`} stroke={GOLD} strokeWidth="2.2" strokeLinecap="square" />

      {/* ── 竖向分隔线 ── */}
      <line x1={D1} y1="0" x2={D1} y2={H} stroke={GOLD} strokeWidth="0.75" />
      <line x1={D2} y1="0" x2={D2} y2={H} stroke={GOLD} strokeWidth="0.75" />

      {/* ── 三 元 楼 ── */}
      <text
        x={CX1} y="33"
        textAnchor="middle"
        fontFamily="'Noto Serif SC', STSong, SimSun, 'Times New Roman', serif"
        fontSize="21"
        fill={GOLD}
        fontWeight="400"
      >三</text>
      <text
        x={CX2} y="33"
        textAnchor="middle"
        fontFamily="'Noto Serif SC', STSong, SimSun, 'Times New Roman', serif"
        fontSize="21"
        fill={GOLD}
        fontWeight="400"
      >元</text>
      <text
        x={CX3} y="33"
        textAnchor="middle"
        fontFamily="'Noto Serif SC', STSong, SimSun, 'Times New Roman', serif"
        fontSize="21"
        fill={GOLD}
        fontWeight="400"
      >楼</text>
    </svg>
  );
}
