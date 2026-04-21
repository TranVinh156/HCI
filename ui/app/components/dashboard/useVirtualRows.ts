import { useMemo } from "react";

type UseVirtualRowsInput = {
  itemCount: number;
  rowHeight: number;
  viewportHeight: number;
  scrollTop: number;
  overscan?: number;
};

type VirtualRowsOutput = {
  startIndex: number;
  endIndex: number;
  paddingTop: number;
  paddingBottom: number;
};

export function useVirtualRows({
  itemCount,
  rowHeight,
  viewportHeight,
  scrollTop,
  overscan = 5,
}: UseVirtualRowsInput): VirtualRowsOutput {
  return useMemo(() => {
    if (itemCount <= 0) {
      return {
        startIndex: 0,
        endIndex: -1,
        paddingTop: 0,
        paddingBottom: 0,
      };
    }

    const visibleCount = Math.max(1, Math.ceil(viewportHeight / rowHeight));
    const firstVisible = Math.floor(scrollTop / rowHeight);
    const startIndex = Math.max(0, firstVisible - overscan);
    const endIndex = Math.min(itemCount - 1, firstVisible + visibleCount + overscan - 1);

    return {
      startIndex,
      endIndex,
      paddingTop: startIndex * rowHeight,
      paddingBottom: Math.max(0, (itemCount - endIndex - 1) * rowHeight),
    };
  }, [itemCount, overscan, rowHeight, scrollTop, viewportHeight]);
}
