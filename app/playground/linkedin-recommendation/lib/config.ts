export const LINKEDIN_RECOMMENDATION_CONFIG = {
  // Configuración de la API
  apiUrl: process.env.FLASK_API_URL || 'http://localhost:5000',
  
  // Configuración de la aplicación
  app: {
    name: 'LinkedIn Recommendation Generator',
    description: 'Genera recomendaciones personalizadas de LinkedIn en segundos utilizando IA',
    version: '1.0.0',
  },
  
  // Configuración de la IA
  ai: {
    model: 'gpt-4',
    minCharacters: 350,
    maxCharacters: 450,
  },
  
  // Opciones de tono
  tones: {
    flores: {
      label: 'Profesional',
      description: 'Tono formal y profesional',
    },
    medio: {
      label: 'Equilibrado',
      description: 'Tono balanceado con áreas de mejora',
    },
    chili: {
      label: 'Humorístico',
      description: 'Tono divertido y amistoso',
    },
  },
  
  // Idiomas soportados
  languages: {
    es: {
      label: 'Español',
      flag: '🇪🇸',
    },
    en: {
      label: 'English',
      flag: '🇺🇸',
    },
  },
} 