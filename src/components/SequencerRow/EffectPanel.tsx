/* eslint-disable no-lone-blocks */
import { Arc, Knob, Pointer } from "rc-knob";
import { useEffect, useState } from "react";

function EffectToggle({ name, effect }) {
  const [effectValue, setEffectValue] = useState(0);

  useEffect(() => {
    if (!effect) return;
    if (name === "Distortion") effect.distortion = effectValue / 100;
    else effect.wet.value = effectValue / 100;
  }, [effectValue, effect, name]);

  return (
    <div className="flex flex-col items-center rounded-md bg-neutral-300 p-1 text-zinc-600">
      <div
        className={`
          size-3 self-start rounded-full bg-red-600 shadow-[0px_0px_10px_2px_rgba(255,0,0,0.7),inset_10px_10px_71px_8px_rgba(255,0,0,1)]
          transition-colors
          ${effectValue > 0 && "bg-green-500 shadow-[0px_0px_10px_2px_rgba(64,255,0,1),inset_10px_10px_71px_8px_rgba(64,255,0,1)]"}
        `}
      />
      <input
        type="range"
        name=""
        id=""
        min={0}
        max={100}
        value={effectValue}
        onChange={(e) => setEffectValue(Number(e.target.value))}
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
    <div className="my-2 flex rounded-md bg-userSidebarBg p-2">
      {Object.entries(effects).map(([name, effect]) => (
        <EffectToggle key={name} name={name} effect={effect} />
      ))}
    </div>
  );
}

export default EffectPanel;
