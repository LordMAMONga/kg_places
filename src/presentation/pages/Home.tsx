import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Map as MapIcon, Grid, Bookmark } from "lucide-react";
import type { Place } from "../../core/domain/entities/Place";
import { PlaceRepositoryImpl } from "../../core/data/repositories/PlaceRepositoryImpl";
import { GetPlacesUseCase } from "../../core/domain/useCases/GetPlacesUseCase";
import { Map } from "../components/Map";

const placeRepository = new PlaceRepositoryImpl();
const getPlacesUseCase = new GetPlacesUseCase(placeRepository);

export function Home() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeDanger, setActiveDanger] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Состояние для Избранного (читаем из localStorage при первой загрузке)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("tainy-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Сохраняем в localStorage при каждом изменении избранного
  useEffect(() => {
    localStorage.setItem("tainy-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    getPlacesUseCase.execute().then((data) => {
      setPlaces(data);
      setLoading(false);
    });
  }, []);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesSearch = place.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDanger = activeDanger
        ? place.dangerLevel === activeDanger
        : true;
      return matchesSearch && matchesDanger;
    });
  }, [places, searchQuery, activeDanger]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Чтобы клик по закладке не перекидывал на другую страницу
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 uppercase tracking-tight drop-shadow-lg">
            Архив мест посещения
          </h1>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по легендам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <Filter className="text-slate-400 w-5 h-5 mr-2 shrink-0" />
                {["low", "medium", "high"].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setActiveDanger(activeDanger === level ? null : level)
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border shrink-0 ${
                      activeDanger === level
                        ? "bg-amber-500 text-slate-950 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                        : "bg-slate-950/50 text-slate-400 border-slate-700 hover:border-amber-500/50 hover:text-amber-400"
                    }`}
                  >
                    {level === "low"
                      ? "Местный миф"
                      : level === "medium"
                        ? "Есть свидетели"
                        : "Необъяснимо наукой"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 ml-auto">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider hidden lg:block">
                  Найдено:{" "}
                  <span className="text-amber-500">
                    {filteredPlaces.length}
                  </span>
                </span>
                <div className="flex items-center bg-slate-950/80 rounded-xl p-1 border border-slate-700">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg flex items-center gap-2 transition-colors ${viewMode === "grid" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-amber-400"}`}
                  >
                    <Grid className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider hidden md:block">
                      Свиток
                    </span>
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-2 rounded-lg flex items-center gap-2 transition-colors ${viewMode === "map" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-amber-400"}`}
                  >
                    <MapIcon className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider hidden md:block">
                      Карта
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredPlaces.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400"
                >
                  <Search className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-serif text-xl">
                    Тайны скрыты туманом. Попробуйте другой запрос.
                  </p>
                </motion.div>
              ) : (
                filteredPlaces.map((place) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={place.id}
                    className="group bg-slate-900/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all flex flex-col relative"
                  >
                    {/* Кнопка добавления в избранное */}
                    <button
                      onClick={(e) => toggleFavorite(e, place.id)}
                      className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700 hover:bg-slate-900 hover:border-amber-500 transition-all group/btn"
                    >
                      <Bookmark
                        className={`w-4 h-4 transition-colors ${
                          favorites.includes(place.id)
                            ? "fill-amber-500 text-amber-500"
                            : "text-slate-400 group-hover/btn:text-amber-400"
                        }`}
                      />
                    </button>

                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/20 to-transparent z-20 pointer-events-none" />

                    <div className="h-48 bg-slate-800 overflow-hidden relative border-b border-amber-900/30">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
                      <img
                        src={place.images[0]}
                        alt={place.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 saturate-50 group-hover:saturate-100"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow relative z-20 -mt-6">
                      <h2 className="text-xl font-serif font-bold mb-2 text-white group-hover:text-amber-400 transition-colors drop-shadow-md line-clamp-2">
                        {place.title}
                      </h2>

                      <div className="flex items-center gap-2 mb-4 opacity-50">
                        <div className="h-px bg-amber-500 flex-grow" />
                        <div className="w-2 h-2 rotate-45 bg-amber-500" />
                        <div className="h-px bg-amber-500 flex-grow" />
                      </div>

                      <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-grow font-light line-clamp-3">
                        {place.shortDescription}
                      </p>

                      <div className="flex justify-between items-center mt-auto">
                        <span
                          className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${
                            place.dangerLevel === "high"
                              ? "bg-red-950/50 text-red-400 border-red-900"
                              : place.dangerLevel === "medium"
                                ? "bg-orange-950/50 text-orange-400 border-orange-900"
                                : "bg-emerald-950/50 text-emerald-400 border-emerald-900"
                          }`}
                        >
                          {place.dangerLevel === "high"
                            ? "Необъяснимо наукой"
                            : place.dangerLevel === "medium"
                              ? "Есть свидетели"
                              : "Местный миф"}
                        </span>
                        <Link
                          to={`/place/${place.id}`}
                          className="text-amber-500 hover:text-amber-400 text-sm font-medium uppercase tracking-widest flex items-center gap-1"
                        >
                          Путь <span className="text-lg">→</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Map places={filteredPlaces} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
