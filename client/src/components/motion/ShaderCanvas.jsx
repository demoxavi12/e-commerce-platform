import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/useMedia";

// Lightweight raw-WebGL "shader gradient": domain-warped simplex noise,
// cursor glow, vignette and film grain. ~3KB, no three.js.
// - renders at reduced resolution (smooth field, so it's invisible)
// - pauses when offscreen or tab hidden
// - reduced motion: one static frame
// - no WebGL: the CSS gradient underneath stays visible

const VERT = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;

const FRAG = `precision mediump float;
varying vec2 v;
uniform vec2 r;uniform float t;uniform vec2 m;
uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform vec3 c4;uniform float g;
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 tis(vec4 r){return 1.79284291400159-.85373472095314*r;}
float sn(vec3 v){
 const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
 vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
 vec3 g0=step(x0.yzx,x0.xyz);vec3 l=1.-g0;vec3 i1=min(g0.xyz,l.zxy);vec3 i2=max(g0.xyz,l.zxy);
 vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
 i=mod289(i);
 vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
 float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
 vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
 vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
 vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
 vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
 vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
 vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
 vec4 nm=tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
 p0*=nm.x;p1*=nm.y;p2*=nm.z;p3*=nm.w;
 vec4 mm=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);mm=mm*mm;
 return 42.*dot(mm*mm,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
void main(){
 float a=r.x/r.y;vec2 p=v;p.x*=a;vec2 mo=m;mo.x*=a;
 float T=t*.045;
 vec2 q=vec2(sn(vec3(p*1.1,T)),sn(vec3(p*1.1+5.2,T)));
 float n=sn(vec3(p*.85+q*.9+(mo-p)*.12,T*1.4))*.5+.5;
 vec3 col=mix(c1,c2,smoothstep(.15,.65,n));
 col=mix(col,c3,smoothstep(.62,.98,n)*.9);
 float d=distance(p,mo);
 col+=c4*smoothstep(.55,0.,d)*.22;
 col*=1.-.5*pow(length(v-.5)*1.25,2.);
 float gr=fract(sin(dot(gl_FragCoord.xy+t,vec2(12.9898,78.233)))*43758.5453);
 col+=(gr-.5)*g;
 gl_FragColor=vec4(col,1.);
}`;

const hex = (h) => {
  const n = parseInt(h.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const PALETTES = {
  ember: ["#0d0d0b", "#3b0f06", "#ff4d17", "#ff9a5c"],
  dusk: ["#0d0d0b", "#1d1a16", "#5a2a14", "#ff6a2b"],
  bone: ["#e9e4da", "#f3f0ea", "#d4c6b2", "#ffffff"],
};

const ShaderCanvas = ({ palette = "ember", grain = 0.06, className = "", fallback }) => {
  const canvasRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const colors = PALETTES[palette] || PALETTES.ember;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return undefined;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n) => gl.getUniformLocation(prog, n);
    const [U_r, U_t, U_m, U_g] = [u("r"), u("t"), u("m"), u("g")];
    ["c1", "c2", "c3", "c4"].forEach((k, i) => gl.uniform3fv(u(k), hex(colors[i])));
    gl.uniform1f(U_g, grain);

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const scale = coarse ? 0.3 : 0.5;
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(U_r, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0.7, y: 0.6, tx: 0.7, ty: 0.6 };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / rect.width;
      mouse.ty = 1 - (e.clientY - rect.top) / rect.height;
    };
    if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let visible = true;
    const start = performance.now() - 20000; // start mid-flow, not at a blank seed
    const draw = (now) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform2f(U_m, mouse.x, mouse.y);
      gl.uniform1f(U_t, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const loop = (now) => {
      draw(now);
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf && visible && !document.hidden && !reduced) raf = requestAnimationFrame(loop);
    };

    draw(performance.now());
    canvas.style.opacity = "1";
    if (!reduced) kick();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      kick();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", kick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", kick);
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [colors, grain, reduced]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            fallback ||
            `radial-gradient(60% 70% at 75% 60%, ${colors[2]}55, transparent 70%), radial-gradient(80% 80% at 20% 20%, ${colors[1]}, ${colors[0]})`,
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-1000"
        style={{ opacity: 0 }}
      />
    </div>
  );
};

export default ShaderCanvas;
