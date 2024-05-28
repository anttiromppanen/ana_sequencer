import { useState } from "react";

const colors = [
  "from-userSequenceButtonBlue to-userSequenceButtonBlue/80 border-userSequenceButtonBlue",
  "from-userSequenceButtonMint to-userSequenceButtonMint/80 border-userSequenceButtonMint",
  "from-userSequenceButtonYellow to-userSequenceButtonYellow/80 border-userSequenceButtonYellow",
  "from-userSequenceButtonPink to-userSequenceButtonPink/80 border-userSequenceButtonPink",
  "from-userSequenceButtonPurple to-userSequenceButtonPurple/80 border-userSequenceButtonPurple",
];

const useSampleColorPicker = () => {
  const [index, setIndex] = useState(0);

  const handleGetNextColor = () => {
    setIndex((state) => (state + 1 < colors.length ? state + 1 : 0));
  };

  return {
    color: colors[index],
    handleGetNextColor,
  };
};

export default useSampleColorPicker;
