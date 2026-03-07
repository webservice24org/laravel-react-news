"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Visitor {
  id: number;
  lat: number;
  lng: number;
  count: number;
}

interface VisitorMapProps {
  visitors: Visitor[];
}

export default function VisitorMap({ visitors }: VisitorMapProps) {
  return (
    <MapContainer
      // Note: center and zoom are still allowed, but TypeScript wants correct types
      center={[23.685, 90.3563] as [number, number]}
      zoom={6}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        // For v4+, the prop for URL is `url`, attribution is still allowed
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {visitors.map((v) => (
        <CircleMarker
          key={v.id}
          center={[v.lat, v.lng] as [number, number]}
          radius={10 + v.count / 10} // bigger circle for more visitors
          pathOptions={{ fillColor: "red", color: "red", fillOpacity: 0.4 }}
        >
          <Tooltip>
            {v.count} visitor{v.count > 1 ? "s" : ""} at this location
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}