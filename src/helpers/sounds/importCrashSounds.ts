import crash_808 from "../../assets/sounds/crash/crash-808.wav";
import crash_acoustic from "../../assets/sounds/crash/crash-acoustic.wav";
import crash_noise from "../../assets/sounds/crash/crash-noise.wav";
import crash_tape from "../../assets/sounds/crash/crash-tape.wav";
import { ISound } from "../../types/types";

const allCrashSounds: ISound[] = [
  { name: "crash_808", url: crash_808 },
  { name: "crash_acoustic", url: crash_acoustic },
  { name: "crash_noise", url: crash_noise },
  { name: "crash_tape", url: crash_tape },
];

export default allCrashSounds;
