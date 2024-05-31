import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";
import SequencerRow from "./components/SequencerRow/SequencerRow";
import Sidebar from "./components/Sidebar/Sidebar";
import {
  createInitialTracks,
  createNewTrackFromSound,
} from "./helpers/createNewTracks";
import { ISoundPack } from "./helpers/importSounds";
import { ITrack } from "./types/types";
import resetSteps from "./helpers/resetSteps";

const numOfSteps = 36;

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [tracksRef, setTracksRef] = useState<ITrack[]>([]); // holds the instrument tracks and effects for track
  const stepsRef = useRef<Record<string, HTMLInputElement[]>>({}); // holds the grid track buttons for each row
  const seqRef = useRef<Tone.Sequence | null>(null); // holds the sequencer
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
    setTracksRef(createInitialTracks());
  }, []);

  useEffect(() => {
    // tone.js sequence loop
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        // loops the sequencer buttons by column
        tracksRef.map((trk) => {
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
          tracksRef.forEach((trk) => {
            const previousSequencerButton = stepsRef.current[trk.id][
              step - 1
            ] as HTMLInputElement;

            if (!previousSequencerButton.checked)
              previousSequencerButton.style.filter = "brightness(1)";
            else previousSequencerButton.style.background = "";
          });
        } else {
          // If we are at step 0, reset the last step's background color
          tracksRef.forEach((trk) => {
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
    };
  }, [stepIds, tracksRef]);

  // add new sound when dragged over
  useEffect(
    () =>
      monitorForElements({
        onDrop({ source, location }) {
          const destination = location.current.dropTargets[0];
          if (!destination) {
            // if dropped outside of any drop targets
            return;
          }

          const names = tracksRef.map((x) => x.name);
          if (names.includes(source.data.name as string)) return;

          const newSound = source.data as unknown as ISoundPack;

          const newTrackId =
            tracksRef.length > 0 ? tracksRef[tracksRef.length - 1].id + 1 : 0;

          const newTrack = createNewTrackFromSound(newSound, newTrackId);

          setTracksRef((state) => [...state, newTrack]);
        },
      }),

    [tracksRef],
  );

  // toggle isDraggedOver state when dragged over parent element
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
    const track = tracksRef.find((trk) => trk.id === id);
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
        <div className="flex gap-x-2 px-4 text-xl font-medium">
          <button
            type="button"
            onClick={handleStartClick}
            className="flex h-[44px] w-[112px] items-center justify-center gap-x-1 rounded-md transition-colors hover:bg-userGray8"
          >
            {isPlaying ? (
              <PauseIcon className="size-5" />
            ) : (
              <PlayIcon className="size-5" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => resetSteps(stepsRef, setIsPlaying)}
            className="flex h-[44px] w-[112px] items-center justify-center gap-x-1 rounded-md transition-colors hover:bg-userGray8"
          >
            Reset
          </button>
        </div>
        <div className="flex flex-col gap-y-2 bg-userGray9 p-4">
          {tracksRef.map(({ name, id: trackId }) => (
            <SequencerRow
              key={name}
              name={name}
              stepIds={stepIds}
              stepsRef={stepsRef}
              tracksRef={tracksRef}
              setTracksRef={setTracksRef}
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
