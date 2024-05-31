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
