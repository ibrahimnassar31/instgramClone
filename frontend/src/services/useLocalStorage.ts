export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`فشل قراءة المفتاح "${key}" من localStorage:`, error);
    return defaultValue;
  }
};

export const setToLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`فشل في تعيين المفتاح "${key}" في localStorage:`, error);
  }
};