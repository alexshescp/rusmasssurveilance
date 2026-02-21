"use client"

import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-24">
      {/* Decorative top-left corner accent */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, hsla(5, 85%, 55%, 0.3) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, hsla(15, 80%, 55%, 0.25) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div
        className="flex flex-col items-center gap-6 text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: "#DC2626", boxShadow: "0 0 8px hsla(5, 85%, 55%, 0.5)" }}
          />
          {"Интерактивная визуализация"}
        </div>

        <h1
          ref={titleRef}
          className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          {"Карта"}
          <br />
          <span style={{ color: "#DC2626" }}>{"Инфраструктуры"}</span>
        </h1>

        <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          {"Системы мониторинга, контроля и обмена данными \u2014 от телеком-перехвата и видеонаблюдения до финансовой аналитики и транспортного трекинга. Все связи в формате карты метро."}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <a
            href="#map"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105"
            style={{
              backgroundColor: "#DC2626",
              boxShadow: "0 4px 20px hsla(5, 85%, 55%, 0.3)",
            }}
          >
            {"Смотреть карту"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </a>
          <a
            href="#lines"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-secondary"
          >
            {"Подробнее"}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{
          opacity: visible ? 0.5 : 0,
          transition: "opacity 1.5s ease 0.5s",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">{"scroll"}</span>
          <div className="h-8 w-[1px] bg-muted-foreground/30">
            <div
              className="h-3 w-[1px]"
              style={{
                backgroundColor: "#DC2626",
                animation: "scrollPulse 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(0); opacity: 0; }
          50% { transform: translateY(20px); opacity: 1; }
        }
      `}</style>
    </section>
  )
}
