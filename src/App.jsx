import "./app.css";
import React from "react";
import { IconSettings, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

function App() {
  const [component, setComponent] = useState("Study");
  const [showConfig, setShowConfig] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const interval = useRef({
    seconds: null,
    minutes: null,
  });

  const [newMinutes, setNewMinutes] = useState(0);
  const [newSeconds, setNewSeconds] = useState(0);

  useEffect(() => {
    if (component === "Break")
      document.title = `${minutes}:${seconds} - Break Time`;
    else if (component === "Study")
      document.title = `${minutes}:${seconds} - Study Time`;

    if (minutes <= 0 && seconds <= 0 && component === "Study") {
      setIsRunning(false);
      setMinutes(5);
      setComponent("Break");
    } else if (minutes <= 0 && seconds <= 0 && component === "Break") {
      setIsRunning(false);
      setMinutes(20);
      setComponent("Study");
    }
  }, [minutes, seconds]);

  useEffect(() => {
    if (isRunning) {
      interval.current.seconds = setInterval(() => {
        setSeconds((s) => {
          const newSeconds =
            s <= 0
              ? {
                  seconds: 59,
                  isSecondsZero: true,
                }
              : {
                  seconds: s - 1,
                  isSecondsZero: false,
                };

          if (newSeconds.isSecondsZero) {
            setMinutes((m) => m - 1);
          }
          return newSeconds.seconds;
        });
      }, 1000);

      return () => {
        clearInterval(interval.current.seconds);
        clearInterval(interval.current.minutes);
      };
    }
  }, [isRunning]);


  function handleNewSettings() {
    setMinutes(newMinutes)
    setSeconds(newSeconds)
    setShowConfig(false)
  }

  return (
    <div className="flex h-screen text-white">
      <div
        className="w-full bg-neutral-950 p-2  flex flex-col items-center"
      >
        <div className="w-full h-1/12 flex justify-between">
          <IconSettings
            size={36}
            className="cursor-pointer"
            onClick={() => setShowConfig(showConfig === false ? true : false)}
          />
        </div>
        <div className="w-full h-full mb-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl">{component} Time</h1>
          <div
            className="w-85 flex justify-center mb-2 rounded-sm shadow-container"
            onClick={() => setIsRunning(isRunning === false ? true : false)}
          >
            <span className="text-9xl cursor-pointer">{minutes}</span>
            <span className="text-9xl cursor-pointer">:</span>
            <span className="text-9xl cursor-pointer w-27">{seconds}</span>
          </div>
        </div>
      </div>
      {showConfig && (
        <div className="config bg-neutral-900 h-3/4 w-2xl p-2 rounded-xl">
          <div className="w-full h-1/12 flex flex-row-reverse justify-between">
            <IconX
              size={36}
              className="cursor-pointer"
              onClick={() => setShowConfig(showConfig === false ? true : false)}
            />
          </div>
          <div>
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="minutes">Minutes</label>
              <input
                type="number"
                min={0}
                max={59}
                id="minutes"
                className="border-2 border-white rounded-2xl outline-none py-1 px-2"
                value={newMinutes}
                onChange={(e) => setNewMinutes(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="seconds">Seconds</label>
              <input
                type="number"
                min={0}
                max={59}
                id="seconds"
                className="border-2 border-white rounded-2xl outline-none py-1 px-2"
                value={newSeconds}
                onChange={(e) => setNewSeconds(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="sounds">Sounds</label>
              <input
                type="file"
                id="sounds"
                className="border-2 border-white rounded-2xl outline-none py-1 px-2"
                accept=".mp3"
              />
            </div>
          </div>
          <button
            className="mt-1 py-2 px-4 bg-neutral-800 rounded-xl btn-save"
            onClick={handleNewSettings}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
