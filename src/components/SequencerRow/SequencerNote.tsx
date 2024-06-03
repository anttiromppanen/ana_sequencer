/* eslint-disable no-param-reassign */
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { colorsAsRgba } from "../../const/colors";
import { StepsRefType } from "../../types/types";

interface Props {
  id: string;
  stepsRef: StepsRefType;
  trackId: number;
  stepId: number;
  colorIndex: number;
}

function SequencerNote({ id, stepsRef, trackId, stepId, colorIndex }: Props) {
  // We are creating a snapshot of the values when the drag starts
  // because the [value] will itself change & we need the original
  // [value] to calculate during a drag.
  const [volumeValue, setVolumeValue] = useState(100);
  const [snapshot, setSnapshot] = useState(volumeValue);

  // This captures the starting position of the drag and is used to
  // calculate the diff in positions of the cursor.
  const [startVal, setStartVal] = useState(0);

  // Start the drag to change operation when the mouse button is down.
  const onStart: MouseEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setStartVal(event.clientY);
      setSnapshot(volumeValue);
    },
    [volumeValue],
  );

  // We use document events to update and end the drag operation
  // because the mouse may not be present over the label during
  // the operation..
  useEffect(() => {
    // Only change the value if the drag was actually started.
    const onUpdate = (event: MouseEvent) => {
      if (startVal !== 0) {
        // deduct dragged amount from volumeValue
        let volumeValueCalculation = snapshot - (event.clientY - startVal);

        if (volumeValueCalculation > 100) volumeValueCalculation = 100;
        if (volumeValueCalculation < 0) volumeValueCalculation = 0;

        setVolumeValue(volumeValueCalculation);
      }
    };

    // Stop the drag operation now.
    const onEnd = () => {
      setStartVal(0);
    };

    document.addEventListener("mousemove", onUpdate);
    document.addEventListener("mouseup", onEnd);
    return () => {
      document.removeEventListener("mousemove", onUpdate);
      document.removeEventListener("mouseup", onEnd);
    };
  }, [startVal, snapshot]);

  const [gradientColor1, gradientColor2] = colorsAsRgba[colorIndex];

  return (
    <input
      id={id}
      type="checkbox"
      onMouseDown={onStart}
      ref={(elm) => {
        if (!elm) return;
        if (!stepsRef.current[trackId]) {
          stepsRef.current[trackId] = [];
        }
        stepsRef.current[trackId][stepId] = {
          volume: volumeValue / 100,
          element: elm,
        };
      }}
      className={`  
        cursor-pointer appearance-none rounded-md opacity-50 transition-all
        checked:!opacity-100 checked:!brightness-125 hover:!opacity-85
        `}
      style={{
        background: `linear-gradient(to top, ${gradientColor1} ${volumeValue}%, ${gradientColor2} ${volumeValue}%)`,
      }}
    />
  );
}

export default SequencerNote;
