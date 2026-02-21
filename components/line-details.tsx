"use client"

import { useEffect, useRef, useState } from "react"

interface LineInfo {
  id: string
  name: string
  color: string
  description: string
  stations: { name: string; detail: string }[]
  labels: string[]
}

const linesData: LineInfo[] = [
  {
    id: "A",
    name: "Телеком-перехват и хранение",
    color: "#DC2626",
    description:
      "Законный перехват телекоммуникаций, хранение трафика и метаданных. Системы СОРМ обеспечивают доступ силовых структур к голосовому трафику и данным.",
    stations: [
      { name: "СОРМ-1/2/3", detail: "Системы оперативно-розыскных мероприятий всех поколений" },
      { name: "Пакет Яровой", detail: "Обязательное хранение трафика операторами связи до 6 месяцев" },
      { name: "Реестр IMEI", detail: "Учёт ввозимых смартфонов, привязка SIM-IMEI" },
    ],
    labels: ["LI", "CDR", "IMSI/IMEI", "DPI", "IMEI-registry"],
  },
  {
    id: "B",
    name: "Интернет-фильтрация",
    color: "#EA580C",
    description:
      "Глубокая инспекция трафика и централизованное управление маршрутизацией. ТСПУ установлены на сетях всех крупных операторов.",
    stations: [
      { name: "ТСПУ", detail: "Технические средства противодействия угрозам (DPI-оборудование)" },
      { name: "ЦМУ ССОП / ГРЧЦ", detail: "Центр мониторинга и управления сетями связи общего пользования (РКН)" },
      { name: "Ревизор", detail: "Автоматизированный контроль блокировок запрещённых ресурсов" },
    ],
    labels: ["DPI", "URL/IP filtering", "Traffic shaping"],
  },
  {
    id: "C",
    name: "Городское видеонаблюдение",
    color: "#CA8A04",
    description:
      "Сеть камер с ИИ-аналитикой для распознавания лиц, номерных знаков и инцидентов. Москва \u2014 крупнейшая городская система видеонаблюдения в Европе.",
    stations: [
      { name: "АПК \u00ABБезопасный город\u00BB", detail: "Аппаратно-программный комплекс видеонаблюдения" },
      { name: "ГИС ЕЦХД (Москва)", detail: "Единый центр хранения данных, 200K+ камер" },
      { name: "ИИ-видеоаналитика", detail: "FindFace, Городовой \u2014 распознавание лиц в реальном времени" },
      { name: "Региональные расширения", detail: "Тиражирование систем видеонаблюдения в регионы" },
    ],
    labels: ["ANPR/LPR", "AI-recognition", "Neural networks"],
  },
  {
    id: "D",
    name: "Биометрия и идентичность",
    color: "#16A34A",
    description:
      "Единая биометрическая система и её интеграция с государственными услугами. Сбор и верификация биометрических образцов.",
    stations: [
      { name: "ЕБС", detail: "Единая биометрическая система Российской Федерации" },
      { name: "Госуслуги Биометрия", detail: "Биометрическая идентификация через портал госуслуг" },
    ],
    labels: ["Биометрия", "Идентификация"],
  },
  {
    id: "E",
    name: "Финансы и AML",
    color: "#2563EB",
    description:
      "Противодействие отмыванию денег, санкционный скрининг и финансовый мониторинг транзакций, включая криптовалюты. Аэропорт FATF Egmont Group обеспечивает связь с международным финансовым мониторингом.",
    stations: [
      { name: "Banking KYC / AML", detail: "Банковские системы знай-своего-клиента и противодействия отмыванию" },
      { name: "Росфинмониторинг / FinCERT ЦБ", detail: "Федеральная служба по финансовому мониторингу" },
      { name: "Continuous KYC", detail: "Непрерывная биометрическая верификация клиентов" },
      { name: "Crypto AML (Travel Rule)", detail: "Мониторинг криптовалютных транзакций, санкционный скрининг" },
    ],
    labels: ["ПОД/ФТ", "Sanction screening", "Travel Rule"],
  },
  {
    id: "F",
    name: "Госреестры и обмен",
    color: "#7C3AED",
    description:
      "Система межведомственного электронного взаимодействия \u2014 центральная шина обмена данными между всеми государственными информационными системами. Включает пересадку на Interpol (полный доступ к системе I-24/7) и Interpol Diffusion (более прямое взаимодействие с Интерполом).",
    stations: [
      { name: "СМЭВ-шлюз", detail: "SMEV3/4 \u2014 межведомственный обмен документами и данными" },
      { name: "Учёты МВД (ГИАЦ / ИЦ)", detail: "Информационные центры МВД, базы розыска" },
      { name: "ГАС \u00ABПравосудие\u00BB", detail: "Государственная автоматизированная система судебного контура + КАД" },
      { name: "ФССП", detail: "Федеральная служба судебных приставов \u2014 исполнительные производства" },
      { name: "ГИС ГМП", detail: "Государственная информационная система о государственных и муниципальных платежах" },
      { name: "ЕГРН", detail: "Единый государственный реестр недвижимости" },
    ],
    labels: ["СМЭВ 3/4", "Журналы запросов", "Граф-связи"],
  },
  {
    id: "G",
    name: "Перемещения и транспорт",
    color: "#1C1917",
    description:
      "Системы бронирования и контроля перемещений пассажиров на всех видах транспорта \u2014 авиа, ЖД, автомобильный.",
    stations: [
      { name: "Sirena-Travel / Leonardo", detail: "Системы бронирования авиабилетов (PSS)" },
      { name: "АСУ \u00ABЭкспресс-3\u00BB", detail: "Автоматизированная система управления ЖД-перевозками" },
      { name: "АПК \u00ABПОТОК\u00BB", detail: "Автоматизированный контро��ь автомобильного трафика (ANPR)" },
    ],
    labels: ["PSS", "ЖД", "ANPR"],
  },
]

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
