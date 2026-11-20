import { useEffect, useRef } from "react";
import { env } from "@/lib/state";
import { FRAME_COUNT, drawFrame, placement, store } from "@/lib/frames";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
// Twinkling stars and a faint drifting mist, added (screen blend) on top of the still of the final frame.
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes; uniform float uTime;
float hash(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*noise(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return s; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec3 col = vec3(0.);
  vec2 sg = uv * vec2(asp,1.) * 55.;
  vec2 id = floor(sg); vec2 f = fract(sg) - .5;
  float r = hash(id);
  float star = step(.975, r) * smoothstep(.2,.0,length(f + (hash(id+7.3)-.5)*.5));
  star *= .5 + .5 * sin(uTime*(.5+r*1.4) + r*40.);
  col += vec3(.7,.74,1.) * star * smoothstep(.35,.7,uv.y) * .55;
  float t = uTime * .02;
  float m = fbm(vec2(uv.x*asp*1.3 + t, uv.y*1.8 - t*.5) * 1.6);
  m = smoothstep(.35,.85,m);
  col += vec3(.20,.18,.50) * m * m * .30 * smoothstep(.85,.1,uv.y);
  gl_FragColor = vec4(col, 1.);
}`;

/**
 * Persistent atmospheric environment behind the whole site.
 *  - still: the final frame of the sequence, painted with exactly the placement the opening ends on,
 *    so when the opening canvas fades out nothing changes on screen.
 *  - gl: a light WebGL layer (twinkling stars, drifting mist) that makes it feel alive.
 */
export default function Env({ reduced, ready }: { reduced: boolean; ready: boolean }) {
  const still = useRef<HTMLCanvasElement>(null);
  const glc = useRef<HTMLCanvasElement>(null);

  // paint the still once the final frame is available, and repaint on resize
  useEffect(() => {
    if (!ready) return;
    const cv = still.current!;
    const ctx = cv.getContext("2d")!;
    const paint = () => {
      const img = store.frames[FRAME_COUNT - 1];
      if (!img) return;
      const w = cv.clientWidth, h = cv.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      drawFrame(ctx, img, cv.width, cv.height, placement(w, h, 1), dpr);
      document.documentElement.classList.add("env-ready");
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(cv);
    return () => ro.disconnect();
  }, [ready]);

  useEffect(() => {
    const cv = glc.current!;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;
    const compile = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { cv.style.display = "none"; return; }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes"), uTime = gl.getUniformLocation(prog, "uTime");
    const quality = (matchMedia("(max-width: 700px)").matches ? 0.5 : 0.7) * Math.min(devicePixelRatio || 1, 1.5);
    const resize = () => {
      cv.width = Math.max(2, Math.round(innerWidth * quality));
      cv.height = Math.max(2, Math.round(innerHeight * quality));
      gl.viewport(0, 0, cv.width, cv.height);
    };
    const draw = (still = false) => {
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uTime, still ? 40 : performance.now() / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    resize();
    if (reduced) {
      draw(true);
      const onResize = () => { resize(); draw(true); };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || env.gl < 0.002) return; // nothing to see yet (still inside the opening)
      draw();
    };
    loop();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, [reduced]);

  return (
    <div className="env" aria-hidden="true">
      <div className="env__base" />
      <canvas className="env__still" ref={still} />
      <canvas className="env__gl" ref={glc} />
      <div className="env__veil" />
    </div>
  );
}
