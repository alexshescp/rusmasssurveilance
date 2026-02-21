"use client"

import { useEffect, useRef, useState } from "react"

const connections = [
  { from: "Учёты МВД (F)", to: "Interpol (международное наблюдение и задержания)", description: "Учёты МВД имеют полный доступ к системе Interpol I-24/7 для обмена данными о розыске, делах и лицах" },
  { from: "Учёты МВД (F)", to: "Interpol Diffusion (международные задержания)", description: "Механизм Interpol Diffusion позволяет обходить ограничения стандартных процедур Интерпола через альтернативные каналы" },
  { from: "Росфинмониторинг (E)", to: "FATF Egmont Group (глобальная слежка)", description: "Международный обмен финансовой разведкой через Egmont Group и соблюдение рекомендаций FATF" },
  { from: "Учёты МВД (F)", to: "ГАС Правосудие (F)", description: "Учёты МВД напрямую связаны с ГАС Правосудие и КАД для обмена данными о делах и лицах" },
  { from: "ГАС Правосудие (F)", to: "ФССП (F)", description: "Судебные решения автоматически передаются в службу судебных приставов для исполнительного производства" },
  { from: "ФССП (F)", to: "Banking KYC/AML (E)", description: "Исполнительные производства инициируют блокировку и списание средств через банковские системы" },
  { from: "Реестр IMEI (A)", to: "ЕБС (D)", description: "Привязка устройств к биометрическим профилям для верификации личности" },
  { from: "Crypto AML (E)", to: "СМЭВ-шлюз (F)", description: "Финансовый мониторинг криптовалют обменивается данными через межведомственную шину SMEV" },
  { from: "ИИ-видеоаналитика (C)", to: "Аналитика (центр)", description: "Результаты видеоаналитики и распознавания лиц поступают в центральный DWH для корреляции и граф-связей" },
  { from: "АСУ Экспресс-3 (G)", to: "Госреестры (F)", description: "Данные о перемещениях пассажиров ЖД связаны с государственными реестрами через СМЭВ" },
]

export function ConnectionsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"Пересадки и "}
            <span style={{ color: "#DC2626" }}>{"связи"}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted-foreground">
            {"Межсистемные интеграции \u2014 как пересадочные узлы, позволяющие данным перетекать между контурами."}
          </p>
        </div>

        <div className="space-y-4">
          {connections.map((conn, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-500 hover:shadow-md"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-20px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {/* Connection line visual */}
              <div className="flex shrink-0 items-center gap-1">
                <div
                  className="h-3 w-3 rounded-full border-2 border-current"
                  style={{ color: "#DC2626" }}
                />
                <div className="h-px w-8" style={{ backgroundColor: "#DC2626", opacity: 0.4 }} />
                <div
                  className="h-3 w-3 rounded-full border-2 border-current"
                  style={{ color: "#DC2626" }}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span>{conn.from}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                  <span>{conn.to}</span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {conn.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
