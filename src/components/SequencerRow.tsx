import { useState } from "react";

const colors = [
  "from-userSequenceButtonBlue to-userSequenceButtonBlue/80 border-userSequenceButtonBlue",
  "from-userSequenceButtonMint to-userSequenceButtonMint/80 border-userSequenceButtonMint",
  "from-userSequenceButtonYellow to-userSequenceButtonYellow/80 border-userSequenceButtonYellow",
  "from-userSequenceButtonPink to-userSequenceButtonPink/80 border-userSequenceButtonPink",
  "from-userSequenceButtonPurple to-userSequenceButtonPurple/80 border-userSequenceButtonPurple",
];

function SequencerRow({ name, stepIds, trackId, stepsRef }) {
  const [colorIndex, setColorIndex] = useState(0);

  const handleGetNextColor = () => {
    setColorIndex((state) => (state + 1 < colors.length ? state + 1 : 0));
  };

  return (
    <div
      key={name}
      className="grid h-20 grid-cols-[200px_repeat(16,1fr)] gap-1"
    >
      <div>
        <p>{name}</p>
        <button
          type="button"
          onClick={handleGetNextColor}
          className="bg-userSidebarBg p-1"
        >
          change color
        </button>
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
