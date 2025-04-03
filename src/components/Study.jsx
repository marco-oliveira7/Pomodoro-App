import React from "react";
import { IconSettings } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

const Study = () => {
  const [studySeconds, setStudySeconds] = useState(4);
  const [studyMinutes, setStudyMinutes] = useState(20);
  const [isStudyRunning, setIsStudyRunning] = useState(false);
  const [isStudyNotRunning, setIsStudyNotRunning] = useState(false);
  const [isSecondsZero, setIsSecondsZero] = useState(false);
  const intervalStudy = useRef({
    seconds: null,
    minutes: null,
    invisibleSeconds: null,
  });

  useEffect(() => {
    let i = 0;
    if (isStudyRunning) {
      //   intervalStudy.current.minutes = setInterval(() => {
      //     setStudyMinutes((m) => m - 1);
      //   }, 60000);

      intervalStudy.current.seconds = setInterval(() => {
        setStudySeconds((s) => {
          const newSeconds =
            s <= 0
              ? {
                  seconds: 59,
                  isSecondsZero: true,
                }
              : {
                  seconds: s-1,
                  isSecondsZero: false,
                };
          return newSeconds.seconds;
        });
      }, 1000);

      return () => {
        clearInterval(intervalStudy.current.seconds);
        clearInterval(intervalStudy.current.minutes);
      };
    }
  }, [isStudyRunning]);

  return (
    <div
      id="study-container"
      className="w-full bg-neutral-950 p-2  flex flex-col items-center"
    >
      <div className="w-full h-1/12 flex justify-between">
        <IconSettings size={36} className="cursor-pointer" />
      </div>
      <div className="w-full h-full mb-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl">Study Time</h1>
        <div
          id="study-time"
          className="w-85 flex mb-2 rounded-sm shadow-container"
          onClick={() =>
            setIsStudyRunning(isStudyRunning === false ? true : false)
          }
        >
          <span className="text-9xl cursor-pointer">{studyMinutes}</span>
          <span className="text-9xl cursor-pointer semicolon">:</span>
          <span className="text-9xl cursor-pointer">{studySeconds}</span>
        </div>
      </div>
    </div>
  );
};

export default Study;
