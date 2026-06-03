import type { IPlaceRepository } from "../repositories/IPlaceRepository";
import type { Place } from "../entities/Place";

export class GetPlaceByIdUseCase {
  private repository: IPlaceRepository;

  constructor(repository: IPlaceRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Place | null> {
    return await this.repository.getPlaceById(id);
  }
}
