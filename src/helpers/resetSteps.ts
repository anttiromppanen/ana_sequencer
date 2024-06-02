/* eslint-disable no-param-reassign */
import { Dispatch, SetStateAction } from "react";
import * as Tone from "tone";
import { StepsRefType } from "../types/types";

const resetSteps = (
  stepsRef: StepsRefType,
  setIsPlaying: Dispatch<SetStateAction<boolean>>,
) => {
  Object.values(stepsRef.current).forEach((x) =>
    x.forEach((y) => {
      y.element.style.filter = "brightness(1)"; // default brightness -- same value as in Sequence useEffect
      y.element.style.opacity = "0.5"; // default opacity -- same value as in Sequence useEffect
      y.element.checked = false;
    }),
  );

  setIsPlaying(false);
  Tone.getTransport().pause();
  Tone.getTransport().position = 0;
};

export default resetSteps;
