import { useEffect, useState } from "react";

interface HoldButtonProps {
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
  holdTime?: number;
}

const HoldButton = ({
  className,
  onClick,
  children,
  holdTime = 1000,
}: HoldButtonProps) => {
  const [isHolding, setIsHolding] = useState(false);
  const [pressPercentage, setPressPercentage] = useState(0);
  const [timeoutId, setTimeoutId] = useState<any | null>(null);

  const pressInterval = 1000 / holdTime;
  const pressProgressIncrease = 100 / holdTime;

  const handleMouseDown = () => {
    setIsHolding(true);
    setPressPercentage(0);
  };
  const handleMouseUp = () => {
    setIsHolding(false);
    setPressPercentage(0);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  useEffect(() => {
    if (isHolding) {
      const timeoutId = setTimeout(() => {
        setPressPercentage(pressPercentage + pressProgressIncrease);
      }, pressInterval);
      setTimeoutId(timeoutId);
    }
  }, [isHolding, pressPercentage, pressProgressIncrease, pressInterval]);

  useEffect(() => {
    if (pressPercentage >= 100 && isHolding) {
      onClick();
      setPressPercentage(0);
      setIsHolding(false);
    }
  }, [pressPercentage, onClick]);

  return (
    <button
      className={`bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer text-white rounded-md flex items-center flex-col ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex flex-row items-center gap-2 p-2 pb-1">
        {children}
      </div>
      <div className="text-xs w-full min-h-1">
        <span
          className="bg-white/75 h-full rounded-md min-h-1 block"
          style={{ width: `${pressPercentage}%` }}
        />
      </div>
    </button>
  );
};

export default HoldButton;
