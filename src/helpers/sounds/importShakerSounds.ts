import shaker_analog from "../../assets/sounds/shaker/shaker-analog.wav";
import shaker_shuffle from "../../assets/sounds/shaker/shaker-shuffle.wav";
import shaker_suckup from "../../assets/sounds/shaker/shaker-suckup.wav";
import { ISound } from "./importAllSounds";

const allShakerSounds: ISound[] = [
  { name: "shaker_analog", url: shaker_analog },
  { name: "shaker_shuffle", url: shaker_shuffle },
  { name: "shaker_suckup", url: shaker_suckup },
];

export default allShakerSounds;
