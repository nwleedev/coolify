import { Dispatch, PropsWithChildren, createContext, useReducer } from "react";

export type ResumeIssue = {
  id: string;
  content: string;
};

export type ResumePayload = {
  content: string;
  code: string;
  issues: ResumeIssue[];
};

interface AppModal {
  prompt: {
    isOpen: boolean;
    value?: string;
  };
  resume: {
    isOpen: boolean;
    value?: ResumePayload;
  };
  coverLetter: {
    isOpen: boolean;
    value?: string;
  };
}

export const ModalContext = createContext({
  store: null! as AppModal,
  dispatch: null! as Dispatch<ModalAction>,
});

type ModalAction =
  | { type: "PROMPT/OPEN"; payload: string }
  | { type: "PROMPT/CLOSE" }
  | { type: "RESUME/OPEN"; payload: ResumePayload }
  | { type: "RESUME/CLOSE" }
  | { type: "COVER_LETTER/OPEN"; payload: string }
  | { type: "COVER_LETTER/CLOSE" };

function modalReducer(state: AppModal, action: ModalAction): AppModal {
  switch (action.type) {
    case "PROMPT/OPEN": {
      state = {
        ...state,
        prompt: {
          isOpen: true,
          value: action.payload,
        },
      };
      break;
    }
    case "PROMPT/CLOSE": {
      state = {
        ...state,
        prompt: {
          isOpen: false,
          value: undefined,
        },
      };
      break;
    }
    case "RESUME/OPEN": {
      state = {
        ...state,
        resume: {
          isOpen: true,
          value: action.payload,
        },
      };
      break;
    }
    case "RESUME/CLOSE": {
      state = {
        ...state,
        resume: {
          isOpen: false,
          value: undefined,
        },
      };
      break;
    }
    case "COVER_LETTER/OPEN": {
      state = {
        ...state,
        coverLetter: {
          isOpen: true,
          value: action.payload,
        },
      };
      break;
    }
    case "COVER_LETTER/CLOSE": {
      state = {
        ...state,
        coverLetter: {
          isOpen: false,
          value: undefined,
        },
      };
      break;
    }
  }
  return state;
}

export function ModalProvider(props: PropsWithChildren) {
  const [store, dispatch] = useReducer(modalReducer, {
    prompt: { isOpen: false },
    resume: { isOpen: false },
    coverLetter: { isOpen: false },
  } satisfies AppModal);

  return (
    <ModalContext.Provider value={{ store, dispatch }}>
      {props.children}
    </ModalContext.Provider>
  );
}
