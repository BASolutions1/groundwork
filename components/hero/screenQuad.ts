export type Point = { x: number; y: number };

/** Corners as percentages of the laptop image width/height. */
export type ScreenQuadPct = {
  tl: Point;
  tr: Point;
  br: Point;
  bl: Point;
};

/**
 * Inner screen glass (inside the black bezel), measured from the current render.
 * More left studio room for copy; laptop sits centre-right.
 */
export const SCREEN_QUAD_PCT: ScreenQuadPct = {
  tl: { x: 64.5, y: 32.0 },
  tr: { x: 88.4, y: 31.4 },
  br: { x: 87.0, y: 58.0 },
  bl: { x: 63.8, y: 57.6 },
};

export function quadPctToPixels(
  pct: ScreenQuadPct,
  width: number,
  height: number,
): { tl: Point; tr: Point; br: Point; bl: Point } {
  const map = (p: Point): Point => ({
    x: (p.x / 100) * width,
    y: (p.y / 100) * height,
  });
  return {
    tl: map(pct.tl),
    tr: map(pct.tr),
    br: map(pct.br),
    bl: map(pct.bl),
  };
}

type Matrix3 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

function multiply(a: Matrix3, b: Matrix3): Matrix3 {
  return [
    a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
    a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
    a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
    a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
    a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
    a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
    a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
    a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
    a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
  ];
}

function adjoint(m: Matrix3): Matrix3 {
  return [
    m[4] * m[8] - m[5] * m[7],
    m[2] * m[7] - m[1] * m[8],
    m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8],
    m[0] * m[8] - m[2] * m[6],
    m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6],
    m[1] * m[6] - m[0] * m[7],
    m[0] * m[4] - m[1] * m[3],
  ];
}

/** Homography mapping four `from` points onto four `to` points. */
function basisToPoints(p: [Point, Point, Point, Point]): Matrix3 {
  const m: Matrix3 = [
    p[0].x,
    p[1].x,
    p[2].x,
    p[0].y,
    p[1].y,
    p[2].y,
    1,
    1,
    1,
  ];
  const adj = adjoint(m);
  const v = [
    adj[0] * p[3].x + adj[1] * p[3].y + adj[2],
    adj[3] * p[3].x + adj[4] * p[3].y + adj[5],
    adj[6] * p[3].x + adj[7] * p[3].y + adj[8],
  ];
  return multiply(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}

/**
 * CSS matrix3d that maps a flat `width`×`height` rectangle onto the screen quad.
 * Quad points are in the same coordinate space as the positioned overlay parent
 * (the laptop image box).
 */
export function getTransformFromQuad(
  width: number,
  height: number,
  quad: { tl: Point; tr: Point; br: Point; bl: Point },
): string {
  if (width <= 0 || height <= 0) return "none";

  const from: [Point, Point, Point, Point] = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];
  const to: [Point, Point, Point, Point] = [quad.tl, quad.tr, quad.br, quad.bl];

  const fromBasis = basisToPoints(from);
  const toBasis = basisToPoints(to);
  const transform = multiply(toBasis, adjoint(fromBasis));

  const normalize = transform[8] || 1;
  const t = transform.map((n) => n / normalize);

  const matrix3d = [
    t[0],
    t[3],
    0,
    t[6],
    t[1],
    t[4],
    0,
    t[7],
    0,
    0,
    1,
    0,
    t[2],
    t[5],
    0,
    t[8],
  ];

  return `matrix3d(${matrix3d.join(",")})`;
}
