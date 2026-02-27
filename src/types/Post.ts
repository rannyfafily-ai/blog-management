export interface Post {
  objectId?: string;
  title: string;
  author?: string;
  content: string;
  publishedDate: any;

  // Backendless fields
  created?: number;
  updated?: number;
}