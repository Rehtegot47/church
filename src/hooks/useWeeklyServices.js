import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { localStore } from "../lib/store";

// Priority: MySQL API → local store
export function useWeeklyServices() {
  const [services, setServices] = useState(() => localStore.loadWeekly());
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("local");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await api.weeklyList();
        if (!cancelled && rows.length) {
          setServices(rows);
          setSource("mysql");
        }
      } catch { /* API down — keep local data */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);
  return { services, loading, source };
}
