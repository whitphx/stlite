import { _ as n, a } from "./inherits-DZBdSoid.js";
function c() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (c = function() {
    return !!t;
  })();
}
function i(t) {
  var r = c();
  return function() {
    var e, o = n(t);
    if (r) {
      var u = n(this).constructor;
      e = Reflect.construct(o, arguments, u);
    } else e = o.apply(this, arguments);
    return a(this, e);
  };
}
export {
  i as _
};
//# sourceMappingURL=createSuper-ZQh_QQod.js.map
