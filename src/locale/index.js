import { createI18n } from 'vue-i18n'
import en from './en-US'
import cn from './zh-CN'

const defaultLocale = 'zh'

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'en',
  allowComposition: true,
  messages: {
    'en': en,
    'zh': cn,
  },
})

export default i18n
