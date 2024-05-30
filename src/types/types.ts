import { Distortion, Reverb, Sampler } from "tone";

export interface ITrack {
  id: number;
  effects: Record<string, Reverb | Distortion>;
  sampler: Sampler;
}
