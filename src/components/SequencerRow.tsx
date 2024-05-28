import { useState } from "react";
import { Knob, Arc, Value } from "rc-knob";
import { PaintBrushIcon } from "@heroicons/react/16/solid";

const colors = [
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
  updateSamplerVolume,
}) {
  const [colorIndex, setColorIndex] = useState(0);
  const [volumeValue, setVolumeValue] = useState(0);

  const handleGetNextColor = () => {
    setColorIndex((state) => (state + 1 < colors.length ? state + 1 : 0));
  };

  return (
    <div
      key={name}
      className="grid h-20 grid-cols-[250px_repeat(16,1fr)] gap-1"
    >
      <div className="flex items-center justify-around">
        <button
          type="button"
          aria-label="change color"
          onClick={handleGetNextColor}
          className="bg-userSidebarBg size-8 rounded-md p-2"
        >
          <PaintBrushIcon className={iconColors[colorIndex]} />
        </button>
        <p>{name}</p>
        <div className="flex flex-col justify-center">
          <Knob
            size={50}
            angleOffset={220}
            angleRange={280}
            value={-15}
            min={-30}
            max={0}
            onChange={(value) => updateSamplerVolume(trackId, Number(value))}
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
              appearance-none rounded-lg border
              bg-gradient-to-bl shadow-[inset_10px_10px_72px_0px_rgba(240,240,240,0.1)] checked:shadow-[0px_0px_4px_1px_rgba(45,255,196,0.6)] checked:!brightness-200
              ${colors[colorIndex]}`}
          />
        );
      })}
    </div>
  );
}

export default SequencerRow;
