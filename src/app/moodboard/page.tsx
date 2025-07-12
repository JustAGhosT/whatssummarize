import styles from './moodboard.module.css';

export default function MoodboardPage() {
  return (
    <div className={styles.container}>
      {/* Animated Background Vectors */}
      <div className={styles['background-vectors']}>
        <div className={styles['vector-shape'] + ' ' + styles['vector-circle']} />
        <div className={styles['vector-shape'] + ' ' + styles['vector-square']} />
        <div className={styles['vector-shape'] + ' ' + styles['vector-triangle']} />
        <div className={styles['vector-shape'] + ' ' + styles['vector-hexagon']} />
        <div className={styles['vector-shape'] + ' ' + styles['vector-diamond']} />
      </div>
      {/* Header Section */}
      <div className={styles.header}>
        <div className="mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        <h1>WhatsApp Summarizer</h1>
        <p>Premium Design System & Style Guide</p>
        <div className="flex gap-8 justify-center mt-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">8</span>
            <span className="text-xs text-muted-foreground">Components</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">12</span>
            <span className="text-xs text-muted-foreground">Colors</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">156</span>
            <span className="text-xs text-muted-foreground">Animations</span>
          </div>
        </div>
      </div>
      {/* Moodboard Grid */}
      <div className={styles['design-grid']}>
        {/* Color Palette Card */}
        <div className={styles['design-card']}>
          <div className="flex items-center mb-4">
            <svg className="mr-2" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.82.62-3.49 1.64-4.83L9 11.5c.28.28.5.61.7.99L12 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2c0-.28.11-.53.29-.71L8.5 9.5C7.58 10.83 7 11.9 7 12c0 2.76 2.24 5 5 5s5-2.24 5-5-2.24-5-5-5c-.55 0-1.08.1-1.57.27l-.01-.01L12 2z" /></svg>
            <h3 className="font-semibold text-lg">Color Palette</h3>
            <span className="ml-2 px-2 py-1 text-xs rounded bg-primary/10 text-primary">Interactive</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">WhatsApp-inspired color system with interactive swatches and gradient variations for modern dark themes.</p>
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm">Primary Colors</h4>
              <div className="flex gap-2">
                <div className={`${styles['color-swatch']} ${styles['swatch-green']}`} title="WhatsApp Green" />
                <div className={`${styles['color-swatch']} ${styles['swatch-darkgreen']}`} title="Dark Green" />
                <div className={`${styles['color-swatch']} ${styles['swatch-lightgreen']}`} title="Light Green" />
                <div className={`${styles['color-swatch']} ${styles['swatch-mint']}`} title="Mint Green" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">Background Colors</h4>
              <div className="flex gap-2">
                <div className={`${styles['background-swatch']} ${styles['swatch-bg-dark']}`} title="Dark Background" />
                <div className={`${styles['background-swatch']} ${styles['swatch-bg-card']}`} title="Card Background" />
                <div className={`${styles['background-swatch']} ${styles['swatch-bg-accent']}`} title="Accent Background" />
                <div className={`${styles['background-swatch']} ${styles['swatch-bg-border']}`} title="Border Color" />
              </div>
            </div>
          </div>
        </div>

        {/* Typography Card */}
        <div className={styles['design-card']}>
          <div className="flex items-center mb-4">
            <svg className="mr-2" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M5 4v3h5.5v12h3V7H19V4H5z" /></svg>
            <h3 className="font-semibold text-lg">Typography</h3>
            <span className="ml-2 px-2 py-1 text-xs rounded bg-primary/10 text-primary">Inter Font</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Modern Inter font family with carefully selected weights and sizes for optimal readability and hierarchy.</p>
          <div className="space-y-2">
            <div className="font-extrabold text-4xl">Dashboard</div>
            <div className="font-bold text-2xl">Message Summary</div>
            <div className="font-medium text-lg">View and manage summaries</div>
            <div className="font-normal text-base">156 Messages • 8 Participants • 2 hours ago</div>
            <div className="font-normal text-sm text-muted-foreground">Last updated today at 3:42 PM</div>
          </div>
        </div>

        {/* Components Card */}
        <div className={styles['design-card']}>
          <div className="flex items-center mb-4">
            <svg className="mr-2" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            <h3 className="font-semibold text-lg">Components</h3>
            <span className="ml-2 px-2 py-1 text-xs rounded bg-primary/10 text-primary">Reusable</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Essential UI components with consistent styling, smooth animations, and clear interaction states.</p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button className="btn btn-primary flex items-center gap-1 px-3 py-1 rounded bg-primary text-white font-semibold"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>New Summary</button>
              <button className="btn btn-secondary flex items-center gap-1 px-3 py-1 rounded bg-secondary text-foreground font-semibold"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Export All</button>
              <button className="btn btn-ghost flex items-center gap-1 px-3 py-1 rounded bg-transparent border border-border text-foreground font-semibold"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>Clear All</button>
            </div>
            <div className="flex gap-2 mt-2">
              <div className="rounded bg-card p-2 flex flex-col items-center shadow">
                <div className="text-primary font-bold text-lg">234</div>
                <div className="text-xs text-muted-foreground">Messages</div>
              </div>
              <div className="rounded bg-card p-2 flex flex-col items-center shadow">
                <div className="text-primary font-bold text-lg">12</div>
                <div className="text-xs text-muted-foreground">Participants</div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Effects Card */}
        <div className={styles['design-card']}>
          <div className="flex items-center mb-4">
            <svg className="mr-2" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
            <h3 className="font-semibold text-lg">Visual Effects</h3>
            <span className="ml-2 px-2 py-1 text-xs rounded bg-primary/10 text-primary">Glassmorphism</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Modern glassmorphism effects, dynamic gradients, and subtle shadows create depth and visual interest.</p>
          <div className="flex flex-col gap-2">
            <div className="rounded-xl bg-white/10 backdrop-blur p-4 flex flex-col items-center mb-2">
              <div className="mb-2"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
              <div className="font-semibold">Glassmorphism Effect</div>
              <div className="text-xs text-muted-foreground">Frosted glass with backdrop blur</div>
            </div>
            <div className="rounded-xl bg-gradient-to-r from-primary to-accent p-4 flex flex-col items-center mb-2">
              <div className="font-semibold">Dynamic Gradient</div>
              <div className="text-xs text-muted-foreground">Animated color transitions</div>
            </div>
            <div className="rounded-xl bg-card p-4 flex flex-col items-center shadow">
              <div className="font-semibold">Elevated Shadow</div>
              <div className="text-xs text-muted-foreground">Multi-layer depth effect</div>
            </div>
          </div>
        </div>

        {/* Layout Card */}
        <div className={styles['design-card']}>
          <div className="flex items-center mb-4">
            <svg className="mr-2" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14zm-10-7h2V9h-2v3zm4 0h2V9h-2v3zm-4 4h2v-3h-2v3zm4 0h2v-3h-2v3z" /></svg>
            <h3 className="font-semibold text-lg">Layout System</h3>
            <span className="ml-2 px-2 py-1 text-xs rounded bg-primary/10 text-primary">Responsive</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Flexible grid system with consistent spacing, responsive breakpoints, and clear visual hierarchy.</p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="bg-card p-2 rounded shadow text-xs">Header</div>
              <div className="bg-card p-2 rounded shadow text-xs">Sidebar</div>
              <div className="bg-card p-2 rounded shadow text-xs">Content Area</div>
              <div className="bg-card p-2 rounded shadow text-xs">Details</div>
            </div>
            <div className="flex gap-2 mt-2 items-center">
              <span className="text-xs font-semibold">Spacing:</span>
              <div className="w-4 h-4 bg-muted rounded flex items-center justify-center text-xs">4px</div>
              <div className="w-6 h-6 bg-muted rounded flex items-center justify-center text-xs">8px</div>
              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs">16px</div>
              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs">24px</div>
              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs">32px</div>
            </div>
          </div>
        </div>

        {/* Interactions Card */}
        <div className={styles['design-card']}>
          <div className="flex items-center mb-4">
            <svg className="mr-2" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
            <h3 className="font-semibold text-lg">Interactions</h3>
            <span className="ml-2 px-2 py-1 text-xs rounded bg-primary/10 text-primary">Smooth</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Responsive hover states, smooth transitions, and micro-animations provide delightful user feedback.</p>
          <div className="flex flex-col gap-2">
            <div className="rounded bg-muted p-2 flex flex-col items-center mb-2">
              <div className="font-semibold">Hover Transform</div>
              <div className="text-xs text-muted-foreground">Smooth scale and translate</div>
            </div>
            <div className="rounded bg-muted p-2 flex flex-col items-center mb-2">
              <div className="font-semibold">Click Feedback</div>
              <div className="text-xs text-muted-foreground">Instant visual response</div>
            </div>
            <div className="rounded bg-muted p-2 flex flex-col items-center">
              <div className="font-semibold">Focus States</div>
              <div className="text-xs text-muted-foreground">Accessibility-first design</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-muted-foreground">
        <p>WhatsApp Summarizer Design System &copy; {new Date().getFullYear()}</p>
        <p>Built with modern web technologies and attention to detail</p>
      </div>
    </div>
  );
} 