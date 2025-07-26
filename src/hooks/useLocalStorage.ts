import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const getStoredValue = (): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from ls', error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to ls', error);
    }
  };

  useEffect(() => {
    setStoredValue(getStoredValue());
  }, [key]);

  return [storedValue, setValue];
}
