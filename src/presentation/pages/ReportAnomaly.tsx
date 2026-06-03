import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  AlertTriangle,
  CheckCircle,
  MapPin,
  User,
  FileText,
  ArrowLeft,
} from "lucide-react";

export function ReportAnomaly() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    location: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    let isValid = true;
    const newErrors = { name: "", location: "", description: "" };

    if (formData.name.trim().length < 2) {
      newErrors.name = "Имя (или позывной) должно содержать минимум 2 символа";
      isValid = false;
    }
    if (formData.location.trim().length < 3) {
      newErrors.location = "Укажите примерные ориентиры или координаты";
      isValid = false;
    }
    if (formData.description.trim().length < 15) {
      newErrors.description =
        "Опишите увиденное подробнее (минимум 15 символов)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      // Имитируем отправку данных на сервер (задержка 1.5 секунды)
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1500);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Убираем ошибку, как только пользователь начинает печатать
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-wider">
          Данные получены
        </h2>
        <p className="text-slate-400 mb-8 text-lg">
          Спасибо за информацию, {formData.name}. Ваш рапорт отправлен в архив
          для дальнейшего изучения исследователями.
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-slate-900 border border-slate-700 hover:bg-amber-600 hover:border-amber-500 text-white font-bold rounded-xl transition-all shadow-lg"
        >
          Вернуться на базу
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] p-8 max-w-2xl mx-auto">
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-500 mb-6 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </Link>
        <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 uppercase tracking-tight">
          Доложить об аномалии
        </h1>
        <p className="text-slate-400 font-serif">
          Стали свидетелем необъяснимого? Заполните форму ниже.
          Конфиденциальность гарантируется.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm"
      >
        {/* Имя */}
        <div>
          <label className="block text-slate-300 font-bold mb-2 text-sm uppercase tracking-wider">
            Имя или Позывной
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full bg-slate-950/80 border ${errors.name ? "border-red-500" : "border-slate-700"} rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50`}
              placeholder="Сталкер 404"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {errors.name}
            </p>
          )}
        </div>

        {/* Локация */}
        <div>
          <label className="block text-slate-300 font-bold mb-2 text-sm uppercase tracking-wider">
            Местоположение
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full bg-slate-950/80 border ${errors.location ? "border-red-500" : "border-slate-700"} rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50`}
              placeholder="Например: 15 км к югу от ущелья Сказка"
            />
          </div>
          {errors.location && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {errors.location}
            </p>
          )}
        </div>

        {/* Описание */}
        <div>
          <label className="block text-slate-300 font-bold mb-2 text-sm uppercase tracking-wider">
            Суть явления
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={5}
              className={`w-full bg-slate-950/80 border ${errors.description ? "border-red-500" : "border-slate-700"} rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none disabled:opacity-50 custom-scrollbar`}
              placeholder="Опишите, что вы видели, слышали или чувствовали..."
            />
          </div>
          {errors.description && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {errors.description}
            </p>
          )}
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center gap-3 mt-4"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-500 border-t-slate-950 rounded-full animate-spin" />
              Передача данных...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Отправить рапорт
            </>
          )}
        </button>
      </form>
    </div>
  );
}
