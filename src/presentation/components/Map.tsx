import { useState, useRef, useEffect } from "react";
// @ts-ignore
import {
  Map as MapboxMap,
  Marker,
  Popup,
  Source,
  Layer,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl/mapbox";
import { Link } from "react-router-dom";
import { Maximize, Minimize, Layers, Play, Pause } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Place } from "../../core/domain/entities/Place";
// @ts-ignore
import type { MapRef } from "react-map-gl/mapbox";

interface MapProps {
  places: Place[];
  onPlaceClick?: (place: Place) => void;
  selectedPlace?: Place | null;
}

export function Map({ places, onPlaceClick, selectedPlace }: MapProps) {
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  const mapRef = useRef<MapRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [popupInfo, setPopupInfo] = useState<Place | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/dark-v11");
  const [isOrbiting, setIsOrbiting] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current
        ?.requestFullscreen()
        .catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  const toggleStyle = () => {
    setMapStyle((prev) =>
      prev === "mapbox://styles/mapbox/dark-v11"
        ? "mapbox://styles/mapbox/satellite-streets-v12"
        : "mapbox://styles/mapbox/dark-v11",
    );
  };

  useEffect(() => {
    let animationId: number;
    const rotate = () => {
      if (isOrbiting && mapRef.current) {
        const map = mapRef.current.getMap();
        map.setBearing(map.getBearing() + 0.15);
        animationId = requestAnimationFrame(rotate);
      }
    };
    if (isOrbiting) {
      animationId = requestAnimationFrame(rotate);
    }
    return () => cancelAnimationFrame(animationId);
  }, [isOrbiting]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
      )
        return;
      if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => mapRef.current?.resize(), 50);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (selectedPlace && mapRef.current) {
      setIsOrbiting(false);
      mapRef.current.flyTo({
        center: [selectedPlace.coordinates.lng, selectedPlace.coordinates.lat],
        zoom: 10.5,
        pitch: 45,
        duration: 2000,
      });
      setPopupInfo(selectedPlace);
    }
  }, [selectedPlace]);

  const handlePlaceSelect = (place: Place) => {
    setIsOrbiting(false);
    setPopupInfo(place);
    onPlaceClick?.(place);
    mapRef.current?.flyTo({
      center: [place.coordinates.lng, place.coordinates.lat],
      zoom: 10.5,
      pitch: 45,
      duration: 1500,
    });
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-[600px] flex items-center justify-center text-red-400 bg-slate-900 rounded-3xl border border-red-900/30">
        Ошибка: Не найден VITE_MAPBOX_TOKEN в .env.local
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full relative z-0 bg-slate-950 flex flex-col ${
        isFullscreen
          ? "h-screen rounded-none border-none"
          : "h-[600px] rounded-3xl border border-amber-900/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden"
      }`}
    >
      <div className="absolute top-0 right-0 left-0 bottom-0 z-0">
        <MapboxMap
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: 74.7661,
            latitude: 41.2044,
            zoom: 6,
            pitch: 45,
            bearing: -10,
          }}
          mapStyle={mapStyle}
          terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Source
            id="mapbox-dem"
            type="raster-dem"
            url="mapbox://mapbox.mapbox-terrain-dem-v1"
            tileSize={512}
            maxzoom={14}
          />

          <Layer
            id="sky"
            type="sky"
            paint={{
              "sky-type": "atmosphere",
              "sky-atmosphere-sun": [0.0, 0.0],
              "sky-atmosphere-sun-intensity": 15,
            }}
          />

          <NavigationControl position="top-right" />
          <GeolocateControl
            position="top-right"
            trackUserLocation={true}
            showAccuracyCircle={false}
          />

          {places.map((place) => (
            <Marker
              key={place.id}
              longitude={place.coordinates.lng}
              latitude={place.coordinates.lat}
              anchor="bottom"
              onClick={(e: any) => {
                e.originalEvent.stopPropagation();
                handlePlaceSelect(place);
              }}
            >
              <div
                className={`marker-pulsar marker-pulsar-${
                  place.dangerLevel === "high"
                    ? "red"
                    : place.dangerLevel === "medium"
                      ? "orange"
                      : "emerald"
                } cursor-pointer`}
              ></div>
            </Marker>
          ))}

          {popupInfo && (
            <Popup
              longitude={popupInfo.coordinates.lng}
              latitude={popupInfo.coordinates.lat}
              anchor="top"
              closeOnClick={false}
              onClose={() => setPopupInfo(null)}
              className="mapbox-custom-popup"
              maxWidth="240px"
            >
              <div className="overflow-hidden bg-slate-900 rounded-xl border border-slate-800 shadow-2xl">
                <div className="h-28 relative">
                  <img
                    src={popupInfo.images[0]}
                    alt={popupInfo.title}
                    className="w-full h-full object-cover saturate-50"
                  />
                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      popupInfo.dangerLevel === "high"
                        ? "bg-red-500/20 text-red-400"
                        : popupInfo.dangerLevel === "medium"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {popupInfo.dangerLevel === "high"
                      ? "Необъяснимо наукой"
                      : popupInfo.dangerLevel === "medium"
                        ? "Есть свидетели"
                        : "Местный миф"}
                  </span>
                </div>
                <div className="p-3 bg-slate-950">
                  <h3 className="font-bold text-sm text-white mb-1.5 line-clamp-1">
                    {popupInfo.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-3 leading-relaxed">
                    {popupInfo.shortDescription}
                  </p>
                  <Link
                    to={`/place/${popupInfo.id}`}
                    className="block w-full text-center bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-xs font-semibold py-1.5 rounded-lg border border-amber-900/50 hover:border-transparent transition-all duration-300"
                  >
                    Исследовать тайну
                  </Link>
                </div>
              </div>
            </Popup>
          )}
        </MapboxMap>
      </div>

      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={toggleFullscreen}
          className="bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 shadow-xl text-amber-500 hover:text-amber-400 hover:border-amber-500/50 transition-all flex items-center justify-center"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        <button
          onClick={toggleStyle}
          className="bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 shadow-xl text-amber-500 hover:text-amber-400 hover:border-amber-500/50 transition-all flex items-center justify-center"
        >
          <Layers size={20} />
        </button>

        {popupInfo && (
          <button
            onClick={() => setIsOrbiting(!isOrbiting)}
            className="bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 shadow-xl text-amber-500 hover:text-amber-400 hover:border-amber-500/50 transition-all flex items-center justify-center"
          >
            {isOrbiting ? <Pause size={20} /> : <Play size={20} />}
          </button>
        )}
      </div>

      <div
        className="absolute bottom-4 left-4 right-4 z-20 flex gap-3 overflow-x-auto pb-2 pt-1 px-1 snap-x scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {places.map((place) => (
          <button
            key={place.id}
            onClick={() => handlePlaceSelect(place)}
            className={`flex items-center gap-3 min-w-[240px] max-w-[280px] p-2.5 rounded-xl backdrop-blur-md transition-all border snap-start text-left shrink-0 select-none ${
              popupInfo?.id === place.id
                ? "bg-slate-950/90 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                : "bg-slate-950/70 border-slate-800/80 hover:bg-slate-950/90 hover:border-slate-700"
            }`}
          >
            <img
              src={place.images[0]}
              alt={place.title}
              className="w-12 h-12 rounded-lg object-cover saturate-50 shrink-0"
            />
            <div className="overflow-hidden">
              <h4 className="text-slate-200 text-xs font-bold line-clamp-1 mb-0.5">
                {place.title}
              </h4>
              <p className="text-slate-400 text-[10px] line-clamp-1 mb-1">
                {place.shortDescription}
              </p>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    place.dangerLevel === "high"
                      ? "bg-red-500"
                      : place.dangerLevel === "medium"
                        ? "bg-orange-500"
                        : "bg-emerald-500"
                  }`}
                />
                <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider line-clamp-1">
                  {place.dangerLevel === "high"
                    ? "Необъяснимо наукой"
                    : place.dangerLevel === "medium"
                      ? "Есть свидетели"
                      : "Местный миф"}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
