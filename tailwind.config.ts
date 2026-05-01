// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './src/components/**/*.{vue,js,ts}',
    './src/components/layouts/**/*.{vue,js,ts}',
    './src/components/layouts/layout_components/**/*.{vue,js,ts}',
    './src/components/layouts/ui/**/*.{vue,js,ts}',
    './src/pages/**/*.vue',
    './app/app.vue',
    './src/plugins/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // example color
        secondary: '#facc15',
        neutral:'#000000'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
