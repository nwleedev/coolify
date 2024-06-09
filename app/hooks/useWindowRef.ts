import { useEffect, useRef } from "react";

export default function useWindowRef() {
  const windowRef = useRef(null as Window | null);

  useEffect(() => {
    windowRef.current = window;
  }, []);

  return windowRef;
}
