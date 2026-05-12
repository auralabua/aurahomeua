@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Premium wellness palette */
    --background: 40 30% 97%;
    --foreground: 220 20% 16%;
    --card: 0 0% 100%;
    --card-foreground: 220 20% 16%;
    --popover: 0 0% 100%;
    --popover-foreground: 220 20% 16%;

    /* Muted sage green — основний */
    --primary: 155 28% 38%;
    --primary-foreground: 0 0% 100%;
    --primary-soft: 155 28% 94%;
    --primary-hover: 155 32% 30%;

    /* Warm beige accent */
    --accent: 35 40% 70%;
    --accent-foreground: 220 20% 16%;
    --accent-soft: 35 40% 94%;

    --secondary: 38 28% 93%;
    --secondary-foreground: 220 20% 16%;
    --muted: 38 22% 91%;
    --muted-foreground: 220 8% 50%;
    --destructive: 0 65% 52%;
    --destructive-foreground: 0 0% 100%;
    --border: 36 18% 88%;
    --input: 36 18% 90%;
    --ring: 155 28% 38%;
    --radius: 1.25rem;

    --shadow-soft: 0 4px 24px -8px hsl(155 20% 20% / 0.10);
    --shadow-card: 0 8px 40px -12px hsl(155 20% 20% / 0.14);
    --shadow-elevated: 0 16px 60px -20px hsl(155 20% 20% / 0.18);
    --transition-smooth: all 0.26s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
}

@layer base {
  * { @apply border-border; }
  html { scroll-behavior: smooth; }
  body {
    @apply bg-background text-foreground antialiased;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
    background-color: hsl(40 30% 97%);
    min-height: 100vh;
  }
  #root { position: relative; z-index: 1; }
  h1, h2, h3, h4 { font-weight: 300; letter-spacing: -0.02em; }
  h1 { letter-spacing: -0.035em; }
  ::selection { background: hsl(var(--primary) / .18); color: hsl(var(--foreground)); }
}

@layer utilities {
  .shadow-soft { box-shadow: var(--shadow-soft); }
  .shadow-card { box-shadow: var(--shadow-card); }
  .shadow-elevated { box-shadow: var(--shadow-elevated); }
  .transition-smooth { transition: var(--transition-smooth); }

  .btn-aura {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    box-shadow: 0 4px 20px -6px hsl(var(--primary) / 0.40);
  }
  .btn-aura:hover {
    background: hsl(var(--primary-hover));
    transform: translateY(-1px);
    box-shadow: 0 8px 28px -6px hsl(var(--primary) / 0.45);
  }

  .glass {
    background: hsl(0 0% 100% / 0.82);
    border: 1px solid hsl(var(--border) / 0.8);
    backdrop-filter: blur(16px);
    box-shadow: var(--shadow-soft);
  }

  .aura-card {
    @apply rounded-2xl border border-border bg-card shadow-soft;
  }

  .aura-kicker {
    @apply text-[10px] uppercase tracking-[0.22em] text-primary font-medium;
  }

  .text-gradient { color: hsl(var(--primary)); }

  /* Hero gradient — warm, minimal */
  .hero-bg {
    background: linear-gradient(135deg,
      hsl(40 35% 95%) 0%,
      hsl(38 30% 93%) 50%,
      hsl(155 18% 92%) 100%
    );
  }
}
