export type EventCategory = "Cumpleaños" | "Boda" | "Corporativo" | "Festival" | "Taller" | "Aniversario" | "Beneficencia";

export interface Event {
  id: string;
  title: string;
  description: string;
  images: { url: string; hint: string }[];
  date: string; // ISO string
  category: EventCategory;
  popularity: number; // e.g., 0-100
  location: string;
}
