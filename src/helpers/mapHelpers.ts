import type { Feature } from 'ol';
import { Point } from 'ol/geom';
import { toLonLat } from 'ol/proj';

export function getMarkerData(activeMarker: Feature | null) {
  if (activeMarker) {
    const geometry = activeMarker.getGeometry();
    let coordinates: number[] | undefined;

    if (geometry instanceof Point) {
      coordinates = toLonLat(geometry.getCoordinates());
    }
    const id = crypto.randomUUID();
    return { coordinates, id };
  }
}
