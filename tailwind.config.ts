import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Nature-inspired palette for mental health
        nature: {
          mint: '#A7F3D0',
          sage: '#10B981', 
          forest: '#047857',
          sky: '#BFDBFE',
          ocean: '#3B82F6',
          cream: '#FEF3C7',
          sand: '#F59E0B',
          rose: '#F9A8D4',
          lavender: '#DDD6FE',
        },
        // Mood colors
        mood: {
          happy: '#FEF08A',
          calm: '#A7F3D0', 
          sad: '#BFDBFE',
          anxious: '#F9A8D4',
          angry: '#FCA5A5',
          excited: '#FDBA74',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'dancing': ['Dancing Script', 'cursive'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Plant growth animations
        "grow": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "celebrate": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        // Panda animations
        "nod": {
          "0%": { transform: "rotateY(0deg)" },
          "25%": { transform: "rotateY(15deg)" },
          "75%": { transform: "rotateY(-15deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        "shake": {
          "0%": { transform: "rotateX(0deg)" },
          "25%": { transform: "rotateX(-10deg)" },
          "75%": { transform: "rotateX(10deg)" },
          "100%": { transform: "rotateX(0deg)" },
        },
        "dance": {
          "0%": { transform: "scale(1) rotateZ(0deg)" },
          "25%": { transform: "scale(1.05) rotateZ(2deg)" },
          "50%": { transform: "scale(1.1) rotateZ(0deg)" },
          "75%": { transform: "scale(1.05) rotateZ(-2deg)" },
          "100%": { transform: "scale(1) rotateZ(0deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "grow": "grow 2s ease-out",
        "celebrate": "celebrate 1.5s ease-in-out",
        "float": "float 3s ease-in-out infinite",
        "nod": "nod 0.6s ease-in-out",
        "shake": "shake 0.4s ease-in-out",
        "dance": "dance 1.2s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
