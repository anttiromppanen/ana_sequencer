import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";
import SequencerRow from "./components/SequencerRow/SequencerRow";
import Sidebar from "./components/Sidebar/Sidebar";
import { ISoundPack, soundPack1 as samples } from "./helpers/importSounds";
import { ITrack } from "./types/types";

const numOfSteps = 36;

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSamples, setActiveSamples] = useState(samples);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const tracksRef = useRef<ITrack[]>([]);
  const stepsRef = useRef<HTMLInputElement[][]>([[]]);
  const seqRef = useRef<Tone.Sequence | null>(null);
  const draggableContainerRef = useRef(null);

  const stepIds = useMemo(() => [...Array(numOfSteps).keys()] as const, []);

  const handleStartClick = async () => {
    if (Tone.getTransport().state === "started") {
      Tone.getTransport().pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.getTransport().start();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    // tone.js sampler
    tracksRef.current = activeSamples.map((sample, i) => {
      const reverb = new Tone.Reverb({ decay: 0.5, wet: 0 }).toDestination();
      const distortion = new Tone.Distortion({
        distortion: 0.5,
        wet: 0,
      }).toDestination();

      return {
        id: i,
        effects: { Reverb: reverb, Distortion: distortion },
        sampler: new Tone.Sampler({
          urls: {
            A1: sample.url,
          },
          volume: -10,
        }).fan(reverb, distortion),
      };
    });

    // tone.js sequence loop
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        // loops the sequencer buttons by column
        tracksRef.current.map((trk) => {
          const sequencerColumnButton = stepsRef.current[trk.id][
            step
          ] as HTMLInputElement;

          if (sequencerColumnButton.checked) {
            trk.sampler.triggerAttack("A1", time);
          }

          if (!sequencerColumnButton.checked)
            sequencerColumnButton.style.filter = "brightness(1.5)";
          else sequencerColumnButton.style.background = "rgba(255,255,255,0.9)";

          return undefined;
        });

        if (step > 0) {
          tracksRef.current.forEach((trk) => {
            const previousSequencerButton = stepsRef.current[trk.id][
              step - 1
            ] as HTMLInputElement;

            if (!previousSequencerButton.checked)
              previousSequencerButton.style.filter = "brightness(1)";
            else previousSequencerButton.style.background = "";
          });
        } else {
          // If we are at step 0, reset the last step's background color
          tracksRef.current.forEach((trk) => {
            const lastColumnSequencerButton = stepsRef.current[trk.id][
              stepIds.length - 1
            ] as HTMLInputElement;

            if (!lastColumnSequencerButton.checked)
              lastColumnSequencerButton.style.filter = "brightness(1)";
            else lastColumnSequencerButton.style.background = "";
          });
        }
      },
      [...stepIds],
      "16n",
    );

    seqRef.current.start(0);

    return () => {
      seqRef.current?.dispose();
      tracksRef.current.map((trk) => trk.sampler.dispose());
    };
  }, [stepIds, activeSamples]);

  useEffect(
    () =>
      monitorForElements({
        onDrop({ source, location }) {
          const destination = location.current.dropTargets[0];
          if (!destination) {
            // if dropped outside of any drop targets
            return;
          }

          const names = activeSamples.map((x) => x.name);
          if (names.includes(source.data.name as string)) return;

          setActiveSamples((state) => [...state, source.data] as ISoundPack[]);
        },
      }),

    [activeSamples],
  );

  useEffect(() => {
    const el = draggableContainerRef.current;

    if (!el) return undefined;

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  const updateSamplerVolume = (id: number, volume: number) => {
    const track = tracksRef.current.find((trk) => trk.id === id);
    if (track) {
      track.sampler.volume.value = volume;
    }
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-[250px_1fr] text-slate-200">
      {/* SIDEBAR */}
      <Sidebar />
      <div
        ref={draggableContainerRef}
        className={`flex w-full flex-col gap-y-1 overflow-y-scroll pb-20 pt-4 ${isDraggedOver && "bg-userGray9/95 brightness-150"}`}
      >
        <div className="ml-2 px-4 py-2 text-xl font-medium">
          <button
            type="button"
            onClick={handleStartClick}
            className="flex items-center gap-x-1"
          >
            {isPlaying ? (
              <PauseIcon className="size-5" />
            ) : (
              <PlayIcon className="size-5" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
        <div className="flex flex-col gap-y-2 bg-userGray9 p-4">
          {activeSamples.map(({ name }, trackId) => (
            <SequencerRow
              key={name}
              name={name}
              stepIds={stepIds}
              stepsRef={stepsRef}
              tracksRef={tracksRef}
              trackId={trackId}
              updateSamplerVolume={updateSamplerVolume}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
