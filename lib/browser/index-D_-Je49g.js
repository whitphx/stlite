import { s as $t, r as ht, j as Ne } from "./index-COqA-032.js";
const {
  entries: St,
  setPrototypeOf: mt,
  isFrozen: qt,
  getPrototypeOf: Kt,
  getOwnPropertyDescriptor: Zt
} = Object;
let {
  freeze: S,
  seal: L,
  create: ke
} = Object, {
  apply: ve,
  construct: Ue
} = typeof Reflect < "u" && Reflect;
S || (S = function(n) {
  return n;
});
L || (L = function(n) {
  return n;
});
ve || (ve = function(n, s) {
  for (var r = arguments.length, c = new Array(r > 2 ? r - 2 : 0), b = 2; b < r; b++)
    c[b - 2] = arguments[b];
  return n.apply(s, c);
});
Ue || (Ue = function(n) {
  for (var s = arguments.length, r = new Array(s > 1 ? s - 1 : 0), c = 1; c < s; c++)
    r[c - 1] = arguments[c];
  return new n(...r);
});
const ce = R(Array.prototype.forEach), Jt = R(Array.prototype.lastIndexOf), pt = R(Array.prototype.pop), q = R(Array.prototype.push), Qt = R(Array.prototype.splice), ue = R(String.prototype.toLowerCase), Ie = R(String.prototype.toString), Me = R(String.prototype.match), K = R(String.prototype.replace), en = R(String.prototype.indexOf), tn = R(String.prototype.trim), y = R(Object.prototype.hasOwnProperty), h = R(RegExp.prototype.test), Z = nn(TypeError);
function R(a) {
  return function(n) {
    n instanceof RegExp && (n.lastIndex = 0);
    for (var s = arguments.length, r = new Array(s > 1 ? s - 1 : 0), c = 1; c < s; c++)
      r[c - 1] = arguments[c];
    return ve(a, n, r);
  };
}
function nn(a) {
  return function() {
    for (var n = arguments.length, s = new Array(n), r = 0; r < n; r++)
      s[r] = arguments[r];
    return Ue(a, s);
  };
}
function l(a, n) {
  let s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ue;
  mt && mt(a, null);
  let r = n.length;
  for (; r--; ) {
    let c = n[r];
    if (typeof c == "string") {
      const b = s(c);
      b !== c && (qt(n) || (n[r] = b), c = b);
    }
    a[c] = !0;
  }
  return a;
}
function on(a) {
  for (let n = 0; n < a.length; n++)
    y(a, n) || (a[n] = null);
  return a;
}
function C(a) {
  const n = ke(null);
  for (const [s, r] of St(a))
    y(a, s) && (Array.isArray(r) ? n[s] = on(r) : r && typeof r == "object" && r.constructor === Object ? n[s] = C(r) : n[s] = r);
  return n;
}
function J(a, n) {
  for (; a !== null; ) {
    const r = Zt(a, n);
    if (r) {
      if (r.get)
        return R(r.get);
      if (typeof r.value == "function")
        return R(r.value);
    }
    a = Kt(a);
  }
  function s() {
    return null;
  }
  return s;
}
const dt = S(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Ce = S(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), we = S(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), an = S(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), xe = S(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), rn = S(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Tt = S(["#text"]), Et = S(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Pe = S(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), _t = S(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), fe = S(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), sn = L(/\{\{[\w\W]*|[\w\W]*\}\}/gm), ln = L(/<%[\w\W]*|[\w\W]*%>/gm), cn = L(/\$\{[\w\W]*/gm), fn = L(/^data-[\-\w.\u00B7-\uFFFF]+$/), un = L(/^aria-[\-\w]+$/), Rt = L(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), mn = L(/^(?:\w+script|data):/i), pn = L(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), bt = L(/^html$/i), dn = L(/^[a-z][.\w]*(-[.\w]+)+$/i);
var gt = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: un,
  ATTR_WHITESPACE: pn,
  CUSTOM_ELEMENT: dn,
  DATA_ATTR: fn,
  DOCTYPE_NAME: bt,
  ERB_EXPR: ln,
  IS_ALLOWED_URI: Rt,
  IS_SCRIPT_OR_DATA: mn,
  MUSTACHE_EXPR: sn,
  TMPLIT_EXPR: cn
});
const Q = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Tn = function() {
  return typeof window > "u" ? null : window;
}, En = function(n, s) {
  if (typeof n != "object" || typeof n.createPolicy != "function")
    return null;
  let r = null;
  const c = "data-tt-policy-suffix";
  s && s.hasAttribute(c) && (r = s.getAttribute(c));
  const b = "dompurify" + (r ? "#" + r : "");
  try {
    return n.createPolicy(b, {
      createHTML(P) {
        return P;
      },
      createScriptURL(P) {
        return P;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + b + " could not be created."), null;
  }
}, At = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function Ot() {
  let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Tn();
  const n = (i) => Ot(i);
  if (n.version = "3.3.0", n.removed = [], !a || !a.document || a.document.nodeType !== Q.document || !a.Element)
    return n.isSupported = !1, n;
  let {
    document: s
  } = a;
  const r = s, c = r.currentScript, {
    DocumentFragment: b,
    HTMLTemplateElement: P,
    Node: me,
    Element: ze,
    NodeFilter: B,
    NamedNodeMap: Lt = a.NamedNodeMap || a.MozNamedAttrMap,
    HTMLFormElement: yt,
    DOMParser: Dt,
    trustedTypes: ee
  } = a, Y = ze.prototype, Nt = J(Y, "cloneNode"), It = J(Y, "remove"), Mt = J(Y, "nextSibling"), Ct = J(Y, "childNodes"), te = J(Y, "parentNode");
  if (typeof P == "function") {
    const i = s.createElement("template");
    i.content && i.content.ownerDocument && (s = i.content.ownerDocument);
  }
  let g, j = "";
  const {
    implementation: pe,
    createNodeIterator: wt,
    createDocumentFragment: xt,
    getElementsByTagName: Pt
  } = s, {
    importNode: kt
  } = r;
  let A = At();
  n.isSupported = typeof St == "function" && typeof te == "function" && pe && pe.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: de,
    ERB_EXPR: Te,
    TMPLIT_EXPR: Ee,
    DATA_ATTR: vt,
    ARIA_ATTR: Ut,
    IS_SCRIPT_OR_DATA: Ft,
    ATTR_WHITESPACE: Ge,
    CUSTOM_ELEMENT: Ht
  } = gt;
  let {
    IS_ALLOWED_URI: We
  } = gt, p = null;
  const Be = l({}, [...dt, ...Ce, ...we, ...xe, ...Tt]);
  let T = null;
  const Ye = l({}, [...Et, ...Pe, ..._t, ...fe]);
  let u = Object.seal(ke(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), X = null, _e = null;
  const k = Object.seal(ke(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let je = !0, ge = !0, Xe = !1, Ve = !0, v = !1, ne = !0, w = !1, Ae = !1, he = !1, U = !1, oe = !1, ie = !1, $e = !0, qe = !1;
  const zt = "user-content-";
  let Se = !0, V = !1, F = {}, H = null;
  const Ke = l({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Ze = null;
  const Je = l({}, ["audio", "video", "img", "source", "image", "track"]);
  let Re = null;
  const Qe = l({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), ae = "http://www.w3.org/1998/Math/MathML", re = "http://www.w3.org/2000/svg", N = "http://www.w3.org/1999/xhtml";
  let z = N, be = !1, Oe = null;
  const Gt = l({}, [ae, re, N], Ie);
  let se = l({}, ["mi", "mo", "mn", "ms", "mtext"]), le = l({}, ["annotation-xml"]);
  const Wt = l({}, ["title", "style", "font", "a", "script"]);
  let $ = null;
  const Bt = ["application/xhtml+xml", "text/html"], Yt = "text/html";
  let d = null, G = null;
  const jt = s.createElement("form"), et = function(e) {
    return e instanceof RegExp || e instanceof Function;
  }, Le = function() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(G && G === e)) {
      if ((!e || typeof e != "object") && (e = {}), e = C(e), $ = // eslint-disable-next-line unicorn/prefer-includes
      Bt.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? Yt : e.PARSER_MEDIA_TYPE, d = $ === "application/xhtml+xml" ? Ie : ue, p = y(e, "ALLOWED_TAGS") ? l({}, e.ALLOWED_TAGS, d) : Be, T = y(e, "ALLOWED_ATTR") ? l({}, e.ALLOWED_ATTR, d) : Ye, Oe = y(e, "ALLOWED_NAMESPACES") ? l({}, e.ALLOWED_NAMESPACES, Ie) : Gt, Re = y(e, "ADD_URI_SAFE_ATTR") ? l(C(Qe), e.ADD_URI_SAFE_ATTR, d) : Qe, Ze = y(e, "ADD_DATA_URI_TAGS") ? l(C(Je), e.ADD_DATA_URI_TAGS, d) : Je, H = y(e, "FORBID_CONTENTS") ? l({}, e.FORBID_CONTENTS, d) : Ke, X = y(e, "FORBID_TAGS") ? l({}, e.FORBID_TAGS, d) : C({}), _e = y(e, "FORBID_ATTR") ? l({}, e.FORBID_ATTR, d) : C({}), F = y(e, "USE_PROFILES") ? e.USE_PROFILES : !1, je = e.ALLOW_ARIA_ATTR !== !1, ge = e.ALLOW_DATA_ATTR !== !1, Xe = e.ALLOW_UNKNOWN_PROTOCOLS || !1, Ve = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, v = e.SAFE_FOR_TEMPLATES || !1, ne = e.SAFE_FOR_XML !== !1, w = e.WHOLE_DOCUMENT || !1, U = e.RETURN_DOM || !1, oe = e.RETURN_DOM_FRAGMENT || !1, ie = e.RETURN_TRUSTED_TYPE || !1, he = e.FORCE_BODY || !1, $e = e.SANITIZE_DOM !== !1, qe = e.SANITIZE_NAMED_PROPS || !1, Se = e.KEEP_CONTENT !== !1, V = e.IN_PLACE || !1, We = e.ALLOWED_URI_REGEXP || Rt, z = e.NAMESPACE || N, se = e.MATHML_TEXT_INTEGRATION_POINTS || se, le = e.HTML_INTEGRATION_POINTS || le, u = e.CUSTOM_ELEMENT_HANDLING || {}, e.CUSTOM_ELEMENT_HANDLING && et(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (u.tagNameCheck = e.CUSTOM_ELEMENT_HANDLING.tagNameCheck), e.CUSTOM_ELEMENT_HANDLING && et(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (u.attributeNameCheck = e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), e.CUSTOM_ELEMENT_HANDLING && typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (u.allowCustomizedBuiltInElements = e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), v && (ge = !1), oe && (U = !0), F && (p = l({}, Tt), T = [], F.html === !0 && (l(p, dt), l(T, Et)), F.svg === !0 && (l(p, Ce), l(T, Pe), l(T, fe)), F.svgFilters === !0 && (l(p, we), l(T, Pe), l(T, fe)), F.mathMl === !0 && (l(p, xe), l(T, _t), l(T, fe))), e.ADD_TAGS && (typeof e.ADD_TAGS == "function" ? k.tagCheck = e.ADD_TAGS : (p === Be && (p = C(p)), l(p, e.ADD_TAGS, d))), e.ADD_ATTR && (typeof e.ADD_ATTR == "function" ? k.attributeCheck = e.ADD_ATTR : (T === Ye && (T = C(T)), l(T, e.ADD_ATTR, d))), e.ADD_URI_SAFE_ATTR && l(Re, e.ADD_URI_SAFE_ATTR, d), e.FORBID_CONTENTS && (H === Ke && (H = C(H)), l(H, e.FORBID_CONTENTS, d)), Se && (p["#text"] = !0), w && l(p, ["html", "head", "body"]), p.table && (l(p, ["tbody"]), delete X.tbody), e.TRUSTED_TYPES_POLICY) {
        if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Z('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Z('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        g = e.TRUSTED_TYPES_POLICY, j = g.createHTML("");
      } else
        g === void 0 && (g = En(ee, c)), g !== null && typeof j == "string" && (j = g.createHTML(""));
      S && S(e), G = e;
    }
  }, tt = l({}, [...Ce, ...we, ...an]), nt = l({}, [...xe, ...rn]), Xt = function(e) {
    let t = te(e);
    (!t || !t.tagName) && (t = {
      namespaceURI: z,
      tagName: "template"
    });
    const o = ue(e.tagName), f = ue(t.tagName);
    return Oe[e.namespaceURI] ? e.namespaceURI === re ? t.namespaceURI === N ? o === "svg" : t.namespaceURI === ae ? o === "svg" && (f === "annotation-xml" || se[f]) : !!tt[o] : e.namespaceURI === ae ? t.namespaceURI === N ? o === "math" : t.namespaceURI === re ? o === "math" && le[f] : !!nt[o] : e.namespaceURI === N ? t.namespaceURI === re && !le[f] || t.namespaceURI === ae && !se[f] ? !1 : !nt[o] && (Wt[o] || !tt[o]) : !!($ === "application/xhtml+xml" && Oe[e.namespaceURI]) : !1;
  }, D = function(e) {
    q(n.removed, {
      element: e
    });
    try {
      te(e).removeChild(e);
    } catch {
      It(e);
    }
  }, x = function(e, t) {
    try {
      q(n.removed, {
        attribute: t.getAttributeNode(e),
        from: t
      });
    } catch {
      q(n.removed, {
        attribute: null,
        from: t
      });
    }
    if (t.removeAttribute(e), e === "is")
      if (U || oe)
        try {
          D(t);
        } catch {
        }
      else
        try {
          t.setAttribute(e, "");
        } catch {
        }
  }, ot = function(e) {
    let t = null, o = null;
    if (he)
      e = "<remove></remove>" + e;
    else {
      const m = Me(e, /^[\r\n\t ]+/);
      o = m && m[0];
    }
    $ === "application/xhtml+xml" && z === N && (e = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + e + "</body></html>");
    const f = g ? g.createHTML(e) : e;
    if (z === N)
      try {
        t = new Dt().parseFromString(f, $);
      } catch {
      }
    if (!t || !t.documentElement) {
      t = pe.createDocument(z, "template", null);
      try {
        t.documentElement.innerHTML = be ? j : f;
      } catch {
      }
    }
    const _ = t.body || t.documentElement;
    return e && o && _.insertBefore(s.createTextNode(o), _.childNodes[0] || null), z === N ? Pt.call(t, w ? "html" : "body")[0] : w ? t.documentElement : _;
  }, it = function(e) {
    return wt.call(
      e.ownerDocument || e,
      e,
      // eslint-disable-next-line no-bitwise
      B.SHOW_ELEMENT | B.SHOW_COMMENT | B.SHOW_TEXT | B.SHOW_PROCESSING_INSTRUCTION | B.SHOW_CDATA_SECTION,
      null
    );
  }, ye = function(e) {
    return e instanceof yt && (typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || !(e.attributes instanceof Lt) || typeof e.removeAttribute != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function");
  }, at = function(e) {
    return typeof me == "function" && e instanceof me;
  };
  function I(i, e, t) {
    ce(i, (o) => {
      o.call(n, e, t, G);
    });
  }
  const rt = function(e) {
    let t = null;
    if (I(A.beforeSanitizeElements, e, null), ye(e))
      return D(e), !0;
    const o = d(e.nodeName);
    if (I(A.uponSanitizeElement, e, {
      tagName: o,
      allowedTags: p
    }), ne && e.hasChildNodes() && !at(e.firstElementChild) && h(/<[/\w!]/g, e.innerHTML) && h(/<[/\w!]/g, e.textContent) || e.nodeType === Q.progressingInstruction || ne && e.nodeType === Q.comment && h(/<[/\w]/g, e.data))
      return D(e), !0;
    if (!(k.tagCheck instanceof Function && k.tagCheck(o)) && (!p[o] || X[o])) {
      if (!X[o] && lt(o) && (u.tagNameCheck instanceof RegExp && h(u.tagNameCheck, o) || u.tagNameCheck instanceof Function && u.tagNameCheck(o)))
        return !1;
      if (Se && !H[o]) {
        const f = te(e) || e.parentNode, _ = Ct(e) || e.childNodes;
        if (_ && f) {
          const m = _.length;
          for (let O = m - 1; O >= 0; --O) {
            const M = Nt(_[O], !0);
            M.__removalCount = (e.__removalCount || 0) + 1, f.insertBefore(M, Mt(e));
          }
        }
      }
      return D(e), !0;
    }
    return e instanceof ze && !Xt(e) || (o === "noscript" || o === "noembed" || o === "noframes") && h(/<\/no(script|embed|frames)/i, e.innerHTML) ? (D(e), !0) : (v && e.nodeType === Q.text && (t = e.textContent, ce([de, Te, Ee], (f) => {
      t = K(t, f, " ");
    }), e.textContent !== t && (q(n.removed, {
      element: e.cloneNode()
    }), e.textContent = t)), I(A.afterSanitizeElements, e, null), !1);
  }, st = function(e, t, o) {
    if ($e && (t === "id" || t === "name") && (o in s || o in jt))
      return !1;
    if (!(ge && !_e[t] && h(vt, t))) {
      if (!(je && h(Ut, t))) {
        if (!(k.attributeCheck instanceof Function && k.attributeCheck(t, e))) {
          if (!T[t] || _e[t]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(lt(e) && (u.tagNameCheck instanceof RegExp && h(u.tagNameCheck, e) || u.tagNameCheck instanceof Function && u.tagNameCheck(e)) && (u.attributeNameCheck instanceof RegExp && h(u.attributeNameCheck, t) || u.attributeNameCheck instanceof Function && u.attributeNameCheck(t, e)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              t === "is" && u.allowCustomizedBuiltInElements && (u.tagNameCheck instanceof RegExp && h(u.tagNameCheck, o) || u.tagNameCheck instanceof Function && u.tagNameCheck(o)))
            ) return !1;
          } else if (!Re[t]) {
            if (!h(We, K(o, Ge, ""))) {
              if (!((t === "src" || t === "xlink:href" || t === "href") && e !== "script" && en(o, "data:") === 0 && Ze[e])) {
                if (!(Xe && !h(Ft, K(o, Ge, "")))) {
                  if (o)
                    return !1;
                }
              }
            }
          }
        }
      }
    }
    return !0;
  }, lt = function(e) {
    return e !== "annotation-xml" && Me(e, Ht);
  }, ct = function(e) {
    I(A.beforeSanitizeAttributes, e, null);
    const {
      attributes: t
    } = e;
    if (!t || ye(e))
      return;
    const o = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: T,
      forceKeepAttr: void 0
    };
    let f = t.length;
    for (; f--; ) {
      const _ = t[f], {
        name: m,
        namespaceURI: O,
        value: M
      } = _, W = d(m), De = M;
      let E = m === "value" ? De : tn(De);
      if (o.attrName = W, o.attrValue = E, o.keepAttr = !0, o.forceKeepAttr = void 0, I(A.uponSanitizeAttribute, e, o), E = o.attrValue, qe && (W === "id" || W === "name") && (x(m, e), E = zt + E), ne && h(/((--!?|])>)|<\/(style|title|textarea)/i, E)) {
        x(m, e);
        continue;
      }
      if (W === "attributename" && Me(E, "href")) {
        x(m, e);
        continue;
      }
      if (o.forceKeepAttr)
        continue;
      if (!o.keepAttr) {
        x(m, e);
        continue;
      }
      if (!Ve && h(/\/>/i, E)) {
        x(m, e);
        continue;
      }
      v && ce([de, Te, Ee], (ut) => {
        E = K(E, ut, " ");
      });
      const ft = d(e.nodeName);
      if (!st(ft, W, E)) {
        x(m, e);
        continue;
      }
      if (g && typeof ee == "object" && typeof ee.getAttributeType == "function" && !O)
        switch (ee.getAttributeType(ft, W)) {
          case "TrustedHTML": {
            E = g.createHTML(E);
            break;
          }
          case "TrustedScriptURL": {
            E = g.createScriptURL(E);
            break;
          }
        }
      if (E !== De)
        try {
          O ? e.setAttributeNS(O, m, E) : e.setAttribute(m, E), ye(e) ? D(e) : pt(n.removed);
        } catch {
          x(m, e);
        }
    }
    I(A.afterSanitizeAttributes, e, null);
  }, Vt = function i(e) {
    let t = null;
    const o = it(e);
    for (I(A.beforeSanitizeShadowDOM, e, null); t = o.nextNode(); )
      I(A.uponSanitizeShadowNode, t, null), rt(t), ct(t), t.content instanceof b && i(t.content);
    I(A.afterSanitizeShadowDOM, e, null);
  };
  return n.sanitize = function(i) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, t = null, o = null, f = null, _ = null;
    if (be = !i, be && (i = "<!-->"), typeof i != "string" && !at(i))
      if (typeof i.toString == "function") {
        if (i = i.toString(), typeof i != "string")
          throw Z("dirty is not a string, aborting");
      } else
        throw Z("toString is not a function");
    if (!n.isSupported)
      return i;
    if (Ae || Le(e), n.removed = [], typeof i == "string" && (V = !1), V) {
      if (i.nodeName) {
        const M = d(i.nodeName);
        if (!p[M] || X[M])
          throw Z("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (i instanceof me)
      t = ot("<!---->"), o = t.ownerDocument.importNode(i, !0), o.nodeType === Q.element && o.nodeName === "BODY" || o.nodeName === "HTML" ? t = o : t.appendChild(o);
    else {
      if (!U && !v && !w && // eslint-disable-next-line unicorn/prefer-includes
      i.indexOf("<") === -1)
        return g && ie ? g.createHTML(i) : i;
      if (t = ot(i), !t)
        return U ? null : ie ? j : "";
    }
    t && he && D(t.firstChild);
    const m = it(V ? i : t);
    for (; f = m.nextNode(); )
      rt(f), ct(f), f.content instanceof b && Vt(f.content);
    if (V)
      return i;
    if (U) {
      if (oe)
        for (_ = xt.call(t.ownerDocument); t.firstChild; )
          _.appendChild(t.firstChild);
      else
        _ = t;
      return (T.shadowroot || T.shadowrootmode) && (_ = kt.call(r, _, !0)), _;
    }
    let O = w ? t.outerHTML : t.innerHTML;
    return w && p["!doctype"] && t.ownerDocument && t.ownerDocument.doctype && t.ownerDocument.doctype.name && h(bt, t.ownerDocument.doctype.name) && (O = "<!DOCTYPE " + t.ownerDocument.doctype.name + `>
` + O), v && ce([de, Te, Ee], (M) => {
      O = K(O, M, " ");
    }), g && ie ? g.createHTML(O) : O;
  }, n.setConfig = function() {
    let i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Le(i), Ae = !0;
  }, n.clearConfig = function() {
    G = null, Ae = !1;
  }, n.isValidAttribute = function(i, e, t) {
    G || Le({});
    const o = d(i), f = d(e);
    return st(o, f, t);
  }, n.addHook = function(i, e) {
    typeof e == "function" && q(A[i], e);
  }, n.removeHook = function(i, e) {
    if (e !== void 0) {
      const t = Jt(A[i], e);
      return t === -1 ? void 0 : Qt(A[i], t, 1)[0];
    }
    return pt(A[i]);
  }, n.removeHooks = function(i) {
    A[i] = [];
  }, n.removeAllHooks = function() {
    A = At();
  }, n;
}
var He = Ot();
const _n = /* @__PURE__ */ $t("div", {
  target: "e18540fl0"
})({
  name: "1d3w5wq",
  styles: "width:100%"
}), Fe = "data-temp-href-target";
He.addHook("beforeSanitizeAttributes", function(a) {
  a instanceof HTMLElement && a.hasAttribute("target") && a.getAttribute("target") === "_blank" && a.setAttribute(Fe, "_blank");
});
He.addHook("afterSanitizeAttributes", function(a) {
  a instanceof HTMLElement && a.hasAttribute(Fe) && (a.setAttribute("target", "_blank"), a.setAttribute("rel", "noopener noreferrer"), a.removeAttribute(Fe));
});
const gn = (a) => {
  const n = {
    // Default to permit HTML, SVG and MathML, this limits to HTML only
    USE_PROFILES: {
      html: !0
    },
    // glue elements like style, script or others to document.body and prevent unintuitive browser behavior in several edge-cases
    FORCE_BODY: !0
  };
  return He.sanitize(a, n);
};
function An({
  element: a
}) {
  const {
    body: n
  } = a, s = ht.useMemo(() => gn(n), [n]);
  return /* @__PURE__ */ Ne.jsx(Ne.Fragment, { children: s && /* @__PURE__ */ Ne.jsx(
    _n,
    {
      className: "stHtml",
      "data-testid": "stHtml",
      dangerouslySetInnerHTML: {
        __html: s
      }
    }
  ) });
}
const Sn = ht.memo(An);
export {
  Sn as default
};
//# sourceMappingURL=index-D_-Je49g.js.map
