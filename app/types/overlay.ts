export enum SportCategory {
  Baseball = "baseball",
  Football = "football",
}

export interface IOverlayType {
  _id: string;
  name: string;
  displayName: string;
  category: SportCategory;
  description?: string;
  defaultConfig: {
    visible: boolean;
    x: number;
    y: number;
    scale: number;
    design: string;
  };
  availableDesigns: string[];
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOverlay {
  _id: string;
  gameId: string;
  visible: boolean;
  x: number;
  y: number;
  scale: number;
  design: string;
  customConfig?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  // Populated field
  overlayTypeId?: IOverlayType;
}

export interface IOverlayUpdate {
  visible?: boolean;
  x?: number;
  y?: number;
  scale?: number;
  design?: string;
  customConfig?: Record<string, any>;
}