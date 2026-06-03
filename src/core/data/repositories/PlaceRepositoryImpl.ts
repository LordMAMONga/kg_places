import type { IPlaceRepository } from "../../domain/repositories/IPlaceRepository";
import type { Place } from "../../domain/entities/Place";
import { mockPlaces } from "../mock/mockPlaces";

export class PlaceRepositoryImpl implements IPlaceRepository {
  async getPlaces(): Promise<Place[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPlaces), 500);
    });
  }

  async getPlaceById(id: string): Promise<Place | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const place = mockPlaces.find((p) => p.id === id) || null;
        resolve(place);
      }, 500);
    });
  }
}
