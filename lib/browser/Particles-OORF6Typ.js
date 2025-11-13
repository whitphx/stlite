import { r as s, a7 as m, a8 as d, j as r, s as p, L as f, a9 as C } from "./index-COqA-032.js";
const j = ({
  children: t
}) => {
  const e = s.useContext(m)?.();
  return e ? d.createPortal(t, e) : /* @__PURE__ */ r.jsx(r.Fragment, { children: t });
}, g = /* @__PURE__ */ p("div", {
  target: "ecnfqzf0"
})({
  name: "my9yfq",
  styles: "@media print{display:none;}"
}), u = ({
  className: t,
  scriptRunId: e,
  numParticles: o,
  numParticleTypes: a,
  ParticleComponent: n
}) => {
  const {
    libConfig: i
  } = s.useContext(f), c = s.useMemo(() => C(o).map(() => Math.floor(Math.random() * a)), [o, a]);
  return (
    // Keys should be unique each time, so React replaces the images in the DOM and their animations
    // actually rerun.
    /* @__PURE__ */ r.jsx(g, { className: t, "data-testid": t, children: c.map((x, l) => /* @__PURE__ */ r.jsx(
      n,
      {
        particleType: x,
        resourceCrossOriginMode: i.resourceCrossOriginMode
      },
      e + l
    )) })
  );
}, E = s.memo(u);
export {
  E as P,
  j as R
};
//# sourceMappingURL=Particles-OORF6Typ.js.map
