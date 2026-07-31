import type { NavigationItem } from '@shared/interfaces/navigation-item';

export type LocalizedText = Readonly<{
  en: string;
  es: string;
}>;

export const uiText = {
  actions: {
    cancel: { en: 'Cancel', es: 'Cancelar' },
    confirm: { en: 'Confirm', es: 'Confirmar' },
    login: { en: 'Login', es: 'Iniciar sesión' },
    loggingIn: { en: 'Signing in...', es: 'Ingresando...' },
    logout: { en: 'Log Out', es: 'Cerrar sesión' },
    save: { en: 'Save', es: 'Guardar' },
    saving: { en: 'Saving...', es: 'Guardando...' },
    send: { en: 'Send', es: 'Enviar' },
    sending: { en: 'Sending...', es: 'Enviando...' },
  },
  common: {
    loading: { en: 'Loading...', es: 'Cargando...' },
    retry: { en: 'Try again', es: 'Intentar nuevamente' },
  },
  contact: {
    title: { en: 'Contact me', es: 'Contáctame' },
    nameLabel: { en: 'Name', es: 'Nombre' },
    emailLabel: { en: 'Email', es: 'Correo electrónico' },
    messageLabel: { en: 'Message', es: 'Mensaje' },
    nameRequired: { en: 'The name is required', es: 'El nombre es requerido' },
    nameMinLength: {
      en: 'The name must contain at least 2 characters',
      es: 'El nombre debe contener al menos 2 caracteres',
    },
    nameMaxLength: {
      en: 'The name cannot exceed 100 characters',
      es: 'El nombre no puede superar los 100 caracteres',
    },
    emailRequired: { en: 'The email is required', es: 'El correo es requerido' },
    emailInvalid: { en: 'Enter a valid email', es: 'Ingresa un correo válido' },
    emailMaxLength: {
      en: 'The email cannot exceed 254 characters',
      es: 'El correo no puede superar los 254 caracteres',
    },
    messageRequired: { en: 'The message is required', es: 'El mensaje es requerido' },
    messageMinLength: {
      en: 'The message must contain at least 5 characters',
      es: 'El mensaje debe contener al menos 5 caracteres',
    },
    messageMaxLength: {
      en: 'The message cannot exceed 500 characters',
      es: 'El mensaje no puede superar los 500 caracteres',
    },
  },
  portfolio: {
    viewCv: { en: 'Show CV', es: 'Visualizar CV' },
    profilePhotoAltPrefix: { en: 'Photo of', es: 'Foto de' },
    primaryNavigation: { en: 'Primary navigation', es: 'Navegación principal' },
    footerNavigation: { en: 'Footer navigation', es: 'Navegación del pie de página' },
    socialMediaLinks: { en: 'Social media links', es: 'Enlaces a redes sociales' },
    toggleNavigation: { en: 'Toggle navigation', es: 'Alternar navegación' },
    openSocialPrefix: { en: 'Open', es: 'Abrir' },
    socialNetworksMessage: {
      en: 'You can contact me through my social networks.',
      es: 'Puedes contactarme a través de mis redes sociales.',
    },
    project: {
      technologies: { en: 'Project technologies', es: 'Tecnologías del proyecto' },
      openImage: { en: 'Open image of', es: 'Abrir imagen de' },
      previousImage: { en: 'Previous image', es: 'Imagen anterior' },
      nextImage: { en: 'Next image', es: 'Imagen siguiente' },
      of: { en: 'of', es: 'de' },
      closeDetails: { en: 'Close project details', es: 'Cerrar detalles del proyecto' },
      viewDetails: { en: 'View details', es: 'Ver detalles' },
      visitSite: { en: 'Visit site', es: 'Visitar sitio' },
      sourceCode: { en: 'Source code', es: 'Código fuente' },
      frontendCode: { en: 'Frontend code', es: 'Código frontend' },
      backendCode: { en: 'Backend code', es: 'Código backend' },
      linkFor: { en: 'for', es: 'de' },
    },
    course: {
      viewCertificate: { en: 'View certificate', es: 'Ver certificado' },
      certificateFor: { en: 'Certificate for', es: 'Certificado de' },
      viewMore: { en: 'View more', es: 'Ver más' },
    },
    rightsReserved: { en: 'All rights reserved.', es: 'Todos los derechos reservados.' },
    sections: {
      home: { en: 'Home', es: 'Inicio' },
      education: { en: 'Education', es: 'Educación' },
      skills: { en: 'Skills', es: 'Habilidades' },
      portfolio: { en: 'Portfolio', es: 'Portafolio' },
      courses: { en: 'Courses & Certificates', es: 'Cursos y Certificados' },
      contact: { en: 'Contact', es: 'Contacto' },
      login: { en: 'Login', es: 'Iniciar sesión' },
    },
    emptyRecords: { en: 'There are no records yet.', es: 'Todavía no hay registros.' },
  },
} as const;

export const portfolioNavigationItems: readonly NavigationItem[] = [
  {
    label: uiText.portfolio.sections.home.en,
    label_es: uiText.portfolio.sections.home.es,
    routerLink: '#home',
  },
  {
    label: uiText.portfolio.sections.education.en,
    label_es: uiText.portfolio.sections.education.es,
    routerLink: '#education',
  },
  {
    label: uiText.portfolio.sections.skills.en,
    label_es: uiText.portfolio.sections.skills.es,
    routerLink: '#skills',
  },
  {
    label: uiText.portfolio.sections.portfolio.en,
    label_es: uiText.portfolio.sections.portfolio.es,
    routerLink: '#portfolio',
  },
  {
    label: uiText.portfolio.sections.courses.en,
    label_es: uiText.portfolio.sections.courses.es,
    routerLink: '#certificates',
  },
  {
    label: uiText.portfolio.sections.contact.en,
    label_es: uiText.portfolio.sections.contact.es,
    routerLink: '',
  },
  {
    label: uiText.portfolio.sections.login.en,
    label_es: uiText.portfolio.sections.login.es,
    routerLink: '/login',
  },
] as const;
