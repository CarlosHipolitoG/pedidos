export type EventCategory = "Cumpleaños" | "Boda" | "Corporativo" | "Festival" | "QuinceAños" | "Aniversario" | "Graduación" | "Anchetas y Regalos" | "Tortas Personalizadas";

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
