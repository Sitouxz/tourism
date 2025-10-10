export type Category = 'tourism' | 'culinary' | 'hotel' | 'event';

export type BaseItem = {
  id: string;
  category: Category;
  name: string;
  district: string;
  rating: number;
  description: string;
  latitude: number;
  longitude: number;
  image: string;
  priceRange?: string;
  operatingHours?: string;
};

export type EventItem = BaseItem & {
  startDate?: string;
  endDate?: string;
  venue?: string;
};

export type TourismItem = BaseItem & {
  admissionFee?: string;
};

export type CulinaryItem = BaseItem & {
  cuisineType?: string;
  priceRange: string;
};

export type HotelItem = BaseItem & {
  starRating?: number;
  priceRange: string;
  amenities?: string[];
};

export type Item = TourismItem | CulinaryItem | HotelItem | EventItem;

export type FilterOptions = {
  district?: string;
  minRating?: number;
  priceRange?: string;
};

export type FavoriteItem = {
  id: string;
  category: Category;
  addedAt: string;
};

export type AdminAuth = {
  isAuthenticated: boolean;
  pin: string;
};

export type LocalEdit = {
  id: string;
  action: 'create' | 'update' | 'delete';
  data?: Item;
  timestamp: string;
};

