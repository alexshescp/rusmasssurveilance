"use client"

import { useEffect, useState, useRef } from "react"

/* ═══════════════════════════════════
   COORDINATE SYSTEM
   Canvas: 1400 x 1600
   Central ring at (700, 780) r=55
   Lines flow INTO the ring from their direction
   ═══════════════════════════════════ */

const W = 1400
const H = 1600
const CX = 700
const CY = 780
const CR = 55

/* ─── Line A: Телеком ─── left column, vertical, connects to ring from top-left */
const lineA = {
  id: "a", letter: "A", name: "Телеком-перехват и хранение", color: "#DC2626",
  segments: [
    { x1: 160, y1: 80, x2: 160, y2: 560 },
    { x1: 160, y1: 560, x2: 340, y2: 700 },
    { x1: 340, y1: 700, x2: CX - CR * 0.87, y2: CY - CR * 0.5 },
  ],
  stations: [
    { id: "a1", name: "SORM-1/2/3", sub: "LI, CDR, DPI", x: 160, y: 140, side: "right" as const },
    { id: "a2", name: "Пакет Яровой", sub: "IMSI/IMEI, хранение", x: 160, y: 320, side: "right" as const },
    { id: "a3", name: "Реестр IMEI", sub: "учёт устройств", x: 160, y: 500, side: "right" as const },
  ],
}

/* ─── Line B: Интернет ─── second column, vertical, connects to ring from top */
const lineB = {
  id: "b", letter: "B", name: "Интернет-фильтрация", color: "#EA580C",
  segments: [
    { x1: 420, y1: 80, x2: 420, y2: 540 },
    { x1: 420, y1: 540, x2: 540, y2: 660 },
    { x1: 540, y1: 660, x2: CX - CR * 0.5, y2: CY - CR * 0.87 },
  ],
  stations: [
    { id: "b1", name: "ТСПУ", sub: "DPI-оборудование", x: 420, y: 140, side: "left" as const },
    { id: "b2", name: "ЦМУ ССОП / ГРЧЦ", sub: "URL/IP filtering", x: 420, y: 320, side: "left" as const },
    { id: "b3", name: "Ревизор", sub: "Traffic shaping", x: 420, y: 480, side: "left" as const },
  ],
}

/* ─── Line C: Видео ─── center column, vertical, connects to ring from top */
const lineC = {
  id: "c", letter: "C", name: "Городское видеонаблюдение", color: "#CA8A04",
  segments: [
    { x1: CX, y1: 80, x2: CX, y2: CY - CR },
  ],
  stations: [
    { id: "c1", name: "АПК «Безопасный город»", sub: "ANPR / LPR", x: CX, y: 180, side: "right" as const },
    { id: "c2", name: "ГИС ЕЦХД (Москва)", sub: "200K+ камер", x: CX, y: 370, side: "right" as const },
    { id: "c3", name: "ИИ-видеоаналитика", sub: "FindFace / Городовой", x: CX, y: 540, side: "right" as const },
    { id: "c4", name: "Региональные расш.", sub: "тиражирование", x: CX, y: 670, side: "right" as const },
  ],
}

/* ─── Line D: Биометрия ─── exits ring to the right bottom */
const lineD = {
  id: "d", letter: "D", name: "Биометрия и идентичность", color: "#16A34A",
  segments: [
    { x1: CX + CR, y1: CY, x2: CX + 160, y2: CY },
    { x1: CX + 160, y1: CY, x2: CX + 260, y2: CY + 100 },
    { x1: CX + 260, y1: CY + 100, x2: CX + 260, y2: CY + 240 },
  ],
  stations: [
    { id: "d1", name: "ЕБС", sub: "Единая биометрическая", x: CX + 260, y: CY + 140, side: "right" as const },
    { id: "d2", name: "Госуслуги Биометрия", sub: "идентификация", x: CX + 260, y: CY + 240, side: "right" as const },
  ],
}

/* ─── Line E: Финансы ─── right column, vertical, connects to ring from top-right */
const lineE = {
  id: "e", letter: "E", name: "Финансы и AML", color: "#2563EB",
  segments: [
    { x1: 1200, y1: 80, x2: 1200, y2: 520 },
    { x1: 1200, y1: 520, x2: 1020, y2: 680 },
    { x1: 1020, y1: 680, x2: CX + CR * 0.87, y2: CY - CR * 0.5 },
  ],
  stations: [
    { id: "e1", name: "Banking KYC / AML", sub: "ПОД/ФТ", x: 1200, y: 140, side: "left" as const },
    { id: "e2", name: "Росфинмониторинг", sub: "FinCERT ЦБ", x: 1200, y: 310, side: "left" as const },
    { id: "e3", name: "Continuous KYC", sub: "биометрическая верификация", x: 1200, y: 460, side: "left" as const },
    { id: "e4", name: "Crypto AML", sub: "Travel Rule, screening", x: 1140, y: 560, side: "left" as const },
  ],
}

/* ─── Line F: Госреестры ─── exits ring downward left */
const lineF = {
  id: "f", letter: "F", name: "Госреестры и обмен", color: "#7C3AED",
  segments: [
    { x1: CX - CR * 0.5, y1: CY + CR * 0.87, x2: 340, y2: 940 },
    { x1: 340, y1: 940, x2: 160, y2: 1060 },
    { x1: 160, y1: 1060, x2: 160, y2: 1520 },
  ],
  stations: [
    { id: "f1", name: "СМЭВ-шлюз", sub: "SMEV3/4", x: 400, y: 910, side: "right" as const },
    { id: "f2", name: "Учёты МВД (ГИАЦ/ИЦ)", sub: "журналы запросов", x: 160, y: 1100, side: "right" as const },
    { id: "f3", name: "ГАС «Правосудие»", sub: "судебный контур, КАД", x: 160, y: 1220, side: "right" as const },
    { id: "f4", name: "ФССП", sub: "исполнительные производства", x: 160, y: 1340, side: "right" as const },
    { id: "f5", name: "ГИС ГМП", sub: "штрафы / платежи", x: 160, y: 1440, side: "right" as const },
    { id: "f6", name: "ЕГРН", sub: "реестр недвижимости", x: 160, y: 1520, side: "right" as const },
  ],
}

/* ─── Line G: Перемещения ─── exits ring downward right */
const lineG = {
  id: "g", letter: "G", name: "Перемещения и транспорт", color: "#374151",
  segments: [
    { x1: CX + CR * 0.5, y1: CY + CR * 0.87, x2: 900, y2: 940 },
    { x1: 900, y1: 940, x2: 1020, y2: 1060 },
    { x1: 1020, y1: 1060, x2: 1020, y2: 1360 },
  ],
  stations: [
    { id: "g1", name: "Sirena-Travel / Leonardo", sub: "PSS, авиа", x: 860, y: 920, side: "left" as const },
    { id: "g2", name: "АСУ «Экспресс-3»", sub: "ЖД", x: 1020, y: 1160, side: "left" as const },
    { id: "g3", name: "АПК «ПОТОК»", sub: "ANPR, авто", x: 1020, y: 1310, side: "left" as const },
  ],
}

const ALL_LINES = [lineA, lineB, lineC, lineD, lineE, lineF, lineG]

/* ─── Transport Hubs ─── */
const HUBS = [
  {
    id: "interpol", name: "Interpol", sub: "полный доступ к I-24/7",
    type: "train" as const, x: 460, y: 1100, labelSide: "left" as const,
    fromStation: { x: 160, y: 1100 },
  },
  {
    id: "interpol-diff", name: "Interpol Diffusion", sub: "обход ограничений Интерпола",
    type: "bus" as const, x: 460, y: 1220, labelSide: "left" as const,
    fromStation: { x: 160, y: 1100 },
  },
  {
    id: "fatf", name: "FATF Egmont Group", sub: "международный финмониторинг",
    type: "airport" as const, x: 1380, y: 310, labelSide: "left" as const,
    fromStation: { x: 1200, y: 310 },
  },
]

/* ─── Ring hub labels ─── */
const ringLabels = [
  { name: "СХД / ЦОД", sub: "хранение", angle: 200 },
  { name: "Аналитика / DWH", sub: "корреляция", angle: 160 },
  { name: "СМЭВ", sub: "обмен", angle: 340 },
  { name: "ЦМУ ССОП", sub: "контроль", angle: 20 },
]

function polar(angle: number, r: number) {
  const rad = (angle * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function segmentsToPath(segs: { x1: number; y1: number; x2: number; y2: number }[]) {
  if (segs.length === 0) return ""
  let d = `M${segs[0].x1},${segs[0].y1}`
  for (const s of segs) d += ` L${s.x2},${s.y2}`
  return d
}

/* ─── Hub icon sub-components ─── */
function TrainIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 14}, ${y - 14})`}>
      <rect width="28" height="28" rx="7" fill="#7C3AED" opacity="0.12" />
      <rect x="5" y="4" width="18" height="15" rx="4" fill="none" stroke="#7C3AED" strokeWidth="2" />
      <line x1="5" y1="12" x2="23" y2="12" stroke="#7C3AED" strokeWidth="1" />
      <circle cx="10" cy="22" r="2.5" fill="#7C3AED" />
      <circle cx="18" cy="22" r="2.5" fill="#7C3AED" />
      <line x1="8" y1="24" x2="5" y2="27" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="24" x2="23" y2="27" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  )
}

function BusIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 14}, ${y - 14})`}>
      <rect width="28" height="28" rx="7" fill="#7C3AED" opacity="0.12" />
      <rect x="4" y="5" width="20" height="15" rx="4" fill="none" stroke="#7C3AED" strokeWidth="2" />
      <rect x="6" y="7" width="7" height="5" rx="1.5" fill="#7C3AED" opacity="0.2" />
      <rect x="15" y="7" width="7" height="5" rx="1.5" fill="#7C3AED" opacity="0.2" />
      <circle cx="9" cy="23" r="2.5" fill="#7C3AED" />
      <circle cx="19" cy="23" r="2.5" fill="#7C3AED" />
    </g>
  )
}

function AirportIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 16}, ${y - 16})`}>
      <circle cx="16" cy="16" r="16" fill="#2563EB" opacity="0.10" />
      <g transform="translate(16,16) rotate(-30) scale(0.7)">
        <path
          d="M-2,-14 L2,-14 L4,-4 L13,-1 L13,2 L4,0 L3,10 L6,12 L6,14 L0,12 L-6,14 L-6,12 L-3,10 L-4,0 L-13,2 L-13,-1 L-4,-4 Z"
          fill="#2563EB" opacity="0.85"
        />
      </g>
    </g>
  )
}

/* ═══════════════════════════════════
   COMPONENT
   ═══════════════════════════════════ */

export function MetroMap() {
  const [revealed, setRevealed] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-x-auto rounded-3xl border border-border bg-card p-3 shadow-sm md:p-6">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        style={{ minWidth: 600 }}
        role="img"
        aria-label="Карта инфраструктуры в формате метро"
      >
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="dshadow"><feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.06" /></filter>
        </defs>

        {/* Dot grid background */}
        <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="0.6" fill="#d6d3d1" opacity="0.4" />
        </pattern>
        <rect width={W} height={H} fill="url(#dots)" />

        {/* ══════ METRO LINES ══════ */}
        {ALL_LINES.map((line, li) => {
          const path = segmentsToPath(line.segments)
          const delay = li * 0.12
          return (
            <g key={line.id} style={{
              opacity: revealed ? 1 : 0,
              transition: `opacity 0.6s ease ${delay}s`,
            }}>
              {/* Glow shadow */}
              <path d={path} fill="none" stroke={line.color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.06" />
              {/* Main stroke */}
              <path d={path} fill="none" stroke={line.color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data flow dot */}
              <circle r="3.5" fill="white" opacity="0.9">
                <animateMotion dur={`${3.5 + li * 0.5}s`} repeatCount="indefinite" path={path} />
              </circle>

              {/* Letter badge near first station */}
              {(() => {
                const s0 = line.stations[0]
                const bx = s0.side === "left" ? s0.x + 20 : s0.x - 20
                return (
                  <g filter="url(#dshadow)">
                    <rect x={bx - 14} y={s0.y - 36} width="28" height="22" rx="7" fill={line.color} />
                    <text x={bx} y={s0.y - 25} textAnchor="middle" dominantBaseline="middle"
                      fill="white" fontSize="12" fontWeight="800" fontFamily="var(--font-sans)">
                      {line.letter}
                    </text>
                  </g>
                )
              })()}

              {/* Stations */}
              {line.stations.map((st) => {
                const lx = st.side === "left" ? st.x - 20 : st.x + 20
                const anc = st.side === "left" ? "end" : "start"
                return (
                  <g key={st.id} className="group">
                    {/* Outer ring on hover via CSS */}
                    <circle cx={st.x} cy={st.y} r="16" fill={line.color} opacity="0" className="transition-opacity duration-200 group-hover:opacity-[0.07]" />
                    {/* Station circle */}
                    <circle cx={st.x} cy={st.y} r="7" fill="white" stroke={line.color} strokeWidth="3" className="transition-all duration-150 group-hover:r-[9]" />
                    {/* Name */}
                    <text x={lx} y={st.y - 4} textAnchor={anc} dominantBaseline="middle"
                      fontSize="11.5" fontWeight="600" fill="#1c1917" fontFamily="var(--font-sans)">
                      {st.name}
                    </text>
                    {st.sub && (
                      <text x={lx} y={st.y + 11} textAnchor={anc} dominantBaseline="middle"
                        fontSize="8.5" fill="#78716c" fontFamily="var(--font-mono)" opacity="0.7">
                        {st.sub}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          )
        })}

        {/* ══════ CENTRAL RING ══════ */}
        <g style={{ opacity: revealed ? 1 : 0, transition: "opacity 0.8s ease 0.2s" }}>
          {/* Outer pulse */}
          <circle cx={CX} cy={CY} r={CR + 12} fill="none" stroke="#DC2626" strokeWidth="0.6" opacity="0">
            <animate attributeName="r" values={`${CR + 8};${CR + 28};${CR + 8}`} dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.12;0;0.12" dur="5s" repeatCount="indefinite" />
          </circle>
          {/* Fill */}
          <circle cx={CX} cy={CY} r={CR} fill="#DC2626" opacity="0.03" />
          {/* Ring stroke */}
          <circle cx={CX} cy={CY} r={CR} fill="none" stroke="#DC2626" strokeWidth="5" filter="url(#glow)">
            <animate attributeName="opacity" values="0.55;0.9;0.55" dur="3.5s" repeatCount="indefinite" />
          </circle>
          {/* Center label */}
          <text x={CX} y={CY - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill="#DC2626" opacity="0.65" fontFamily="var(--font-sans)">{"Центральное"}</text>
          <text x={CX} y={CY + 8} textAnchor="middle" fontSize="9" fontWeight="500" fill="#DC2626" opacity="0.4" fontFamily="var(--font-sans)">{"кольцо"}</text>

          {/* Ring node labels */}
          {ringLabels.map((node) => {
            const pos = polar(node.angle, CR)
            const outer = polar(node.angle, CR + 30)
            const anc = node.angle > 90 && node.angle < 270 ? "end" : "start"
            return (
              <g key={node.name}>
                <circle cx={pos.x} cy={pos.y} r="8" fill="white" stroke="#DC2626" strokeWidth="2.5" />
                <circle cx={pos.x} cy={pos.y} r="2.5" fill="#DC2626" opacity="0.4">
                  <animate attributeName="r" values="2;3.5;2" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <text x={outer.x} y={outer.y - 3} textAnchor={anc} dominantBaseline="middle"
                  fontSize="10" fontWeight="700" fill="#1c1917" fontFamily="var(--font-sans)">{node.name}</text>
                <text x={outer.x} y={outer.y + 10} textAnchor={anc} dominantBaseline="middle"
                  fontSize="8" fill="#78716c" fontFamily="var(--font-mono)">{node.sub}</text>
              </g>
            )
          })}
        </g>

        {/* ══════ TRANSPORT HUBS ══════ */}
        {HUBS.map((hub) => {
          const color = hub.type === "airport" ? "#2563EB" : "#7C3AED"
          const typeLabel = hub.type === "train" ? "Международное наблюдение" : hub.type === "bus" ? "Международное преследование" : "Глобальные данные"
          const lx = hub.labelSide === "left" ? hub.x - 26 : hub.x + 26
          const anc = hub.labelSide === "left" ? "end" : "start"

          return (
            <g key={hub.id} className="group" style={{
              opacity: revealed ? 1 : 0,
              transition: "opacity 0.7s ease 1s",
            }}>
              {/* Dashed connector line */}
              <line
                x1={hub.fromStation.x} y1={hub.fromStation.y}
                x2={hub.x} y2={hub.y}
                stroke={color} strokeWidth="2" strokeDasharray="6,4" opacity="0.3"
              />

              {/* Hover glow */}
              <circle cx={hub.x} cy={hub.y} r="28" fill={color} opacity="0"
                className="transition-opacity duration-200 group-hover:opacity-[0.06]" />

              {/* Icon */}
              {hub.type === "train" && <TrainIcon x={hub.x} y={hub.y} />}
              {hub.type === "bus" && <BusIcon x={hub.x} y={hub.y} />}
              {hub.type === "airport" && <AirportIcon x={hub.x} y={hub.y} />}

              {/* Type */}
              <text x={lx} y={hub.y - 16} textAnchor={anc} dominantBaseline="middle"
                fontSize="7.5" fontWeight="700" fill={color} opacity="0.65" letterSpacing="0.4"
                fontFamily="var(--font-mono)" style={{ textTransform: "uppercase" } as React.CSSProperties}>
                {typeLabel}
              </text>
              {/* Name */}
              <text x={lx} y={hub.y + 1} textAnchor={anc} dominantBaseline="middle"
                fontSize="12" fontWeight="700" fill="#1c1917" fontFamily="var(--font-sans)">
                {hub.name}
              </text>
              {/* Sub */}
              <text x={lx} y={hub.y + 15} textAnchor={anc} dominantBaseline="middle"
                fontSize="8.5" fill="#78716c" fontFamily="var(--font-mono)" opacity="0.65">
                {hub.sub}
              </text>
            </g>
          )
        })}
      </svg>

      {/* ══════ LEGEND ══════ */}
      <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-5">
        <div className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          {"Легенда"}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {ALL_LINES.map((line) => (
            <div key={line.id} className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-extrabold"
                style={{ backgroundColor: line.color, color: "white" }}>
                {line.letter}
              </div>
              <span className="text-[11px] font-medium text-foreground">{line.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-border pt-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14"><rect width="14" height="14" rx="3" fill="#7C3AED" opacity="0.15" /><rect x="3" y="2" width="8" height="7" rx="2" fill="none" stroke="#7C3AED" strokeWidth="1.2" /><circle cx="5" cy="11" r="1.3" fill="#7C3AED" /><circle cx="9" cy="11" r="1.3" fill="#7C3AED" /></svg>
            {"Наблюдения и задержания"}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14"><rect width="14" height="14" rx="3" fill="#7C3AED" opacity="0.15" /><rect x="2" y="3" width="10" height="7" rx="2" fill="none" stroke="#7C3AED" strokeWidth="1.2" /><circle cx="5" cy="12" r="1.3" fill="#7C3AED" /><circle cx="9" cy="12" r="1.3" fill="#7C3AED" /></svg>
            {"Задержания и преследования"}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="#2563EB" opacity="0.1" /><path d="M6,2 L8,2 L8.5,5.5 L12,6.5 L12,8 L8.5,7.5 L8,11 L9.5,12 L9.5,13 L7,12 L4.5,13 L4.5,12 L6,11 L5.5,7.5 L2,8 L2,6.5 L5.5,5.5 Z" fill="#2563EB" opacity="0.7" /></svg>
            {"Глобальный надзор и блокирование"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full border-[2.5px] bg-card" style={{ borderColor: "#DC2626" }} />
            {"Кольцо"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-5 border-t-2 border-dashed" style={{ borderColor: "#7C3AED" }} />
            {"Пересадка"}
          </span>
        </div>
      </div>
    </div>
  )
}
