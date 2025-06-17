import "./app.css";
import React from "react";
import { IconSettings, IconX, IconChevronsRight } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import defaultSound from "./assets/audios/default-sound.mp3";

function App() {
  const [component, setComponent] = useState("Study");
  const [showConfig, setShowConfig] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [next, setNext] = useState(false);
  const [count, setCount] = useState(0);
  const interval = useRef({
    seconds: null,
    minutes: null,
  });

  const url = useRef({ urlStudy: null, urlBreak: null });

  const [newMinutes, setNewMinutes] = useState();
  const [newSeconds, setNewSeconds] = useState();

  let audioBreak = new Audio();
  let audioStudy = new Audio();

  useEffect(() => {
    if (next) {
      setNext(false);
      if (component === "Study") {
        setIsRunning(false);
        setComponent("Break");
        setMinutes(5);
        setSeconds(0);
        setCount((c) => c + 1);
      } else {
        setIsRunning(false);
        setComponent("Study");
        setMinutes(20);
        setSeconds(0);
      }
    }
  }, [next]);

  useEffect(() => {
    if (component === "Break")
      document.title = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds} - Break Time`;
    else if (component === "Study")
      document.title = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds} - Study Time`;

    if (minutes <= 0 && seconds <= 0 && component === "Study") {
      setIsRunning(false);
      setMinutes(5);
      setSeconds(0);
      setComponent("Break");
      setCount((c) => c + 1);

      // Lógica para garantir que a notificação irá aparecer na tela do usuário
      if (Notification.permission === "granted") {
        const notification = new Notification(
          `The ${component} time has done!`, {silent: true}
        );
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const notification = new Notification(
              `The ${component} time has done!`, {silent: true}
            );
          }
        });
      }

      if (url.current.urlStudy) {
        playSound(audioStudy, url.current.urlStudy);
      } else {
        playSound(audioStudy, defaultSound);
      }
    } else if (minutes <= 0 && seconds <= 0 && component === "Break") {
      setIsRunning(false);
      setMinutes(20);
      setSeconds(0);
      setComponent("Study");

      // Lógica para garantir que a notificação irá aparecer na tela do usuário
      if (Notification.permission === "granted") {
        const notification = new Notification(
          `The ${component} time has done!`, {silent: true}
        );
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const notification = new Notification(
              `The ${component} time has done!`, {silent: true}
            );
          }
        });
      }

      if (url.current.urlBreak) {
        playSound(audioBreak, url.current.urlBreak);
      } else {
        playSound(audioBreak, defaultSound);
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

  function playSound(audio, sound) {
    audio = new Audio(sound);
    audio.volume = 0.1;
    audio.play();
  }

  function handleNewSettings() {
    const inputMinutes = document.querySelector("#minutes");
    const inputSeconds = document.querySelector("#seconds");
    if (
      inputMinutes.value === "" ||
      inputSeconds.value === "" ||
      inputMinutes.value.toString()[0] === "0"
    ) {
      console.log("preencha os campos");
    } else {
      setMinutes(newMinutes);
      setSeconds(newSeconds);
      setShowConfig(false);
    }
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
          <div className="timer-container my-5">
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
          <div className="relative w-84 flex flex-col justify-center next-container">
            <button
              className="px-8 py-4 bg-neutral-800 rounded-2xl text-xl tracking-widest cursor-pointer self-center"
              onClick={() => setIsRunning(isRunning === false ? true : false)}
            >
              {isRunning === false ? "Start" : "Pause"}
            </button>
            {isRunning && (
              <IconChevronsRight
                size={36}
                className="next-icon absolute top-1/5 right-10"
                onClick={() => setNext(true)}
              />
            )}
            {count > 0 && (
              <p className="mt-1 self-center font-semibold text-md">
                You are in your {count} study section
              </p>
            )}
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
          <div className="flex flex-col justify-evenly items-center h-3/4">
            {/* input for minutes */}
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="minutes">Minutes</label>
              <input
                type="number"
                min={1}
                max={60}
                id="minutes"
                className="text-center border-2 border-white rounded-2xl w-3xs outline-none py-1 px-2"
                value={newMinutes}
                onChange={(e) =>
                  e.target.value >= 61 || e.target.value.toString()[0] === "0"
                    ? console.log(``)
                    : setNewMinutes(e.target.value)
                }
              />
            </div>

            {/* input for seconds */}
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="seconds">Seconds</label>
              <input
                type="number"
                min={1}
                max={59}
                id="seconds"
                className="text-center border-2 border-white rounded-2xl w-3xs outline-none py-1 px-2"
                value={newSeconds}
                onChange={(e) =>
                  e.target.value >= 60 ||
                  /[^0-9]/.test(e.target.value) ||
                  e.target.value.length > 2 ||
                  (e.target.value.toString()[0] === "0" &&
                    e.target.value.toString()[1] === "0")
                    ? console.log("")
                    : setNewSeconds(e.target.value)
                }
              />
            </div>

            {/* input for files */}
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
