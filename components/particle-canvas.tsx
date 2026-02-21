"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  phase: number
  speed: number
  orbitR: number
}

interface Pulse {
  fromIdx: number
  toIdx: number
  progress: number
  speed: number
  size: number
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let nodes: Node[] = []
    let pulses: Pulse[] = []
    let edges: [number, number][] = []
    const NODE_COUNT = 28
    const MAX_EDGE_DIST = 280

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initNodes()
    }

    const initNodes = () => {
      nodes = Array.from({ length: NODE_COUNT }, () => {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          radius: Math.random() * 2.5 + 1,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0003 + Math.random() * 0.0008,
          orbitR: 15 + Math.random() * 40,
        }
      })

      // Build edges based on proximity
      edges = []
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].baseX - nodes[j].baseX
          const dy = nodes[i].baseY - nodes[j].baseY
          if (Math.sqrt(dx * dx + dy * dy) < MAX_EDGE_DIST) {
            edges.push([i, j])
          }
        }
      }
    }

    resize()
    window.addEventListener("resize", resize)

    let mouseX = -9999
    let mouseY = -9999
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Spawn pulses periodically
    let lastPulseTime = 0
    const spawnPulse = (time: number) => {
      if (time - lastPulseTime > 600 && edges.length > 0 && pulses.length < 12) {
        const edge = edges[Math.floor(Math.random() * edges.length)]
        pulses.push({
          fromIdx: edge[0],
          toIdx: edge[1],
          progress: 0,
          speed: 0.004 + Math.random() * 0.008,
          size: 2 + Math.random() * 2,
        })
        lastPulseTime = time
      }
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Soft red vignette corners
      const vg1 = ctx.createRadialGradient(0, 0, 0, 0, 0, canvas.width * 0.5)
      vg1.addColorStop(0, "hsla(5, 80%, 55%, 0.03)")
      vg1.addColorStop(1, "transparent")
      ctx.fillStyle = vg1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const vg2 = ctx.createRadialGradient(canvas.width, canvas.height, 0, canvas.width, canvas.height, canvas.width * 0.5)
      vg2.addColorStop(0, "hsla(10, 80%, 55%, 0.025)")
      vg2.addColorStop(1, "transparent")
      ctx.fillStyle = vg2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update node positions (slow orbit)
      nodes.forEach((n) => {
        n.x = n.baseX + Math.cos(time * n.speed + n.phase) * n.orbitR
        n.y = n.baseY + Math.sin(time * n.speed * 0.7 + n.phase) * n.orbitR * 0.6
      })

      // Mouse repulsion
      nodes.forEach((n) => {
        const dx = n.x - mouseX
        const dy = n.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 180 && dist > 0) {
          const force = (1 - dist / 180) * 25
          n.x += (dx / dist) * force
          n.y += (dy / dist) * force
        }
      })

      // Draw edges
      edges.forEach(([i, j]) => {
        const a = nodes[i]
        const b = nodes[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const alpha = Math.max(0, 1 - dist / MAX_EDGE_DIST) * 0.08
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `hsla(5, 60%, 50%, ${alpha})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      })

      // Draw nodes
      nodes.forEach((n) => {
        // Glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 8)
        glow.addColorStop(0, `hsla(5, 75%, 55%, 0.08)`)
        glow.addColorStop(1, `hsla(5, 75%, 55%, 0)`)
        ctx.fillStyle = glow
        ctx.fillRect(n.x - n.radius * 8, n.y - n.radius * 8, n.radius * 16, n.radius * 16)
        // Core
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(5, 70%, 55%, 0.2)`
        ctx.fill()
      })

      // Update and draw pulses
      spawnPulse(time)
      pulses = pulses.filter((p) => p.progress <= 1)
      pulses.forEach((p) => {
        p.progress += p.speed
        const a = nodes[p.fromIdx]
        const b = nodes[p.toIdx]
        const px = a.x + (b.x - a.x) * p.progress
        const py = a.y + (b.y - a.y) * p.progress
        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 5)
        glow.addColorStop(0, `hsla(5, 90%, 60%, 0.35)`)
        glow.addColorStop(0.5, `hsla(5, 80%, 55%, 0.1)`)
        glow.addColorStop(1, `hsla(5, 80%, 55%, 0)`)
        ctx.fillStyle = glow
        ctx.fillRect(px - p.size * 5, py - p.size * 5, p.size * 10, p.size * 10)
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(5, 90%, 65%, 0.6)`
        ctx.fill()
      })

      // Mouse glow
      if (mouseX > 0) {
        const mg = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 120)
        mg.addColorStop(0, "hsla(5, 85%, 55%, 0.04)")
        mg.addColorStop(1, "transparent")
        ctx.fillStyle = mg
        ctx.fillRect(mouseX - 120, mouseY - 120, 240, 240)
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
