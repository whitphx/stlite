import { s as p, r as i, v as y, w as T, j as f, x } from "./index-COqA-032.js";
const h = /* @__PURE__ */ p("div", {
  target: "exyuj7n1"
})(() => ({
  // Without setting lineHeight to 0, the audio element will
  // have some extra weird space in Safari & Firefox.
  lineHeight: 0
}), ""), L = /* @__PURE__ */ p("audio", {
  target: "exyuj7n0"
})(({
  theme: r
}) => ({
  width: "100%",
  height: r.sizes.minElementHeight,
  margin: 0,
  padding: 0
}), ""), S = x.getLogger("Audio");
function j({
  element: r,
  endpoints: a,
  elementMgr: d
}) {
  const o = i.useRef(null), {
    startTime: n,
    endTime: s,
    loop: u,
    autoplay: E
  } = r, m = i.useMemo(() => {
    if (!r.id)
      return !0;
    const e = d.getElementState(r.id, "preventAutoplay");
    return e || d.setElementState(r.id, "preventAutoplay", !0), e ?? !1;
  }, [r.id, d]);
  i.useEffect(() => {
    o.current && (o.current.currentTime = n);
  }, [n]), i.useEffect(() => {
    const e = o.current, t = () => {
      e && (e.currentTime = r.startTime);
    };
    return e && e.addEventListener("loadedmetadata", t), () => {
      e && e.removeEventListener("loadedmetadata", t);
    };
  }, [r]), i.useEffect(() => {
    const e = o.current;
    if (!e)
      return;
    let t = !1;
    const l = () => {
      s > 0 && e.currentTime >= s && (u ? (e.currentTime = n || 0, e.play()) : t || (t = !0, e.pause()));
    };
    return s > 0 && e.addEventListener("timeupdate", l), () => {
      e && s > 0 && e.removeEventListener("timeupdate", l);
    };
  }, [s, u, n]), i.useEffect(() => {
    const e = o.current;
    if (!e)
      return;
    const t = () => {
      u && (e.currentTime = n || 0, e.play());
    };
    return e.addEventListener("ended", t), () => {
      e && e.removeEventListener("ended", t);
    };
  }, [u, n]);
  const c = y(r.url), A = T(c), v = a.buildMediaURL(c), g = (e) => {
    const t = e.currentTarget.src;
    S.error(`Client Error: Audio source error - ${t}`), a.sendClientErrorToHost("Audio", "Audio source failed to load", "onerror triggered", t);
  };
  return /* @__PURE__ */ f.jsx(h, { children: /* @__PURE__ */ f.jsx(L, { className: "stAudio", "data-testid": "stAudio", ref: o, controls: !0, autoPlay: E && !m, src: v, onError: g, crossOrigin: A }) });
}
const C = i.memo(j);
export {
  C as default
};
//# sourceMappingURL=index-BlnFp4Bu.js.map
