import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Compass } from "lucide-react";
import type { Place } from "../../core/domain/entities/Place";
import { PlaceRepositoryImpl } from "../../core/data/repositories/PlaceRepositoryImpl";

const placeRepository = new PlaceRepositoryImpl();

export function Favorites() {
  const [favoritePlaces, setFavoritePlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Читаем ID сохраненных мест из localStorage
    const savedIds = JSON.parse(
      localStorage.getItem("tainy-favorites") || "[]",
    );

    if (savedIds.length === 0) {
      setLoading(false);
      return;
    }

    // Загружаем все места и фильтруем только нужные
    placeRepository.getPlaces().then((allPlaces) => {
      const filtered = allPlaces.filter((place) => savedIds.includes(place.id));
      setFavoritePlaces(filtered);
      setLoading(false);
    });
  }, []);

  const removeFromFavorites = (id: string) => {
    const newFavorites = favoritePlaces.filter((place) => place.id !== id);
    setFavoritePlaces(newFavorites);
    const updatedIds = newFavorites.map((p) => p.id);
    localStorage.setItem("tainy-favorites", JSON.stringify(updatedIds));
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-[80vh]">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 uppercase tracking-tight drop-shadow-lg">
        Мои экспедиции
      </h1>
      <p className="text-slate-400 mb-12 font-serif text-lg">
        Список локаций, которые вы планируете исследовать.
      </p>

      {favoritePlaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
          <Compass className="w-16 h-16 mb-4 opacity-30" />
          <h2 className="text-xl font-bold text-slate-300 mb-2">
            Ваш список пуст
          </h2>
          <p className="mb-6">
            Вы еще не добавили ни одной локации для изучения.
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold uppercase tracking-wider rounded-xl transition-all"
          >
            Искать аномалии
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritePlaces.map((place) => (
            <div
              key={place.id}
              className="group bg-slate-900/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)] flex flex-col relative"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFromFavorites(place.id);
                }}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500 hover:bg-slate-900 hover:border-red-500 transition-all group/btn"
                title="Удалить из экспедиций"
              >
                <Bookmark className="w-4 h-4 fill-amber-500 text-amber-500 group-hover/btn:fill-red-500 group-hover/btn:text-red-500 transition-colors" />
              </button>

              <div className="h-40 bg-slate-800 overflow-hidden relative border-b border-amber-900/30">
                <img
                  src={place.images[0]}
                  alt={place.title}
                  className="w-full h-full object-cover saturate-50"
                />
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-serif font-bold mb-3 text-white line-clamp-1">
                  {place.title}
                </h2>
                <div className="flex justify-between items-center mt-auto">
                  <span className="px-2 py-1 bg-amber-950/50 text-amber-400 border border-amber-900 rounded-sm text-[10px] font-bold uppercase tracking-wider">
                    В планах
                  </span>
                  <Link
                    to={`/place/${place.id}`}
                    className="text-amber-500 hover:text-amber-400 text-sm font-bold uppercase tracking-widest flex items-center gap-1"
                  >
                    Детали <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
