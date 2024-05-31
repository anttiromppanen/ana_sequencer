import * as Tone from "tone";
import { ISound, ITrack } from "../types/types";
import { soundPack1 as initialSamples } from "./importSounds";

export const createTracks = (sounds: ISound[]): ITrack[] =>
  sounds.map((sample, i) => {
    const reverb = new Tone.Reverb({ decay: 0.5, wet: 0 }).toDestination();
    const distortion = new Tone.Distortion({
      distortion: 0.5,
      wet: 0,
    }).toDestination();

    return {
      id: i,
      name: sample.name,
      effects: { Reverb: reverb, Distortion: distortion },
      sampler: new Tone.Sampler({
        urls: {
          A1: sample.url,
        },
        volume: -10,
      }).fan(reverb, distortion),
    };
  });

export const createInitialTracks = () => createTracks(initialSamples);

export const createNewTrackFromSound = (sound: ISound, id: number) => {
  const reverb = new Tone.Reverb({ decay: 0.5, wet: 0 }).toDestination();
  const distortion = new Tone.Distortion({
    distortion: 0.5,
    wet: 0,
  }).toDestination();

  return {
    id,
    name: sound.name,
    effects: { Reverb: reverb, Distortion: distortion },
    sampler: new Tone.Sampler({
      urls: {
        A1: sound.url,
      },
      volume: -10,
    }).fan(reverb, distortion),
  };
};
