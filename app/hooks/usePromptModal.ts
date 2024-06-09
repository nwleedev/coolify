import { useCallback, useContext, useMemo } from "react";
import { ModalContext } from "~/contexts/modal";

export interface UsePromptModalProps {}

export default function usePromptModal() {
  const { store, dispatch } = useContext(ModalContext);
  const state = useMemo(() => {
    return store.prompt;
  }, [store]);

  const onOpen = useCallback(
    (value?: string) => {
      if (!value) {
        return;
      }
      dispatch({ type: "PROMPT/OPEN", payload: value });
    },
    [dispatch]
  );

  const onClose = useCallback(() => {
    dispatch({ type: "PROMPT/CLOSE" });
  }, [dispatch]);

  return { state, onOpen, onClose };
}
