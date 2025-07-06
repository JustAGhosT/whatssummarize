"use client"

import { useEffect, useRef, useCallback } from "react"
import { useTheme } from "../../../contexts/theme-context"
import styles from "./enhanced-background.module.css"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  hue: number
  energy: number
  trail: { x: number; y: number; opacity: number }[]
}

interface AuroraLayer {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  hue: number
  speed: number
}

export function EnhancedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const auroraLayersRef = useRef<AuroraLayer[]>([])
  const mouseRef = useRef({ x: 0, y: 0, isActive: false })
  const animationRef = useRef<number>()
  const { theme } = useTheme()

  const createParticle = useCallback(
    (canvas: HTMLCanvasElement): Particle => {
      const maxLife = 800 + Math.random() * 600
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        life: maxLife,
        maxLife,
        hue: theme === "dark" ? Math.random() * 60 + 120 : Math.random() * 40 + 140,
        energy: Math.random() * 0.3 + 0.7,
        trail: [],
      }
    },
    [theme],
  )

  const createAuroraLayer = useCallback(
    (canvas: HTMLCanvasElement): AuroraLayer => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: canvas.width * (0.3 + Math.random() * 0.4),
        height: canvas.height * (0.2 + Math.random() * 0.3),
        rotation: Math.random() * Math.PI * 2,
        opacity: theme === "dark" ? Math.random() * 0.15 + 0.05 : Math.random() * 0.08 + 0.02,
        hue: theme === "dark" ? Math.random() * 80 + 120 : Math.random() * 60 + 140,
        speed: Math.random() * 0.002 + 0.001,
      }
    },
    [theme],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true })
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = rect.width + "px"
      canvas.style.height = rect.height + "px"

      ctx.scale(dpr, dpr)
    }

    const initParticles = () => {
      const area = canvas.width * canvas.height
      const density = theme === "dark" ? 80 : 60
      const particleCount = Math.min(density, Math.max(30, Math.floor(area / 20000)))

      particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas))

      // Create aurora layers for dark mode
      if (theme === "dark") {
        auroraLayersRef.current = Array.from({ length: 3 }, () => createAuroraLayer(canvas))
      } else {
        auroraLayersRef.current = []
      }
    }

    const drawAuroraLayers = () => {
      if (theme !== "dark") return

      auroraLayersRef.current.forEach((layer) => {
        ctx.save()

        // Create radial gradient for aurora effect
        const gradient = ctx.createRadialGradient(layer.x, layer.y, 0, layer.x, layer.y, layer.width / 2)

        gradient.addColorStop(0, `hsla(${layer.hue}, 70%, 60%, ${layer.opacity})`)
        gradient.addColorStop(0.3, `hsla(${layer.hue + 20}, 80%, 70%, ${layer.opacity * 0.7})`)
        gradient.addColorStop(0.7, `hsla(${layer.hue - 20}, 60%, 50%, ${layer.opacity * 0.3})`)
        gradient.addColorStop(1, `hsla(${layer.hue}, 50%, 40%, 0)`)

        ctx.translate(layer.x, layer.y)
        ctx.rotate(layer.rotation)
        ctx.fillStyle = gradient
        ctx.fillRect(-layer.width / 2, -layer.height / 2, layer.width, layer.height)

        ctx.restore()

        // Update aurora layer
        layer.rotation += layer.speed
        layer.x += Math.sin(layer.rotation * 0.5) * 0.2
        layer.y += Math.cos(layer.rotation * 0.3) * 0.15

        // Wrap around screen
        if (layer.x < -layer.width / 2) layer.x = canvas.width + layer.width / 2
        if (layer.x > canvas.width + layer.width / 2) layer.x = -layer.width / 2
        if (layer.y < -layer.height / 2) layer.y = canvas.height + layer.height / 2
        if (layer.y > canvas.height + layer.height / 2) layer.y = -layer.height / 2
      })
    }

    const drawRadialPulses = () => {
      if (theme !== "dark") return

      const time = Date.now() * 0.001
      const pulseCount = 3

      for (let i = 0; i < pulseCount; i++) {
        const phase = (time + i * 2) % 6
        const centerX = canvas.width * (0.2 + i * 0.3)
        const centerY = canvas.height * (0.3 + Math.sin(time + i) * 0.2)
        const maxRadius = Math.min(canvas.width, canvas.height) * 0.4
        const radius = (Math.sin(phase) * 0.5 + 0.5) * maxRadius
        const opacity = (Math.sin(phase * 2) * 0.3 + 0.3) * 0.1

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
        gradient.addColorStop(0, `hsla(${140 + i * 20}, 70%, 60%, ${opacity})`)
        gradient.addColorStop(0.5, `hsla(${160 + i * 15}, 80%, 70%, ${opacity * 0.5})`)
        gradient.addColorStop(1, `hsla(${180 + i * 10}, 60%, 50%, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const updateParticles = () => {
      const mouse = mouseRef.current

      particlesRef.current.forEach((particle, index) => {
        // Store trail
        if (particle.trail.length > 6) {
          particle.trail.shift()
        }
        particle.trail.push({
          x: particle.x,
          y: particle.y,
          opacity: particle.opacity * 0.4,
        })

        // Update position
        particle.x += particle.vx * particle.energy
        particle.y += particle.vy * particle.energy

        // Mouse interaction
        if (mouse.isActive) {
          const dx = mouse.x - particle.x
          const dy = mouse.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 200) {
            const force = (200 - distance) / 200
            const angle = Math.atan2(dy, dx)
            const forceMultiplier = particle.energy * 0.02

            if (distance > 80) {
              particle.vx += Math.cos(angle) * force * forceMultiplier
              particle.vy += Math.sin(angle) * force * forceMultiplier
            } else {
              particle.vx -= Math.cos(angle) * force * forceMultiplier * 2
              particle.vy -= Math.sin(angle) * force * forceMultiplier * 2
            }
            particle.energy = Math.min(1.8, particle.energy + 0.01)
          }
        }

        // Boundary wrapping
        const margin = 50
        if (particle.x < -margin) particle.x = canvas.width + margin
        if (particle.x > canvas.width + margin) particle.x = -margin
        if (particle.y < -margin) particle.y = canvas.height + margin
        if (particle.y > canvas.height + margin) particle.y = -margin

        // Physics
        particle.vx *= 0.999
        particle.vy *= 0.999
        particle.energy *= 0.998

        // Add subtle drift
        particle.vx += (Math.random() - 0.5) * 0.01
        particle.vy += (Math.random() - 0.5) * 0.01

        // Life cycle
        particle.life--
        if (particle.life <= 0) {
          particlesRef.current[index] = createParticle(canvas)
        }

        const lifeRatio = particle.life / particle.maxLife
        particle.opacity = (lifeRatio * 0.6 + 0.2) * (1 + (particle.energy - 0.7) * 0.5)
      })
    }

    const drawConnections = () => {
      const maxDistance = theme === "dark" ? 150 : 120
      const connections: any[] = []

      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            connections.push({
              p1: particle,
              p2: otherParticle,
              distance,
              opacity: (1 - distance / maxDistance) * 0.3,
            })
          }
        })
      })

      connections.forEach(({ p1, p2, distance, opacity }) => {
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
        const avgHue = (p1.hue + p2.hue) / 2
        const energyBoost = (p1.energy + p2.energy) / 2

        gradient.addColorStop(0, `hsla(${p1.hue}, 60%, 50%, ${opacity * energyBoost})`)
        gradient.addColorStop(0.5, `hsla(${avgHue}, 70%, 60%, ${opacity * energyBoost * 1.2})`)
        gradient.addColorStop(1, `hsla(${p2.hue}, 60%, 50%, ${opacity * energyBoost})`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = Math.max(0.5, energyBoost * 0.8)
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      })
    }

    const drawParticles = () => {
      particlesRef.current.forEach((particle) => {
        const { x, y, size, opacity, hue, energy, trail } = particle

        // Draw trail
        trail.forEach((point, index) => {
          const trailOpacity = point.opacity * (index / trail.length) * 0.6
          const trailSize = size * 0.4 * (index / trail.length)

          if (trailOpacity > 0.01) {
            ctx.fillStyle = `hsla(${hue}, 50%, 40%, ${trailOpacity})`
            ctx.beginPath()
            ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2)
            ctx.fill()
          }
        })

        // Outer glow
        const glowRadius = size * (theme === "dark" ? 6 : 4)
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius)
        glowGradient.addColorStop(0, `hsla(${hue}, 70%, 60%, ${opacity * energy * 0.4})`)
        glowGradient.addColorStop(0.4, `hsla(${hue}, 60%, 50%, ${opacity * energy * 0.2})`)
        glowGradient.addColorStop(1, `hsla(${hue}, 50%, 40%, 0)`)

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Main particle
        const mainGradient = ctx.createRadialGradient(x, y, 0, x, y, size * energy)
        mainGradient.addColorStop(0, `hsla(0, 0%, 100%, ${opacity * 0.8})`)
        mainGradient.addColorStop(0.3, `hsla(${hue}, 80%, 70%, ${opacity * 0.9})`)
        mainGradient.addColorStop(1, `hsla(${hue}, 60%, 50%, ${opacity * 0.6})`)

        ctx.fillStyle = mainGradient
        ctx.beginPath()
        ctx.arc(x, y, size * energy, 0, Math.PI * 2)
        ctx.fill()

        // Core highlight
        if (energy > 1) {
          ctx.fillStyle = `hsla(0, 0%, 100%, ${opacity * (energy - 1)})`
          ctx.beginPath()
          ctx.arc(x, y, size * 0.3, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (theme === "dark") {
        drawRadialPulses()
        drawAuroraLayers()
      }

      updateParticles()
      drawConnections()
      drawParticles()

      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
      mouseRef.current.isActive = true
    }

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false
    }

    resizeCanvas()
    initParticles()
    animate()

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("resize", () => {
      resizeCanvas()
      initParticles()
    })

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [theme, createParticle, createAuroraLayer])

  return (
    <div className={styles.backgroundContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={`${styles.gradientLayer} ${theme === "dark" ? styles.dark : styles.light}`} />
      <div className={styles.noiseOverlay} />
    </div>
  )
}
