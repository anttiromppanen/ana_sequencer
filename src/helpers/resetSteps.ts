/* eslint-disable no-param-reassign */
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import * as Tone from "tone";

const resetSteps = (
  stepsRef: MutableRefObject<Record<string, HTMLInputElement[]>>,
  setIsPlaying: Dispatch<SetStateAction<boolean>>,
) => {
  Object.values(stepsRef.current).forEach((x) =>
    x.forEach((y) => {
      y.style.filter = "brightness(1)"; // default brightness -- same value as in Sequence useEffect
      y.checked = false;
    }),
  );

  setIsPlaying(false);
  Tone.getTransport().pause();
  Tone.getTransport().position = 0;
};

export default resetSteps;
