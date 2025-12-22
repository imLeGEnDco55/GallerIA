export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  category?: string;
  tags?: string[];
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
