import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Item, LocalEdit } from '../types';

// Import JSON data
import culinaryData from '../assets/data/culinary.json';
import eventData from '../assets/data/events.json';
import hotelData from '../assets/data/hotels.json';
import tourismData from '../assets/data/tourism.json';

const DATA_KEYS = {
  FAVORITES: 'city_explorer_favorites',
  RECENT: 'city_explorer_recent',
  LOCAL_EDITS: 'city_explorer_local_edits',
  ADMIN_AUTH: 'city_explorer_admin_auth',
} as const;

// Base data from JSON files
const baseData: Record<Category, Item[]> = {
  tourism: tourismData as Item[],
  culinary: culinaryData as Item[],
  hotel: hotelData as Item[],
  event: eventData as Item[],
};

// Load local edits from AsyncStorage and merge with base data
export const loadData = async (): Promise<Record<Category, Item[]>> => {
  try {
    const localEditsJson = await AsyncStorage.getItem(DATA_KEYS.LOCAL_EDITS);
    const localEdits: LocalEdit[] = localEditsJson ? JSON.parse(localEditsJson) : [];
    
    // Apply local edits to base data
    const mergedData = { ...baseData };
    
    localEdits.forEach((edit) => {
      const category = edit.data?.category || getCategoryFromId(edit.id);
      if (!category || !mergedData[category]) return;
      
      switch (edit.action) {
        case 'create':
          if (edit.data) {
            mergedData[category].push(edit.data);
          }
          break;
        case 'update':
          if (edit.data) {
            const index = mergedData[category].findIndex(item => item.id === edit.id);
            if (index !== -1) {
              mergedData[category][index] = edit.data;
            }
          }
          break;
        case 'delete':
          mergedData[category] = mergedData[category].filter(item => item.id !== edit.id);
          break;
      }
    });
    
    return mergedData;
  } catch (error) {
    console.error('Error loading data:', error);
    return baseData;
  }
};

// Helper function to determine category from ID
const getCategoryFromId = (id: string): Category | null => {
  if (id.startsWith('tourism-')) return 'tourism';
  if (id.startsWith('culinary-')) return 'culinary';
  if (id.startsWith('hotel-')) return 'hotel';
  if (id.startsWith('event-')) return 'event';
  return null;
};

// Save local edit to AsyncStorage
export const saveLocalEdit = async (edit: LocalEdit): Promise<void> => {
  try {
    const localEditsJson = await AsyncStorage.getItem(DATA_KEYS.LOCAL_EDITS);
    const localEdits: LocalEdit[] = localEditsJson ? JSON.parse(localEditsJson) : [];
    
    // Remove existing edit for the same ID and add new one
    const filteredEdits = localEdits.filter(existingEdit => existingEdit.id !== edit.id);
    filteredEdits.push(edit);
    
    await AsyncStorage.setItem(DATA_KEYS.LOCAL_EDITS, JSON.stringify(filteredEdits));
  } catch (error) {
    console.error('Error saving local edit:', error);
  }
};

// Clear all local edits (reset to base data)
export const clearLocalEdits = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DATA_KEYS.LOCAL_EDITS);
  } catch (error) {
    console.error('Error clearing local edits:', error);
  }
};

// Favorites management
export const getFavorites = async (): Promise<string[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(DATA_KEYS.FAVORITES);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addFavorite = async (itemId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(itemId)) {
      favorites.push(itemId);
      await AsyncStorage.setItem(DATA_KEYS.FAVORITES, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
};

export const removeFavorite = async (itemId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(id => id !== itemId);
    await AsyncStorage.setItem(DATA_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

export const isFavorite = async (itemId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.includes(itemId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

// Recent items management
export const getRecent = async (): Promise<string[]> => {
  try {
    const recentJson = await AsyncStorage.getItem(DATA_KEYS.RECENT);
    return recentJson ? JSON.parse(recentJson) : [];
  } catch (error) {
    console.error('Error getting recent:', error);
    return [];
  }
};

export const addRecent = async (itemId: string): Promise<void> => {
  try {
    const recent = await getRecent();
    const updatedRecent = [itemId, ...recent.filter(id => id !== itemId)].slice(0, 10);
    await AsyncStorage.setItem(DATA_KEYS.RECENT, JSON.stringify(updatedRecent));
  } catch (error) {
    console.error('Error adding recent:', error);
  }
};

// Admin authentication
export const getAdminAuth = async (): Promise<{ isAuthenticated: boolean; pin: string }> => {
  try {
    const authJson = await AsyncStorage.getItem(DATA_KEYS.ADMIN_AUTH);
    if (authJson) {
      return JSON.parse(authJson);
    }
    return { isAuthenticated: false, pin: '1234' };
  } catch (error) {
    console.error('Error getting admin auth:', error);
    return { isAuthenticated: false, pin: '1234' };
  }
};

export const setAdminAuth = async (isAuthenticated: boolean): Promise<void> => {
  try {
    const auth = await getAdminAuth();
    auth.isAuthenticated = isAuthenticated;
    await AsyncStorage.setItem(DATA_KEYS.ADMIN_AUTH, JSON.stringify(auth));
  } catch (error) {
    console.error('Error setting admin auth:', error);
  }
};

// Clear all app data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      DATA_KEYS.FAVORITES,
      DATA_KEYS.RECENT,
      DATA_KEYS.LOCAL_EDITS,
      DATA_KEYS.ADMIN_AUTH,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

