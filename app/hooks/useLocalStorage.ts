import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import Scope from "~/libs/scope";

const onSubscribe = (onStoreChange: () => unknown) => {
  const onStorage = function () {
    onStoreChange();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("storage", onStorage);
  };
};

const onServerSnapshot = () => {
  return null;
};

const updateLocalStorage = <V>(key: string, value: V) => {
  const formatted = JSON.stringify(value);
  window.localStorage.setItem(key, formatted);
  window.dispatchEvent(
    new StorageEvent("storage", { key, newValue: formatted })
  );
};

const useLocalStorage = <V>(key?: string, initialValue?: V) => {
  const onSnapshot = useCallback(() => {
    return (
      new Scope(key).run((key) => {
        return window.localStorage.getItem(key);
      }) ?? null
    );
  }, [key]);

  const store = useSyncExternalStore(onSubscribe, onSnapshot, onServerSnapshot);

  const setState = useCallback(
    (action: V | ((next: V) => V)) => {
      if (key === undefined) {
        return;
      }
      if (!(action instanceof Function)) {
        updateLocalStorage(key, action);
        return;
      }
      let parsed = null as V | null;
      try {
        parsed = store ? JSON.parse(store) : null;
      } catch (error) {
        console.warn(error);
      }
      if (parsed !== null) {
        const nextValue = action(parsed);
        updateLocalStorage(key, nextValue);
      }
    },
    [key, store]
  );

  const removeState = useCallback(() => {
    new Scope(key).run((key) => {
      window.localStorage.removeItem(key);
    });
  }, [key]);

  useEffect(() => {
    new Scope(key).run((key) => {
      if (
        window.localStorage.getItem(key) === null &&
        typeof initialValue !== "undefined"
      ) {
        updateLocalStorage(key, initialValue);
      }
    });
  }, [key, initialValue]);

  const parsed = useMemo(() => {
    try {
      if (store) {
        return JSON.parse(store) as V;
      }
    } catch (error) {
      console.warn(error);
      return undefined;
    }
  }, [store]);

  return [parsed, setState, removeState] as const;
};

export default useLocalStorage;

export function storageKey(prefix: string, name?: string) {
  return name !== undefined ? `${prefix}:${name}` : undefined;
}
