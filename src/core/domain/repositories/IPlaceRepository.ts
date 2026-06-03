import type { Place } from "../entities/Place";

export interface IPlaceRepository {
  getPlaces(): Promise<Place[]>;
  getPlaceById(id: string): Promise<Place | null>;
}
