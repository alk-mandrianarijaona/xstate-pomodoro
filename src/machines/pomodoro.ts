import { Machine, Sender } from "xstate";

const endPhase = (timeout: number) => (context: any) => (cb: Sender<any>) => {
  const interval = setInterval(() => {
    cb("END");
  }, timeout);

  return () => {
    clearInterval(interval);
  };
};

const phaseStates = {
  initial: "work",
  states: {
    work: {
      invoke: {
        src: endPhase(25 * 60 * 1000),
      },
      on: {
        END: "rest",
      },
    },
    rest: {
      invoke: {
        src: endPhase(5 * 60 * 1000),
      },
      on: { END: "work" },
    },
  },
};

export const pomodoroMachine = Machine({
  id: "pomodoro",
  initial: "idle",
  states: {
    idle: {
      on: {
        START: "running",
      },
    },
    running: {
      on: {
        PAUSE: "paused",
        RESET: "idle",
      },
      ...phaseStates,
    },
    paused: {
      on: {
        RESUME: "running",
      },
    },
  },
});
