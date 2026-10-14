import { useCallback, useSyncExternalStore } from "react";

// Full screen for one element (the element in `ref`).
// canFullscreen: the browser allows it (iPhone Safari, for one, does not).
// isFullscreen: that element is full screen right now.
// The browser owns this state (Esc also leaves full screen), so it is read
// from the document instead of copied into React state, and so never drifts.
const subscribe = (onChange) => {
  document.addEventListener("fullscreenchange", onChange);
  return () => document.removeEventListener("fullscreenchange", onChange);
};

export default function useFullscreen(ref) {
  const canFullscreen = useSyncExternalStore(
    subscribe,
    () => document.fullscreenEnabled,
    () => false // on the server nothing is full screen
  );
  const isFullscreen = useSyncExternalStore(
    subscribe,
    () => ref.current !== null && document.fullscreenElement === ref.current,
    () => false
  );

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else ref.current?.requestFullscreen();
  }, [ref]);

  return { canFullscreen, isFullscreen, toggleFullscreen };
}
