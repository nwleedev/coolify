import { useSyncExternalStore } from "react";

function onSubscribe() {
  return () => {};
}

function onSnapshot() {
  return true;
}

function onServerSnapshot() {
  return false;
}

const useIsHydrated = () => {
  return useSyncExternalStore(onSubscribe, onSnapshot, onServerSnapshot);
};

export default useIsHydrated;
