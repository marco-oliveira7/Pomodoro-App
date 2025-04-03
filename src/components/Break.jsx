import React from "react";
import { IconSettings } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

const Break = () => {
  const [breakSeconds, setBreakSeconds] = useState(59);
  const [breakMinutes, setbreakMinutes] = useState(5);
  const [isBreakRunning, setIsBreakRunning] = useState(false);

  const intervaloBreak = useRef({ seconds: null, minutes: null });

  useEffect(() => {
    if (isBreakRunning) {
      setBreakSeconds(59);
      intervaloBreak.current.seconds = setInterval(() => {
        setBreakSeconds((s) => (s <= 0 ? 59 : s - 1));
      }, 1000);

      intervaloBreak.current.minutes = setInterval(() => {
        setbreakMinutes((m) => m - 1);
      }, 60000);

      return () => {
        clearInterval(intervaloBreak.current.seconds);
        clearInterval(intervaloBreak.current.minutes);
      };
    }
  }, [isBreakRunning]);

  return (
    <div
      id="break-container"
      className="w-1/2 bg-neutral-950 p-2 flex flex-col items-center"
    >
      <div className="w-full h-1/12 flex flex-row-reverse justify-between">
        <IconSettings size={36} className="cursor-pointer" />
      </div>
      <div className="w-full h-full mb-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl">Break Time</h1>
        <div
          id="break-time"
          className="w-85 flex mb-2 rounded-sm shadow-container"
          onClick={() =>
            setIsBreakRunning(isBreakRunning === false ? true : false)
          }
        >
          <span className="text-9xl cursor-pointer">{breakMinutes}</span>
          <span className="text-9xl cursor-pointer semicolon">:</span>
          <span className="text-9xl cursor-pointer">{breakSeconds}</span>
        </div>
      </div>
    </div>
  );
};

export default Break;
