/* eslint-disable no-param-reassign */
import {
  PaintBrushIcon,
  SpeakerWaveIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { colors, iconColors } from "../../const/colors";
import { ITrack, StepValuesType, StepsRefType } from "../../types/types";
import EffectPanel from "./EffectPanel";
import SequencerNote from "./SequencerNote";
import useGlobalsStore from "../../store/globalsStore";

interface Props {
  name: string;
  stepIds: readonly number[];
  stepsRef: StepsRefType;
  tracksRef: ITrack[];
  setTracksRef: Dispatch<SetStateAction<ITrack[]>>;
  trackId: number;
  updateSamplerVolume: (id: number, volume: number) => void;
}

const gridFractions: Record<StepValuesType, string> = {
  8: "grid-cols-[repeat(8,1fr)]",
  16: "grid-cols-[repeat(16,1fr)]",
  32: "grid-cols-[repeat(32,1fr)]",
};

function SequencerRow({
  name,
  stepIds,
  trackId,
  stepsRef,
  tracksRef,
  setTracksRef,
  updateSamplerVolume,
}: Props) {
  const { stepAmount } = useGlobalsStore((state) => state);
  const [colorIndex, setColorIndex] = useState(0);
  const [showEffectPanel, setShowEffectPanel] = useState(false);
  const [volumeValue, setVolumeValue] = useState(-10);

  const handleGetNextColor = () => {
    setColorIndex((state) => (state + 1 < colors.length ? state + 1 : 0));
  };

  const handleRemoveTrack = () => {
    const track = tracksRef.find((x) => x.id === trackId);
    if (!track) return;

    const trackRefFiltered = tracksRef.filter((x) => x.id !== track.id);
    delete stepsRef.current[track.id];

    setTracksRef(trackRefFiltered);
    track.sampler.dispose();
  };

  useEffect(() => {
    updateSamplerVolume(trackId, Number(volumeValue));
  }, [updateSamplerVolume, volumeValue, trackId]);

  return (
    <div className="rounded-md bg-userGray8 p-2">
      <div key={name} className="grid grid-cols-[250px_1fr] gap-2">
        {/* LEFT SIDE INPUTS */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between gap-x-3 px-2">
            <button
              type="button"
              onClick={() => setShowEffectPanel((state) => !state)}
              className="
            w-full rounded-md py-1 text-left font-medium
            text-neutral-200 transition-all hover:pl-2 hover:brightness-125
            "
            >
              <p className="">{name}</p>
            </button>
            {/* REMOVE & CHANGE COLOR BUTTONS */}
            <div className="flex gap-x-2">
              <button
                type="button"
                aria-label="Remove instrument"
                onClick={handleRemoveTrack}
                className="group flex items-center justify-center rounded-md bg-userSidebarBg p-1.5 text-red-400 transition-all hover:brightness-125"
              >
                <XMarkIcon className="size-4" />
              </button>
              <button
                type="button"
                aria-label="change color"
                onClick={handleGetNextColor}
                className="size-7 rounded-md bg-userSidebarBg p-1.5 transition-all hover:brightness-125"
              >
                <PaintBrushIcon className={iconColors[colorIndex]} />
              </button>
            </div>
          </div>
          {/* VOLUME SLIDER */}
          <div className="flex gap-x-2 px-2">
            <SpeakerWaveIcon className="size-6" />
            <input
              type="range"
              name=""
              id=""
              min={-60}
              max={20}
              value={volumeValue}
              onChange={(e) => setVolumeValue(Number(e.target.value))}
              className="w-full cursor-pointer [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-userGray9"
            />
          </div>
        </div>
        {/* RIGHT SIDE SEQUENCER BUTTONS */}
        <div className={`grid gap-1.5 ${gridFractions[stepAmount]}`}>
          {stepIds.map((stepId) => {
            const id = `${trackId}-${stepId}`;
            return (
              <SequencerNote
                key={id}
                id={id}
                stepId={stepId}
                stepsRef={stepsRef}
                trackId={trackId}
                colorIndex={colorIndex}
              />
            );
          })}
        </div>
      </div>
      {showEffectPanel && (
        <EffectPanel trackId={trackId} tracksRef={tracksRef} />
      )}
    </div>
  );
}

export default SequencerRow;
