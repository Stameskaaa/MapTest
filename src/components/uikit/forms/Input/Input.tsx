import {
  Controller,
  useFormState,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { useId, type HTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps<T extends FieldValues> extends HTMLAttributes<HTMLInputElement> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  inputType?: 'number' | 'text';
  validation?: Parameters<typeof Controller<T>>[0]['rules'];
  min?: number;
  max?: number;
}

export const Input = <T extends FieldValues>({
  control,
  name,
  label,
  inputType = 'text',
  validation,
  ...props
}: InputProps<T>) => {
  const { errors } = useFormState({ control, name });
  const hasError = Boolean(errors[name]);
  const id = useId();

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        rules={validation}
        render={({ field }) => {
          return (
            <input
              id={id}
              className={`${styles.input} ${hasError ? styles.error : ''}`}
              type="text"
              inputMode={inputType === 'number' ? 'numeric' : undefined}
              {...props}
              value={field.value ?? ''}
              onChange={(e) => {
                const val = e.target.value;

                if (inputType === 'number') {
                  const isValid = /^-?\d*\.?\d*$/.test(val);
                  if (isValid) {
                    field.onChange(val === '' ? '' : Number(val));
                  }
                } else {
                  field.onChange(val);
                }
              }}
            />
          );
        }}
      />
    </div>
  );
};
