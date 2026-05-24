import React from "react";

/**
 * 三元楼圆形印章 — 完全还原原版 logo 结构
 *
 * 结构：
 *  - 双圆环外框
 *  - 内框：3 行 × 3 列窗棂格
 *    - 左右各 3 个小内框（窗格装饰）
 *    - 中央竖柱：三 / 元 / 楼 从上到下
 *  - 中央竖柱底部：1846 小方框
 *
 * 字体：STXingkai (华文行楷) → STKaiti → KaiTi
 * 颜色：#B8962A 古金
 */

const G = "#B8962A";

// 主框坐标
const FX1 = 28, FY1 = 18, FX2 = 172, FY2 = 165; // 外框
const CX1 = 74, CX2 = 126;                        // 中央竖柱左右边
const RY1 = 67, RY2 = 116;                        // 横向分隔线 (3行)
const BOX_B = 182;                                 // 1846小框底部

// 字体栈 —— 行楷体，尽量与原版一致
const FONT = "'STXingkai', '华文行楷', 'STKaiti', '华文楷体', 'KaiTi', '楷体', serif";

interface SanyuanlouLogoProps {
  size?: number;
  className?: string;
}

export function SanyuanlouLogo({ size = 200, className = "" }: SanyuanlouLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="三元楼 1846"
    >
      {/* ── 白底 ── */}
      <circle cx="100" cy="100" r="99" fill="white" />

      {/* ── 双圆环 ── */}
      <circle cx="100" cy="100" r="96" stroke={G} strokeWidth="1.8" fill="none" />
      <circle cx="100" cy="100" r="91" stroke={G} strokeWidth="0.6" fill="none" />

      {/* ── 外框矩形 ── */}
      <rect
        x={FX1} y={FY1}
        width={FX2 - FX1} height={FY2 - FY1}
        stroke={G} strokeWidth="1" fill="none"
      />

      {/* ── 中央竖柱分隔线（延伸至1846框底） ── */}
      <line x1={CX1} y1={FY1} x2={CX1} y2={BOX_B} stroke={G} strokeWidth="0.85" />
      <line x1={CX2} y1={FY1} x2={CX2} y2={BOX_B} stroke={G} strokeWidth="0.85" />

      {/* ── 1846 小框底线 ── */}
      <line x1={CX1} y1={BOX_B} x2={CX2} y2={BOX_B} stroke={G} strokeWidth="1" />

      {/* ── 横向行分隔线（贯穿全宽） ── */}
      <line x1={FX1} y1={RY1} x2={FX2} y2={RY1} stroke={G} strokeWidth="0.85" />
      <line x1={FX1} y1={RY2} x2={FX2} y2={RY2} stroke={G} strokeWidth="0.85" />

      {/* ── 左侧窗格：3行 × 1列，每格内嵌小矩形 ── */}
      {/* 左上格: (28,18)→(74,67) */}
      <rect x="33" y="23" width="36" height="39" stroke={G} strokeWidth="0.6" fill="none" />
      {/* 左中格: (28,67)→(74,116) */}
      <rect x="33" y="72" width="36" height="39" stroke={G} strokeWidth="0.6" fill="none" />
      {/* 左下格: (28,116)→(74,165) */}
      <rect x="33" y="121" width="36" height="39" stroke={G} strokeWidth="0.6" fill="none" />

      {/* ── 右侧窗格：3行 × 1列 ── */}
      {/* 右上格: (126,18)→(172,67) */}
      <rect x="131" y="23" width="36" height="39" stroke={G} strokeWidth="0.6" fill="none" />
      {/* 右中格: (126,67)→(172,116) */}
      <rect x="131" y="72" width="36" height="39" stroke={G} strokeWidth="0.6" fill="none" />
      {/* 右下格: (126,116)→(172,165) */}
      <rect x="131" y="121" width="36" height="39" stroke={G} strokeWidth="0.6" fill="none" />

      {/* ── 三 元 楼（竖排，各占一行） ── */}
      {/* 行高=49px，中心y: 42.5 / 91.5 / 140.5；行楷字体baseline≈center+14 */}
      <text
        x="100" y="57"
        textAnchor="middle"
        fontFamily={FONT}
        fontSize="42"
        fill={G}
      >三</text>

      <text
        x="100" y="106"
        textAnchor="middle"
        fontFamily={FONT}
        fontSize="42"
        fill={G}
      >元</text>

      <text
        x="100" y="155"
        textAnchor="middle"
        fontFamily={FONT}
        fontSize="42"
        fill={G}
      >楼</text>

      {/* ── 1846（中央竖柱底部小框，y=165→182） ── */}
      <text
        x="100" y="177"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Garamond, 'Times New Roman', serif"
        fontSize="11"
        fill={G}
        letterSpacing="2"
      >1846</text>
    </svg>
  );
}
