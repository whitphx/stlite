import { s as L, r as i, v as N, I as U, w as O, V as R, j as p, x as w } from "./index-COqA-032.js";
const x = /* @__PURE__ */ L("iframe", {
  target: "evvcert0"
})(({
  theme: r
}) => ({
  colorScheme: "normal",
  border: "none",
  padding: r.spacing.none,
  margin: r.spacing.none,
  width: "100%",
  aspectRatio: "16 / 9"
}), ""), A = w.getLogger("Video"), j = {
  width: "100%"
};
function P({
  element: r,
  endpoints: o,
  elementMgr: f
}) {
  const n = i.useRef(null), {
    type: v,
    url: g,
    startTime: a,
    subtitles: y,
    endTime: s,
    loop: d,
    autoplay: m,
    muted: E
  } = r, c = N(g), l = U(y);
  let V = O(c);
  const b = i.useMemo(() => {
    if (!r.id)
      return !0;
    const e = f.getElementState(r.id, "preventAutoplay");
    return e || f.setElementState(r.id, "preventAutoplay", !0), e ?? !1;
  }, [r.id, f]), S = i.useMemo(() => JSON.stringify(l ? l.map((e) => o.buildMediaURL(`${e.url}`)) : []), [l, o]);
  i.useEffect(() => {
    const e = JSON.parse(S);
    e.length !== 0 && e.forEach((t) => {
      o.checkSourceUrlResponse(t, "Video Subtitle");
    });
  }, [S, o]), i.useEffect(() => {
    n.current && (n.current.currentTime = a);
  }, [a]), i.useEffect(() => {
    const e = n.current, t = () => {
      e && (e.currentTime = r.startTime);
    };
    return e && e.addEventListener("loadedmetadata", t), () => {
      e && e.removeEventListener("loadedmetadata", t);
    };
  }, [r]), i.useEffect(() => {
    const e = n.current;
    if (!e)
      return;
    let t = !1;
    const u = () => {
      s > 0 && e.currentTime >= s && (d ? (e.currentTime = a || 0, e.play()) : t || (t = !0, e.pause()));
    };
    return s > 0 && e.addEventListener("timeupdate", u), () => {
      e && s > 0 && e.removeEventListener("timeupdate", u);
    };
  }, [s, d, a]), i.useEffect(() => {
    const e = n.current;
    if (!e)
      return;
    const t = () => {
      d && (e.currentTime = a || 0, e.play());
    };
    return e.addEventListener("ended", t), () => {
      e && e.removeEventListener("ended", t);
    };
  }, [d, a]);
  const h = (e) => {
    const t = new URL(e);
    if (a && !isNaN(a) && t.searchParams.append("start", a.toString()), s && !isNaN(s) && t.searchParams.append("end", s.toString()), d) {
      t.searchParams.append("loop", "1");
      const u = t.pathname.split("/").pop();
      u && t.searchParams.append("playlist", u);
    }
    return m && t.searchParams.append("autoplay", "1"), E && t.searchParams.append("mute", "1"), t.toString();
  };
  if (v === R.Type.YOUTUBE_IFRAME)
    return /* @__PURE__ */ p.jsx(x, { className: "stVideo", "data-testid": "stVideo", title: c, src: h(c), allow: "autoplay; encrypted-media", allowFullScreen: !0 });
  const T = (e) => {
    const t = e.currentTarget.src;
    A.error(`Client Error: Video source error - ${t}`), o.sendClientErrorToHost("Video", "Video source failed to load", "onerror triggered", t);
  };
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    /* @__PURE__ */ p.jsx("video", { className: "stVideo", "data-testid": "stVideo", ref: n, controls: !0, muted: E, autoPlay: m && !b, src: o.buildMediaURL(c), style: j, crossOrigin: V, onError: T, children: l?.map((e, t) => /* @__PURE__ */ p.jsx(
      "track",
      {
        kind: "captions",
        src: o.buildMediaURL(`${e.url}`),
        label: `${e.label}`,
        default: t === 0,
        "data-testid": "stVideoSubtitle"
      },
      t
    )) })
  );
}
const I = i.memo(P);
export {
  I as default
};
//# sourceMappingURL=index-BZzxHmkP.js.map
