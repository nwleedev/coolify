import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import useLocalStorage from "~/hooks/useLocalStorage";
import usePromptModal from "~/hooks/usePromptModal";
import { cs } from "~/libs/classnames";
import Modal from "../Modal";
import Textarea from "../Textarea";

export default function PromptModal() {
  const { state, onClose } = usePromptModal();
  const windowRef = useRef(null as Window | null);
  const [, setStoredPrompt] = useLocalStorage<string>("app:previousPrompt");
  const textareaRef = useRef(null as HTMLTextAreaElement | null);
  const [, forceUpdate] = useReducer(() => [], []);
  const [isClickeds, setIsClickeds] = useState({
    copy: false,
    save: false,
  });
  useEffect(() => {
    if (textareaRef.current && state.value) {
      textareaRef.current.value = state.value;
      forceUpdate();
    }
  }, [state.value]);

  useEffect(() => {
    windowRef.current = window;
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsClickeds(() => ({ copy: false, save: false }));
    }, 3000);
    return () => {
      clearTimeout(timerId);
    };
  }, [isClickeds]);

  const onSave = useCallback(() => {
    if (state.value) {
      setStoredPrompt(state.value);
      setIsClickeds(() => ({ copy: false, save: true }));
    }
  }, [setStoredPrompt, state.value]);

  const onCopy = useCallback(() => {
    if (windowRef.current && state.value && "navigator" in windowRef.current) {
      windowRef.current.navigator.clipboard.writeText(state.value);
      setIsClickeds(() => ({ save: false, copy: true }));
    }
  }, [state.value]);

  return (
    <Modal
      isOpen={state.isOpen}
      onClickOutside={() => onClose()}
      className="max-w-3xl min-h-96 p-4"
    >
      <div className="w-full flex flex-col h-full gap-y-2 px-2">
        <div className="flex flex-col w-full tracking-wide">
          <h2 className="text-center uppercase font-semibold text-xl">
            Prompt
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Here is the improved prompt.
          </p>
        </div>
        <Textarea
          className="h-full w-full border-2 rounded outline-none focus:border-blue-500 py-0.5 px-1 min-h-60 font-light mt-4"
          ref={(element) => (textareaRef.current = element)}
        />
        <div
          className={cs(
            "px-2 py-2 rounded transition-all flex items-center w-full opacity-0",
            isClickeds.save && "bg-green-500 opacity-100",
            isClickeds.copy && "bg-rose-500 opacity-100"
          )}
        >
          <p className="text-white font-semibold text-sm">
            {isClickeds.save && "The prompt is saved."}
            {isClickeds.copy && "The prompt is copied."}
            &nbsp;
          </p>
        </div>
        <div className="flex items-center gap-x-2 mx-auto mt-auto">
          <button
            className="w-24 p-1 bg-blue-600 text-white rounded font-semibold uppercase tracking-normal border border-blue-600"
            onClick={onCopy}
          >
            Copy
          </button>
          <button
            className="w-24 p-1 border-blue-600 border text-blue-600 rounded font-semibold uppercase tracking-normal"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
