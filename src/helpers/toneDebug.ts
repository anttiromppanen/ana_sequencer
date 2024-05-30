import { MutableRefObject } from "react";
import { Distortion } from "tone";
import { ITrack } from "../types/types";

const printAllValuesForSequenceRow = (
  trackId: number,
  tracksRef: MutableRefObject<ITrack[]>,
  filename: string,
) => {
  console.log(`--------------- ${filename}.tsx ----------------`);
  console.log(`track id: ${trackId}`);
  console.log(`volume: ${tracksRef.current[trackId]?.sampler.volume.value}`);
  console.log(
    `reverb: ${tracksRef.current[trackId]?.effects.Reverb.wet.value}`,
  );
  console.log(
    `distortion: ${(tracksRef.current[trackId]?.effects.Distortion as Distortion).distortion}`,
  );
  console.log(`--------------- ${filename}.tsx ----------------`);
};

export default printAllValuesForSequenceRow;
