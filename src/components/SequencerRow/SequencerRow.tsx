import { PaintBrushIcon, SpeakerWaveIcon } from "@heroicons/react/16/solid";
import { Arc, Knob, Value } from "rc-knob";
import { useEffect, useState } from "react";
import EffectPanel from "./EffectPanel";

const colors = [
  "from-stone-300 to-stone-400 border-stone-300",
  "from-userSequenceButtonBlue to-userSequenceButtonBlue/80 border-userSequenceButtonBlue",
  "from-userSequenceButtonMint to-userSequenceButtonMint/80 border-userSequenceButtonMint",
  "from-userSequenceButtonYellow to-userSequenceButtonYellow/80 border-userSequenceButtonYellow",
  "from-userSequenceButtonPink to-userSequenceButtonPink/80 border-userSequenceButtonPink",
  "from-userSequenceButtonPurple to-userSequenceButtonPurple/80 border-userSequenceButtonPurple",
];

const iconColors = [
  "text-userSequenceButtonBlue",
  "text-userSequenceButtonMint",
  "text-userSequenceButtonYellow",
  "text-userSequenceButtonPink",
  "text-userSequenceButtonPurple",
];

function SequencerRow({
  name,
  stepIds,
  trackId,
  stepsRef,
  tracksRef,
  updateSamplerVolume,
}) {
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
    <div>
      <div
        key={name}
        className="grid h-20 grid-cols-[250px_repeat(16,1fr)] gap-1"
      >
        {/* LEFT SIDE INPUTS */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between gap-x-3 px-2">
            <button
              type="button"
              onClick={() => setShowEffectPanel((state) => !state)}
              className="
            rounded-md bg-userSequenceButtonGreen p-2 py-3 font-userDisplayFont text-[10px] text-black/70 
            shadow-[inset_10px_10px_58px_-28px_rgba(0,0,0,0.9),10px_10px_70px_-16px_rgba(139,252,0,1)] hover:brightness-125
            "
            >
              <p className="">{name}</p>
            </button>
            <button
              type="button"
              aria-label="change color"
              onClick={handleGetNextColor}
              className="size-8 rounded-md bg-userSidebarBg p-2"
            >
              <PaintBrushIcon className={iconColors[colorIndex]} />
            </button>
          </div>
          <div className="-mb-2 flex gap-x-2 px-2 pt-2">
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
              appearance-none rounded-lg border bg-gradient-to-bl
              shadow-[inset_10px_10px_72px_0px_rgba(240,240,240,0.1)] checked:shadow-[0px_0px_4px_1px_rgba(45,255,196,0.6)] checked:!brightness-125 hover:!brightness-150
              ${colors[colorIndex]}`}
            />
          );
        })}
      </div>
      {showEffectPanel && (
        <EffectPanel trackId={trackId} tracksRef={tracksRef} />
      )}
    </div>
  );
}

export default SequencerRow;
