'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // SSR không có localStorage — khởi tạo 'dark', đồng bộ lại ngay khi mount.
  // Script inline trong app/layout.jsx đã đặt data-theme trước khi hydrate
  // nên không bị nháy màn hình.
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    if (localStorage.getItem('portfolio-theme') === 'light') setTheme('light')
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

/** Trang admin luôn dùng nền tối — khôi phục theme cũ khi rời trang */
export function useForceDarkTheme() {
  useEffect(() => {
    const prev = document.documentElement.dataset.theme
    document.documentElement.dataset.theme = 'dark'
    return () => {
      document.documentElement.dataset.theme = prev
    }
  }, [])
}
