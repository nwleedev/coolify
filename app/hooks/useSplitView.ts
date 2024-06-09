import { useCallback, useEffect, useReducer, useRef, useState } from "react";

export type ViewConfig = {
  x: number;
  y: number;
  widths: [number, number];
  heights: [number, number];
};

export interface UseSplitViewProps {
  minWidths?: [number, number];
  minHeights?: [number, number];
  direction?: "vertical" | "horizontal";
}

export default function useSplitView<
  X extends HTMLElement,
  Y extends HTMLElement
>(props: UseSplitViewProps) {
  const refs = useRef([null, null] as [X | null, Y | null]);
  const [, forceUpdate] = useReducer(() => [], []);
  const { minWidths, minHeights, direction = "vertical" } = props;
  const [viewConfig, setConfig] = useState<{
    x: number;
    y: number;
    widths: [number, number];
    heights: [number, number];
  }>();

  const onHorizontalMove = useCallback(
    (delta: number) => {
      if (!refs.current[0] || !refs.current[1] || !viewConfig || !minWidths) {
        return;
      }
      const [xWidth, yWidth] = viewConfig.widths;
      const xNextWidth = xWidth + delta;
      const yNextWidth = yWidth - delta;
      if (xNextWidth < minWidths[0] || yNextWidth < minWidths[1]) {
        return;
      }
      refs.current[0].style.height = `${xNextWidth}px`;
      refs.current[1].style.height = `${xNextWidth}px`;
      forceUpdate();
    },
    [minWidths, viewConfig]
  );

  const onVerticalMove = useCallback(
    (delta: number) => {
      if (!refs.current[0] || !refs.current[1] || !viewConfig || !minHeights) {
        return;
      }
      const [xHeight, yHeight] = viewConfig.heights;
      const xNextHeight = xHeight + delta;
      const yNextHeight = yHeight - delta;
      if (xNextHeight < minHeights[0] || yNextHeight < minHeights[1]) {
        return;
      }
      refs.current[0].style.height = `${xNextHeight}px`;
      refs.current[1].style.height = `${yNextHeight}px`;
      forceUpdate();
    },
    [minHeights, viewConfig]
  );

  useEffect(() => {
    if (!viewConfig) {
      return;
    }
    const onMouseMove = function (event: MouseEvent) {
      console.log("Moving...", event);
      const deltaY = event.screenY - viewConfig.y;
      const deltaX = event.screenX - viewConfig.x;

      switch (direction) {
        case "horizontal": {
          onHorizontalMove(deltaX);
          return;
        }
        case "vertical":
        default: {
          onVerticalMove(deltaY);
          break;
        }
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [viewConfig, direction, onHorizontalMove, onVerticalMove]);

  useEffect(() => {
    if (!viewConfig) {
      return;
    }
    const onMouseUp = function () {
      setConfig(undefined);
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [viewConfig]);

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    if (!refs.current[0] || !refs.current[1]) {
      return;
    }
    setConfig({
      x: event.screenX,
      y: event.screenY,
      widths: [refs.current[0].clientWidth, refs.current[1].clientWidth],
      heights: [refs.current[0].clientHeight, refs.current[1].clientHeight],
    });
  }, []);

  return {
    refs,
    viewConfig,
    onMouseDown,
  };
}
