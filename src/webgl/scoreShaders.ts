/** Fullscreen triangle. */
export const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

/**
 * The score field, composited (SRC_ALPHA, ONE_MINUS_SRC_ALPHA) over opaque black.
 *
 * A loose field of conducted strings. It never changes shape — it settles:
 *   uCalm   0..1  waves shrink and the drift slows as it settles. Same as page
 *                 scroll everywhere except the Book page, which starts partway
 *                 settled so the field is calm from the top.
 *   uScroll 0..1  raw page progress. Only the last stretch fades the ink out, so
 *                 the field is gone by the footer on every page.
 * Near the pointer a few lines pick up a faint brass tint that flares with speed.
 */
export const FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform vec2  uRes;      // drawing-buffer pixels
uniform float uPhase;    // drift phase, CPU-accumulated; advances slower as the field settles
uniform float uCalm;     // 0 energetic .. 1 fully settled (waves + drift)
uniform float uScroll;   // raw page progress, 0 top .. 1 bottom (fade-out only)
uniform vec2  uPointer;  // 0..1, y from top
uniform float uVel;      // pointer speed energy, 0..~1
uniform float uReduced;  // 1.0 => hold still
uniform float uDim;      // overall alpha multiplier (reading routes knock it down)

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

  float calm = smoothstep(0.0, 1.0, uCalm);
  float fade = smoothstep(0.70, 1.0, uScroll);   // only the last ~30% of a page
  float still = clamp(uReduced, 0.0, 1.0);

  // Full waves when energetic, easing to a faint slow drift once settled.
  float amp = mix(0.108, 0.042, calm) * (1.0 - still * 0.95);

  vec2 p = vec2(uv.x, yTop);
  float pd = distance(p, uPointer);
  float near = exp(-pd * pd * 16.0);
  float ripple = near * (0.05 + 0.6 * uVel) * (1.0 - still);
  amp += ripple;

  float cover = 0.0;   // nearest-line coverage 0..1
  float brass = 0.0;   // brass tint where the pointer passes

  const int NLOOSE = 15;
  for (int i = 0; i < NLOOSE; i++) {
    float t = (float(i) + 0.5) / float(NLOOSE);   // 0..1 down the viewport
    float ph = float(i) * 0.7;
    float wob =
      amp * sin(x * 6.0 + uPhase * 0.7 + ph) +
      amp * 0.4 * sin(x * 11.0 - uPhase * 1.0 + ph * 1.6);
    float dyPx = (yTop - (t + wob)) * H;
    float m = lineAA(dyPx);
    cover = max(cover, m);
    brass = max(brass, m * near * (0.32 + uVel));
  }

  vec3 inkCol = vec3(0.94, 0.93, 0.91);
  vec3 brassCol = vec3(0.949, 0.706, 0.294);
  vec3 col = mix(inkCol, brassCol, clamp(brass, 0.0, 1.0));

  float alpha = cover * mix(0.30, 0.20, calm) * (1.0 - fade) * uDim;
  frag = vec4(col, alpha);
}
`
