'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useResize<T extends HTMLElement = HTMLDivElement>() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const ref = useRef<T>(null);

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateDimensions]);

  return { ref, width: dimensions.width, height: dimensions.height };
}

