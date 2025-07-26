import { LucideChevronDown } from 'lucide-react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import styles from './Select.module.css';

interface SelectOption {
  id: number | string;
  value: string | number;
}

interface SelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  options: SelectOption[];
  label?: string;
}

export const Select = <T extends FieldValues>({
  control,
  name,
  label,
  options,
}: SelectProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={styles.container}>
          {label && <label className={styles.label}>{label}</label>}
          <div className={styles.selectWrapper} style={{ position: 'relative', width: '100%' }}>
            <select
              {...field}
              className={styles.select}
              onChange={(e) => field.onChange(e.target.value)}
              value={field.value ?? ''}>
              {options.map(({ id, value }) => (
                <option key={id} value={id}>
                  {value}
                </option>
              ))}
            </select>
            <LucideChevronDown
              size={14}
              strokeWidth={2}
              color="rgba(73, 74, 80, 1)"
              className={styles.icon}
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          </div>
        </div>
      )}
    />
  );
};
