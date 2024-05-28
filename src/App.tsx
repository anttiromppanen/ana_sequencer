import { useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";
import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { v4 as uuid } from "uuid";
import { soundPack1 as samples } from "./helpers/importSounds";
import Sidebar from "./components/Sidebar/Sidebar";
import useSampleColorPicker from "./hooks/useSampleColorPicker";
import SequencerRow from "./components/SequencerRow";

const numOfSteps = 16;

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSamples, setActiveSamples] = useState(samples);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const tracksRef = useRef([]);
  const stepsRef = useRef([[]]);
  const seqRef = useRef(null);
  const draggableContainerRef = useRef(null);
  const { color, handleGetNextColor } = useSampleColorPicker();

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
    tracksRef.current = activeSamples.map((sample, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: {
          A1: sample.url,
        },
      }).toDestination(),
    }));
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.map((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack("A1", time);
          }
          // lampsRef.current[step].checked = true;
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

  return (
    <div className="grid min-h-screen w-full grid-cols-[300px_1fr] text-white">
      {/* SIDEBAR */}
      <Sidebar />
      <div
        ref={draggableContainerRef}
        className={`flex w-full flex-col gap-y-1 ${isDraggedOver && "bg-userBgColor/95 brightness-150"}`}
      >
        <div className="px-4 py-2">
          <button type="button" onClick={handleStartClick}>
            Play
          </button>
        </div>
        <div className="flex flex-col gap-y-1 p-4">
          {activeSamples.map(({ name }, trackId) => (
            <SequencerRow
              key={name}
              name={name}
              stepIds={stepIds}
              stepsRef={stepsRef}
              trackId={trackId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
