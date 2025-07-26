import 'ol/ol.css';
import { OSM } from 'ol/source';
import { Point } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { fromLonLat } from 'ol/proj';
import { Feature, Map, View } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Tile as TileLayer } from 'ol/layer';
import { defaults as defaultControls } from 'ol/control';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import appStore from '../../store';
import mapIcon from '../../assets/map-icon.svg';
import mapActiveIcon from '../../assets/map-active-icon.svg';

const activeMarkerStyle = new Style({
  image: new Icon({
    src: mapActiveIcon,
    scale: 1,
  }),
});

const permanentMarkerStyle = new Style({
  image: new Icon({
    src: mapIcon,
    scale: 1,
  }),
});

export interface MapComponentHandle {
  zoomTo: (coords: [number, number]) => void;
}

export const MapComponent = observer(
  forwardRef<MapComponentHandle>((_, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const olMap = useRef<Map | null>(null);
    const vectorSourceRef = useRef<VectorSource | null>(null);

    const activeMarker = appStore.activeMarker;
    const mapProjects = appStore.mapProjects;
    const setActiveMarker = appStore.setActiveMarker;

    useEffect(() => {
      if (!mapRef.current) return;

      const vectorSource = new VectorSource();
      vectorSourceRef.current = vectorSource;

      const vectorLayer = new VectorLayer({ source: vectorSource });

      const mapInstance = new Map({
        controls: defaultControls({ zoom: false }),
        target: mapRef.current,
        layers: [new TileLayer({ source: new OSM() }), vectorLayer],
        view: new View({
          center: fromLonLat([56.2289, 58.0105]),
          zoom: 15,
        }),
      });

      olMap.current = mapInstance;
      olMap.current.on('click', handleMapClick);

      return () => {
        olMap.current?.setTarget(undefined);
        vectorSource.clear();
      };
    }, []);

    useEffect(() => {
      if (!vectorSourceRef.current) return;

      vectorSourceRef.current.clear();

      mapProjects.forEach(({ id, coordinates }) => {
        if (!coordinates || coordinates.length !== 2) return;

        const lonLat = coordinates;
        const point = new Point(fromLonLat(lonLat));

        const feature = new Feature({ geometry: point });
        feature.setId(id);
        feature.set('type', 'permanent');
        feature.setStyle(permanentMarkerStyle);

        vectorSourceRef.current?.addFeature(feature);
      });
    }, [mapProjects]);

    useEffect(() => {
      if (!vectorSourceRef.current) return;

      vectorSourceRef.current.getFeatures().forEach((f) => {
        if (f.get('type') === 'active') {
          vectorSourceRef.current?.removeFeature(f);
        }
      });

      if (activeMarker) {
        activeMarker.setStyle(activeMarkerStyle);
        activeMarker.set('type', 'active');
        vectorSourceRef.current.addFeature(activeMarker);
      }
    }, [activeMarker]);

    const handleMapClick = (evt: any) => {
      const coordinate = evt.coordinate;
      const newMarker = new Feature({ geometry: new Point(coordinate) });
      newMarker.set('type', 'active');
      newMarker.setStyle(activeMarkerStyle);
      setActiveMarker(newMarker);
    };

    useImperativeHandle(ref, () => ({
      zoomTo(coords: [number, number]) {
        if (!olMap.current) return;
        const view = olMap.current.getView();
        view.animate({
          center: fromLonLat(coords),
          duration: 500,
        });
      },
    }));

    return <div ref={mapRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />;
  }),
);
