import type { Config } from "tailwindcss";
import daisyui from "daisyui"
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [daisyui,],
  daisyui: {
    themes:[{
      mytheme: {
          
        "primary": "#1e3a8a",
                  
        "primary-content": "#f3f4f6",
                  
        "secondary": "#fda4af",
                  
        "secondary-content": "#111827",
                  
        "accent": "#007900",
                  
        "accent-content": "#d2e4d0",
                  
        "neutral": "#160b16",
                  
        "neutral-content": "#d6d3d1",
                  
        "base-100": "#f3f4f6",
                  
        "base-200": "#d1d5db",
                  
        "base-300": "#d1d5db",
                  
        "base-content": "#111827",
                  
        "info": "#facc15",
                  
        "info-content": "#000b16",
                  
        "success": "#37a321",
                  
        "success-content": "#f3f4f6",
                  
        "warning": "#f97316",
                  
        "warning-content": "#f3f4f6",
                  
        "error": "#dc2626",
                  
        "error-content": "#f3f4f6",
                  },
    }]
  }
} satisfies Config;
