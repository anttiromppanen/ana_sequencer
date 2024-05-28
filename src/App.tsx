import { useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";
import { soundPack1 as samples } from "./helpers/importSounds";

const numOfSteps = 16;

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const tracksRef = useRef([]);
  const stepsRef = useRef([[]]);
  const seqRef = useRef(null);

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
    tracksRef.current = samples.map((sample, i) => ({
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
            stepsRef.current[trk.id][step].style.filter = "brightness(2)";
        });

        if (step > 0) {
          tracksRef.current.forEach((trk) => {
            if (!stepsRef.current[trk.id][step - 1].checked)
              stepsRef.current[trk.id][step - 1].style.filter = "brightness(1)";
          });
        } else {
          // If we are at step 0, reset the last step's background color
          tracksRef.current.forEach((trk) => {
            if (!stepsRef.current[trk.id][stepIds.length - 1].checked)
              stepsRef.current[trk.id][stepIds.length - 1].style.filter =
                "brightness(1)";
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
  }, [stepIds]);

  return (
    <div className="grid min-h-screen w-full grid-cols-[300px_1fr] text-white">
      {/* SIDEBAR */}
      <div className="bg-userSidebarBg">
        <button type="button" onClick={handleStartClick}>
          Start
        </button>
      </div>
      <div className="flex w-full flex-col gap-y-1 p-4">
        {samples.map(({ name }, trackId) => (
          <div
            key={name}
            className="grid h-20 grid-cols-[200px_repeat(16,1fr)] gap-1"
          >
            <div>{name}</div>
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
                  className="
                  from-userSequenceButtonBlue to-userSequenceButtonBlue/80 border-userSequenceButtonBlue appearance-none rounded-lg border
                  bg-gradient-to-bl shadow-[inset_10px_10px_72px_0px_rgba(240,240,240,0.1)] checked:shadow-[0px_0px_4px_1px_rgba(45,255,196,0.6)] checked:!brightness-150"
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
