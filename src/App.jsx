import { IconMaximize, IconSettings } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import "./app.css";

function App() {
  const [studySeconds, setStudySeconds] = useState(59);
  const [studyMinutes, setStudyMinutes] = useState(20);
  const [breakSeconds, setBreakSeconds] = useState(59);
  const [breakMinutes, setbreakMinutes] = useState(5);
  const [isStudyRunning, setIsStudyRunning] = useState(false);
  const [isBreakRunning, setIsBreakRunning] = useState(false);
  const [isStudyMaximize, setIsStudyMaximize] = useState(false);
  const [isBreakMaximize, setIsBreakMaximize] = useState(false);

  const intervalStudy = useRef({ seconds: null, minutes: null });
  const intervaloBreak = useRef({ seconds: null, minutes: null });

  useEffect(() => {
    if (isStudyRunning) {
      intervalStudy.current.minutes = setInterval(() => {
        setStudyMinutes((m) => m - 1);        
      }, 60000);
      
      intervalStudy.current.seconds = setInterval(() => {
        setStudySeconds((s) => (s <= 0 ? 59 : s - 1));
      }, 1000);


      return () => {
        clearInterval(intervalStudy.current.seconds);
        clearInterval(intervalStudy.current.minutes);
      };
    }
  }, [isStudyRunning]);

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

  useEffect(() => {
    const studyContainer = document.querySelector("#study-container");
    const breakContainer = document.querySelector("#break-container");
    const breakTime = document.querySelector("#break-time");
    const semicolon = document.querySelectorAll(".semicolon")[1];

    studyContainer.classList.toggle("maximize");
    breakContainer.classList.toggle("shrink");
    breakTime.classList.toggle("flex-col");
    semicolon.classList.toggle("hidden");
  }, [isStudyMaximize]);

  useEffect(() => {
    const studyContainer = document.querySelector("#study-container");
    const breakContainer = document.querySelector("#break-container");
    const studyTime = document.querySelector("#study-time");
    const semicolon = document.querySelectorAll(".semicolon")[0];

    studyContainer.classList.toggle("shrink");
    breakContainer.classList.toggle("maximize");
    studyTime.classList.toggle("flex-col");
    semicolon.classList.toggle("hidden");
  }, [isBreakMaximize]);

  return (
    <div className="flex h-screen text-white">
      <div
        id="study-container"
        className="w-1/2 bg-neutral-950 p-2 border-r-2 border-white flex flex-col items-center"
      >
        <div className="w-full h-1/12 flex justify-between">
          <IconSettings size={36} className="cursor-pointer" />
          <IconMaximize
            onClick={() =>
              setIsStudyMaximize(
                isStudyMaximize === false && isBreakMaximize === false
                  ? true
                  : false
              )
            }
            size={36}
            className="cursor-pointer"
          />
        </div>
        <div className="w-full h-full mb-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl">Study Time</h1>
          <div
            id="study-time"
            className="w-85 flex mb-2 rounded-sm shadow-container"
            onClick={() =>
              setIsStudyRunning(isStudyRunning === false && isBreakRunning === false ? true : false)
            }
          >
            <span className="text-9xl cursor-pointer">{studyMinutes}</span>
            <span className="text-9xl cursor-pointer semicolon">:</span>
            <span className="text-9xl cursor-pointer">{studySeconds}</span>
          </div>
        </div>
      </div>

      <div
        id="break-container"
        className="w-1/2 bg-neutral-950 p-2 flex flex-col items-center"
      >
        <div className="w-full h-1/12 flex flex-row-reverse justify-between">
          <IconSettings size={36} className="cursor-pointer" />
          <IconMaximize
            size={36}
            className="cursor-pointer"
            onClick={() =>
              setIsBreakMaximize(
                isBreakMaximize === false && isStudyMaximize === false
                  ? true
                  : false
              )
            }
          />
        </div>
        <div className="w-full h-full mb-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl">Break Time</h1>
          <div
            id="break-time"
            className="w-85 flex mb-2 rounded-sm shadow-container"
            onClick={() =>
              setIsBreakRunning(isBreakRunning === false && isStudyRunning === false? true : false)
            }
          >
            <span className="text-9xl cursor-pointer">{breakMinutes}</span>
            <span className="text-9xl cursor-pointer semicolon">:</span>
            <span className="text-9xl cursor-pointer">{breakSeconds}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
