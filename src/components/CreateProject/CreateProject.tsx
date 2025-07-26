import { useEffect } from 'react';
import type { Feature } from 'ol';
import appStore from '../../store';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import styles from './CreateProject.module.css';
import { CardTitle } from '../CardTitle/CardTitle';
import { isEmpty } from '../../helpers/objectHelpers';
import { getMarkerData } from '../../helpers/mapHelpers';
import type { FormValues, FormValuesKeys } from '../../App';
import { Input } from '../uikit/forms/Input/Input';
import { Button } from '../uikit/buttons/Button/Button';
import { Select } from '../uikit/forms/Select/Select';
import { FormMessage } from '../uikit/forms/FormMessage/FormMessage';

interface FieldsType {
  label: string;
  name: FormValuesKeys;
  type?: 'text' | 'select' | 'number';
  options?: { id: number; value: string }[];
  validation?: any;
}

export const statusOptions = [
  { id: 1, value: 'verified', text: 'Проверен' },
  { id: 2, value: 'inReview', text: 'На проверке' },
  { id: 3, value: 'notVerified', text: 'Не проверен' },
] as const;

const fields: FieldsType[] = [
  { label: 'Название', name: 'name', type: 'text', validation: { required: true } },
  { label: 'Автор', name: 'author', type: 'text' },
  { label: 'Ссылка на изображение', name: 'link', type: 'text' },
  {
    label: 'Статус',
    name: 'status',
    type: 'select',
    options: statusOptions.map(({ id, text }) => ({ id, value: text })),
  },
  {
    label: 'Рейтинг',
    name: 'rate',
    type: 'number',
  },
];

interface CreateProjecProps {
  close?: () => void;
}

export const CreateProject: React.FC<CreateProjecProps> = observer(({ close }) => {
  const {
    control,
    handleSubmit: submit,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues & { activeMarker: Feature }>({
    mode: 'onSubmit',
    defaultValues: { status: 2 },
  });

  const activeMarker = appStore.activeMarker;
  const setActiveMarker = appStore.setActiveMarker;

  function handleSubmit() {
    if (!activeMarker) {
      setError('activeMarker', { message: 'Выберите активный маркер' });
      return;
    }

    const formData = { ...getValues(), date: new Date() };
    const markerData = getMarkerData(activeMarker);

    appStore.addProject({
      formData,
      id: `${markerData?.id}`,
      coordinates: markerData?.coordinates,
    });
    setActiveMarker(null);
    close?.();
  }

  useEffect(() => {
    if (activeMarker) {
      clearErrors('activeMarker');
    }
  }, [activeMarker]);

  const errorMessage = () => {
    if (errors.activeMarker?.message) return errors.activeMarker.message;

    for (const key of Object.keys(errors) as (keyof typeof errors)[]) {
      const error = errors[key];
      if (error && typeof error === 'object' && 'message' in error && error.message) {
        return error.message;
      }
    }

    return 'Заполните обязательные поля';
  };
  return (
    <div className={styles.modalContainer}>
      <CardTitle iconButtProps={{ onClick: close }} title="Новый проект" />

      <div className={styles.modalList}>
        {fields.map((props) => {
          if (props.type === 'select' && props.options) {
            return (
              <Select
                key={props.name}
                control={control}
                name={props.name}
                label={props.label}
                options={props.options}
              />
            );
          }
          return <Input key={props.name} control={control} {...props} />;
        })}
      </div>

      {!isEmpty(errors) && <FormMessage status="error">{errorMessage()}</FormMessage>}
      <Button onClick={submit(handleSubmit)} style={{ marginLeft: 'auto', marginTop: 10 }}>
        Добавить
      </Button>
    </div>
  );
});
