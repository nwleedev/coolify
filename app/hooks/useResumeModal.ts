import { useCallback, useContext, useMemo } from "react";
import { ModalContext, type ResumePayload } from "~/contexts/modal";

export default function useResumeModal() {
  const { store, dispatch } = useContext(ModalContext);
  const state = useMemo(() => {
    return store.resume;
  }, [store.resume]);

  const onOpen = useCallback(
    (value?: ResumePayload) => {
      if (!value) {
        return;
      }
      dispatch({ type: "RESUME/OPEN", payload: value });
    },
    [dispatch]
  );

  const onClose = useCallback(() => {
    dispatch({ type: "RESUME/CLOSE" });
  }, [dispatch]);

  return { state, onOpen, onClose };
}
