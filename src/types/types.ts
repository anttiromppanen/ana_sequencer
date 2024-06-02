import { MutableRefObject } from "react";
import { Distortion, Reverb, Sampler } from "tone";

export interface ITrack {
  id: number;
  name: string;
  effects: Record<string, Reverb | Distortion>;
  sampler: Sampler;
}

export interface ISound {
  name: string;
  url: string;
}

export type StepsRefType = MutableRefObject<
  Record<
    string,
    {
      volume: number;
      element: HTMLInputElement;
    }[]
  >
>;
