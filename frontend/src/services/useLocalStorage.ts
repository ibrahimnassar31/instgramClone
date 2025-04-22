import { useState, useEffect, useCallback } from 'react';


export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`فشل قراءة المفتاح "${key}" من localStorage:`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(() => readValue());

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      setStoredValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.warn(`فشل في تعيين المفتاح "${key}" في localStorage:`, error);
    }
  }, [key, storedValue]);

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  return [storedValue, setValue] as const;
};
