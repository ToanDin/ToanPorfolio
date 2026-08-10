import { createContext, useContext, useEffect, useState } from 'react'

const dict = {
  vi: {
    nav: {
      about: 'Giới thiệu',
      skills: 'Kỹ năng',
      projects: 'Dự án',
      contact: 'Liên hệ',
      cta: 'Nói chuyện với tôi',
    },
    hero: {
      greeting: 'Xin chào, tôi là',
      viewProjects: 'Xem dự án',
      contact: 'Liên hệ',
      scrollDown: 'Cuộn xuống',
    },
    about: { kicker: 'Giới thiệu', title: 'Về tôi' },
    skills: {
      kicker: 'Kỹ năng',
      title: 'Tôi làm được gì',
      groups: { frontend: 'Frontend', backend: 'Backend', tools: 'Công cụ & Khác' },
    },
    projects: { kicker: 'Dự án', title: 'Sản phẩm tôi đã xây', featured: 'Nổi bật' },
    contact: {
      kicker: 'Liên hệ',
      title: 'Cùng làm gì đó thú vị?',
      blurb: 'Có ý tưởng, cơ hội hợp tác, hay đơn giản muốn chào một câu — cứ nhắn cho tôi.',
      name: 'Tên của bạn',
      email: 'Email',
      message: 'Nội dung...',
      send: 'Gửi tin nhắn',
      sending: 'Đang gửi...',
      ok: 'Đã gửi! Tôi sẽ phản hồi sớm nhất có thể.',
      error: 'Gửi không thành công. Bạn có thể email trực tiếp:',
    },
    detail: {
      all: '← Tất cả dự án',
      live: 'Xem live demo',
      source: 'Source code',
      notFound: 'Không tìm thấy dự án',
      home: '← Về trang chủ',
    },
    footer: { built: 'Xây bằng React, Three.js & Node.js' },
  },
  en: {
    nav: {
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
      cta: 'Get in touch',
    },
    hero: {
      greeting: "Hi, I'm",
      viewProjects: 'View projects',
      contact: 'Contact',
      scrollDown: 'Scroll down',
    },
    about: { kicker: 'About', title: 'About me' },
    skills: {
      kicker: 'Skills',
      title: 'What I can do',
      groups: { frontend: 'Frontend', backend: 'Backend', tools: 'Tools & Others' },
    },
    projects: { kicker: 'Projects', title: 'Things I have built', featured: 'Featured' },
    contact: {
      kicker: 'Contact',
      title: 'Let’s build something fun?',
      blurb: 'Got an idea, a collaboration, or just want to say hi — drop me a message.',
      name: 'Your name',
      email: 'Email',
      message: 'Your message...',
      send: 'Send message',
      sending: 'Sending...',
      ok: 'Sent! I will get back to you as soon as possible.',
      error: 'Something went wrong. You can email me directly:',
    },
    detail: {
      all: '← All projects',
      live: 'Live demo',
      source: 'Source code',
      notFound: 'Project not found',
      home: '← Back to home',
    },
    footer: { built: 'Built with React, Three.js & Node.js' },
  },
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() =>
    localStorage.getItem('portfolio-lang') === 'en' ? 'en' : 'vi',
  )

  useEffect(() => {
    localStorage.setItem('portfolio-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggle = () => setLang((l) => (l === 'vi' ? 'en' : 'vi'))

  const t = (path) => {
    const get = (obj) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)
    return get(dict[lang]) ?? get(dict.vi) ?? path
  }

  return <LangContext.Provider value={{ lang, toggle, t }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
