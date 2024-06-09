import {
  ForwardedRef,
  KeyboardEvent,
  TextareaHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";
import useIsHydrated from "~/hooks/useIsHydrated";
import useLocalStorage, { storageKey } from "~/hooks/useLocalStorage";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  hasTab?: boolean;
}

const Textarea = forwardRef(function Textarea(
  props: TextareaProps,
  upperRef: ForwardedRef<HTMLTextAreaElement | null>
) {
  const {
    className,
    onKeyDown: onKeyDownProp,
    hasTab = true,
    ...others
  } = props;
  const ref = useRef(null as HTMLTextAreaElement | null);
  const [, forceUpdate] = useReducer(() => [], []);
  const [storedHeight, setHeight] = useLocalStorage<number>(
    storageKey("app:textarea", props.name)
  );
  const isHydrated = useIsHydrated();

  const onTabDown = useCallback((element: HTMLTextAreaElement) => {
    const fromIndex = element.selectionStart;
    const toIndex = element.selectionEnd;
    const textContent = element.value;

    const from = textContent.substring(0, fromIndex);
    const end = textContent.substring(fromIndex);
    element.selectionStart = fromIndex + 2;
    element.selectionEnd = toIndex + 2;
    element.value = `${from}  ${end}`;
    forceUpdate();
    // Change selection range after updating textarea
    queueMicrotask(() => {
      element.focus();
      element.setSelectionRange(fromIndex + 2, fromIndex + 2);
    });
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      const refCopy = ref.current;
      if (!refCopy) {
        return;
      }
      if (event.key === "Tab" && hasTab) {
        event.preventDefault();
        onTabDown(refCopy);
      }
      onKeyDownProp?.(event);
    },
    [hasTab, onKeyDownProp, onTabDown]
  );

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (ref.current && entry.target.contains(ref.current)) {
          setHeight(ref.current.clientHeight);
        }
      });
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [props.name, setHeight]);

  useEffect(() => {
    if (isHydrated && ref.current && storedHeight !== undefined) {
      ref.current.style.height = `${storedHeight}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  return (
    <textarea
      {...others}
      className={className}
      onKeyDown={onKeyDown}
      ref={(element) => {
        ref.current = element;
        if (typeof upperRef === "function") {
          upperRef(element);
        } else if (upperRef !== null) {
          upperRef.current = element;
        }
      }}
    />
  );
});

export default Textarea;
