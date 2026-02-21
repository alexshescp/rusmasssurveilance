import { ParticleCanvas } from "@/components/particle-canvas"
import { HeroSection } from "@/components/hero-section"
import { MetroMap } from "@/components/metro-map"
import { CentralHubSection } from "@/components/central-hub"
import { LineDetails } from "@/components/line-details"
import { ConnectionsSection } from "@/components/connections-section"

// make this page static
export const dynamic = 'force-static';

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <ParticleCanvas />

      <div className="relative z-10">
        <HeroSection />

        {/* Metro Map Section */}
        <section id="map" className="relative px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {"Схема "}
                <span style={{ color: "#DC2626" }}>{"метро"}</span>
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-pretty text-base text-muted-foreground">
                {"Наведите курсор на станции для подробной информации. Данные пульсируют по линиям в реальном времени."}
              </p>
            </div>

            <MetroMap />
          </div>
        </section>

        <CentralHubSection />
        <LineDetails />
        <ConnectionsSection />

        {/* Footer */}
        <footer className="border-t border-border px-6 py-12">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "#DC2626", boxShadow: "0 0 10px hsla(5, 85%, 55%, 0.4)" }}
              />
              <span className="text-sm font-bold text-foreground">
                {"Карта Инфраструктуры"}
              </span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              {"Визуализация архитектуры государственных систем мониторинга, контроля и обмена данными Российской Федерации в формате карты метро. Все данные основаны на публичных источниках."}
            </p>
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span>{"7 линий"}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span>{"25+ станций"}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span>{"4 узловых хаба"}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span>{"6 пересадок"}</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
