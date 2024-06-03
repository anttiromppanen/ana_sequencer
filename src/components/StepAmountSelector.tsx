import { StepValuesType } from "../types/types";
import useGlobalsStore from "../store/globalsStore";

const values: StepValuesType[] = [8, 16, 32];

function StepAmountSelector() {
  const { stepAmount, setStepAmount } = useGlobalsStore((state) => state);

  return (
    <div className="flex items-center gap-x-2 rounded-md *:relative *:flex *:size-8 *:cursor-pointer *:items-center *:justify-center">
      {values.map((value) => (
        <label key={value} htmlFor={String(value)} className="group">
          <input
            type="radio"
            name="stepsAmount"
            id={String(value)}
            value={value}
            checked={stepAmount === value}
            onChange={() => setStepAmount(value)}
            className="peer appearance-none"
          />
          <span className="relative z-10 select-none text-neutral-400 group-hover:text-neutral-200 peer-checked:text-neutral-200">
            {value}
          </span>
          <div
            className="
            peer-focus:border-1 absolute left-0 top-0 z-0 h-full w-full rounded-md peer-checked:bg-black"
          />
        </label>
      ))}
    </div>
  );
}

export default StepAmountSelector;
