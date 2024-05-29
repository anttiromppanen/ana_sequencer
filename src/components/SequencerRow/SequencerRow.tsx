import { PaintBrushIcon } from "@heroicons/react/16/solid";
import { Arc, Knob, Value } from "rc-knob";
import { useEffect, useState } from "react";
import EffectPanel from "./EffectPanel";

const colors = [
  "from-neutral-300 to-neutral-200",
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
  const [volumeValue, setVolumeValue] = useState(-20);

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
        <div className="flex items-center justify-around">
          <button
            type="button"
            aria-label="change color"
            onClick={handleGetNextColor}
            className="size-8 rounded-md bg-userSidebarBg p-2"
          >
            <PaintBrushIcon className={iconColors[colorIndex]} />
          </button>
          <button
            type="button"
            onClick={() => setShowEffectPanel((state) => !state)}
            className="
            font-userDisplayFont rounded-md bg-userSequenceButtonGreen p-2 py-3 text-[10px] text-black/70 
            shadow-[inset_10px_10px_58px_-28px_rgba(0,0,0,0.9),10px_10px_70px_-16px_rgba(139,252,0,1)] hover:brightness-125
            "
          >
            <p className="">{name}</p>
          </button>
          <div className="flex flex-col justify-center">
            <Knob
              size={50}
              angleOffset={220}
              angleRange={280}
              min={-60}
              max={0}
              value={volumeValue}
              onChange={(value) => setVolumeValue(Number(value))}
            >
              <Arc arcWidth={5} color="#f15bb5" background="gray" />
              <Value marginBottom={18} className="fill-white" />
            </Knob>
            <p className="select-none leading-3">Volume</p>
          </div>
        </div>
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
              shadow-[inset_10px_10px_72px_0px_rgba(240,240,240,0.1)] checked:shadow-[0px_0px_4px_1px_rgba(45,255,196,0.6)] checked:!brightness-200 hover:!brightness-150
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
