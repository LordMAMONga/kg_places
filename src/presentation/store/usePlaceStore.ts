import { create } from "zustand";
import { PlaceRepositoryImpl } from "../../core/data/repositories/PlaceRepositoryImpl";
import { GetPlaceByIdUseCase } from "../../core/domain/useCases/GetPlaceByIdUseCase";
import type { Place } from "../../core/domain/entities/Place";

const repository = new PlaceRepositoryImpl();
const getPlaceByIdUseCase = new GetPlaceByIdUseCase(repository);

interface PlaceState {
  selectedPlace: Place | null;
  isLoading: boolean;
  loadPlace: (id: string) => Promise<void>;
}

export const usePlaceStore = create<PlaceState>((set) => ({
  selectedPlace: null,
  isLoading: true,

  loadPlace: async (id: string) => {
    set({ isLoading: true });
    const place = await getPlaceByIdUseCase.execute(id);
    set({ selectedPlace: place, isLoading: false });
  },
}));
