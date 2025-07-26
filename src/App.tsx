import './App.css';
import { LucideList, LucideMapPinPlus } from 'lucide-react';
import { LargeButton } from './components/uikit/buttons/LargeButton/LargeButton';
import { ProjectList } from './components/ProjectList/ProjectList';
import { useModalContext } from './providers/ModalProvider';
import { MapComponent, type MapComponentHandle } from './components/MapComponent/MapComponent';
import { CreateProject } from './components/CreateProject/CreateProject';
import { useRef } from 'react';

export interface StoredMarkerData {
  id: string;
  formData: FormValues;
  coordinates?: number[];
}

export interface FormValues {
  name: string;
  status: 1 | 2 | 3;
  date: Date;
  author?: string;
  link?: string;
  rate?: number;
}

export type FormValuesKeys = keyof FormValues;

function App() {
  const { openModal } = useModalContext();
  const mapRef = useRef<MapComponentHandle>(null);

  const zoomToCoords = (coords: [number, number]) => {
    mapRef.current?.zoomTo(coords);
  };

  return (
    <div className="appContainer">
      <div className="appActionsContainer">
        <LargeButton
          onClick={() => openModal(CreateProject, {}, { hasOverlay: false })}
          icon={LucideMapPinPlus}>
          Добавить проект
        </LargeButton>
        <LargeButton
          onClick={() => openModal(ProjectList, { zoomFunc: zoomToCoords }, { position: 'right' })}
          icon={LucideList}>
          Список проектов
        </LargeButton>
      </div>
      <MapComponent ref={mapRef} />
    </div>
  );
}

export default App;
