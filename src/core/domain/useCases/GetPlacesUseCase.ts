import type { IPlaceRepository } from "../repositories/IPlaceRepository";
import type { Place } from "../entities/Place";

export class GetPlacesUseCase {
  private repository: IPlaceRepository;

  constructor(repository: IPlaceRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Place[]> {
    return await this.repository.getPlaces();
  }
}
