import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Skull,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import type { Place } from "../../core/domain/entities/Place";
// 1. Правильный импорт класса репозитория
import { PlaceRepositoryImpl } from "../../core/data/repositories/PlaceRepositoryImpl";

export function PlaceDetails() {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);

    // 2. Правильное получение данных через метод класса
    const fetchPlace = async () => {
      try {
        const repository = new PlaceRepositoryImpl();
        const places = await repository.getPlaces();
        const foundPlace = places.find((p) => p.id === id);
        setPlace(foundPlace || null);
      } catch (error) {
        console.error("Ошибка при загрузке локации:", error);
        setPlace(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <Skull className="w-16 h-16 mb-4 text-slate-700" />
        <h1 className="text-2xl font-bold text-slate-200 mb-2">
          Тайна не найдена
        </h1>
        <p className="mb-6">Возможно, эта локация была стерта с карт...</p>
        <Link
          to="/"
          className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg transition-colors"
        >
          Вернуться назад
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 pb-20">
      {/* Шапка с большой картинкой */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <img
          src={place.images[0]}
          alt={place.title}
          className="w-full h-full object-cover saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

        {/* Кнопка "Назад" */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-slate-950/50 hover:bg-slate-900 backdrop-blur-md rounded-xl border border-slate-700 text-slate-200 transition-all"
        >
          <ArrowLeft size={18} />
          <span className="font-semibold text-sm">К карте</span>
        </Link>

        {/* Заголовок поверх картинки */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`px-3 py-1 flex items-center gap-2 rounded-md border text-xs font-bold uppercase tracking-wider ${
                place.dangerLevel === "high"
                  ? "bg-red-500/10 border-red-500/50 text-red-500"
                  : place.dangerLevel === "medium"
                    ? "bg-orange-500/10 border-orange-500/50 text-orange-500"
                    : "bg-emerald-500/10 border-emerald-500/50 text-emerald-500"
              }`}
            >
              <AlertTriangle size={14} />
              {place.dangerLevel === "high"
                ? "Необъяснимо наукой"
                : place.dangerLevel === "medium"
                  ? "Есть свидетели"
                  : "Местный миф"}
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium bg-slate-900/60 px-3 py-1 rounded-md backdrop-blur-sm border border-slate-800">
              <MapPin size={14} className="text-amber-500" />
              {place.coordinates.lat.toFixed(4)},{" "}
              {place.coordinates.lng.toFixed(4)}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
            {place.title}
          </h1>
        </div>
      </div>

      {/* Контент страницы */}
      <div className="max-w-5xl mx-auto px-8 md:px-16 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Левая колонка (Описание) */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-amber-500 mb-4 border-b border-slate-800 pb-2">
              История места
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              {place.fullDescription}
            </p>
          </section>

          {/* Легенды */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-amber-500" size={24} />
              <h2 className="text-2xl font-bold text-white">Местные мифы</h2>
            </div>
            <ul className="space-y-4">
              {place.myths.map((myth, index) => (
                <li key={index} className="flex gap-4">
                  <span className="text-amber-600 font-black text-xl leading-none">
                    0{index + 1}
                  </span>
                  <p className="text-slate-400 leading-relaxed pt-0.5">
                    {myth}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Правая колонка (Сайдбар) */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-2">Статус экспедиции</h3>
            <p className="text-sm text-slate-400 mb-6">
              Эта локация требует осторожности. Подготовьте снаряжение перед
              отправкой.
            </p>
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-black uppercase tracking-wider py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              Добавить в план
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {place.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="rounded-xl w-full h-32 object-cover border border-slate-800 saturate-50 hover:saturate-100 transition-all cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
