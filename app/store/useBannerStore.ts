import { create } from 'zustand';
import {
  AnimationType,
  backgroundType,
  EasingType,
  FieldAnimationConfig,
  FieldAnimationType,
  FieldStyleConfig,
  GradientStop,
  GradientType,
  IBanner,
  IBannerSettings,
  LowerThirdDesign,
} from '../types/Banner';
import { ISponsor, SponsorBanner } from '../types/sponsor';
import {
  createBanner,
  findByOrganizationId,
  findSettingTemplate,
  getById,
  toggleVisibility,
  update,
  updatePosition,
  updateSettings,
  updateSponsor,
} from '../service/banner.service';
import { useSponsorStore } from './useSponsor';

const defaultFieldAnimations: Record<keyof SponsorBanner, FieldAnimationConfig> = {
  name: { type: FieldAnimationType.fadeIn, duration: 0.3, delay: 0, easing: EasingType.easeOut },
  logo: { type: FieldAnimationType.zoomIn, duration: 0.4, delay: 0.1, easing: EasingType.backOut },
  link: { type: FieldAnimationType.slideIn, duration: 0.3, delay: 0.2, easing: EasingType.easeOut },
  ad: { type: FieldAnimationType.typewriter, duration: 0.5, delay: 0.3, easing: EasingType.easeInOut },
  phone: { type: FieldAnimationType.bounceIn, duration: 0.4, delay: 0.2, easing: EasingType.bounce },
  address: { type: FieldAnimationType.blurIn, duration: 0.4, delay: 0.3, easing: EasingType.easeOut },
  owner: { type: FieldAnimationType.flipIn, duration: 0.5, delay: 0.2, easing: EasingType.backOut },
  email: { type: FieldAnimationType.scaleIn, duration: 0.3, delay: 0.1, easing: EasingType.easeOut },
};

const defaultGradientStops: GradientStop[] = [
  { color: '#3b82f6', position: 0 },
  { color: '#1e40af', position: 100 },
];

export const defaultFieldStyles: Record<keyof SponsorBanner, FieldStyleConfig> = {
  name: { fontSize: '18px', fontWeight: '600' },
  logo: { fontSize: '16px', fontWeight: '600' },
  link: { fontSize: '14px', color: '#0066cc' },
  ad: { fontSize: '16px', fontWeight: '500' },
  phone: { fontSize: '14px', fontWeight: '600' },
  address: { fontSize: '14px', fontWeight: '600' },
  owner: { fontSize: '16px', fontWeight: '500' },
  email: { fontSize: '14px', fontWeight: '600' },
};

const __initialBannerSettings__: IBannerSettings = {
  isTemplate: false,
  organizationId: '',
  name: 'Basica',
  _id: '',
  displayFields: ['name', 'email'],
  animationSettings: {
    type: AnimationType.flipIn, // Cambiado a flipIn para mejor efecto 3D
    duration: 0.5,
    delay: 0,
    easing: EasingType.easeOut,
    staggered: false,
    staggerAmount: 0.1,
    fieldAnimations: {
      enabled: true,
      perFieldConfig: defaultFieldAnimations,
      defaultConfig: {
        type: FieldAnimationType.fadeIn,
        duration: 0.3,
        staggerAmount: 0.1,
      },
    },
  },
  styleSettings: {
    design: LowerThirdDesign.classic, // Cambiado a flipCard como diseño predeterminado
    backgroundType: backgroundType.gradient,
    backgroundColor: '#3b82f6',
    gradientColor: '#1e40af', // Kept for backward compatibility
    // New enhanced gradient settings
    gradient: {
      type: GradientType.linear,
      angle: 135,
      stops: defaultGradientStops,
    },
    textColor: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '16px',
    // New enhanced typography settings
    typography: {
      family: "'Poppins', sans-serif",
      weight: '500',
      letterSpacing: 'normal',
      lineHeight: '1.5',
      useGradient: false,
    },
    fieldStyles: defaultFieldStyles,
  },
};

const initialBanner: IBanner = {
  _id: '',
  name: 'Basica',
  bannerSettingsId: __initialBannerSettings__,
  isVisible: false,
  position: { x: 50, y: 50 },
  organizationId: '',
  userId: '',
  sponsorId: '',
  updatedAt: '',
  createdAt: '',
  description: '',
};

interface IBannerStore {
  bannerSelected: IBanner;
  banners: IBanner[];
  bannerSettings: IBannerSettings[];
  updateSettings: (settings: IBannerSettings) => Promise<void>;
  updateSponsor: (sponsorId: string) => Promise<void>;
  updatePosition: (newPosition: { x: number; y: number }) => Promise<void>;
  toggleVisibility: (isSaved: boolean) => Promise<void>;
  createBanner: (banner: Partial<IBanner>) => Promise<void>;
  updateBanner: (banner: Partial<IBanner>) => Promise<void>;
  getById: (id: string) => Promise<void>;
  findByOrganizationId: (organizationId: string) => Promise<IBanner[]>;
  findSettingTemplate: (organizationId: string) => Promise<void>;
  setSelectedBanner: (banner: IBanner) => void;
}

export const useBannerStore = create<IBannerStore>((set, get) => ({
  bannerSelected: initialBanner,
  banners: [],
  bannerSettings: [],
  setSelectedBanner: (banner) => {
    set((state) => ({
      ...state,
      bannerSelected: banner,
    }));
  },
  updateSettings: async (settings) => {
    const { bannerSelected } = get();

    set((state) => ({
      ...state,
      bannerSelected: {
        ...bannerSelected,
        bannerSettingsId: settings,
      },
    }));

    await updateSettings(settings._id, settings);
  },
  updateSponsor: async (sponsorId) => {
    const { bannerSelected } = get();
    const { sponsors } = useSponsorStore.getState();

    const sponsor = sponsors.find((s) => s._id === sponsorId) as ISponsor

    set((state) => ({
      ...state,
      bannerSelected: { ...bannerSelected, sponsorId:sponsor },
    }));

    await updateSponsor(bannerSelected._id, sponsorId);
  },
  updatePosition: async (newPosition) => {
    const { bannerSelected } = get();

    set((state) => ({
      ...state,
      bannerSelected: { ...bannerSelected, position: newPosition },
    }));

    await updatePosition(bannerSelected._id, newPosition.x, newPosition.y);
  },
  toggleVisibility: async (isSaved) => {
    const { bannerSelected } = get();

    const { _id, isVisible } = bannerSelected;

    set((state) => ({
      ...state,
      bannerSelected: { ...bannerSelected, isVisible: !isVisible },
    }));

    if (isSaved) {
      await toggleVisibility(_id, !isVisible);
      
    }
  },
  createBanner: async (banner) => {
    const { banners } = get();

    delete banner._id;

    const newBanner = await createBanner(banner);

    set((state) => ({
      ...state,
      banners: [...banners, newBanner],
    }));
  },
  updateBanner: async (banner) => {
    const { bannerSelected } = get();

    const updatedBanner = await update(bannerSelected._id, banner);

    set((state) => ({
      ...state,
      bannerSelected: updatedBanner,
      banners: state.banners.map((b) => (b._id === updatedBanner._id ? updatedBanner : b)),
    }));
  },
  getById: async (id) => {
    const banner = await getById(id);

    set((state) => ({
      ...state,
      bannerSelected: banner,
    }));
  },
  findByOrganizationId: async (organizationId) => {
    const banners = await findByOrganizationId(organizationId);

    set((state) => ({
      ...state,
      banners: banners,
    }));
    
    return banners;
  },

  findSettingTemplate: async (organizationId) => {
    const bannerSettings = await findSettingTemplate(organizationId);

    set((state) => ({
      ...state,
      bannerSettings: bannerSettings,
    }));
  },

}));
