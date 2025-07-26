import appStore from '../../store';
import { observer } from 'mobx-react-lite';
import { LucideMapPin, LucideStar, LucideTrash } from 'lucide-react';
import styles from './ProjectCard.module.css';
import type { StoredMarkerData } from '../../App';
import { formatDateTime } from '../../helpers/dateHelpers';
import { statusOptions } from '../CreateProject/CreateProject';
import { Image } from '../uikit/Image/Image';
import { IconButton } from '../uikit/buttons/IconButton/IconButton';

interface ProjectCardProps extends StoredMarkerData {
  zoomFunc: (coords: [number, number]) => void;
  id: string;
  close?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = observer(
  ({ id, coordinates, zoomFunc, formData, close }) => {
    const { status, rate, author, name, date, link } = formData;
    const addRate = appStore.addRate;
    const deleteProject = appStore.deleteProject;
    const currentStatus = statusOptions.find(({ id }) => id == status)?.value || '';

    function handleZoomTo(coordinates: unknown) {
      if (
        Array.isArray(coordinates) &&
        coordinates.length === 2 &&
        typeof coordinates[0] === 'number' &&
        typeof coordinates[1] === 'number'
      ) {
        zoomFunc(coordinates as [number, number]);
        close?.();
      } else {
        alert('Произошла ошибка: неверные координаты');
      }
    }

    return (
      <div className={styles.container}>
        <Image src={link} />

        <div className={styles.detailsContainer}>
          <div className={styles.titleContainer}>
            <h4 className={styles.title}>{name}</h4>
            <div className={styles.description}>
              <div className={styles.descriptionLeft}>
                {formatDateTime(new Date(date))}

                {author && (
                  <>
                    <span>•</span>
                    <span className={styles.author}>{author}</span>
                  </>
                )}
              </div>
              {currentStatus === 'verified' && (
                <div className={styles.rating}>
                  <LucideStar size={12} strokeWidth={3} color="rgba(73, 74, 80, 1)" />
                  {rate && rate > 0 ? rate > 999 ? `999+` : rate : <span>Rating</span>}
                </div>
              )}
            </div>
          </div>

          <div className={styles.actionsContainer}>
            <IconButton
              onClick={() => {
                handleZoomTo(coordinates);
              }}
              icon={LucideMapPin}
            />
            {currentStatus === 'verified' && (
              <IconButton onClick={() => addRate(id)} icon={LucideStar} />
            )}
            <IconButton icon={LucideTrash} onClick={() => deleteProject(id)} />
          </div>
        </div>
      </div>
    );
  },
);
