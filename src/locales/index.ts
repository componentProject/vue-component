import { createI18n } from 'vue-i18n'
import zh from './lang/zh'
import en from './lang/en'
import es from './lang/es'

const messages = {
  zh,
  en,
  es,
}

const savedLanguage = window.localStorage.getItem('language')
let language = navigator.language.split('-')[0]
if (!savedLanguage && language) {
  window.localStorage.setItem('language', language)
}
language = savedLanguage ? savedLanguage : language
const i18n = createI18n({
  legacy: false,
  locale: language,
  messages,
})

export default i18n
