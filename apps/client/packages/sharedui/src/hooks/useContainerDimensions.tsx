import { useState, useEffect } from 'react';

function useContainerDimensions(containerRef: React.RefObject<HTMLDivElement>) {
  const [dimensions, setDimensions] = useState({
    width: 4,
    height: 4,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const containerRefCurrent = containerRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
        }
      }
    });
    resizeObserver.observe(containerRefCurrent);

    return () => {
      resizeObserver.unobserve(containerRefCurrent);
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return dimensions;
}

export default useContainerDimensions;
