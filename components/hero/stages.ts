export type StagePerson = {
  role: string;
  status: string;
  /** Green chip border + green wire when true. */
  active: boolean;
  icon: "accountant" | "insurance" | "guide" | "web" | "lawyer";
};

export type Stage = {
  id: string;
  name: string;
  number: string;
  done: boolean;
  person: StagePerson;
};

/** Edit stages, people and statuses here. Diagram reads from this array. */
export const STAGES: Stage[] = [
  {
    id: "register",
    name: "Register",
    number: "1",
    done: true,
    person: {
      role: "Accountant",
      status: "introduced",
      active: true,
      icon: "accountant",
    },
  },
  {
    id: "setup",
    name: "Set up",
    number: "2",
    done: true,
    person: {
      role: "Bookkeeper",
      status: "this week",
      active: true,
      icon: "accountant",
    },
  },
  {
    id: "paid",
    name: "Get paid",
    number: "3",
    done: false,
    person: {
      role: "Your guide",
      status: "with you",
      active: true,
      icon: "guide",
    },
  },
  {
    id: "found",
    name: "Get found",
    number: "4",
    done: false,
    person: {
      role: "Marketing",
      status: "on standby",
      active: false,
      icon: "web",
    },
  },
  {
    id: "grow",
    name: "Grow",
    number: "5",
    done: false,
    person: {
      role: "Advisor",
      status: "when needed",
      active: false,
      icon: "lawyer",
    },
  },
];
