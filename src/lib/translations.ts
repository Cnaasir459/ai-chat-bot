import { useLanguage } from '@/contexts/LanguageContext'

export const translations = {
  en: {
    // Sidebar
    'newChat': 'New Chat',
    'exploreGpts': 'Explore GPTs',
    'settings': 'Settings',
    
    // Input Area
    'typeMessage': 'Type a message...',
    'send': 'Send',
    
    // Explore Modal
    'exploreGptsTitle': 'Explore GPTs',
    'searchGpts': 'Search GPTs...',
    'noGptsFound': 'No GPTs found',
    
    // Settings Modal
    'settingsTitle': 'Settings',
    'speech': 'Speech',
    'mainLanguage': 'Main Language',
    'english': 'English',
    'somali': 'Somali',
    
    // App - Empty States
    'startNewConversation': 'Start a new conversation',
    'noMessagesYet': 'No messages yet',
    'askAnything': 'Ask anything, get your answer',
    
    // General
    'close': 'Close',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'loading': 'Loading...',
    'error': 'Error',
    'retry': 'Retry'
  },
  so: {
    // Sidebar
    'newChat': 'Sheeko Cusub',
    'exploreGpts': 'Sahami GPT-yada',
    'settings': 'Dejinta',
    
    // Input Area
    'typeMessage': 'Qor farriin...',
    'send': 'Dir',
    
    // Explore Modal
    'exploreGptsTitle': 'Sahami GPT-yada',
    'searchGpts': 'Raadi GPT-yo...',
    'noGptsFound': 'GPT laga heli karin',
    
    // Settings Modal
    'settingsTitle': 'Dejinta',
    'speech': 'Hadalka',
    'mainLanguage': 'Luuqada Hore',
    'english': 'Ingiriis',
    'somali': 'Soomaali',
    
    // App - Empty States
    'startNewConversation': 'Bilaal shiraal cusub',
    'noMessagesYet': 'Weli farriin ah',
    'askAnything': 'Wax weydii, jawaab hel',
    
    // General
    'close': 'Xir',
    'cancel': 'Jooji',
    'save': 'Kaydi',
    'delete': 'Tirtir',
    'edit': 'Hagaaji',
    'loading': 'Shidaalayo...',
    'error': 'Khalad',
    'retry': 'Ku celi'
  }
}

export type TranslationKey = keyof typeof translations.en

export const useTranslation = () => {
  const { language } = useLanguage()
  
  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key
  }
  
  return { t, language }
}