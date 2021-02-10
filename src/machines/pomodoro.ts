import { Machine, Sender } from "xstate";

const endPhase = (timeout: number) => (context: any) => (cb: Sender<any>) => {
  const interval = setInterval(() => {
    cb("END");
  }, timeout);

  return () => {
    clearInterval(interval);
  };
};

interface PomodoroContext {
  nextEndTime?: Date | null;
}
interface PomodoroMachineSchema {
  states: {
    idle: {};
    running: {
      states: {
        work: {};
        rest: {};
      };
    };
    paused: {};
  };
}

type PomodoroEvent =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "RESUME" }
  | { type: "END_PHASE" };

export const pomodoroMachine = Machine<
  PomodoroContext,
  PomodoroMachineSchema,
  PomodoroEvent
>({
  id: "pomodoro",
  initial: "idle",
  states: {
    idle: {
      on: {
        START: "running",
      },
    },
    running: {
      initial: "work",
      on: {
        PAUSE: "paused",
        RESET: "idle",
      },
      states: {
        work: {
          invoke: {
            src: endPhase(25 * 60 * 1000),
          },
          on: {
            END_PHASE: "rest",
          },
        },
        rest: {
          invoke: {
            src: endPhase(5 * 60 * 1000),
          },
          on: { END_PHASE: "work" },
        },
      },
    },
    paused: {
      on: {
        RESUME: "running",
      },
    },
  },
});
