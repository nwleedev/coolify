import { PropsWithChildren, useEffect } from "react";
import { createPortal } from "react-dom";
import useClickOutside from "~/hooks/useClickOutside";
import useIsHydrated from "~/hooks/useIsHydrated";
import { cs } from "~/libs/classnames";

export interface ModalProps extends PropsWithChildren {
  className?: string;

  isOpen?: boolean;
  onClickOutside?: () => unknown;
}

export default function Modal(props: ModalProps) {
  const { isOpen, onClickOutside, children, className } = props;
  const { ref: modalRef } = useClickOutside({
    onMousedownOutside: onClickOutside,
  });
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (isHydrated && isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "";
    }
  }, [isHydrated, isOpen]);

  if (!isOpen || !isHydrated) {
    return <></>;
  }

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-600 bg-opacity-70 z-50 p-4">
      <div
        className={cs(
          "flex flex-col bg-white w-full bg-opacity-100 rounded",
          className
        )}
        ref={(element) => (modalRef.current = element)}
      >
        {children}
      </div>
    </div>,
    document.getElementById("modals")!
  );
}
