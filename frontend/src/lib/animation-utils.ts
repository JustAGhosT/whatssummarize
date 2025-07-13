/**
 * Adds mouse tracking effect to elements
 * @param selector CSS selector for elements to apply the effect to
 */
export function initMouseTracking(selector: string): void {
  if (typeof window === 'undefined') return
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return
  
  const elements = document.querySelectorAll(selector)
  
  elements.forEach(element => {
    element.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = (element as HTMLElement).getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      
      (element as HTMLElement).style.setProperty('--x', `${x}%`)
      (element as HTMLElement).style.setProperty('--y', `${y}%`)
    })
  })
}

/**
 * Adds staggered entrance animations to elements
 * @param selector CSS selector for elements to animate
 * @param options Animation options
 */
export function initStaggeredAnimations(
  selector: string, 
  options = { 
    threshold: 0.1,
    baseDelay: 100,
    className: 'animate-fade-in'
  }
): void {
  if (typeof window === 'undefined') return
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return
  
  const elements = document.querySelectorAll(selector)
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add(options.className)
        }, index * options.baseDelay)
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: options.threshold })
  
  elements.forEach(element => {
    observer.observe(element)
  })
}