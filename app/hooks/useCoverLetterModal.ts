import { useCallback, useContext, useMemo } from "react";
import { ModalContext } from "~/contexts/modal";

export interface UsePromptModalProps {}

export default function useCoverLetterModal() {
  const { store, dispatch } = useContext(ModalContext);
  const state = useMemo(() => {
    return store.coverLetter;
  }, [store]);

  const onOpen = useCallback(
    (value?: string) => {
      if (!value) {
        return;
      }
      dispatch({ type: "COVER_LETTER/OPEN", payload: value });
    },
    [dispatch]
  );

  const onClose = useCallback(() => {
    dispatch({ type: "COVER_LETTER/CLOSE" });
  }, [dispatch]);

  return { state, onOpen, onClose };
}
