/** Fullscreen triangle. */
export const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

/**
 * The score field, composited (SRC_ALPHA, ONE_MINUS_SRC_ALPHA) over opaque black.
 *
 *   scroll 0 -> a loose field of conducted strings that ripple under the pointer
 *   scroll 1 -> five clean staff lines at the footer's stave proportions
 *
 * Coverage is "distance to the nearest line", so lines stay thin and distinct
 * however many of them there are.
 */
export const FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform vec2  uRes;      // drawing-buffer pixels
uniform float uTime;
uniform float uScroll;   // 0..1 hero resolve
uniform vec2  uPointer;  // 0..1, y from top
uniform float uVel;      // pointer speed energy, 0..~1
uniform float uReduced;  // 1.0 => hold still

out vec4 frag;

// AA line: 1.0 on the line, 0.0 beyond ~1.6px
float lineAA(float dyPx) {
  return 1.0 - smoothstep(0.75, 2.2, abs(dyPx));
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 uv = px / uRes;                 // y up
  float yTop = 1.0 - uv.y;             // 0 at viewport top
  float aspect = uRes.x / uRes.y;
  float H = uRes.y;
  float x = uv.x * aspect;

  float resolve = smoothstep(0.0, 1.0, uScroll);
  float still = clamp(uReduced, 0.0, 1.0);

  float amp = mix(0.130, 0.004, resolve) * (1.0 - still * 0.95);

  vec2 p = vec2(uv.x, yTop);
  float pd = distance(p, uPointer);
  float near = exp(-pd * pd * 16.0);
  float ripple = near * (0.05 + 0.6 * uVel) * (1.0 - resolve * 0.75) * (1.0 - still);
  amp += ripple;

  float cover = 0.0;   // nearest-line coverage 0..1
  float brass = 0.0;

  // --- loose field: 22 strings, thinning toward 5 as we resolve ---
  const int NLOOSE = 22;
  float looseFade = pow(1.0 - resolve, 1.3);
  for (int i = 0; i < NLOOSE; i++) {
    float t = (float(i) + 0.5) / float(NLOOSE);   // 0..1 down the viewport
    float ph = float(i) * 0.7;
    float wob =
      amp * sin(x * 6.0 + uTime * 0.7 + ph) +
      amp * 0.4 * sin(x * 11.0 - uTime * 1.0 + ph * 1.6);
    float dyPx = (yTop - (t + wob)) * H;
    cover = max(cover, lineAA(dyPx) * looseFade);
  }

  // --- resolved five-line staff ---
  float mid = mix(0.46, 0.5, resolve);
  float gap = 0.028;
  for (int i = 0; i < 5; i++) {
    float yv = mid + (float(i) - 2.0) * gap;
    yv += ripple * 0.25 * sin(x * 8.0 + uTime);
    float dyPx = (yTop - yv) * H;
    float m = lineAA(dyPx) * resolve;
    cover = max(cover, m);
    brass = max(brass, m * near * (0.35 + uVel));
  }

  vec3 inkCol = vec3(0.94, 0.93, 0.91);
  vec3 brassCol = vec3(0.949, 0.706, 0.294);
  vec3 col = mix(inkCol, brassCol, clamp(brass, 0.0, 1.0));

  float alpha = cover * mix(0.34, 0.24, resolve);
  frag = vec4(col, alpha);
}
`
