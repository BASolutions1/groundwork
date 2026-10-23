import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        secondary: "#55555A",
        muted: "#8A8A8E",
        done: "#1F8A4C",
        mint: "#9FD9B5",
        deep: "#0E3D22",
        line: "#ECECEA",
      },
      borderRadius: {
        card: "12px",
        control: "4px",
        pill: "999px",
      },
      backgroundImage: {
        "card-tint": "linear-gradient(160deg, #F4F6F2, #EAF0EB)",
        "card-accent": "linear-gradient(160deg, #EEF4EF, #DCEBE1)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "var(--font-jetbrains)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      screens: {
        tab: "700px",
        desk: "900px",
      },
    },
  },
};

export default config;
