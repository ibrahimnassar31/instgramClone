import { useState } from "react";


export const useAsync = <T, E = string>(
  asyncFunction: (...args: unknown[]) => Promise<T>
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<E | null>(null);


  const execute = async (...args: Parameters<typeof asyncFunction>): Promise<T> => {
    setLoading(true); 
    setError(null); 
    setData(null); 

    try {
      const result = await asyncFunction(...args);
      setData(result); 
      return result; 
    } catch (err: unknown) {
      const errorMessage = (err as Error)?.message || "An unexpected error occurred";
      setError(errorMessage as E); 
      throw err; 
    } finally {
      setLoading(false); 
    }
  };

  return { data, loading, error, execute };
};