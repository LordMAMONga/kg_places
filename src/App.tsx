import { Routes, Route } from "react-router-dom";
import { Home } from "./presentation/pages/Home";
import { PlaceDetails } from "./presentation/pages/PlaceDetails";
import { Favorites } from "./presentation/pages/Favorites";
import { ReportAnomaly } from "./presentation/pages/ReportAnomaly"; // Добавили импорт
import { Header } from "./presentation/components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-16 font-sans">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/place/:id" element={<PlaceDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/report" element={<ReportAnomaly />} />{" "}
        {/* Добавили роут */}
      </Routes>
    </div>
  );
}
