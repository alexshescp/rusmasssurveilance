"use client"

import { useEffect, useRef, useState } from "react"
import { linesData, LineInfo } from "@/lib/lines"

// data moved to lib/lines.ts

function LineCard({ line, index }: { line: LineInfo; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-500 hover:shadow-lg"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {/* Accent border top */}
      <div
        className="absolute left-0 right-0 top-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: line.color }}
      />

      {/* Floating glow on hover */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ backgroundColor: line.color }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-primary-foreground shadow-md"
          style={{
            backgroundColor: line.color,
            boxShadow: `0 4px 12px ${line.color}33`,
          }}
        >
          {line.id}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">{line.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {line.description}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {line.stations.map((station, si) => (
          <div key={si} className="flex items-start gap-3">
            <div className="relative mt-1.5 flex flex-col items-center">
              <div
                className="h-3 w-3 rounded-full border-2 bg-card"
                style={{ borderColor: line.color }}
              />
              {si < line.stations.length - 1 && (
                <div
                  className="mt-0.5 h-6 w-0.5"
                  style={{ backgroundColor: line.color, opacity: 0.3 }}
                />
              )}
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground">{station.name}</span>
              <p className="text-xs leading-relaxed text-muted-foreground">{station.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {line.labels.map((label) => (
          <span
            key={label}
            className="rounded-md border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function LineDetails() {
  return (
    <section id="lines" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"Линии и "}
            <span style={{ color: "#DC2626" }}>{"системы"}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted-foreground">
            {"Семь направлений инфраструктуры, объединённых центральным кольцом сбора, хранения и аналитики данных."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {linesData.map((line, i) => (
            <LineCard key={line.id} line={line} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
