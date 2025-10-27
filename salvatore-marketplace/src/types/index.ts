export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  location?: string;
  bio?: string;
  createdAt: Date;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: {
    city: string;
    subCity: string;
  };
  condition: "New" | "Used";
  images: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  featured?: boolean;
  // Dynamic fields based on category
  fuelType?: "Gasoline" | "Diesel" | "Electric";
  transmission?: "Manual" | "Automatic";
  kilometers?: number;
  year?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  forSale?: boolean;
  brand?: string;
  storage?: string;
  accessories?: string[];
  model?: string;
  warranty?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read?: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: string[];
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  subCity?: string;
  condition?: "New" | "Used";
  [key: string]: any;
}
