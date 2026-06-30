export type Category =
  | "business"
  | "technology"
  | "politics"
  | "sports"
  | "entertainment"
  | "press_release"
  | "lifestyle";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: Category;
  author: string;
  coverImage: string;
  tags: string[];
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  metaTitle: string;
  metaDescription: string;
}
