export type DangerLevel = "low" | "medium" | "high";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  title: string; // Название (например, "Ущелье Сказка")
  shortDescription: string; // Краткое описание для карточки
  fullDescription: string; // Полный текст для отдельной страницы
  coordinates: Coordinates;
  images: string[]; // Массив ссылок на фото
  dangerLevel: DangerLevel; // Уровень труднодоступности/мистики
  myths: string[]; // Легенды
}
