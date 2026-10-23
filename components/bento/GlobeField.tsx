import { GLOBE_DOTS } from "./globe-dots";

export function GlobeField() {
  return (
    <svg
      viewBox="0 40 460 320"
      width="100%"
      aria-hidden="true"
      className="block h-auto overflow-visible"
    >
      <g className="globe">
        {GLOBE_DOTS.map(([cx, cy, r, fill, opacity], index) => (
          <circle key={index} cx={cx} cy={cy} r={r} fill={fill} fillOpacity={opacity} />
        ))}
      </g>
      <path
        d="M 70 150 Q 230 20 390 170"
        fill="none"
        stroke="#1F8A4C"
        strokeWidth="1.2"
        strokeOpacity="0.8"
        className="arc1"
      />
      <path
        d="M 120 290 Q 230 120 350 110"
        fill="none"
        stroke="#111111"
        strokeWidth="1"
        strokeOpacity="0.5"
        className="arc2"
      />
      <circle cx="70" cy="150" r="4" fill="#FFFFFF" stroke="#1F8A4C" strokeWidth="1.5" />
      <circle cx="390" cy="170" r="4" fill="#FFFFFF" stroke="#1F8A4C" strokeWidth="1.5" />
      <circle cx="350" cy="110" r="4" fill="#FFFFFF" stroke="#111" strokeWidth="1.5" />
      <circle cx="230" cy="92" r="5" fill="#1F8A4C" className="pulse-svg" />
    </svg>
  );
}
