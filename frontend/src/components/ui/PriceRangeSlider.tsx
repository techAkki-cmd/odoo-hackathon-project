import { useCallback, useEffect, useState, useRef } from "react";

type PriceRangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: { min: number; max: number };
  onChange: ({ min, max }: { min: number; max: number }) => void;
};

export function PriceRangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
}: PriceRangeSliderProps) {
  const [minVal, setMinVal] = useState(value.min);
  const [maxVal, setMaxVal] = useState(value.max);
  const range = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMinVal(value.min);
    setMaxVal(value.max);
  }, [value.min, value.max]);

  const getPercent = useCallback(
    (val: number) => Math.round(((val - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  const handleMouseUp = () => {
    onChange({ min: minVal, max: maxVal });
  };

  return (
    <div className="relative h-10 flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={(event) => {
          const val = Math.min(Number(event.target.value), maxVal - (step || 1));
          setMinVal(val);
        }}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - 100 ? 5 : undefined }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={(event) => {
          const val = Math.max(Number(event.target.value), minVal + (step || 1));
          setMaxVal(val);
        }}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        className="thumb thumb--right"
      />

      <div className="relative w-full">
        <div className="absolute rounded h-1.5 bg-gray-300 w-full z-0" />
        <div
          ref={range}
          className="absolute rounded h-1.5 bg-gradient-to-r from-purple-600 to-blue-600 z-1"
        />
      </div>
    </div>
  );
}
