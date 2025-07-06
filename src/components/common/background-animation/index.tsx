"use client"

import { useEffect, useRef, useCallback } from "react"
import styles from "./background-animation.module.css"

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

interface TouchPoint {
  x: number
  y: number
  intensity: number
  decay: number
}

export function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, isActive: false })
  const touchPointsRef = useRef<TouchPoint[]>([])
  const animationRef = useRef<number>()
  const performanceRef = useRef({ fps: 60, lastTime: 0, frameCount: 0 })

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const maxLife = 500 + Math.random() * 400
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      life: maxLife,
      maxLife,
      hue: Math.random() * 80 + 100, // Green-blue spectrum
      energy: Math.random() * 0.5 + 0.5,
      trail: [],
    }
  }, [])

  const updatePerformance = useCallback((currentTime: number) => {
    const perf = performanceRef.current
    perf.frameCount++

    if (currentTime - perf.lastTime >= 1000) {
      perf.fps = Math.round((perf.frameCount * 1000) / (currentTime - perf.lastTime))
      perf.frameCount = 0
      perf.lastTime = currentTime
    }
  }, [])

  const createTouchRipple = useCallback((x: number, y: number) => {
    touchPointsRef.current.push({
      x,
      y,
      intensity: 1,
      decay: 0.02,
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true })
    if (!ctx) return

    // Enable hardware acceleration hints
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

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
      const density = Math.min(120, Math.max(40, Math.floor(area / 15000)))
      const adjustedCount = Math.floor(density * (performanceRef.current.fps / 60))

      particlesRef.current = Array.from({ length: adjustedCount }, () => createParticle(canvas))
    }

    const updateParticles = () => {
      const mouse = mouseRef.current
      const touchPoints = touchPointsRef.current

      particlesRef.current.forEach((particle, index) => {
        // Store previous position for trail
        if (particle.trail.length > 8) {
          particle.trail.shift()
        }
        particle.trail.push({
          x: particle.x,
          y: particle.y,
          opacity: particle.opacity * 0.3,
        })

        // Update position
        particle.x += particle.vx * particle.energy
        particle.y += particle.vy * particle.energy

        // Mouse interaction with improved physics
        if (mouse.isActive) {
          const dx = mouse.x - particle.x
          const dy = mouse.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 250) {
            const force = (250 - distance) / 250
            const angle = Math.atan2(dy, dx)
            const forceMultiplier = particle.energy * 0.03

            if (distance > 120) {
              // Attraction
              particle.vx += Math.cos(angle) * force * forceMultiplier
              particle.vy += Math.sin(angle) * force * forceMultiplier
              particle.energy = Math.min(1.5, particle.energy + 0.01)
            } else {
              // Repulsion with orbital motion
              const orbitalForce = force * 0.02
              particle.vx -= Math.cos(angle) * force * forceMultiplier
              particle.vy -= Math.sin(angle) * force * forceMultiplier
              // Add perpendicular force for orbital motion
              particle.vx += Math.cos(angle + Math.PI / 2) * orbitalForce
              particle.vy += Math.sin(angle + Math.PI / 2) * orbitalForce
              particle.energy = Math.min(2, particle.energy + 0.02)
            }
          }
        }

        // Touch point interactions
        touchPoints.forEach((touch) => {
          const dx = touch.x - particle.x
          const dy = touch.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 200 * touch.intensity

          if (distance < maxDistance) {
            const force = ((maxDistance - distance) / maxDistance) * touch.intensity
            const angle = Math.atan2(dy, dx)

            particle.vx -= Math.cos(angle) * force * 0.05
            particle.vy -= Math.sin(angle) * force * 0.05
            particle.energy = Math.min(2, particle.energy + force * 0.1)
          }
        })

        // Boundary handling with smooth wrapping
        const margin = 100
        if (particle.x < -margin) {
          particle.x = canvas.width + margin
          particle.vx *= 0.8
        }
        if (particle.x > canvas.width + margin) {
          particle.x = -margin
          particle.vx *= 0.8
        }
        if (particle.y < -margin) {
          particle.y = canvas.height + margin
          particle.vy *= 0.8
        }
        if (particle.y > canvas.height + margin) {
          particle.y = -margin
          particle.vy *= 0.8
        }

        // Physics simulation
        particle.vx *= 0.998 // Air resistance
        particle.vy *= 0.998
        particle.energy *= 0.995 // Energy decay

        // Add subtle noise
        particle.vx += (Math.random() - 0.5) * 0.02
        particle.vy += (Math.random() - 0.5) * 0.02

        // Velocity limiting
        const maxVel = 3 * particle.energy
        const vel = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
        if (vel > maxVel) {
          particle.vx = (particle.vx / vel) * maxVel
          particle.vy = (particle.vy / vel) * maxVel
        }

        // Life cycle
        particle.life--
        if (particle.life <= 0) {
          particlesRef.current[index] = createParticle(canvas)
        }

        // Dynamic opacity
        const lifeRatio = particle.life / particle.maxLife
        const energyBoost = Math.min(particle.energy - 0.5, 0.5)
        particle.opacity = (lifeRatio * 0.8 + 0.2) * (1 + energyBoost)
      })

      // Update touch points
      touchPointsRef.current = touchPoints.filter((touch) => {
        touch.intensity -= touch.decay
        return touch.intensity > 0
      })
    }

    const drawConnections = () => {
      const connections = []

      // Calculate all connections first
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 180) {
            connections.push({
              p1: particle,
              p2: otherParticle,
              distance,
              opacity: (1 - distance / 180) * 0.5,
            })
          }
        })
      })

      // Sort by distance for better layering
      connections.sort((a, b) => b.distance - a.distance)

      // Draw connections
      connections.forEach(({ p1, p2, distance, opacity }) => {
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
        const hue1 = p1.hue + (p1.energy - 0.5) * 20
        const hue2 = p2.hue + (p2.energy - 0.5) * 20
        const avgHue = (hue1 + hue2) / 2
        const energyBoost = (p1.energy + p2.energy) / 2

        if (distance < 100) {
          // Ultra-bright connections
          const pulsePhase = (Date.now() * 0.003 + distance * 0.01) % (Math.PI * 2)
          const pulse = Math.sin(pulsePhase) * 0.3 + 0.7

          gradient.addColorStop(0, `hsla(${hue1}, 80%, 70%, ${opacity * pulse * energyBoost})`)
          gradient.addColorStop(0.5, `hsla(${avgHue}, 90%, 80%, ${opacity * pulse * energyBoost * 1.5})`)
          gradient.addColorStop(1, `hsla(${hue2}, 80%, 70%, ${opacity * pulse * energyBoost})`)
          ctx.lineWidth = 3
        } else {
          gradient.addColorStop(0, `hsla(${hue1}, 70%, 60%, ${opacity * energyBoost})`)
          gradient.addColorStop(0.5, `hsla(${avgHue}, 80%, 70%, ${opacity * energyBoost * 1.2})`)
          gradient.addColorStop(1, `hsla(${hue2}, 70%, 60%, ${opacity * energyBoost})`)
          ctx.lineWidth = Math.max(1, energyBoost)
        }

        ctx.strokeStyle = gradient
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
          const trailOpacity = point.opacity * (index / trail.length) * 0.5
          const trailSize = size * 0.3 * (index / trail.length)

          ctx.fillStyle = `hsla(${hue}, 60%, 50%, ${trailOpacity})`
          ctx.beginPath()
          ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2)
          ctx.fill()
        })

        // Multi-layer glow system
        const glowIntensity = energy * opacity

        // Outer glow
        const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 8)
        outerGlow.addColorStop(0, `hsla(${hue}, 80%, 70%, ${glowIntensity * 0.3})`)
        outerGlow.addColorStop(0.3, `hsla(${hue}, 70%, 60%, ${glowIntensity * 0.15})`)
        outerGlow.addColorStop(1, `hsla(${hue}, 60%, 50%, 0)`)

        ctx.fillStyle = outerGlow
        ctx.beginPath()
        ctx.arc(x, y, size * 8, 0, Math.PI * 2)
        ctx.fill()

        // Main particle
        const mainGradient = ctx.createRadialGradient(x, y, 0, x, y, size * energy)
        mainGradient.addColorStop(0, `hsla(0, 0%, 100%, ${opacity})`)
        mainGradient.addColorStop(0.3, `hsla(${hue}, 90%, 80%, ${opacity * 0.9})`)
        mainGradient.addColorStop(1, `hsla(${hue}, 70%, 50%, ${opacity * 0.7})`)

        ctx.fillStyle = mainGradient
        ctx.beginPath()
        ctx.arc(x, y, size * energy, 0, Math.PI * 2)
        ctx.fill()

        // Core highlight
        ctx.fillStyle = `hsla(0, 0%, 100%, ${opacity * energy})`
        ctx.beginPath()
        ctx.arc(x, y, size * 0.4 * energy, 0, Math.PI * 2)
        ctx.fill()

        // Energy burst effect
        if (energy > 1.2) {
          const burstSize = (energy - 1) * size * 2
          const burstOpacity = (energy - 1) * opacity * 0.5

          ctx.fillStyle = `hsla(${hue}, 100%, 90%, ${burstOpacity})`
          ctx.beginPath()
          ctx.arc(x, y, burstSize, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }

    const drawTouchRipples = () => {
      touchPointsRef.current.forEach((touch) => {
        const radius = (1 - touch.intensity) * 200
        const gradient = ctx.createRadialGradient(touch.x, touch.y, 0, touch.x, touch.y, radius)

        gradient.addColorStop(0, `hsla(140, 80%, 70%, 0)`)
        gradient.addColorStop(0.8, `hsla(140, 80%, 70%, ${touch.intensity * 0.3})`)
        gradient.addColorStop(1, `hsla(140, 80%, 70%, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(touch.x, touch.y, radius, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const animate = (currentTime: number) => {
      updatePerformance(currentTime)

      // Adaptive quality based on performance
      const quality = Math.min(1, performanceRef.current.fps / 45)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (quality > 0.7) {
        drawTouchRipples()
        drawConnections()
      }

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

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      Array.from(e.touches).forEach((touch) => {
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top
        createTouchRipple(x, y)
      })
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        mouseRef.current.x = touch.clientX - rect.left
        mouseRef.current.y = touch.clientY - rect.top
        mouseRef.current.isActive = true
      }
    }

    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }

    // Initialize
    resizeCanvas()
    initParticles()
    animate(0)

    // Event listeners
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false })
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("resize", handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [createParticle, updatePerformance, createTouchRipple])

  return (
    <div className={styles.backgroundAnimation}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.gradientLayer1}></div>
      <div className={styles.gradientLayer2}></div>
      <div className={styles.gradientLayer3}></div>
      <div className={styles.gridPattern}></div>
      <div className={styles.gridPatternSecondary}></div>
      <div className={styles.textureOverlay}></div>
    </div>
  )
}
