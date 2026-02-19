import { useCallback, useState } from "react";

export function useAsync<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (fn: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
      return result;
    } catch (e: any) {
      const msg = e?.message ?? "Unexpected error";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, run, setData };
}
