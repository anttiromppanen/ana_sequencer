import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ArrowPathIcon, PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";
import SequencerRow from "./components/SequencerRow/SequencerRow";
import Sidebar from "./components/Sidebar/Sidebar";
import StepAmountSelector from "./components/StepAmountSelector";
import {
  createInitialTracks,
  createNewTrackFromSound,
} from "./helpers/createNewTracks";
import { ISoundPack } from "./helpers/importSounds";
import resetSteps from "./helpers/resetSteps";
import { ITrack } from "./types/types";
import useGlobalsStore from "./store/globalsStore";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const { stepAmount } = useGlobalsStore((state) => state);
  const [tracksRef, setTracksRef] = useState<ITrack[]>([]); // holds the instrument tracks and effects for track
  const stepsRef = useRef<
    Record<number, { volume: number; element: HTMLInputElement }[]>
  >({}); // holds the grid track buttons for each row
  const seqRef = useRef<Tone.Sequence | null>(null); // holds the sequencer
  const draggableContainerRef = useRef(null);

  const stepIds = useMemo(
    () => [...Array(stepAmount).keys()] as const,
    [stepAmount],
  );

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
          const sequencerColumnButton = stepsRef.current[trk.id][step]
            .element as HTMLInputElement;
          const sequencerNoteTime = stepsRef.current[trk.id][step].volume;

          if (sequencerColumnButton.checked) {
            trk.sampler.triggerAttack("A1", time, sequencerNoteTime);
          }

          // current column note highlighting
          if (!sequencerColumnButton.checked) {
            sequencerColumnButton.style.filter = "brightness(1.2)";
            sequencerColumnButton.style.opacity = "0.8";
          } else {
            sequencerColumnButton.style.boxShadow =
              "0 0 50px 3px rgba(255,255,255,1)";
          }

          return undefined;
        });

        // reset previous column highlighting
        if (step > 0) {
          tracksRef.forEach((trk) => {
            const previousSequencerButton = stepsRef.current[trk.id][step - 1]
              .element as HTMLInputElement;

            if (!previousSequencerButton.checked) {
              previousSequencerButton.style.filter = "brightness(1)";
              previousSequencerButton.style.opacity = "0.5";
            } else {
              previousSequencerButton.style.boxShadow = "none";
            }
          });
        } else {
          // If we are at step 0, reset the last step's background color
          tracksRef.forEach((trk) => {
            const lastColumnSequencerButton = stepsRef.current[trk.id][
              stepIds.length - 1
            ].element as HTMLInputElement;

            if (!lastColumnSequencerButton.checked) {
              lastColumnSequencerButton.style.filter = "brightness(1)";
              lastColumnSequencerButton.style.opacity = "0.5";
            } else {
              lastColumnSequencerButton.style.boxShadow = "none";
            }
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
    <div className="grid h-screen w-full grid-cols-[250px_1fr] text-slate-200">
      <Sidebar />
      <div
        ref={draggableContainerRef}
        className={`flex w-full flex-col gap-y-1 overflow-y-scroll pb-20 pt-4 ${isDraggedOver && "bg-userGray9/95 brightness-150"}`}
      >
        {/* TOP NAV */}
        <div className="flex justify-between gap-x-2 px-4 pr-10 text-xl font-medium">
          <div className="flex">
            <button
              type="button"
              onClick={handleStartClick}
              className="flex h-[44px] w-[112px] items-center justify-center gap-x-2 rounded-md transition-colors hover:bg-userGray8"
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
              className="flex h-[44px] w-[112px] items-center justify-center gap-x-2 rounded-md transition-colors hover:bg-userGray8"
            >
              <ArrowPathIcon className="size-5" />
              Reset
            </button>
          </div>
          {/* STEPS AMOUNT SELECTOR */}
          <StepAmountSelector />
        </div>
        <div className="flex flex-col gap-y-2 overflow-x-auto overflow-y-hidden bg-userGray9 p-4">
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
