import { create } from 'zustand';
import { getSponsorsByOrganizationIdService } from '../service/organization.service';
import {
  createSponsorServices,
  deleteSponsorServices,
  getSponsorByIdServices,
  restoreSponsorServices,
  updateSponsorServices,
} from '../service/sponsor.service';
import { User, UserRole } from '../types/user';
import { createStaffServices, deleteStaffServices, getStaffByOrganizationIdServices, getUserByIdServices, restoreStaffServices, updateStaffServices } from '../service/staff.service';

type StaffState = {
  staffs: User[];
  currentStaff: User | null;
  setCurrentStaff: (staff: User) => void;
  getStaffByOrganizationId: (id: string) => Promise<User[]>;
  getStaffById: (id: string) => Promise<void>;
  createStaff: (staff: Partial<User>) => Promise<User>;
  updateStaff: (id: string, staff: Partial<User>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  restoreStaff: (id: string) => Promise<void>;
};

export const useStaffStore = create<StaffState>((set, get) => ({
  staffs: [],
  currentStaff: null,

  // Actions
  setCurrentStaff: (staff) => set({ currentStaff: staff }),

  getStaffByOrganizationId: async (id) => {
    const staffs = (await getStaffByOrganizationIdServices(id)) as User[];
    set({ staffs: staffs.filter((staff) => !staff.deleted_at) });

    return staffs;
  },

  getStaffById: async (id) => {
    const staff = await getUserByIdServices(id);
    set({ currentStaff: staff });
  },

  createStaff: async (staff) => {

    delete staff._id;
    const newStaff = await createStaffServices({...staff, role: UserRole.STAFF});

    const { staffs } = get();

    set({ staffs: [...staffs, newStaff] });

    return newStaff;
  },

  updateStaff: async (id, staff) => {
    let staffUpdate = await updateStaffServices(id, staff);

    set((state) => ({
      staffs: state.staffs.map((staff) =>
        staff._id === staff._id ? { ...staffUpdate } : staff
      )
    }));
  },

  deleteStaff: async (id) => {
    await deleteStaffServices(id);
    set((state) => ({
      staffs: state.staffs.filter((staff) => staff._id !== id)
    }));
  },

  restoreStaff: async (id) => {
    await restoreStaffServices(id);
    set({ currentStaff: null });
  },
}));
