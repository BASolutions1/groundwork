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
    number: "01",
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
    number: "02",
    done: true,
    person: {
      role: "Insurance broker",
      status: "this week",
      active: true,
      icon: "insurance",
    },
  },
  {
    id: "paid",
    name: "Get paid",
    number: "03",
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
    number: "04",
    done: false,
    person: {
      role: "Web and marketing",
      status: "on standby",
      active: false,
      icon: "web",
    },
  },
  {
    id: "grow",
    name: "Grow",
    number: "05",
    done: false,
    person: {
      role: "Lawyer",
      status: "when needed",
      active: false,
      icon: "lawyer",
    },
  },
];
