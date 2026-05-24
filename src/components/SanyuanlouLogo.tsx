import React from "react";

interface SanyuanlouLogoProps {
  size?: number;
  className?: string;
}

/**
 * Sanyuanlou brand seal — circular gold emblem with:
 *  • Double outer ring
 *  • Classical lattice frame: 三 元 楼 in three grid cells
 *  • Line-art bauhinia (洋紫荊) flower — Hong Kong city flower
 *  • Year 1846
 * All drawn as inline SVG so it scales cleanly to any size.
 */
export function SanyuanlouLogo({ size = 56, className = "" }: SanyuanlouLogoProps) {
  const G = "#C9A96E"; // champagne gold
  const G2 = "rgba(201,169,110,0.55)"; // lighter gold for veins / stamens

  // ── Bauhinia petal ────────────────────────────────────────
  // Pointing straight UP from flower center (100, 111).
  // Tip at y ≈ 76 — stays inside the middle frame section (y=72–150).
  // Two-lobed split tip is the signature of the bauhinia.
  const petal =
    "M 100,111 " +
    "C 94,103 89,93 91,84 " +
    "C 93,79 95,76 97,75 " +
    "C 98,73 99,72 100,72 " +   // left lobe tip
    "C 101,72 102,73 103,75 " + // right lobe tip
    "C 105,76 107,79 109,84 " +
    "C 111,93 106,103 100,111 Z";

  // ── Stamen endpoint calculator ────────────────────────────
  // Stamens sit midway between petals (offset 36° from each petal).
  // `deg` = clockwise degrees from "straight up".
  const stamen = (deg: number, len = 16) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: 100 + len * Math.cos(rad), y: 111 + len * Math.sin(rad) };
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="三元楼 Sanyuanlou 1846 — Hong Kong classical restaurant since 1846"
    >
      <defs>
        {/* Clip everything to the outer circle */}
        <clipPath id="outerClip">
          <circle cx="100" cy="100" r="97" />
        </clipPath>
      </defs>

      {/* ── White background disc ── */}
      <circle cx="100" cy="100" r="99" fill="white" />

      {/* ── Double outer ring ── */}
      <circle cx="100" cy="100" r="96" stroke={G} strokeWidth="2" fill="none" />
      <circle cx="100" cy="100" r="90" stroke={G} strokeWidth="0.7" fill="none" />

      {/* ── Everything inside is clipped to the outer ring ── */}
      <g clipPath="url(#outerClip)">

        {/* Subtle warm tint fill */}
        <circle cx="100" cy="100" r="90" fill="rgba(201,169,110,0.04)" />

        {/* ── Inner classical lattice frame ── */}
        <rect x="30" y="27" width="140" height="146" stroke={G} strokeWidth="0.9" fill="none" />

        {/* Corner L-brackets (slightly bolder than rect sides) */}
        <path d="M 30,47 V 27 H 50"  stroke={G} strokeWidth="2.2" strokeLinecap="square" />
        <path d="M 150,27 H 170 V 47" stroke={G} strokeWidth="2.2" strokeLinecap="square" />
        <path d="M 30,153 V 173 H 50" stroke={G} strokeWidth="2.2" strokeLinecap="square" />
        <path d="M 150,173 H 170 V 153" stroke={G} strokeWidth="2.2" strokeLinecap="square" />

        {/* ── Upper section — 三 元 楼 ── */}
        <line x1="30"  y1="72" x2="170" y2="72" stroke={G} strokeWidth="0.8" />
        <line x1="76"  y1="27" x2="76"  y2="72" stroke={G} strokeWidth="0.55" />
        <line x1="124" y1="27" x2="124" y2="72" stroke={G} strokeWidth="0.55" />

        <text
          x="53" y="61"
          textAnchor="middle"
          fontFamily="'Noto Serif SC', STSong, SimSun, 'Times New Roman', serif"
          fontSize="22"
          fill={G}
          fontWeight="400"
        >三</text>
        <text
          x="100" y="61"
          textAnchor="middle"
          fontFamily="'Noto Serif SC', STSong, SimSun, 'Times New Roman', serif"
          fontSize="22"
          fill={G}
          fontWeight="400"
        >元</text>
        <text
          x="147" y="61"
          textAnchor="middle"
          fontFamily="'Noto Serif SC', STSong, SimSun, 'Times New Roman', serif"
          fontSize="22"
          fill={G}
          fontWeight="400"
        >楼</text>

        {/* ── Lower section — year ── */}
        <line x1="30" y1="150" x2="170" y2="150" stroke={G} strokeWidth="0.8" />

        {/* Small diamond ornaments flanking 1846 */}
        <polygon points="42,161 46,157 50,161 46,165" fill={G} opacity="0.7" />
        <polygon points="150,161 154,157 158,161 154,165" fill={G} opacity="0.7" />

        <text
          x="100" y="165"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', Garamond, 'EB Garamond', Georgia, serif"
          fontSize="13"
          fill={G}
          letterSpacing="6"
          fontWeight="400"
        >1846</text>

        {/* ── Bauhinia flower — 5 petals at 72° intervals ── */}
        {[0, 72, 144, 216, 288].map((deg) => (
          <g key={deg} transform={`rotate(${deg}, 100, 111)`}>
            {/* Petal outline */}
            <path d={petal} stroke={G} strokeWidth="0.85" fill="none" strokeLinejoin="round" />
            {/* Central vein */}
            <line x1="100" y1="107" x2="100" y2="74" stroke={G2} strokeWidth="0.4" />
            {/* Left lateral vein */}
            <path
              d="M 100,93 C 97,88 96,84 96,80"
              stroke={G2} strokeWidth="0.35" fill="none"
            />
            {/* Right lateral vein */}
            <path
              d="M 100,93 C 103,88 104,84 104,80"
              stroke={G2} strokeWidth="0.35" fill="none"
            />
          </g>
        ))}

        {/* ── Stamens — 5, offset 36° between petals ── */}
        {[36, 108, 180, 252, 324].map((deg) => {
          const ep = stamen(deg, 16);
          return (
            <g key={`stm-${deg}`}>
              <line x1="100" y1="111" x2={ep.x} y2={ep.y} stroke={G} strokeWidth="0.5" />
              <circle cx={ep.x} cy={ep.y} r="1.8" fill={G} />
            </g>
          );
        })}

        {/* ── Flower centre ── */}
        <circle cx="100" cy="111" r="5"   stroke={G} strokeWidth="0.8" fill="white" />
        <circle cx="100" cy="111" r="2.4" fill={G} />

        {/* ── Outer decorative ring text (visible at larger sizes) ── */}
        <defs>
          <path
            id="syl-top-arc"
            d="M 14,100 A 86,86 0 0,1 186,100"
          />
          <path
            id="syl-bot-arc"
            d="M 20,108 A 84,84 0 0,0 180,108"
          />
        </defs>
        <text
          fontFamily="'Cormorant Garamond', Garamond, Georgia, serif"
          fontSize="7"
          fill={G}
          letterSpacing="1.8"
          opacity="0.85"
        >
          <textPath href="#syl-top-arc" startOffset="4%">
            HONGKONG · SAN YUAN BUILDING · 1846 ·
          </textPath>
        </text>
      </g>
    </svg>
  );
}
