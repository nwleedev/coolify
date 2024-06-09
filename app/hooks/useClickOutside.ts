import { useEffect, useRef } from "react";

export interface UseClickOutsideProps<E extends HTMLElement> {
  onClickOutside?: (event: MouseEvent, element: E) => unknown;
  onMousedownOutside?: (event: MouseEvent, element: E) => unknown;
}

export default function useClickOutside<E extends HTMLElement>(
  props: UseClickOutsideProps<E>
) {
  const ref = useRef(null as E | null);
  useEffect(() => {
    function onWindowClick(event: MouseEvent) {
      if (!ref || !ref.current || !props.onClickOutside) {
        return;
      }
      if (
        event.target instanceof HTMLElement &&
        !ref.current.contains(event.target)
      ) {
        props.onClickOutside(event, ref.current);
      }
    }

    window.addEventListener("click", onWindowClick);
    return () => {
      window.removeEventListener("click", onWindowClick);
    };
  }, [props]);

  useEffect(() => {
    function onWindowMousedown(event: MouseEvent) {
      if (!ref || !ref.current || !props.onMousedownOutside) {
        return;
      }
      if (
        event.target instanceof HTMLElement &&
        !ref.current.contains(event.target)
      ) {
        props.onMousedownOutside(event, ref.current);
      }
    }

    window.addEventListener("mousedown", onWindowMousedown);
    return () => {
      window.removeEventListener("mousedown", onWindowMousedown);
    };
  }, [props]);

  return { ref };
}
