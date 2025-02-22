import { create } from 'zustand';
import { getSponsorsByOrganizationIdService } from '../service/organization.service';
import {
  createSponsorServices,
  deleteSponsorServices,
  getSponsorByIdServices,
  restoreSponsorServices,
  updateSponsorServices,
} from '../service/sponsor.service';
import { ISponsor } from '../types/sponsor';

type SponsorState = {
  sponsors: ISponsor[];
  currentSponsor: ISponsor | null;
  setCurrentSponsor: (sponsor: ISponsor) => void;
  getSponsorsByOrganizationId: (id: string) => Promise<ISponsor[]>;
  getSponsorById: (id: string) => Promise<void>;
  createSponsor: (sponsor: Partial<ISponsor>) => Promise<ISponsor>;
  updateSponsor: (id: string, sponsor: Partial<ISponsor>) => Promise<void>;
  deleteSponsor: (id: string) => Promise<void>;
  restoreSponsor: (id: string) => Promise<void>;
};

export const useSponsorStore = create<SponsorState>((set, get) => ({
  sponsors: [],
  currentSponsor: null,

  // Actions
  setCurrentSponsor: (sponsor) => set({ currentSponsor: sponsor }),

  getSponsorsByOrganizationId: async (id) => {
    const sponsors = (await getSponsorsByOrganizationIdService(id)) as ISponsor[];
    set({ sponsors: sponsors.filter((sponsor) => !sponsor.deleted_at) });

    return sponsors;
  },

  getSponsorById: async (id) => {
    const sponsor = await getSponsorByIdServices(id);
    set({ currentSponsor: sponsor });
  },

  createSponsor: async (sponsor) => {

    delete sponsor._id;
    const newSponsor = await createSponsorServices(sponsor);

    const { sponsors } = get();

    set({ sponsors: [...sponsors, newSponsor] });
    return newSponsor;
  },

  updateSponsor: async (id, sponsor) => {
    let sponsorUpdate = await updateSponsorServices(id, sponsor);

    set((state) => ({
      sponsors: state.sponsors.map((sponsor) =>
        sponsor._id === sponsor._id ? { ...sponsorUpdate } : sponsor
      )
    }));
  },

  deleteSponsor: async (id) => {
    await deleteSponsorServices(id);
    set((state) => ({
      sponsors: state.sponsors.filter((sponsor) => sponsor._id !== id)
    }));
  },

  restoreSponsor: async (id) => {
    await restoreSponsorServices(id);
    set({ currentSponsor: null });
  },
}));
