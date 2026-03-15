import { useEffect } from 'react';
import { useOverlayStore } from '../store/useOverlayStore';
import { SportCategory } from '../types/overlay';

export const useOverlayTypes = (sport?: SportCategory) => {
  const {
    overlayTypes,
    loading,
    error,
    loadOverlayTypes,
    createOverlayType,
    updateOverlayType,
    deleteOverlayType,
    clearError,
  } = useOverlayStore();

  // Load overlay types when sport changes
  useEffect(() => {
    loadOverlayTypes(sport);
  }, [sport, loadOverlayTypes]);

  // Filter types by sport if specified
  const filteredTypes = sport 
    ? overlayTypes.filter(type => type.category === sport)
    : overlayTypes;

  return {
    overlayTypes: filteredTypes,
    allOverlayTypes: overlayTypes,
    loading,
    error,
    refetch: () => loadOverlayTypes(sport),
    clearError,
    
    // CRUD operations
    createOverlayType,
    updateOverlayType,
    deleteOverlayType,
  };
};

export const useOverlayDesigns = (overlayTypeId?: string) => {
  const { overlayTypes } = useOverlayStore();

  if (!overlayTypeId) {
    return {
      designs: [],
      loading: false,
      error: null,
    };
  }

  const overlayType = overlayTypes.find(type => type._id === overlayTypeId);
  
  return {
    designs: overlayType?.availableDesigns || [],
    loading: false,
    error: null,
    overlayType,
  };
};