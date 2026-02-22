export interface Product {
  id: string;
  name: string;
  description: string;
  link: string;
  image: string;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
  url: string;
}

export interface Brochure {
  id: string;
  title: string;
  description: string;
  fileSize: number; // Size in bytes
  lastUpdated: Date;
  downloadUrl: string;
  downloadCount: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  dateSubmitted: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
