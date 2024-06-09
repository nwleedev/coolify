import { getMDXComponent } from "mdx-bundler/client";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { ResumePayload } from "~/contexts/modal";
import useLocalStorage from "~/hooks/useLocalStorage";
import useResumeModal from "~/hooks/useResumeModal";
import { cs } from "~/libs/classnames";
import Modal from "../Modal";
import Switch from "../Switch";
import Textarea from "../Textarea";

export interface ResumeModalProps {
  code?: string;
  content?: string;
}

export default function ResumeModal() {
  const { state, onClose } = useResumeModal();
  const [, setStoredResume] =
    useLocalStorage<ResumePayload>("app:previousResume");
  const textareaRef = useRef(null as HTMLTextAreaElement | null);
  const [, forceUpdate] = useReducer(() => [], []);
  const [isClickeds, setIsClickeds] = useState({
    copy: false,
    save: false,
  });
  const [menu, setMenu] = useState(0 as 0 | 1);
  const [isChecked, setIsChecked] = useState(false);
  const Component = useMemo(() => {
    if (state.value && state.value.code) {
      return getMDXComponent(state.value.code);
    }
  }, [state.value]);

  useEffect(() => {
    if (
      textareaRef.current &&
      menu === 1 &&
      state.value &&
      state.value.content
    ) {
      textareaRef.current.value = state.value.content;
      forceUpdate();
    }
  }, [menu, state.value, isChecked]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsClickeds(() => ({ copy: false, save: false }));
    }, 3000);
    return () => {
      clearTimeout(timerId);
    };
  }, [isClickeds.save]);

  const onSave = useCallback(() => {
    if (state.value) {
      const { code, content, issues } = state.value;
      setStoredResume({ code, content, issues });
      setIsClickeds(() => ({ copy: false, save: true }));
    }
  }, [state.value, setStoredResume]);

  const onCopy = useCallback(() => {
    if (state.value && "navigator" in window) {
      window.navigator.clipboard.writeText(state.value.content);
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
            Resume
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Here is the improved resume.
          </p>
        </div>
        <section>
          <div className="w-full flex">
            <div
              className={cs(
                "w-full py-2 pb-2 uppercase cursor-pointer after:transition-all relative after:bg-black after:text-black after:h-0.5 after:w-full after:absolute after:bottom-0",
                menu === 0 && "after:bg-rose-500 text-rose-500"
              )}
              role="presentation"
              onClick={() => setMenu(0)}
            >
              <h3 className="text-center">ISSUES</h3>
            </div>
            <div
              className={cs(
                "w-full py-2 pb-2 uppercase cursor-pointer after:transition-all relative after:bg-black after:text-black after:h-0.5 after:w-full after:absolute after:bottom-0",
                menu === 1 && "after:bg-blue-500 text-blue-500"
              )}
              role="presentation"
              onClick={() => setMenu(1)}
            >
              <h3 className="text-center">RESUME</h3>
            </div>
          </div>
        </section>
        {menu === 0 && (
          <section className="w-full flex flex-col h-60 overflow-y-scroll mt-4">
            <div className="flex flex-col gap-y-1 w-full">
              {state.value?.issues.map((issue) => {
                return (
                  <p
                    key={issue.id}
                    className="text-rose-500 font-light text-sm"
                  >
                    {issue.content}
                  </p>
                );
              })}
            </div>
          </section>
        )}
        {menu === 1 && (
          <div className="flex flex-col w-full gap-y-2">
            <div className="w-full gap-x-1 flex justify-end items-center">
              <p className="font-lato text-sm">Format Resume</p>
              <Switch
                id="resumeModalToggle"
                isClicked={isChecked}
                onClick={() => setIsChecked((isChecked) => !isChecked)}
              />
            </div>
            {isChecked && Component ? (
              <div className="h-60 prose prose-sm w-full max-w-full border-2 rounded outline-none focus:border-blue-500 py-2 px-2 overflow-y-scroll font-light mt-4">
                <Component />
              </div>
            ) : (
              <Textarea
                className="h-full w-full border-2 rounded outline-none focus:border-blue-500 py-0.5 px-1 min-h-60 font-light mt-4"
                ref={(element) => (textareaRef.current = element)}
              />
            )}
            <div
              className={cs(
                "px-2 py-2 rounded transition-all flex items-center w-full opacity-0 border border-green-500",
                isClickeds.save && "bg-green-500 text-white opacity-100",
                isClickeds.copy && "text-green-500 opacity-100"
              )}
            >
              <p className="font-semibold text-sm">
                {isClickeds.save && "The prompt is saved."}
                {isClickeds.copy && "The prompt is copied."}
                &nbsp;
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-x-2 mx-auto mt-4">
          {menu === 0 && (
            <>
              <button
                className="w-24 p-1 border-blue-600 border text-blue-600 rounded font-semibold uppercase tracking-normal"
                onClick={onClose}
              >
                Close
              </button>
            </>
          )}
          {menu === 1 && (
            <>
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
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
