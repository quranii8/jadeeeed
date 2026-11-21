"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import type { StoryPlace } from "@/lib/prophet-stories";

export default function PlacesMapInner({ places }: { places: StoryPlace[] }) {
  const lats = places.map((p) => p.lat);
  const lngs = places.map((p) => p.lng);
  const bounds: [[number, number], [number, number]] = [
    [Math.min(...lats) - 2, Math.min(...lngs) - 2],
    [Math.max(...lats) + 2, Math.max(...lngs) + 2],
  ];
  return (
    <MapContainer
      bounds={bounds}
      scrollWheelZoom={false}
      className="h-72 md:h-96 w-full rounded-2xl z-0"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((p) => (
        <CircleMarker
          key={p.name}
          center={[p.lat, p.lng]}
          radius={p.approx ? 14 : 9}
          pathOptions={{
            color: "#A88830",
            fillColor: "#C8A951",
            fillOpacity: p.approx ? 0.35 : 0.85,
            dashArray: p.approx ? "4 4" : undefined,
          }}
        >
          <Tooltip direction="top" permanent>
            {p.name}
          </Tooltip>
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.note}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
