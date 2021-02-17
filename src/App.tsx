import React from "react";
import { useMachine } from "@xstate/react";

import logo from "./logo.svg";
import "./App.css";

import { pomodoroMachine } from "./machines/pomodoro";

function App() {
  const [pomodoroState, pomodoroSend] = useMachine(pomodoroMachine);

  return (
    <div className="App">
      <header className="App-header">
        {["idle"].includes(pomodoroState.value.toString()) && (
          <button onClick={() => pomodoroSend("START")}>Start Pomodoro</button>
        )}
        {["paused"].includes(pomodoroState.value.toString()) && (
          <button onClick={() => pomodoroSend("RESUME")}>
            Resume Pomodoro
          </button>
        )}
        {pomodoroState.value.running && (
          <>
            <button onClick={() => pomodoroSend("PAUSE")}>
              Pause Pomodoro
            </button>
            <button onClick={() => pomodoroSend("RESET")}>Stop Pomodoro</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
