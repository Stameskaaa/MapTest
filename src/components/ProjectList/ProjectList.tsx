import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import appStore from '../../store';
import styles from './ProjectList.module.css';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CardTitle } from '../CardTitle/CardTitle';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import { statusOptions } from '../CreateProject/CreateProject';
import { Badge } from '../uikit/Badge/Badge';
import type { BadgeStatus as FullBadgeStatus } from '../uikit/Badge/Badge';

interface ProjectListProps {
  zoomFunc: (coords: [number, number]) => void;
  close?: () => void;
}

type BadgeStatus = Exclude<FullBadgeStatus, 'disabled'>;

interface BadgeData {
  key: BadgeStatus;
  label: string;
  count: number;
}

export const ProjectList: React.FC<ProjectListProps> = observer(({ close, zoomFunc }) => {
  const [activeStatuses, setActiveStatuses] = useLocalStorage<BadgeStatus[]>('ProjectListFilters', [
    'ok',
    'process',
    'inactive',
  ]);

  const toggleStatus = (status: BadgeStatus) => {
    const newStatuses = activeStatuses.includes(status)
      ? activeStatuses.filter((s) => s !== status)
      : [...activeStatuses, status];
    setActiveStatuses(newStatuses);
  };
  const mapProjects = appStore.mapProjects;

  const groupedProjects = useMemo(() => {
    const result = {
      ok: [] as typeof mapProjects,
      process: [] as typeof mapProjects,
      inactive: [] as typeof mapProjects,
    };

    for (const project of mapProjects) {
      const status = statusOptions.find(({ id }) => id === Number(project.formData.status))?.value;

      if (status === 'verified') result.ok.push(project);
      else if (status === 'inReview') result.process.push(project);
      else if (status === 'notVerified') result.inactive.push(project);
    }

    if (activeStatuses.includes('ok') && activeStatuses.length === 1) {
      result.ok.sort((a, b) => (b.formData.rate ?? 0) - (a.formData.rate ?? 0));
    }

    return result;
  }, [mapProjects, activeStatuses]);

  const badges: BadgeData[] = [
    { key: 'ok', label: 'Проверенные', count: groupedProjects.ok.length },
    { key: 'process', label: 'На проверке', count: groupedProjects.process.length },
    { key: 'inactive', label: 'Непроверенные', count: groupedProjects.inactive.length },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CardTitle iconButtProps={{ onClick: close }} title="Список проектов" />

        <div className={styles.badgeList}>
          {badges.map(({ key, label, count }) => (
            <Badge
              onClick={() => toggleStatus(key)}
              key={key}
              status={activeStatuses.includes(key) ? key : 'disabled'}>
              {label} {count > 0 ? `(${count})` : ''}
            </Badge>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {activeStatuses.map((status) =>
          groupedProjects[status].map((props) => (
            <ProjectCard key={props.id} {...props} zoomFunc={zoomFunc} close={close} />
          )),
        )}
      </div>
    </div>
  );
});
