/* eslint-disable no-param-reassign */
import { PaintBrushIcon, SpeakerWaveIcon } from "@heroicons/react/16/solid";
import { MutableRefObject, useEffect, useState } from "react";
import { ITrack } from "../../types/types";
import EffectPanel from "./EffectPanel";

interface Props {
  name: string;
  stepIds: readonly number[];
  stepsRef: MutableRefObject<HTMLInputElement[][]>;
  tracksRef: MutableRefObject<ITrack[]>;
  trackId: number;
  updateSamplerVolume: (id: number, volume: number) => void;
}

const colors = [
  "bg-stone-500",
  "bg-userSequenceButtonBlue",
  "bg-userSequenceButtonMint",
  "bg-userSequenceButtonPink",
  "bg-userSequenceButtonPurple",
  "bg-userSequenceButtonYellow",
];

const iconColors = [
  "text-stone-500",
  "text-userSequenceButtonBlue",
  "text-userSequenceButtonMint",
  "text-userSequenceButtonPink",
  "text-userSequenceButtonPurple",
  "text-userSequenceButtonYellow",
];

function SequencerRow({
  name,
  stepIds,
  trackId,
  stepsRef,
  tracksRef,
  updateSamplerVolume,
}: Props) {
  const [colorIndex, setColorIndex] = useState(0);
  const [showEffectPanel, setShowEffectPanel] = useState(false);
  const [volumeValue, setVolumeValue] = useState(-10);

  const handleGetNextColor = () => {
    setColorIndex((state) => (state + 1 < colors.length ? state + 1 : 0));
  };

  useEffect(() => {
    updateSamplerVolume(trackId, Number(volumeValue));
  }, [updateSamplerVolume, volumeValue, trackId]);

  return (
    <div className="rounded-md bg-userGray8 p-2">
      <div key={name} className="grid grid-cols-[250px_1fr] gap-1">
        {/* LEFT SIDE INPUTS */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between gap-x-3 px-2">
            <button
              type="button"
              onClick={() => setShowEffectPanel((state) => !state)}
              className="
            rounded-md px-2 py-1 font-medium text-neutral-200
            hover:brightness-125
            "
            >
              <p className="">{name}</p>
            </button>
            <button
              type="button"
              aria-label="change color"
              onClick={handleGetNextColor}
              className="size-7 rounded-md bg-userSidebarBg p-1.5"
            >
              <PaintBrushIcon className={iconColors[colorIndex]} />
            </button>
          </div>
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
              className="w-full"
            />
          </div>
        </div>
        {/* RIGHT SIDE SEQUENCER BUTTONS */}
        <div className="grid grid-cols-[repeat(36,1fr)] gap-1.5">
          {stepIds.map((stepId) => {
            const id = `${trackId}-${stepId}`;
            return (
              <input
                key={id}
                id={id}
                type="checkbox"
                ref={(elm) => {
                  if (!elm) return;
                  if (!stepsRef.current[trackId]) {
                    stepsRef.current[trackId] = [];
                  }
                  stepsRef.current[trackId][stepId] = elm;
                }}
                className={`
                  appearance-none rounded-md opacity-50 transition-all
                  checked:opacity-100 checked:!brightness-125 hover:opacity-85
                  ${colors[colorIndex]}`}
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
