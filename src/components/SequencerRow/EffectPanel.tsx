/* eslint-disable no-lone-blocks */
import { useEffect, useState } from "react";

function EffectToggle({ name, effect }) {
  const [effectValue, setEffectValue] = useState(0.5);
  const [wetValue, setWetValue] = useState(0);

  useEffect(() => {
    if (!effect) return;
    if (name === "Distortion") effect.distortion = effectValue;
    effect.wet.value = wetValue;
  }, [effectValue, effect, name, wetValue]);

  return (
    <div className="flex flex-col items-center gap-y-2 rounded-md bg-userBgColor p-2 tracking-wider text-zinc-300">
      <div
        className={`
          size-3 self-start rounded-full bg-red-600 shadow-[0px_0px_10px_2px_rgba(255,0,0,0.7),inset_10px_10px_71px_8px_rgba(255,0,0,1)]
          transition-colors
          ${wetValue > 0 && "bg-green-500 shadow-[0px_0px_10px_2px_rgba(64,255,0,1),inset_10px_10px_71px_8px_rgba(64,255,0,1)]"}
        `}
      />
      <input
        type="range"
        name="effectRange"
        id="effectRange"
        min={0}
        max={1}
        step={0.01}
        value={effectValue}
        onChange={(e) => setEffectValue(Number(e.target.value))}
      />
      <input
        type="range"
        name="wetRange"
        id="wetRange"
        min={0}
        max={1}
        step={0.01}
        value={wetValue}
        onChange={(e) => setWetValue(Number(e.target.value))}
      />
      {name}
    </div>
  );
}

function EffectPanel({ trackId, tracksRef }) {
  const currentTrack =
    tracksRef.current && tracksRef.current.find((x) => x.id === trackId);

  const { effects } = currentTrack;

  return (
    <div className="my-2 flex gap-x-4 rounded-md bg-userSidebarBg p-2">
      {Object.entries(effects).map(([name, effect]) => (
        <EffectToggle key={name} name={name} effect={effect} />
      ))}
    </div>
  );
}

export default EffectPanel;
