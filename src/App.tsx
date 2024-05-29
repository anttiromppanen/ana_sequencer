import { useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";
import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import { soundPack1 as samples } from "./helpers/importSounds";
import Sidebar from "./components/Sidebar/Sidebar";
import SequencerRow from "./components/SequencerRow/SequencerRow";

const numOfSteps = 16;

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSamples, setActiveSamples] = useState(samples);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const tracksRef = useRef([]);
  const stepsRef = useRef([[]]);
  const seqRef = useRef(null);
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
    tracksRef.current = activeSamples.map((sample, i) => {
      const reverb = new Tone.JCReverb(0).toDestination();
      const distortion = new Tone.Distortion(0).toDestination();
      return {
        id: i,
        effects: { Reverb: reverb, Distortion: distortion },
        sampler: new Tone.Sampler({
          urls: {
            A1: sample.url,
          },
          volume: -50,
        }).fan(reverb, distortion),
      };
    });

    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.map((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack("A1", time);
          }
          if (!stepsRef.current[trk.id][step].checked)
            stepsRef.current[trk.id][step].style.filter = "brightness(1.2)";
          else
            stepsRef.current[trk.id][step].style.background =
              "rgba(255,255,255,0.9)";
        });

        if (step > 0) {
          tracksRef.current.forEach((trk) => {
            if (!stepsRef.current[trk.id][step - 1].checked)
              stepsRef.current[trk.id][step - 1].style.filter = "brightness(1)";
            else stepsRef.current[trk.id][step - 1].style.background = "";
          });
        } else {
          // If we are at step 0, reset the last step's background color
          tracksRef.current.forEach((trk) => {
            if (!stepsRef.current[trk.id][stepIds.length - 1].checked)
              stepsRef.current[trk.id][stepIds.length - 1].style.filter =
                "brightness(1)";
            else
              stepsRef.current[trk.id][stepIds.length - 1].style.background =
                "";
          });
        }
      },
      [...stepIds],
      "16n",
    );

    seqRef.current.start(0);

    return () => {
      seqRef.current?.dispose();
      tracksRef.current.map((trk) => void trk.sampler.dispose());
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
          if (names.includes(source.data.name)) return;

          setActiveSamples((state) => [...state, source.data]);
        },
      }),

    [activeSamples],
  );

  useEffect(() => {
    const el = draggableContainerRef.current;

    if (!el) return undefined;

    return dropTargetForElements({
      element: el,
      getData: () => ({ location }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  const updateSamplerVolume = (id, volume) => {
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
        className={`flex w-full flex-col gap-y-1 overflow-y-scroll pb-20 pt-4 ${isDraggedOver && "bg-userBgColor/95 brightness-150"}`}
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
        <div className="flex flex-col gap-y-1 p-4">
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
