import type { Config } from 'tailwindcss'
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: {
    colors: { primary:'#064E3B', accent:'#D4AF37', neutral:{900:'#111827',600:'#6B7280'} },
    borderRadius: { '2xl':'1rem' }, boxShadow: { soft:'0 8px 30px rgba(0,0,0,0.08)' }
  }}, plugins: [],
} satisfies Config
