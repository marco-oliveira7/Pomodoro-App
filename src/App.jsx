import "./app.css";
import React from "react";
import { IconSettings, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import soundStudy from "./assets/audios/alarm.mp3";
import soundBreak from "./assets/audios/david-goggins.mp3";

function App() {
  const [component, setComponent] = useState("Study");
  const [showConfig, setShowConfig] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const interval = useRef({
    seconds: null,
    minutes: null,
  });

  const url = useRef({ urlStudy: null, urlBreak: null });

  const [newMinutes, setNewMinutes] = useState(0);
  const [newSeconds, setNewSeconds] = useState(0);

  let audioBreak = new Audio();
  let audioStudy = new Audio();

  useEffect(() => {
    if (component === "Break")
      document.title = `${minutes}:${seconds} - Break Time`;
    else if (component === "Study")
      document.title = `${minutes}:${seconds} - Study Time`;

    if (minutes <= 0 && seconds <= 0 && component === "Study") {
      setIsRunning(false);
      setMinutes(5);
      setComponent("Break");

      if (url.current.urlStudy) {
        console.log("audio modificado");
        audioStudy = new Audio(url.current.urlStudy);
        audioStudy.play();
      } else {
        console.log("audio padrao");
        audioStudy = new Audio(soundStudy);
        audioStudy.play();
      }
    } else if (minutes <= 0 && seconds <= 0 && component === "Break") {
      setIsRunning(false);
      setMinutes(20);
      setComponent("Study");
      if (url.current.urlBreak) {
        console.log("audio modificado");
        audioBreak = new Audio(url.current.urlBreak);
        audioBreak.play();
      } else {
        console.log("audio padrao");
        audioBreak = new Audio(soundBreak);
        audioBreak.play();
      }
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
    setMinutes(newMinutes);
    setSeconds(newSeconds);
    setShowConfig(false);
  }

  function handleNewAudio(e) {
    if (component === "Break") {
      console.log("componente atual eh o Break");
      const file = e.target.files[0];
      if (file) {
        url.current.urlBreak = URL.createObjectURL(file);
        console.log(url.current.urlBreak);
      }
    } else if (component === "Study") {
      console.log("componente atual eh o Study");
      const file = e.target.files[0];
      if (file) {
        url.current.urlStudy = URL.createObjectURL(file);
        console.log(url.current.urlStudy);
      }
    }
  }

  function handleExistentAudios() {
    if (component === "Study") {
      url.current.urlStudy = null;
    } else if (component === "Break") {
      url.current.urlBreak = null;
    }
  }

  return (
    <div className="flex h-screen text-white">
      <div className="w-full bg-neutral-950 p-2  flex flex-col items-center">
        <div className="w-full h-1/12 flex justify-between">
          <IconSettings
            size={36}
            className="cursor-pointer"
            onClick={() => setShowConfig(showConfig === false ? true : false)}
          />
        </div>
        <div className="h-full mb-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl">{component} Time</h1>
          <div className="timer-container">
            <span className="text-9xl select-none">
              {minutes < 10 ? "0" : ""}
              {minutes}
            </span>
            <span className="text-9xl select-none">:</span>
            <span className="text-9xl select-none">
              {seconds < 10 ? "0" : ""}
              {seconds}
            </span>
          </div>
          <button
            className="px-8 py-4 bg-neutral-800 rounded-2xl text-xl tracking-widest cursor-pointer"
            onClick={() => setIsRunning(isRunning === false ? true : false)}
          >
            {isRunning === false ? "Start" : "Pause"}
          </button>
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
          <div className="flex flex-col justify-evenly items-center h-3/4">
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="minutes">Minutes</label>
              <input
                type="number"
                min={0}
                max={59}
                id="minutes"
                className="text-center border-2 border-white rounded-2xl w-3xs outline-none py-1 px-2"
                value={newMinutes}
                onChange={(e) =>
                  e.target.value >= 60 ||
                  e.target.value === 0 ||
                  /[^0-9]/.test(e.target.value)
                    ? console.log(
                        "apenas numeros menores que 60 sao permitidos"
                      )
                    : setNewMinutes(e.target.value)
                }
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="seconds">Seconds</label>
              <input
                type="number"
                min={0}
                max={59}
                id="seconds"
                className="text-center border-2 border-white rounded-2xl w-3xs outline-none py-1 px-2"
                value={newSeconds}
                onChange={(e) =>
                  e.target.value >= 60 ||
                  e.target.value === 0 ||
                  /[^0-9]/.test(e.target.value)
                    ? console.log(
                        "apenas numeros menores que 60 sao permitidos"
                      )
                    : setNewSeconds(e.target.value)
                }
              />
            </div>

            <div className="flex flex-col items-center justify-center">
              <label htmlFor="sounds">
                Sounds for when time {component} done
              </label>
              <input
                type="file"
                id="sounds"
                className="border-2 border-white rounded-2xl outline-none py-1 px-2 h-12"
                accept="audio/*"
                onChange={handleNewAudio}
              />
            </div>

            <div className="w-full flex justify-evenly">
              <div className="flex flex-col items-center justify-center">
                <label htmlFor="david-goggins">David Goggins Audio</label>
                <input
                  type="radio"
                  id="david-goggins"
                  name="sound"
                  className="border-2 border-white rounded-2xl outline-none py-1 px-2 h-12"
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <label htmlFor="iphone-alarm">Iphone Alarm Audio</label>
                <input
                  type="radio"
                  id="iphone-alarm"
                  name="sound"
                  className="border-2 border-white rounded-2xl outline-none py-1 px-2 h-12"
                />
              </div>
            </div>
            <button
              className="mt-1 py-2 px-4 bg-neutral-800 rounded-xl w-1/3 self-center btn-save"
              onClick={handleNewSettings}
            >
              Save
            </button>
          </div>

          <p className="text-end absolute bottom-0 right-0 p-1 text-xs text-neutral-400">
            note: if you refresh the page the audio file that you put will be
            lost
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
