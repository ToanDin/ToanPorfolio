'use client'

import { ThemeProvider } from '@/lib/theme.jsx'
import { LangProvider } from '@/lib/i18n.jsx'

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <LangProvider>{children}</LangProvider>
    </ThemeProvider>
  )
}
