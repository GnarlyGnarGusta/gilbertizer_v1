import React, { useEffect, useState, useRef } from "react";
import useRootEngine from "./useRootEngine";
import tw from "twin.macro";

const stateMap = {
  suspended: -1,
  running: 1,
  resume: 0,
};

export default function AutoPlayBump({ children }) {
  const rootEngine = useRootEngine();

  const [autoPlay, setAutoPlay] = useState(
    stateMap[rootEngine.audioContext.state]
  );

  const videoNodeRef = useRef();

  useEffect(() => {
    const video = videoNodeRef.current;
    console.info(video);
    if (video instanceof HTMLVideoElement) {
      video
        .play()
        .then(() => {
          setAutoPlay(stateMap.running);
        })
        .catch(() => {
          setAutoPlay(stateMap.resume);
        });
    }
  }, []);

  useEffect(() => {
    const cleanup = new AbortController();
    rootEngine.audioContext.addEventListener(
      "statechange",
      (event) => {
        if (event.target.state === "running") {
          setAutoPlay(stateMap[rootEngine.audioContext.state]);
        }
      },
      { signal: cleanup.signal }
    );

    return () => {
      cleanup.abort();
    };
  }, [rootEngine]);

  if (autoPlay === stateMap.suspended) {
    return <video css={[tw`sr-only`]} ref={videoNodeRef} />;
  }

  if (autoPlay === stateMap.resume) {
    return (
      <div>
        You don't not have auto play enabled on your browser.
        <button type="button" onClick={rootEngine.resumeEnginePlayback}>
          Resume Play
        </button>
      </div>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
}
