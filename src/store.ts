import { makeAutoObservable } from 'mobx';
import { type StoredMarkerData } from './App';
import type { Feature } from 'ol';

export const PROJECTS_STORAGE_KEY = 'mapProjects';

function createAppStore() {
  const store = {
    mapProjects: [] as StoredMarkerData[],
    activeMarker: null as Feature | null,

    setMapProjects(projects: StoredMarkerData[]) {
      store.mapProjects = projects;
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    },

    setActiveMarker(marker: Feature | null) {
      store.activeMarker = marker;
    },

    addProject(project: StoredMarkerData) {
      store.setMapProjects([...store.mapProjects, project]);
    },
    addRate(id: string) {
      const index = store.mapProjects.findIndex((p) => p.id === id);
      if (index === -1) return;

      const updated = [...store.mapProjects];
      const current = updated[index];
      const prevRate = current.formData.rate || 0;

      updated[index] = {
        ...current,
        formData: {
          ...current.formData,
          rate: Number(prevRate) + 1,
        },
      };

      store.setMapProjects(updated);
    },
    deleteProject(id: string) {
      store.setMapProjects(store.mapProjects.filter((p) => p.id !== id));
    },
  };

  makeAutoObservable(store);

  const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
  if (saved) {
    try {
      store.mapProjects = JSON.parse(saved);
    } catch {
      store.mapProjects = [];
    }
  }

  return store;
}

const appStore = createAppStore();

export default appStore;
