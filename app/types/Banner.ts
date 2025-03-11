import { ISponsor, SponsorBanner } from "./sponsor"

export enum backgroundType {
  solid = "solid",
  gradient = "gradient",
  image = "image"
}

export enum AnimationType {
  fadeIn = "fadeIn",
  slideIn = "slideIn",
  zoomIn = "zoomIn",
  bounceIn = "bounceIn",
  rotateIn = "rotateIn",
  slideUp = "slideUp",
  slideDown = "slideDown",
  flipIn = "flipIn",
  expandIn = "expandIn",
  blurIn = "blurIn",
  flipCard = "flipCard"
}

export enum EasingType {
  linear = "linear",
  easeOut = "easeOut",
  easeIn = "easeIn",
  easeInOut = "easeInOut",
  circIn = "circIn",
  circOut = "circOut",
  circInOut = "circInOut",
  backIn = "backIn",
  backOut = "backOut",
  backInOut = "backInOut",
  anticipate = "anticipate",
  bounce = "bounce"
}

export enum FieldAnimationType {
  none = "none",
  fadeIn = "fadeIn",
  slideIn = "slideIn",
  typewriter = "typewriter",
  scaleIn = "scaleIn",
  blurIn = "blurIn",
  flipIn = "flipIn",
  bounceIn = "bounceIn",
  zoomIn = "zoomIn"
}

export enum LowerThirdDesign {
  classic = "classic",
  modern = "modern",
  minimal = "minimal",
  elegant = "elegant",
  playful = "playful",
  sports = "sports",
  contact = "contact",
  flipCard = "flipCard"
}

export enum GradientType {
  linear = "linear",
  radial = "radial",
  conic = "conic"
}

export enum BlendMode {
  normal = "normal",
  multiply = "multiply",
  screen = "screen",
  overlay = "overlay",
  darken = "darken",
  lighten = "lighten",
  colorDodge = "colorDodge",
  colorBurn = "colorBurn",
  hardLight = "hardLight",
  softLight = "softLight",
  difference = "difference",  
  exclusion = "exclusion"
}


export interface GradientStop {
  color: string
  position: number // 0-100
}

export interface GradientSettings {
  type: GradientType
  angle: number
  stops: GradientStop[]
}

export interface FontSettings {
  family: string
  weight: string
  letterSpacing: string
  lineHeight: string
  useGradient: boolean
  textGradient?: GradientSettings
}

// Añadir la nueva interfaz FieldStyleConfig después de FontSettings
export interface FieldStyleConfig {
  color?: string
  useGradient?: boolean
  gradient?: GradientSettings
  fontWeight?: string
  fontSize?: string
}

// Nuevo tipo para almacenar configuraciones de animación por campo
export interface FieldAnimationConfig {
  type: FieldAnimationType
  duration: number
  delay: number
  easing: EasingType
}

export interface DefaultConfingFields {
  type: FieldAnimationType
  duration: number
  staggerAmount: number
}

export interface FieldAnimation {
  enabled: boolean
  // Nuevo: mapa de configuraciones por campo
  perFieldConfig: Record<keyof SponsorBanner, FieldAnimationConfig>
  // Configuración global (se usa cuando no hay configuración específica)
  defaultConfig: DefaultConfingFields
}

export interface AnimationSettings {
  type: AnimationType
  duration: number
  delay: number
  easing: EasingType
  staggered: boolean
  staggerAmount: number
  fieldAnimations: FieldAnimation
}

export interface StyleSettings {
  design: LowerThirdDesign
  backgroundType: backgroundType
  backgroundColor: string
  // Enhanced gradient settings
  gradient?: GradientSettings
  image?: string
  gradientColor?: string // Kept for backward compatibility
  textColor: string
  fontFamily: string
  fontSize: string
  // Enhanced typography settings
  typography: FontSettings
  // New: field-specific styles
  fieldStyles?: Record<keyof SponsorBanner, FieldStyleConfig>
}

export interface IBannerSettings {
  _id: string
  name: string
  displayFields: (keyof SponsorBanner)[]
  animationSettings: AnimationSettings
  styleSettings: StyleSettings
  isTemplate: boolean
  organizationId: string;
}

export interface IBanner {
  _id: string;
  description: string;
  name: string;
  bannerSettingsId: string | IBannerSettings;
  organizationId: string;
  userId: string;
  sponsorId: string | ISponsor;
  isVisible: boolean;
  position: { x: number, y: number };
  createdAt: string;
  updatedAt: string;
}

export interface IBannerManager {
  _id: string;
  name: string;
  bannerId: string;
  organizationId: string;
  userId: string;
  isVisible: boolean;
  sequential: number;
  position: { x: number, y: number };
}

//para controlar el tema de los bannerSetting para compartir se va tenner bannerSetting como template, literalmente tienen un campos isTeamplate, y se va tener un boton en el panel de control para hacer de esa configuracion una template