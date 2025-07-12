"use client"

import { useTheme } from "next-themes"
import { useCallback, useEffect, useRef } from "react"
import styles from "./enhanced-background.module.css"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

export function EnhancedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  // Always use light theme for now
  const currentTheme = 'light'

  const createParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.min(30, Math.floor((width * height) / 20000))
    return Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      color: "rgba(37, 211, 102, 0.1)", // WhatsApp green color
    }))
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    const particles = particlesRef.current
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      
      // Update position
      p.x += p.vx
      p.y += p.vy
      
      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      
      // Draw particle
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color.replace('0.15', p.opacity.toString())
      ctx.fill()
    }
    
    // Continue animation
    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = createParticles(canvas.width, canvas.height)
    }

    // Initial setup
    handleResize()
    particlesRef.current = createParticles(canvas.width, canvas.height)
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Handle window resize
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, createParticles])

  // Update particles when theme changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    particlesRef.current = createParticles(canvas.width, canvas.height)
  }, [currentTheme, createParticles])

  return (
    <div className={styles.background}>
      <div className={`${styles.gradientLayer} ${styles.light}`} />
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={0}
        height={0}
      />
    </div>
  )
}
