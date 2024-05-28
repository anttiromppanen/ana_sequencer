import clap_slapper from "../assets/sounds/clap/clap-slapper.wav";
import cowbell_808 from "../assets/sounds/cowbell/cowbell-808.wav";
import crash_noise from "../assets/sounds/crash/crash-noise.wav";
import hihat_dist01 from "../assets/sounds/hihat/hihat-dist01.wav";

export interface ISoundPack {
  name: string;
  url: string;
}

export const soundPack1: ISoundPack[] = [
  { name: "clap_slapper", url: clap_slapper },
  { name: "cowbell_808", url: cowbell_808 },
  { name: "crash_noise", url: crash_noise },
  { name: "hihat_dist01", url: hihat_dist01 },
];
