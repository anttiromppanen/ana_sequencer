/* eslint-disable no-param-reassign */
import { MutableRefObject, useEffect, useState } from "react";
import { Distortion, Reverb } from "tone";
import { ITrack } from "../../types/types";

function EffectToggle({
  name,
  effect,
}: {
  name: string;
  effect: Distortion | Reverb;
}) {
  const [effectValue, setEffectValue] = useState(0.5);
  const [wetValue, setWetValue] = useState(0);

  useEffect(() => {
    if (!effect) return;
    if (effect instanceof Distortion) effect.distortion = effectValue;
    effect.wet.value = wetValue;
  }, [effectValue, effect, name, wetValue]);

  return (
    <div className="flex flex-col items-center gap-y-2 rounded-md bg-userGray8 p-2 tracking-wider text-zinc-300">
      <div
        className={`
          size-3 self-start rounded-full bg-red-600 shadow-[0px_0px_10px_2px_rgba(255,0,0,0.7),inset_10px_10px_71px_8px_rgba(255,0,0,1)]
          transition-colors
          ${wetValue > 0 && "bg-green-500 shadow-[0px_0px_10px_2px_rgba(64,255,0,1),inset_10px_10px_71px_8px_rgba(64,255,0,1)]"}
        `}
      />
      <div className="flex flex-col items-center gap-y-1">
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
        <p className="text-xs font-bold tracking-widest text-slate-400">
          EFFECT
        </p>
      </div>
      <div className="flex flex-col items-center gap-y-1">
        <input
          type="range"
          name="wetRange"
          id="wetRange"
          min={0}
          max={1}
          step={0.01}
          value={wetValue}
          onChange={(e) => setWetValue(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-xs font-bold tracking-widest text-slate-400">
          VOLUME
        </p>
      </div>
      <p className="font-medium text-slate-200">{name}</p>
    </div>
  );
}

function EffectPanel({
  trackId,
  tracksRef,
}: {
  trackId: number;
  tracksRef: MutableRefObject<ITrack[]>;
}) {
  const currentTrack =
    tracksRef.current && tracksRef.current.find((x) => x.id === trackId);

  if (!currentTrack?.effects) return undefined;

  const { effects } = currentTrack;

  return (
    <div className="mt-2 flex gap-x-4 rounded-md bg-userGray9 p-4">
      {Object.entries(effects).map(([name, effect]) => (
        <EffectToggle key={name} name={name} effect={effect} />
      ))}
    </div>
  );
}

export default EffectPanel;
