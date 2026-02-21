"use client"

import { useEffect, useRef, useState } from "react"

const hubs = [
  {
    name: "СХД / ЦОД",
    detail: "Хранение трафика, метаданных, видео, биометрии",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    name: "СМЭВ",
    detail: "Межведомственный обмен данными",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    name: "ЦМУ ССОП",
    detail: "ГРЧЦ / РКН \u2014 управление сетями связи",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    name: "Аналитика / Корреляция",
    detail: "ETL/ESB, DWH, Data Lake, граф-связи, риск-скоринг",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M13 6h3a2 2 0 0 1 2 2v7" />
        <path d="M11 18H8a2 2 0 0 1-2-2V9" />
      </svg>
    ),
  },
]

export function CentralHubSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative px-6 py-24">
      {/* Background accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, hsla(5, 85%, 55%, 0.06), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"Российская "}
            <span style={{ color: "#DC2626" }}>{"автократия"}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted-foreground">
            {"Четыре узловые станции, связывающие все линии инфраструктуры: сбор, доставка, хранение, корреляция и выдача данных по регламенту."}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {hubs.map((hub, i) => (
            <div
              key={hub.name}
              className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-500 hover:shadow-md"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              {/* Icon */}
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: "hsla(5, 85%, 55%, 0.08)",
                  color: "#DC2626",
                }}
              >
                {hub.icon}
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">{hub.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {hub.detail}
                </p>
              </div>

              {/* Hover accent */}
              <div
                className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15"
                style={{ backgroundColor: "#DC2626" }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {/* Connection flow diagram */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          {["Сбор", "Доставка", "Хранение", "Корреляция", "Выдача"].map(
            (step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span
                  className="rounded-full border border-border bg-card px-3 py-1 font-medium"
                  style={
                    i === 0 || i === 4
                      ? { borderColor: "#DC2626", color: "#DC2626" }
                      : {}
                  }
                >
                  {step}
                </span>
                {i < 4 && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground/50"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
