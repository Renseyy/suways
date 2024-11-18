(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) i(s);
  new MutationObserver((s) => {
    for (const n of s)
      if (n.type === "childList")
        for (const l of n.addedNodes)
          l.tagName === "LINK" && l.rel === "modulepreload" && i(l);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(s) {
    const n = {};
    return (
      s.integrity && (n.integrity = s.integrity),
      s.referrerPolicy && (n.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (n.credentials = "include")
        : s.crossOrigin === "anonymous"
        ? (n.credentials = "omit")
        : (n.credentials = "same-origin"),
      n
    );
  }
  function i(s) {
    if (s.ep) return;
    s.ep = !0;
    const n = e(s);
    fetch(s.href, n);
  }
})();
const W = Symbol.for("#__init__"),
  Lr = Symbol.for("#__initor__"),
  qr = Symbol.for("#meta"),
  ve = Symbol.for("imba"),
  Hr = Symbol.for("#matcher"),
  It = {
    HasSuperCalls: 8,
    HasConstructor: 16,
    HasMixins: 64,
    IsObjectExtension: 512,
  },
  ut = new Map(),
  Br = globalThis[ve] || (globalThis[ve] = { counter: 0, classes: ut });
function Nt(r, t = {}) {
  var e;
  return (
    ut.has(r) ||
      ut.set(r, {
        symbol: Symbol(r.name),
        parent:
          (e = Object.getPrototypeOf(r.prototype)) == null
            ? void 0
            : e.constructor,
        for: r,
        uses: null,
        inits: null,
        id: Br.counter++,
        ...t,
      }),
    ut.get(r)
  );
}
function zi(r, t) {
  var e;
  return (
    r === t ||
    ((e = t == null ? void 0 : t[Hr]) == null ? void 0 : e.call(t, r))
  );
}
function Vr(r, t) {
  if (!r || !t) return !1;
  if (r.get) return t.get === r.get;
  if (r.set) return t.set === r.set;
  if (r.value) return r.value === t.value;
}
function Nr(r, t, e, i = {}) {
  const s = r.constructor;
  !e &&
    t &&
    ((e = Object.getOwnPropertyDescriptors(t)),
    delete e.constructor,
    e[W] &&
      (console.warn(
        `Cannot define plain fields when extending class ${s.name}`
      ),
      delete e[W]));
  let n = Nt(s);
  if (n && n.augments) {
    const l = new Map();
    for (let h of Object.keys(e)) {
      let o = Object.getOwnPropertyDescriptor(r, h);
      for (let a of n.augments) {
        let f = l.get(a);
        f || l.set(a, (f = {}));
        let u = Object.getOwnPropertyDescriptor(a.prototype, h);
        u && !Vr(o, u) ? console.warn("wont extend", h, u, o) : (f[h] = e[h]);
      }
    }
    for (let [h, o] of l) Object.keys(o).length && Nr(h.prototype, null, o);
  }
  return Object.defineProperties(r, e), r;
}
function Cr(r, t) {
  let e = Nt(r),
    i = Nt(t);
  if (i.parent && !(r.prototype instanceof i.parent))
    throw new Error(
      `Mixin ${t.name} has superclass not present in target class`
    );
  if (!i.augments) {
    i.augments = new Set();
    const n = (i.ref = Symbol(t.name)),
      l = Object[Symbol.hasInstance];
    (t.prototype[n] = !0),
      Object.defineProperty(t, Symbol.hasInstance, {
        value: function (h) {
          return this === t ? h && !!h[n] : l.call(this, h);
        },
      });
  }
  if (r.prototype[i.ref]) return r;
  if (i.uses) for (let n of i.uses) Cr(r, n);
  i.augments.add(r), e.uses || (e.uses = []), e.uses.push(t);
  let s = Object.getOwnPropertyDescriptors(t.prototype);
  return (
    delete s.constructor,
    s[W] &&
      (e.inits || (e.inits = []), e.inits.push(t.prototype[W]), delete s[W]),
    Object.defineProperties(r.prototype, s),
    (t == null ? void 0 : t.mixed) instanceof Function && t.mixed(r),
    r
  );
}
let et = {
  cache: {},
  self: null,
  target: null,
  proxy: new Proxy(
    {},
    {
      apply: (r, t, ...e) => et.target[t].apply(et.self, e),
      get: (r, t) => Reflect.get(et.target, t, et.self),
      set: (r, t, e, i) => Reflect.set(et.target, t, e, et.self),
    }
  ),
};
function c(r, t, e, i, s = null) {
  var a;
  let n = Object.getPrototypeOf(r.prototype),
    l = i & It.HasMixins,
    h;
  if (
    (l && (ut.set(r, ut.get(n.constructor)), (n = Object.getPrototypeOf(n))), s)
  ) {
    let f = i & It.IsObjectExtension ? s : s.prototype,
      u = Nt(r);
    if (u.uses) {
      s === f && console.warn("Cannot extend object with mixins");
      for (let b of u.uses) Cr(s, b);
    }
    return (
      i & It.HasSuperCalls &&
        (et.cache[t] = Object.create(
          Object.getPrototypeOf(f),
          Object.getOwnPropertyDescriptors(f)
        )),
      Nr(f, r.prototype),
      s
    );
  }
  let o = n == null ? void 0 : n.constructor;
  if (
    ((h = Nt(r, { symbol: t })),
    Object.defineProperty(r, qr, {
      value: h,
      enumerable: !1,
      configurable: !0,
    }),
    e &&
      r.name !== e &&
      Object.defineProperty(r, "name", { value: e, configurable: !0 }),
    (h.flags = i),
    i & It.HasConstructor && (r.prototype[Lr] = t),
    h.uses)
  )
    for (let f of h.uses) (a = f.mixes) == null || a.call(f, r);
  return (
    (o == null ? void 0 : o.inherited) instanceof Function && o.inherited(r), r
  );
}
const vt = Symbol.for("#__listeners__");
let Wr = Symbol();
const oi = class oi {
  static for(t) {
    return new Proxy({}, new this(t));
  }
  constructor(t) {
    this.getter = t;
  }
  get target() {
    return this.getter();
  }
  get(t, e) {
    return this.target[e];
  }
  set(t, e, i) {
    return (this.target[e] = i), !0;
  }
};
c(oi, Wr, "LazyProxy", 16);
let Di = oi;
function zt(r) {
  let t = typeof r;
  if (t == "number") return r;
  if (t == "string") {
    if (/^\d+fps$/.test(r)) return 1e3 / parseFloat(r);
    if (/^([-+]?[\d\.]+)s$/.test(r)) return parseFloat(r) * 1e3;
    if (/^([-+]?[\d\.]+)ms$/.test(r)) return parseFloat(r);
  }
  return null;
}
function ni(r, t, e) {
  if (!r) return;
  let i = Object.getOwnPropertyDescriptor(r, t);
  return i || r == e ? i || void 0 : ni(Reflect.getPrototypeOf(r), t, e);
}
const ji = function (r, t, e) {
  let i, s;
  for (; (i = e) && (e = e.next); )
    (s = e.listener) &&
      (e.path && s[e.path]
        ? t
          ? s[e.path].apply(s, t)
          : s[e.path]()
        : t
        ? s.apply(e, t)
        : s.call(e)),
      e.times && --e.times <= 0 && ((i.next = e.next), (e.listener = null));
};
function oe(r, t, e, i) {
  let s, n, l;
  return (
    (s = r[vt] || (r[vt] = {})),
    (n = s[t] || (s[t] = {})),
    (l = n.tail || (n.tail = n.next = {})),
    (l.listener = e),
    (l.path = i),
    (n.tail = l.next = {}),
    l
  );
}
function xt(r, t, e) {
  let i = oe(r, t, e);
  return (i.times = 1), i;
}
function Tr(r, t, e, i) {
  if (!e) return;
  let s,
    n,
    l = r[vt];
  if (l && (s = l[t])) {
    for (; (n = s) && (s = s.next); )
      if (s == e || s.listener == e) {
        (n.next = s.next), (s.listener = null);
        break;
      }
  }
}
function Ct(r, t, e = null) {
  let i;
  (i = r[vt]) && (i[t] && ji(t, e, i[t]), i.all && ji(t, [t, e], i.all));
}
let Kr = Symbol();
const hi = class hi {
  emit(t, ...e) {
    return Ct(this, t, e);
  }
  on(t, ...e) {
    return oe(this, t, ...e);
  }
  once(t, ...e) {
    return xt(this, t, ...e);
  }
  un(t, ...e) {
    return Tr(this, t, ...e);
  }
};
c(hi, Kr, "Emitter", 0);
let Qt = hi;
function xe(r, t) {
  var e;
  return typeof t == "string"
    ? typeof r === t
    : (e = t[Symbol.hasInstance]) == null
    ? void 0
    : e.call(t, r);
}
function Gr(r) {
  let t;
  return r && ((t = r.toIterable) ? t.call(r) : r);
}
const Mi = Symbol.for("#__init__"),
  Ri = Symbol.for("#schedule"),
  He = Symbol.for("#frames"),
  Dt = Symbol.for("#interval"),
  lt = Symbol.for("#stage"),
  ot = Symbol.for("#scheduled"),
  jt = Symbol.for("#version"),
  Ur = Symbol.for("#fps"),
  ki = Symbol.for("#ticker");
let Qr =
    globalThis.requestAnimationFrame ||
    function (r) {
      return globalThis.setTimeout(r, 1e3 / 60);
    },
  Yr = Symbol();
const ui = class ui {
  constructor(t = null) {
    this[Mi](t);
  }
  [Mi](t = null, e = !0, i = !0) {
    var s;
    (this.owner = t && (s = t.owner) !== void 0 ? s : null),
      (this.target = t && (s = t.target) !== void 0 ? s : null),
      (this.active = t && (s = t.active) !== void 0 ? s : !1),
      (this.value = t && (s = t.value) !== void 0 ? s : void 0),
      (this.skip = t && (s = t.skip) !== void 0 ? s : 0),
      (this.last = t && (s = t.last) !== void 0 ? s : 0);
  }
  tick(t, e) {
    return (this.last = this.owner[He]), this.target.tick(this, e), 1;
  }
  update(t, e) {
    let i = this.active,
      s = t.value;
    return (
      this.value != s && (this.deactivate(), (this.value = s)),
      (this.value || i || e) && this.activate(),
      this
    );
  }
  queue() {
    this.owner.add(this);
  }
  activate() {
    return (
      this.value === !0
        ? this.owner.on("commit", this)
        : this.value === !1 ||
          (typeof this.value == "number" &&
            (this.value / 16.666666666666668 <= 2
              ? this.owner.on("raf", this)
              : (this[Dt] = globalThis.setInterval(
                  this.queue.bind(this),
                  this.value
                )))),
      (this.active = !0),
      this
    );
  }
  deactivate() {
    return (
      this.value === !0 && this.owner.un("commit", this),
      this.owner.un("raf", this),
      this[Dt] && (globalThis.clearInterval(this[Dt]), (this[Dt] = null)),
      (this.active = !1),
      this
    );
  }
};
c(ui, Yr, "Scheduled", 16);
let Be = ui,
  Zr = Symbol();
const ai = class ai {
  constructor() {
    var t = this;
    (this.id = Symbol()),
      (this.queue = []),
      (this.stage = -1),
      (this[lt] = -1),
      (this[He] = 0),
      (this[ot] = !1),
      (this[jt] = 0),
      (this.listeners = {}),
      (this.intervals = {}),
      (this.commit = function () {
        return t.add("commit"), t;
      }),
      (this[Ur] = 0),
      (this.$promise = null),
      (this.$resolve = null),
      (this[ki] = function (e) {
        return (t[ot] = !1), t.tick(e);
      });
  }
  touch() {
    return this[jt]++;
  }
  get version() {
    return this[jt];
  }
  add(t, e) {
    return (
      (e || this.queue.indexOf(t) == -1) && this.queue.push(t),
      this[ot] || this[Ri](),
      this
    );
  }
  get committingΦ() {
    return this.queue.indexOf("commit") >= 0;
  }
  get syncingΦ() {
    return this[lt] == 1;
  }
  listen(t, e) {
    let i = this.listeners[t],
      s = !i;
    return (
      i || (i = this.listeners[t] = new Set()),
      i.add(e),
      t == "raf" && s && this.add("raf"),
      this
    );
  }
  unlisten(t, e) {
    let i = this.listeners[t];
    return (
      i && i.delete(e),
      t == "raf" &&
        i &&
        i.size == 0 &&
        (this.listeners.raf, delete this.listeners.raf),
      this
    );
  }
  on(t, e) {
    return this.listen(t, e);
  }
  un(t, e) {
    return this.unlisten(t, e);
  }
  get promise() {
    var t = this;
    return (
      this.$promise ||
      (this.$promise = new Promise(function (e) {
        return (t.$resolve = e);
      }))
    );
  }
  tick(t) {
    var e = this;
    let i = this.queue;
    if (
      (this[He]++,
      this.ts || (this.ts = t),
      (this.dt = t - this.ts),
      (this.ts = t),
      (this.queue = []),
      (this[lt] = 1),
      this[jt]++,
      i.length)
    )
      for (let s = 0, n = Gr(i), l = n.length; s < l; s++) {
        let h = n[s];
        typeof h == "string" && this.listeners[h]
          ? this.listeners[h].forEach(function (o) {
              if (xe(o.tick, Function)) return o.tick(e, h);
              if (xe(o, Function)) return o(e, h);
            })
          : xe(h, Function)
          ? h(this.dt, this)
          : h.tick && h.tick(this.dt, this);
      }
    return (
      (this[lt] = this[ot] ? 0 : -1),
      this.$promise &&
        (this.$resolve(this), (this.$promise = this.$resolve = null)),
      this.listeners.raf && this.add("raf"),
      this
    );
  }
  [Ri]() {
    return (
      this[ot] ||
        ((this[ot] = !0), this[lt] == -1 && (this[lt] = 0), Qr(this[ki])),
      this
    );
  }
  schedule(t, e) {
    var s, n;
    return (
      e || (e = t[(s = this.id)] || (t[s] = { value: !0 })),
      (e[(n = this.id)] || (e[n] = new Be({ owner: this, target: t }))).update(
        e,
        !0
      )
    );
  }
  unschedule(t, e = {}) {
    e || (e = t[this.id]);
    let i = e && e[this.id];
    return i && i.active && i.deactivate(), this;
  }
};
c(ai, Zr, "Scheduler", 16);
let Ve = ai;
const P = new Ve();
function li() {
  return P.add("commit").promise;
}
function Jr(r, t) {
  return globalThis.setTimeout(function () {
    r(), li();
  }, t);
}
function Xr(r, t) {
  return globalThis.setInterval(function () {
    r(), li();
  }, t);
}
const tn = globalThis.clearInterval,
  en = globalThis.clearTimeout;
let Et = globalThis.imba || (globalThis.imba = {});
Et.commit = li;
Et.setTimeout = Jr;
Et.setInterval = Xr;
Et.clearInterval = tn;
Et.clearTimeout = en;
const Ai = Symbol.for("#toStringDeopt"),
  Li = Symbol.for("#symbols"),
  qi = Symbol.for("#batches"),
  Hi = Symbol.for("#extras"),
  we = Symbol.for("#stacks");
let sn = Symbol();
const fi = class fi {
  constructor(t) {
    (this.dom = t), (this.string = "");
  }
  contains(t) {
    return this.dom.classList.contains(t);
  }
  has(t) {
    return this.dom.classList.contains(t);
  }
  add(t) {
    return this.contains(t)
      ? this
      : ((this.string += (this.string ? " " : "") + t),
        this.dom.classList.add(t),
        this);
  }
  remove(t) {
    if (!this.contains(t)) return this;
    let e = new RegExp("(^|\\s)" + t + "(?=\\s|$)", "g");
    return (
      (this.string = this.string.replace(e, "")),
      this.dom.classList.remove(t),
      this
    );
  }
  toggle(t, e) {
    return (
      e === void 0 && (e = !this.contains(t)), e ? this.add(t) : this.remove(t)
    );
  }
  incr(t, e = 0) {
    var i = this;
    let s = this.stacks,
      n = s[t] || 0;
    return (
      n < 1 && this.add(t),
      e > 0 &&
        setTimeout(function () {
          return i.decr(t);
        }, e),
      (s[t] = Math.max(n, 0) + 1)
    );
  }
  decr(t) {
    let e = this.stacks,
      i = e[t] || 0;
    return i == 1 && this.remove(t), (e[t] = Math.max(i, 1) - 1);
  }
  reconcile(t, e) {
    let i = this[Li],
      s = this[qi],
      n = !0;
    if (!i)
      (i = this[Li] = [t]),
        (s = this[qi] = [e || ""]),
        (this.toString = this.valueOf = this[Ai]);
    else {
      let l = i.indexOf(t),
        h = e || "";
      l == -1 ? (i.push(t), s.push(h)) : s[l] != h ? (s[l] = h) : (n = !1);
    }
    n && ((this[Hi] = " " + s.join(" ")), this.sync());
  }
  valueOf() {
    return this.string;
  }
  toString() {
    return this.string;
  }
  [Ai]() {
    return this.string + (this[Hi] || "");
  }
  sync() {
    return this.dom.flagSync$();
  }
  get stacks() {
    return this[we] || (this[we] = {});
  }
};
c(fi, sn, "Flags", 16);
let Yt = fi;
const Bi = Symbol.for("#__init__"),
  Ne = Symbol.for("#getRenderContext"),
  rn = Symbol.for("#getDynamicContext"),
  E = { context: null };
let nn = Symbol();
const ci = class ci {
  constructor(t = null) {
    this[Bi](t);
  }
  [Bi](t = null, e = !0, i = !0) {
    var s;
    this.stack = t && (s = t.stack) !== void 0 ? s : [];
  }
  push(t) {
    return this.stack.push(t);
  }
  pop(t) {
    return this.stack.pop();
  }
};
c(ci, nn, "Renderer", 16);
let We = ci;
const Zt = new We();
let ln = Symbol();
const re = class re extends Map {
  constructor(t, e = null) {
    super(), (this._ = t), (this.sym = e);
  }
  pop() {
    return (E.context = null);
  }
  [Ne](t) {
    let e = this.get(t);
    return e || this.set(t, (e = new re(this._, t))), (E.context = e);
  }
  [rn](t, e) {
    return this[Ne](t)[Ne](e);
  }
  run(t) {
    return (
      (this.value = t), E.context == this && (E.context = null), this.get(t)
    );
  }
  cache(t) {
    return this.set(this.value, t), t;
  }
};
c(re, ln, "RenderContext", 16);
let Tt = re;
function on(r, t = Symbol(), e = r) {
  return (E.context = r[t] || (r[t] = new Tt(e, t)));
}
function hn() {
  let r = E.context,
    t = r || new Tt(null);
  return (
    globalThis.DEBUG_IMBA &&
      !r &&
      Zt.stack.length > 0 &&
      console.trace(
        "detected unmemoized nodes in",
        Zt.stack.slice(0),
        "see https://imba.io",
        t
      ),
    r && (E.context = null),
    t
  );
}
function Vi(r, t) {
  var e;
  return typeof t == "string"
    ? typeof r === t
    : (e = t[Symbol.hasInstance]) == null
    ? void 0
    : e.call(t, r);
}
function un(r) {
  let t;
  return r && ((t = r.toIterable) ? t.call(r) : r);
}
const wt = Symbol.for("#parent"),
  Wi = Symbol.for("#closestNode"),
  an = Symbol.for("#parentNode"),
  fn = Symbol.for("#context"),
  Pr = Symbol.for("##inited"),
  Ce = Symbol.for("#getRenderContext"),
  cn = Symbol.for("#getDynamicContext"),
  Ki = Symbol.for("#insertChild"),
  Ke = Symbol.for("#appendChild"),
  Te = Symbol.for("#replaceChild"),
  Gi = Symbol.for("#removeChild"),
  q = Symbol.for("#insertInto"),
  Ui = Symbol.for("#insertIntoDeopt"),
  $t = Symbol.for("#removeFrom"),
  Qi = Symbol.for("#removeFromDeopt"),
  ht = Symbol.for("#replaceWith"),
  Yi = Symbol.for("#replaceWithDeopt"),
  Pe = Symbol.for("#placeholderNode"),
  dn = Symbol.for("#attachToParent"),
  mn = Symbol.for("#detachFromParent"),
  Zi = Symbol.for("#placeChild"),
  $n = Symbol.for("#beforeReconcile"),
  pn = Symbol.for("#afterReconcile"),
  gn = Symbol.for("#afterVisit"),
  yn = Symbol.for("#visitContext"),
  Er = Symbol.for("#__init__"),
  Or = Symbol.for("##parent"),
  Mt = Symbol.for("##up"),
  Ee = Symbol.for("##context"),
  J = Symbol.for("#domNode"),
  pt = Symbol.for("##placeholderNode"),
  Ji = Symbol.for("#forNode"),
  Xi = Symbol.for("#domDeopt"),
  gt = Symbol.for("##visitContext"),
  bn = Symbol.for("#isRichElement"),
  ts = Symbol.for("#src"),
  Gt = Symbol.for("#htmlNodeName"),
  es = Symbol.for("#cssns"),
  Sn = Symbol.for("#cssid"),
  _n = window.MouseEvent,
  vn = window.KeyboardEvent,
  Fr = window.Node,
  is = window.Comment,
  xn = window.Text,
  Oe = {};
function Ir(r, t, e) {
  if (!r) return (e[t] = null);
  if (e[t] !== void 0) return e[t];
  let i = Object.getOwnPropertyDescriptor(r, t);
  return i !== void 0 || r == SVGElement
    ? (e[t] = i || null)
    : Ir(Reflect.getPrototypeOf(r), t, e);
}
const Ge = {},
  Ue = {},
  wn = {},
  Nn = {};
function Fe() {
  return globalThis.document;
}
const Cn = {
  get(r, t) {
    let e = r,
      i;
    for (; e && i == null; ) (e = e[wt]) && (i = e[t]);
    return i;
  },
  set(r, t, e) {
    let i = r,
      s;
    for (; i && s == null; ) {
      if (ni(i, t, Element)) return (i[t] = e), !0;
      i = i[wt];
    }
    return !0;
  },
};
let Tn = Symbol();
const di = class di {
  get flags() {
    return this.documentElement.flags;
  }
  emit(...t) {
    return this.documentElement.emit(...t);
  }
};
c(di, Tn, "Document", 1, Document);
let ss = di;
Node.prototype[Er] = function () {
  return this;
};
let Pn = Symbol();
var at;
let Hl =
    ((at = class {
      get [wt]() {
        return this[Or] || this.parentNode || this[Mt];
      }
      get [Wi]() {
        return this;
      }
      get [an]() {
        return this[wt][Wi];
      }
      get [fn]() {
        return this[Ee] || (this[Ee] = new Proxy(this, Cn));
      }
      [Pr]() {
        return this;
      }
      [Ce](t) {
        return on(this, t);
      }
      [cn](t, e) {
        return this[Ce](t)[Ce](e);
      }
      [Ki](t, e) {
        return t[q](this, e);
      }
      [Ke](t) {
        return t[q](this, null);
      }
      [Te](t, e) {
        let i = this[Ki](t, e);
        return this[Gi](e), i;
      }
      [Gi](t) {
        return t[$t](this);
      }
      [q](t, e = null) {
        return e ? t.insertBefore(this, e) : t.appendChild(this), this;
      }
      [Ui](t, e) {
        return (
          e
            ? t.insertBefore(this[J] || this, e)
            : t.appendChild(this[J] || this),
          this
        );
      }
      [$t](t) {
        return t.removeChild(this);
      }
      [Qi](t) {
        return t.removeChild(this[J] || this);
      }
      [ht](t, e) {
        return e[Te](t, this);
      }
      [Yi](t, e) {
        return e[Te](t, this[J] || this);
      }
      get [Pe]() {
        let t;
        return (
          this[pt] ||
          (this[pt] =
            ((t = globalThis.document.createComment("placeholder")),
            (t[Ji] = this),
            t))
        );
      }
      set [Pe](t) {
        let e = this[pt];
        (this[pt] = t), (t[Ji] = this), e && e != t && e.parentNode && e[ht](t);
      }
      [dn]() {
        let t = this[J],
          e = t && t.parentNode;
        return (
          t && e && t != this && ((this[J] = null), this[q](e, t), t[$t](e)),
          this
        );
      }
      [mn]() {
        this[Xi] != !0 &&
          ((this[Xi] = !0), !0) &&
          ((this[ht] = this[Yi]),
          (this[$t] = this[Qi]),
          (this[q] = this[Ui]),
          this[Mt] || (this[Mt] = this[wt]));
        let t = this[Pe];
        return (
          this.parentNode &&
            t != this &&
            (t[q](this.parentNode, this), this[$t](this.parentNode)),
          (this[J] = t),
          this
        );
      }
      [Zi](t, e, i) {
        let s = typeof t;
        if (s === "undefined" || t === null) {
          if (i && Vi(i, Comment)) return i;
          let n = globalThis.document.createComment("");
          return i ? i[ht](n, this) : n[q](this, null);
        }
        if (t === i) return t;
        if (s !== "object") {
          let n,
            l = t;
          return i
            ? Vi(i, Text)
              ? ((i.textContent = l), i)
              : ((n = globalThis.document.createTextNode(l)), i[ht](n, this), n)
            : (this.appendChild((n = globalThis.document.createTextNode(l))),
              n);
        } else
          return t[q]
            ? i
              ? i[ht](t, this)
              : t[q](this, null)
            : this[Zi](String(t), e, i);
      }
    }),
    c(at, Pn, "Node", 1, Node),
    at),
  En = Symbol();
var ft;
let Bl =
  ((ft = class {
    log(...t) {
      return console.log(...t);
    }
    get hiddenΦ() {
      var e, i;
      let t = globalThis.getComputedStyle(this);
      return t.display == "none" || t.visibility == "hidden"
        ? !0
        : this.offsetParent || this === globalThis.document.body
        ? !1
        : (i = (e = this.parentElement) == null ? void 0 : e.hiddenΦ) != null
        ? i
        : !0;
    }
    get unobstructedΦ() {
      let t = this.getBoundingClientRect(),
        e = window.visualViewport,
        i = t.left + t.width * 0.5,
        s = t.top + t.height * 0.5;
      if (e.width > i && i > 0 && e.height > s && s > 0) {
        let n = globalThis.document.elementFromPoint(i, s);
        return !!(n && (n.contains(this) || this.contains(n)));
      }
      return !1;
    }
    get focusΦ() {
      return globalThis.document.activeElement == this;
    }
    get focinΦ() {
      return this.contains(globalThis.document.activeElement);
    }
    emit(t, e, i = {}) {
      var n, l, h;
      e != null && ((n = i.detail) != null || (i.detail = e)),
        (l = i.bubbles) != null || (i.bubbles = !0),
        (h = i.cancelable) != null || (i.cancelable = !0);
      let s = new CustomEvent(t, i);
      return (
        i.original && (s.originalEvent = i.original), this.dispatchEvent(s), s
      );
    }
    text$(t) {
      return (this.textContent = t), this;
    }
    [$n]() {
      return this;
    }
    [pn]() {
      return this;
    }
    [gn]() {
      this[gt] && (this[gt] = null);
    }
    get [yn]() {
      return this[gt] || (this[gt] = {});
    }
    get flags() {
      return (
        this.$flags ||
          ((this.$flags = new Yt(this)),
          this.flag$ == Element.prototype.flag$ &&
            (this.flags$ext = this.className),
          this.flagDeopt$()),
        this.$flags
      );
    }
    flag$(t) {
      let e = this.flags$ns;
      this.className = e ? e + (this.flags$ext = t) : (this.flags$ext = t);
    }
    flagDeopt$() {
      var t = this;
      (this.flag$ = this.flagExt$),
        (this.flagSelf$ = function (e) {
          return t.flagSync$((t.flags$own = e));
        });
    }
    flagExt$(t) {
      return this.flagSync$((this.flags$ext = t));
    }
    flagSelf$(t) {
      return this.flagDeopt$(), this.flagSelf$(t);
    }
    flagSync$() {
      return (this.className =
        (this.flags$ns || "") +
        (this.flags$ext || "") +
        " " +
        (this.flags$own || "") +
        " " +
        (this.$flags || ""));
    }
    set$(t, e) {
      let i = ni(this, t, Element);
      !i || !i.set ? this.setAttribute(t, e) : (this[t] = e);
    }
    get richValue() {
      return this.value;
    }
    set richValue(t) {
      this.value = t;
    }
  }),
  c(ft, En, "Element", 1, Element),
  ft);
Element.prototype.setns$ = Element.prototype.setAttributeNS;
Element.prototype[bn] = !0;
function m(r, t, e, i) {
  let s = globalThis.document.createElement(r);
  return (
    e && (s.className = e), i !== null && s.text$(i), t && t[Ke] && t[Ke](s), s
  );
}
let On = Symbol();
const mi = class mi {
  set$(t, e) {
    var n;
    let i = Oe[(n = this.nodeName)] || (Oe[n] = {}),
      s = Ir(this, t, i);
    !s || !s.set ? this.setAttribute(t, e) : (this[t] = e);
  }
  flag$(t) {
    let e = this.flags$ns;
    this.setAttribute(
      "class",
      e ? e + (this.flags$ext = t) : (this.flags$ext = t)
    );
  }
  flagSelf$(t) {
    var e = this;
    return (
      (this.flag$ = function (i) {
        return e.flagSync$((e.flags$ext = i));
      }),
      (this.flagSelf$ = function (i) {
        return e.flagSync$((e.flags$own = i));
      }),
      this.flagSelf$(t)
    );
  }
  flagSync$() {
    return this.setAttribute(
      "class",
      (this.flags$ns || "") +
        (this.flags$ext || "") +
        " " +
        (this.flags$own || "") +
        " " +
        (this.$flags || "")
    );
  }
};
c(mi, On, "SVGElement", 1, SVGElement);
let rs = mi,
  Fn = Symbol();
const $i = class $i {
  set src(t) {
    if (this[ts] != t && ((this[ts] = t), !0)) {
      if (t && t.adoptNode) t.adoptNode(this);
      else if (t && t.type == "svg") {
        if (t.attributes)
          for (
            let e = t.attributes, i = 0, s = Object.keys(e), n = s.length, l, h;
            i < n;
            i++
          )
            (l = s[i]), (h = e[l]), this.setAttribute(l, h);
        this.innerHTML = t.content;
      }
    }
  }
};
c($i, Fn, "SVGSVGElement", 1, SVGSVGElement);
let ns = $i;
function Qe(r) {
  return globalThis.document.createComment(r);
}
function ls(r) {
  return globalThis.document.createTextNode(r);
}
const Jt = globalThis.navigator,
  In = (Jt && Jt.vendor) || "",
  os = (Jt && Jt.userAgent) || "",
  zn =
    In.indexOf("Apple") > -1 ||
    os.indexOf("CriOS") >= 0 ||
    os.indexOf("FxiOS") >= 0,
  Xt = !zn,
  hs = new Map();
let Dn = Symbol();
const pi = class pi extends HTMLElement {
  connectedCallback() {
    return Xt
      ? this.parentNode.removeChild(this)
      : this.parentNode.connectedCallback();
  }
  disconnectedCallback() {
    if (!Xt) return this.parentNode.disconnectedCallback();
  }
};
c(pi, Dn, "CustomHook", 0);
let Ye = pi;
window.customElements.define("i-hook", Ye);
function jn(r, t) {
  let e = hs.get(t);
  if (!e) {
    e = {};
    let i = t.prototype,
      s = [i];
    for (
      ;
      (i = i && Object.getPrototypeOf(i)) && i.constructor != r.constructor;

    )
      s.unshift(i);
    for (let n = 0, l = un(s), h = l.length; n < h; n++) {
      let o = l[n],
        a = Object.getOwnPropertyDescriptors(o);
      Object.assign(e, a);
    }
    hs.set(t, e);
  }
  return e;
}
function zr(r, t, e, i, s) {
  let n;
  typeof r != "string" && r && r.nodeName && (r = r.nodeName);
  let l = Ue[r] || r;
  if (Ge[r]) {
    let h = Ge[r],
      o = h.prototype[Gt];
    if (o && Xt) n = globalThis.document.createElement(o, { is: l });
    else if (h.create$ && o) {
      (n = globalThis.document.createElement(o)), n.setAttribute("is", l);
      let a = jn(n, h);
      Object.defineProperties(n, a),
        (n.__slots = {}),
        n.appendChild(globalThis.document.createElement("i-hook"));
    } else
      h.create$
        ? ((n = h.create$(n)), (n.__slots = {}))
        : console.warn("could not create tag " + r);
  } else n = globalThis.document.createElement(Ue[r] || r);
  return (
    (n[Or] = t), n[Er](), n[Pr](), (e || n.flags$ns) && n.flag$(e || ""), n
  );
}
function Dr(r, t, e = {}) {
  (wn[r] = Nn[r] = t), (t.nodeName = r);
  let i = r,
    s = t.prototype;
  if ((r.indexOf("-") == -1 && ((i = "" + r + "-tag"), (Ue[r] = i)), e.cssns)) {
    let n = (s._ns_ || s[es] || "") + " " + (e.cssns || "");
    (s._ns_ = n.trim() + " "), (s[es] = e.cssns);
  }
  if (e.cssid) {
    let n = (s.flags$ns || "") + " " + e.cssid;
    (s[Sn] = e.cssid), (s.flags$ns = n.trim() + " ");
  }
  return (
    s[Gt] && !e.extends && (e.extends = s[Gt]),
    e.extends
      ? ((s[Gt] = e.extends),
        (Ge[r] = t),
        Xt && window.customElements.define(i, t, { extends: e.extends }))
      : window.customElements.define(i, t),
    t
  );
}
let Mn = globalThis.imba || (globalThis.imba = {});
Mn.document = globalThis.document;
function yt(r, t) {
  var e;
  return typeof t == "string"
    ? typeof r === t
    : (e = t[Symbol.hasInstance]) == null
    ? void 0
    : e.call(t, r);
}
function Ie(r) {
  let t;
  return r && ((t = r.toIterable) ? t.call(r) : r);
}
const Ut = Symbol.for("#parent"),
  us = Symbol.for("#closestNode"),
  Rn = Symbol.for("#isRichElement"),
  kn = Symbol.for("#afterVisit"),
  as = Symbol.for("#appendChild"),
  fs = Symbol.for("#removeChild"),
  cs = Symbol.for("#replaceChild"),
  H = Symbol.for("#insertInto"),
  Rt = Symbol.for("#replaceWith"),
  ds = Symbol.for("#insertChild"),
  kt = Symbol.for("#removeFrom"),
  ms = Symbol.for("#placeChild"),
  An = Symbol.for("#registerFunctionalSlot"),
  Ln = Symbol.for("#getFunctionalSlot"),
  $s = Symbol.for("#getSlot"),
  Ze = Symbol.for("##parent"),
  Q = Symbol.for("##up"),
  ze = Symbol.for("##flags"),
  qn = Symbol.for("#domFlags"),
  z = Symbol.for("#end"),
  ps = Symbol.for("#textContent"),
  At = Symbol.for("#textNode"),
  Lt = Symbol.for("#functionalSlots");
let Hn = Symbol();
const gi = class gi {
  constructor() {
    this.childNodes = [];
  }
  log(...t) {}
  hasChildNodes() {
    return !1;
  }
  set [Ut](t) {
    this[Ze] = t;
  }
  get [Ut]() {
    return this[Ze] || this[Q];
  }
  get [us]() {
    return this[Ut][us];
  }
  get [Rn]() {
    return !0;
  }
  get flags() {
    return this[ze] || (this[ze] = new Yt(this));
  }
  flagSync$() {
    return this;
  }
  [kn]() {
    return this;
  }
};
c(gi, Hn, "Fragment", 16);
let Pt = gi,
  Bn = 0,
  Vn = Symbol();
const yi = class yi extends Pt {
  constructor(t, e) {
    super(...arguments),
      (this[Q] = e),
      (this.parentNode = null),
      (this[qn] = t),
      (this.childNodes = []),
      (this[z] = Qe("slot" + Bn++)),
      e && e[as](this);
  }
  get [Ut]() {
    return this[Ze] || this.parentNode || this[Q];
  }
  set textContent(t) {
    this[ps] = t;
  }
  get textContent() {
    return this[ps];
  }
  hasChildNodes() {
    for (let t = 0, e = Ie(this.childNodes), i = e.length; t < i; t++) {
      let s = e[t];
      if (yt(s, Pt) && s.hasChildNodes()) return !0;
      if (!yt(s, is)) {
        if (yt(s, Fr)) return !0;
      }
    }
    return !1;
  }
  text$(t) {
    return (
      this[At] ? (this[At].textContent = t) : (this[At] = this[ms](t)), this[At]
    );
  }
  appendChild(t) {
    return (
      this.parentNode && t[H](this.parentNode, this[z]), this.childNodes.push(t)
    );
  }
  [as](t) {
    var e;
    return (
      this.parentNode
        ? t[H](this.parentNode, this[z])
        : (e = t[Q]) != null || (t[Q] = this[Q] || this),
      this.childNodes.push(t)
    );
  }
  insertBefore(t, e) {
    this.parentNode && this.parentNode[ds](t, e);
    let i = this.childNodes.indexOf(e);
    return i >= 0 && this.childNodes.splice(i, 0, t), t;
  }
  [fs](t) {
    this.parentNode && this.parentNode[fs](t);
    let e = this.childNodes.indexOf(t);
    e >= 0 && this.childNodes.splice(e, 1);
  }
  [cs](t, e) {
    this.parentNode && this.parentNode[cs](t, e);
    let i = this.childNodes.indexOf(e);
    return (this.childNodes[i] = t), t;
  }
  [H](t, e) {
    if (
      (this.parentNode, this.parentNode != t && ((this.parentNode = t), !0))
    ) {
      this[z] && (e = this[z][H](t, e));
      for (let i = 0, s = Ie(this.childNodes), n = s.length; i < n; i++)
        s[i][H](t, e);
    }
    return this;
  }
  [Rt](t, e) {
    let i = t[H](e, this[z]);
    return this[kt](e), i;
  }
  [ds](t, e) {
    if ((this.parentNode && this.insertBefore(t, e || this[z]), e)) {
      let i = this.childNodes.indexOf(e);
      i >= 0 && this.childNodes.splice(i, 0, t);
    } else this.childNodes.push(t);
    return t;
  }
  [kt](t) {
    for (let e = 0, i = Ie(this.childNodes), s = i.length; e < s; e++)
      i[e][kt](t);
    return this[z] && this[z][kt](t), (this.parentNode = null), this;
  }
  [ms](t, e, i) {
    let s = this.parentNode,
      n = typeof t;
    if (n === "undefined" || t === null) {
      if (i && yt(i, is)) return i;
      let l = Qe("");
      if (i) {
        let h = this.childNodes.indexOf(i);
        return this.childNodes.splice(h, 1, l), s && i[Rt](l, s), l;
      }
      return this.childNodes.push(l), s && l[H](s, this[z]), l;
    }
    if (t === i) return t;
    if (n !== "object") {
      let l,
        h = t;
      if (i) {
        if (yt(i, xn)) return (i.textContent = h), i;
        {
          l = ls(h);
          let o = this.childNodes.indexOf(i);
          return this.childNodes.splice(o, 1, l), s && i[Rt](l, s), l;
        }
      } else return this.childNodes.push((l = ls(h))), s && l[H](s, this[z]), l;
    } else if (i) {
      let l = this.childNodes.indexOf(i);
      return this.childNodes.splice(l, 1, t), s && i[Rt](t, s), t;
    } else return this.childNodes.push(t), s && t[H](s, this[z]), t;
  }
};
c(yi, Vn, "VirtualFragment", 16);
let Je = yi;
function gs(r, t) {
  const e = new Je(r, null);
  return (e[Q] = t), e;
}
let Wn = Symbol();
const bi = class bi {
  [An](t) {
    let e = this[Lt] || (this[Lt] = {});
    return e[t] || (e[t] = gs(0, this));
  }
  [Ln](t, e) {
    let i = this[Lt];
    return (i && i[t]) || this[$s](t, e);
  }
  [$s](t, e) {
    var i;
    return (t == "__" && !this.render) || !this.__slots
      ? this
      : (i = this.__slots)[t] || (i[t] = gs(0, this));
  }
};
c(bi, Wn, "Node", 1, Fr);
let ys = bi;
function Kn(r) {
  let t;
  return r && ((t = r.toIterable) ? t.call(r) : r);
}
const Gn = Symbol.for("#afterVisit"),
  qt = Symbol.for("#insertInto"),
  bs = Symbol.for("#appendChild"),
  Un = Symbol.for("#replaceWith"),
  De = Symbol.for("#removeFrom"),
  Qn = Symbol.for("#domFlags"),
  Yn = Symbol.for("##parent"),
  G = Symbol.for("#end"),
  Zn = Symbol.for("#removeChild"),
  Jn = Symbol.for("#insertChild");
let Xn = Symbol();
const Si = class Si extends Pt {
  constructor(t, e) {
    super(...arguments),
      (this[Qn] = t),
      (this[Yn] = e),
      t & 256 || (this[G] = Qe("list")),
      (this.$ = this.childNodes),
      (this.length = 0),
      e && e[bs](this);
  }
  hasChildNodes() {
    return this.length != 0;
  }
  [Gn](t) {
    let e = this.length;
    if (((this.length = t), e == t)) return;
    let i = this.parentNode;
    if (!i) return;
    let s = this.childNodes,
      n = this[G];
    if (e > t) for (; e > t; ) i[Zn](s[--e]);
    else if (t > e) for (; t > e; ) i[Jn](s[e++], n);
    this.length = t;
  }
  [qt](t, e) {
    (this.parentNode = t), this[G] && this[G][qt](t, e), (e = this[G]);
    for (let i = 0, s = Kn(this.childNodes), n = s.length; i < n; i++) {
      let l = s[i];
      if (i == this.length) break;
      l[qt](t, e);
    }
    return this;
  }
  [bs](t) {}
  [Un](t, e) {
    let i = t[qt](e, this[G]);
    return this[De](e), i;
  }
  [De](t) {
    let e = this.length;
    for (; e > 0; ) this.childNodes[--e][De](t);
    this[G] && t.removeChild(this[G]), (this.parentNode = null);
  }
};
c(Si, Xn, "IndexedTagFragment", 16);
let Xe = Si;
function Ss(r, t) {
  return new Xe(r, t);
}
function _s(r, t) {
  var e;
  return typeof t == "string"
    ? typeof r === t
    : (e = t[Symbol.hasInstance]) == null
    ? void 0
    : e.call(t, r);
}
const te = Symbol.for("#__init__"),
  tl = Symbol.for("##inited"),
  el = Symbol.for("#afterVisit"),
  il = Symbol.for("#beforeReconcile"),
  sl = Symbol.for("#afterReconcile"),
  vs = Symbol.for("#__hooks__"),
  X = Symbol.for("#autorender"),
  Ht = Symbol.for("##visitContext");
let rl = Symbol();
var ct;
const nl = new ((ct = class {
  constructor(t = null) {
    this[te](t);
  }
  [te](t = null, e = !0, i = !0) {
    var s;
    (this.items = t && (s = t.items) !== void 0 ? s : []),
      (this.current = t && (s = t.current) !== void 0 ? s : null),
      (this.lastQueued = t && (s = t.lastQueued) !== void 0 ? s : null),
      (this.tests = t && (s = t.tests) !== void 0 ? s : 0);
  }
  flush() {
    let t = null;
    for (; (t = this.items.shift()); ) {
      if (!t.parentNode || t.hydratedΦ) continue;
      let e = this.current;
      (this.current = t),
        (t.__F |= 1024),
        t.connectedCallback(),
        (this.current = e);
    }
  }
  queue(t) {
    var e = this;
    let i = this.items.length,
      s = this.lastQueued;
    this.lastQueued = t;
    let n = Node.DOCUMENT_POSITION_PRECEDING,
      l = Node.DOCUMENT_POSITION_FOLLOWING;
    if (i) {
      let h = this.items.indexOf(s),
        o = h,
        a = function (u, b) {
          return e.tests++, u.compareDocumentPosition(b);
        };
      (h == -1 || s.nodeName != t.nodeName) && (o = h = 0);
      let f = this.items[o];
      for (; f && a(f, t) & l; ) f = this.items[++o];
      if (o != h) f ? this.items.splice(o, 0, t) : this.items.push(t);
      else {
        for (; f && a(f, t) & n; ) f = this.items[--o];
        o != h && (f ? this.items.splice(o + 1, 0, t) : this.items.unshift(t));
      }
    } else
      this.items.push(t),
        this.current || globalThis.queueMicrotask(this.flush.bind(this));
  }
}),
c(ct, rl, null, 16),
ct)();
let ll = Symbol();
const _i = class _i extends HTMLElement {
  constructor() {
    super(),
      this.flags$ns && (this.flag$ = this.flagExt$),
      this.setup$(),
      this.build();
  }
  setup$() {
    return (this.__slots = {}), (this.__F = 0);
  }
  [te]() {
    return (this.__F |= 3), this;
  }
  [tl]() {
    if (this[vs]) return this[vs].inited(this);
  }
  flag$(t) {
    this.className = this.flags$ext = t;
  }
  build() {
    return this;
  }
  awaken() {
    return this;
  }
  mount() {
    return this;
  }
  unmount() {
    return this;
  }
  rendered() {
    return this;
  }
  dehydrate() {
    return this;
  }
  hydrate() {
    return (this.autoschedule = !0), this;
  }
  tick(t, e) {
    return this.commit();
  }
  visit() {
    return this.commit();
  }
  commit() {
    return this.renderΦ
      ? ((this.__F |= 256),
        this.render && this.render(),
        this.rendered(),
        (this.__F = (this.__F | 512) & -257 & -8193))
      : ((this.__F |= 8192), this);
  }
  get autoschedule() {
    return (this.__F & 64) != 0;
  }
  set autoschedule(t) {
    t ? (this.__F |= 64) : (this.__F &= -65);
  }
  set autorender(t) {
    let e = this[X] || (this[X] = {});
    (e.value = t), this.mountedΦ && P.schedule(this, e);
  }
  get renderΦ() {
    return !this.suspendedΦ;
  }
  get mountingΦ() {
    return (this.__F & 16) != 0;
  }
  get mountedΦ() {
    return (this.__F & 32) != 0;
  }
  get awakenedΦ() {
    return (this.__F & 8) != 0;
  }
  get renderedΦ() {
    return (this.__F & 512) != 0;
  }
  get suspendedΦ() {
    return (this.__F & 4096) != 0;
  }
  get renderingΦ() {
    return (this.__F & 256) != 0;
  }
  get scheduledΦ() {
    return (this.__F & 128) != 0;
  }
  get hydratedΦ() {
    return (this.__F & 2) != 0;
  }
  get ssrΦ() {
    return (this.__F & 1024) != 0;
  }
  get scheduler() {
    return P;
  }
  schedule() {
    return P.on("commit", this), (this.__F |= 128), this;
  }
  unschedule() {
    return P.un("commit", this), (this.__F &= -129), this;
  }
  async suspend(t = null) {
    return (
      this.flags.incr("@suspended"),
      (this.__F |= 4096),
      _s(t, Function) && (await t(), this.unsuspend()),
      this
    );
  }
  unsuspend() {
    return (
      this.flags.decr("@suspended") == 0 &&
        ((this.__F &= -4097), this.commit()),
      this
    );
  }
  [el]() {
    if ((this.visit(), this[Ht])) return (this[Ht] = null);
  }
  [il]() {
    return (
      this.__F & 1024 &&
        ((this.__F = this.__F & -1025),
        this.classList.remove("_ssr_"),
        this.flags$ext &&
          this.flags$ext.indexOf("_ssr_") == 0 &&
          (this.flags$ext = this.flags$ext.slice(5)),
        this.__F & 512 || (this.innerHTML = "")),
      globalThis.DEBUG_IMBA && Zt.push(this),
      this[Ht] && (this[Ht] = null),
      this
    );
  }
  [sl]() {
    return globalThis.DEBUG_IMBA && Zt.pop(this), this;
  }
  connectedCallback() {
    let t = this.__F,
      e = t & 1,
      i = t & 8;
    if (!e && !(t & 1024)) {
      nl.queue(this);
      return;
    }
    if (t & 48) return;
    (this.__F |= 16),
      e || this[te](),
      t & 2 ||
        ((this.flags$ext = this.className),
        (this.__F |= 2),
        this.hydrate(),
        this.commit()),
      i || (this.awaken(), (this.__F |= 8)),
      Ct(this, "mount", [this]);
    let s = this.mount();
    return (
      s && _s(s.then, Function) && s.then(P.commit),
      (t = this.__F = (this.__F | 32) & -17),
      t & 64 && this.schedule(),
      this[X] && P.schedule(this, this[X]),
      this
    );
  }
  disconnectedCallback() {
    if (
      ((this.__F = this.__F & -49),
      this.__F & 128 && this.unschedule(),
      Ct(this, "unmount", [this]),
      this.unmount(),
      this[X])
    )
      return P.unschedule(this, this[X]);
  }
};
c(_i, ll, "Component", 16);
let ee = _i;
function ol(r, t) {
  var e;
  return typeof t == "string"
    ? typeof r === t
    : (e = t[Symbol.hasInstance]) == null
    ? void 0
    : e.call(t, r);
}
const hl = Symbol.for("#ticker"),
  ul = Symbol.for("#insertInto"),
  xs = Symbol.for("#removeFrom");
function jr(r, t) {
  let e = t || globalThis.document.body,
    i = r;
  if (ol(r, Function)) {
    let s = new Tt(e, null),
      n = function () {
        let l = E.context;
        E.context = s;
        let h = r(s);
        return E.context == s && (E.context = l), h;
      };
    (i = n()),
      i &&
        ((i[hl] = n),
        oe(i, "unmount", function () {
          return P.unlisten("commit", n);
        })),
      P.listen("commit", n);
  } else i.__F |= 64;
  return i[ul](e), i;
}
function al(r) {
  return r && r[xs] && r.parentNode && r[xs](r.parentNode), r;
}
let Mr = globalThis.imba || (globalThis.imba = {});
Mr.mount = jr;
Mr.unmount = al;
function Y(r) {
  let t;
  return r && ((t = r.toIterable) ? t.call(r) : r);
}
const bt = Symbol.for("#__init__"),
  je = Symbol.for("#insertInto"),
  Me = Symbol.for("#removeFrom"),
  fl = Symbol.for("#all"),
  St = Symbol.for("#phase"),
  B = Symbol.for("#nodes"),
  cl = Symbol.for("#sizes"),
  tt = Symbol.for("#linked"),
  ws = Symbol.for("#mode"),
  Ns = Symbol.for("#enabled"),
  dl = Symbol.for("#easer"),
  Cs = Symbol.for("#anims"),
  Bt = Symbol.for("#_easer_");
let ml = Symbol();
const vi = class vi extends Qt {
  constructor() {
    super(...arguments), super[bt] || this[bt]();
  }
  [bt](t = null, e = !0, i = !0) {
    var s;
    e && super[bt] && super[bt](...arguments),
      (this.selectors = t && (s = t.selectors) !== void 0 ? s : {});
  }
  addSelectors(t, e) {
    var s;
    return ((s = this.selectors)[e] || (s[e] = [])).push(...t), !0;
  }
  getSelectors(...t) {
    let e = [];
    for (let i = 0, s = Y(t), n = s.length; i < n; i++) {
      let l = s[i];
      this.selectors[l] && e.push(...this.selectors[l]);
    }
    return e && e.length ? e.join(",") : null;
  }
  nodesForBase(t, e = "transition") {
    let i = [t],
      s = (this.selectors[e] || []).join(",");
    if (s == "") return i;
    let n = t.querySelectorAll(s);
    for (let l = 0, h = Y(n), o = h.length; l < o; l++) {
      let a = h[l];
      a.closest("._ease_") == t && i.push(a);
    }
    return (i[fl] = n), i;
  }
  nodesWithSize(t, e = "in") {
    let i = this.getSelectors("_off_sized", "_" + e + "_sized");
    return i
      ? t.filter(function (s) {
          return s.matches(i);
        })
      : [];
  }
};
c(vi, ml, "Transitions", 16);
let ti = vi;
const ei = new ti();
let $l = globalThis.imba || (globalThis.imba = {});
$l.transitions = ei;
let pl = Symbol();
const xi = class xi extends Qt {
  constructor(t) {
    super(),
      (this.dom = t),
      (this[St] = null),
      (this[B] = []),
      (this[cl] = new Map());
  }
  log(...t) {}
  get flags() {
    return this.dom.flags;
  }
  link(t) {
    return this[tt] || (this[tt] = new Set()), this[tt].add(t);
  }
  unlink(t) {
    return this[tt].delete(t);
  }
  flag(t) {
    for (let e = 0, i = Y(this[B]), s = i.length; e < s; e++) i[e].flags.add(t);
    return this;
  }
  unflag(t) {
    for (let e = 0, i = Y(this[B]), s = i.length; e < s; e++)
      i[e].flags.remove(t);
    return this;
  }
  commit() {
    return this.dom.offsetWidth;
  }
  enable(t) {
    return (
      t && (this[ws] = t),
      this[Ns] != !0 && ((this[Ns] = !0), !0)
        ? ((this.dom[je] = this[je].bind(this)),
          (this.dom[Me] = this[Me].bind(this)),
          this.flags.add("_ease_"))
        : this
    );
  }
  disable() {
    return this.flags.remove("_ease_"), !0;
  }
  set phase(t) {
    var i, s, n, l, h, o, a, f, u, b, x, $, g, S, O, j, p, y, w, F, I, D, N, C;
    let e = this[St];
    this[St] != t &&
      ((this[St] = t), !0) &&
      (e && this.unflag("@" + e),
      t && this.flag("@" + t),
      t ||
        (this.unflag("@out"),
        this.unflag("@in"),
        this.unflag("@off"),
        (this[B] = null)),
      t == "enter" &&
        e == "leave" &&
        ((s = (i = this.dom) == null ? void 0 : i.emit) == null ||
          s.call(i, "outcancel"),
        (l = (n = this.dom) == null ? void 0 : n.transitionΞoutΞcancel) ==
          null || l.call(n, this)),
      t == "leave" &&
        e == "enter" &&
        ((o = (h = this.dom) == null ? void 0 : h.emit) == null ||
          o.call(h, "incancel"),
        (f = (a = this.dom) == null ? void 0 : a.transitionΞinΞcancel) ==
          null || f.call(a, this)),
      t == "enter" &&
        ((b = (u = this.dom) == null ? void 0 : u.emit) == null ||
          b.call(u, "in"),
        ($ = (x = this.dom) == null ? void 0 : x.transitionΞin) == null ||
          $.call(x, this)),
      t == "leave" &&
        ((S = (g = this.dom) == null ? void 0 : g.emit) == null ||
          S.call(g, "out"),
        (j = (O = this.dom) == null ? void 0 : O.transitionΞout) == null ||
          j.call(O, this)),
      e == "leave" &&
        !t &&
        ((y = (p = this.dom) == null ? void 0 : p.emit) == null ||
          y.call(p, "outend"),
        (F = (w = this.dom) == null ? void 0 : w.transitionΞoutΞend) == null ||
          F.call(w, this)),
      e == "enter" &&
        !t &&
        ((D = (I = this.dom) == null ? void 0 : I.emit) == null ||
          D.call(I, "inend"),
        (C = (N = this.dom) == null ? void 0 : N.transitionΞinΞend) == null ||
          C.call(N, this)));
  }
  get phase() {
    return this[St];
  }
  get leavingΦ() {
    return this.phase == "leave";
  }
  get enteringΦ() {
    return this.phase == "enter";
  }
  get idleΦ() {
    return this.phase == null;
  }
  track(t) {
    var e = this;
    let i = { before: Fe().getAnimations() };
    return (
      this.commit(),
      t(),
      this.commit(),
      (i.after = Fe().getAnimations()),
      (i.fresh = i.after.filter(function (s) {
        return i.before.indexOf(s) == -1;
      })),
      (i.deep = i.fresh.filter(function (s) {
        let n;
        return !!((n = s.effect.target) && n.closest("._ease_") != e.dom);
      })),
      (i.own = i.fresh.filter(function (s) {
        return i.deep.indexOf(s) == -1;
      })),
      i.own.length
        ? (i.finished = new Promise(function (s) {
            let n = new Set(i.own),
              l = function () {
                if ((n.delete(this), n.size == 0)) return s();
              };
            for (let h = 0, o = Y(i.own), a = o.length; h < a; h++) {
              let f = o[h];
              (f[dl] = e),
                f.addEventListener("finish", l, { once: !0 }),
                f.addEventListener("cancel", l, { once: !0 });
            }
          }))
        : (i.finished = Promise.resolve(!0)),
      i
    );
  }
  getAnimatedNodes() {
    let t = ei.nodesForBase(this.dom);
    return this[tt] && (t = t.concat(Array.from(this[tt]))), t;
  }
  getNodeSizes(t = "in", e = this[B]) {
    let i = ei.nodesWithSize(e, t),
      s = new Map();
    for (let n = 0, l = Y(i), h = l.length; n < h; n++) {
      let o = l[n],
        a = window.getComputedStyle(o);
      s.set(o, { width: a.width, height: a.height });
    }
    return s;
  }
  applyNodeSizes(t) {
    for (let [e, i] of Y(t))
      (e.style.width = i.width), (e.style.height = i.height);
    return t;
  }
  clearNodeSizes(t) {
    if (t) {
      for (let [e, i] of Y(t))
        e.style.removeProperty("width"), e.style.removeProperty("height");
      return t;
    }
  }
  [je](t, e) {
    var h, o;
    var i = this;
    let s;
    if (this.enteringΦ) return this.dom;
    let n = function () {
      if ((s && i.clearNodeSizes(s), i.enteringΦ)) return (i.phase = null);
    };
    return this.leavingΦ
      ? (this.track(function () {
          return (i.phase = "enter"), i.unflag("@off"), i.unflag("@out");
        }).finished.then(n, function (f) {
          return i.log("error cancel leave", f);
        }),
        this.dom)
      : (Fe().contains(t),
        e ? t.insertBefore(this.dom, e) : t.appendChild(this.dom),
        (this[B] = this.getAnimatedNodes()),
        this.flag("_instant_"),
        this.unflag("@out"),
        this.commit(),
        (s = this[B].sized = this.getNodeSizes("in")),
        (o = (h = this.dom) == null ? void 0 : h.transitionΞinΞinit) == null ||
          o.call(h, this),
        this.flag("@off"),
        this.flag("@in"),
        this.flag("@enter"),
        this.commit(),
        this.unflag("_instant_"),
        (this[Cs] = this.track(function () {
          return (
            (i.phase = "enter"),
            i.applyNodeSizes(s),
            i.unflag("@off"),
            i.unflag("@in")
          );
        })).finished.then(n, function (a) {
          return i.clearNodeSizes(s), i.log("cancelled insert into", a);
        }),
        this.dom);
  }
  [Me](t) {
    var e = this;
    if (this.leavingΦ) return;
    let i,
      s = function () {
        if (e.phase == "leave")
          return (
            e.dom.emit("easeoutend", {}), t.removeChild(e.dom), (e.phase = null)
          );
      };
    if (this.enteringΦ && this[ws] != "forward") {
      let l = this.track(function () {
        return (
          e.flag("@off"),
          e.flag("@in"),
          e.unflag("@out"),
          (e.phase = "leave"),
          e.clearNodeSizes(e[B].sized)
        );
      });
      this.log("cancel enter anims own", l.own, l),
        l.finished.then(s, function (h) {
          return e.log("error cancel entering", h);
        });
      return;
    }
    (this[B] = this.getAnimatedNodes()),
      (i = this.getNodeSizes("out")),
      this.applyNodeSizes(i),
      this.flag("@leave");
    let n = (this[Cs] = this.track(function () {
      return (
        (e.phase = "leave"), e.flag("@off"), e.flag("@out"), e.clearNodeSizes(i)
      );
    }));
    if (!n.own.length) {
      s();
      return;
    }
    n.finished.then(s, function () {
      return !0;
    });
  }
};
c(xi, pl, "Easer", 16);
let ii = xi,
  gl = Symbol();
var dt;
let Vl =
  ((dt = class {
    transitionΞinΞinit(t) {
      return !0;
    }
    transitionΞin(t) {
      return !0;
    }
    transitionΞinΞend(t) {
      return !0;
    }
    transitionΞinΞcancel(t) {
      return !0;
    }
    transitionΞout(t) {
      return !0;
    }
    transitionΞoutΞend(t) {
      return !0;
    }
    transitionΞoutΞcancel(t) {
      return !0;
    }
    get ease() {
      return this[Bt] || (this[Bt] = new ii(this));
    }
    set ease(t) {
      var e, i;
      if (t == !1) {
        (i = (e = this[Bt]) == null ? void 0 : e.disable) == null || i.call(e);
        return;
      }
      this.ease.enable(t);
    }
  }),
  c(dt, gl, "Element", 1, Element),
  dt);
function yl() {
  return (globalThis.imba.uses_dom_transitions = !0), !0;
}
function bl() {
  return (globalThis.imba.uses_events_keyboard = !0), !0;
}
let Sl = Symbol();
const wi = class wi {
  αesc() {
    return this.keyCode == 27;
  }
  αtab() {
    return this.keyCode == 9;
  }
  αenter() {
    return this.keyCode == 13;
  }
  αspace() {
    return this.keyCode == 32;
  }
  αup() {
    return this.keyCode == 38;
  }
  αdown() {
    return this.keyCode == 40;
  }
  αleft() {
    return this.keyCode == 37;
  }
  αright() {
    return this.keyCode == 39;
  }
  αdel() {
    return this.keyCode == 8 || this.keyCode == 46;
  }
  αkey(t) {
    if (typeof t == "string") return this.key == t;
    if (typeof t == "number") return this.keyCode == t;
  }
};
c(wi, Sl, "KeyboardEvent", 1, vn);
let Ts = wi;
function Rr() {
  return (globalThis.imba.uses_events_mouse = !0), !0;
}
let _l = Symbol();
const Ni = class Ni {
  αleft() {
    return this.button == 0;
  }
  αmiddle() {
    return this.button == 1;
  }
  αright() {
    return this.button == 2;
  }
  αshift() {
    return !!this.shiftKey;
  }
  αalt() {
    return !!this.altKey;
  }
  αctrl() {
    return !!this.ctrlKey;
  }
  αmeta() {
    return !!this.metaKey;
  }
  αmod() {
    let t = globalThis.navigator.platform;
    return /^(Mac|iPhone|iPad|iPod)/.test(t || "")
      ? !!this.metaKey
      : !!this.ctrlKey;
  }
};
c(Ni, _l, "MouseEvent", 1, _n);
let Ps = Ni;
function A(r, t) {
  var e;
  return typeof t == "string"
    ? typeof r === t
    : (e = t[Symbol.hasInstance]) == null
    ? void 0
    : e.call(t, r);
}
function Re(r) {
  let t;
  return r && ((t = r.toIterable) ? t.call(r) : r);
}
const vl = Symbol.for("#extendType"),
  xl = Symbol.for("#modifierState"),
  Vt = Symbol.for("#sharedModifierState"),
  Es = Symbol.for("#onceHandlerEnd"),
  ke = Symbol.for("#extendDescriptors"),
  v = Symbol.for("#context"),
  ie = Symbol.for("#defaultPrevented"),
  si = Symbol.for("#stopPropagation"),
  Os = Symbol.for("#self"),
  wl = Symbol.for("#target"),
  Nl = Symbol.for("#teleport");
bl();
Rr();
let Cl = Symbol();
const Ci = class Ci {
  [vl](t) {
    var e, i;
    let s =
      t[ke] ||
      (t[ke] =
        ((e = Object.getOwnPropertyDescriptors(t.prototype)),
        (i = e.constructor),
        delete e.constructor,
        e));
    return Object.defineProperties(this, s);
  }
};
c(Ci, Cl, "CustomEvent", 1, CustomEvent);
let Fs = Ci,
  Tl = Symbol();
const Ti = class Ti {
  get original() {
    return this.originalEvent || this;
  }
  get [xl]() {
    var t, e;
    return (t = this[v])[(e = this[v].step)] || (t[e] = {});
  }
  get [Vt]() {
    var t, e;
    return (t = this[v].handler)[(e = this[v].step)] || (t[e] = {});
  }
  [Es](t) {
    return xt(this[v], "end", t);
  }
  αsel(t) {
    return !!this.target.matches(String(t));
  }
  αclosest(t) {
    return !!this.target.closest(String(t));
  }
  αprevent() {
    return (this[ie] = !0), this.preventDefault(), !0;
  }
  αtrap() {
    return (
      (this[si] = !0),
      this.stopImmediatePropagation(),
      (this[ie] = !0),
      this.preventDefault(),
      !0
    );
  }
  αfocin(t) {
    var i;
    let e = this[v].element;
    return (
      (e = A(t, Element) ? t : t ? e.closest(t) : e),
      (i = e == null ? void 0 : e.contains) == null
        ? void 0
        : i.call(e, globalThis.document.activeElement)
    );
  }
  αlog(...t) {
    return console.info(...t), !0;
  }
  αtrusted() {
    return !!this.isTrusted;
  }
  αif(t) {
    return !!t;
  }
  αwait(t = 250) {
    return new Promise(function (e) {
      return setTimeout(e, zt(t));
    });
  }
  αself() {
    return this.target == this[v].element;
  }
  αcooldown(t = 250) {
    let e = this[Vt];
    return e.active
      ? !1
      : ((e.active = !0),
        (e.target = this[v].element),
        e.target.flags.incr("cooldown"),
        this[Es](function () {
          return setTimeout(function () {
            return e.target.flags.decr("cooldown"), (e.active = !1);
          }, zt(t));
        }),
        !0);
  }
  αthrottle(t = 250, e = "throttled") {
    let i = this[Vt];
    return i.active
      ? (i.next && i.next(!1),
        new Promise(function (s) {
          return (i.next = function (n) {
            return (i.next = null), s(n);
          });
        }))
      : ((i.active = !0),
        i.el || (i.el = this[v].element),
        e && i.el.flags.incr(e),
        xt(this[v], "end", function () {
          let s = zt(t);
          return (i.interval = setInterval(function () {
            i.next
              ? i.next(!0)
              : (clearInterval(i.interval),
                e && i.el.flags.decr(e),
                (i.active = !1));
          }, s));
        }),
        !0);
  }
  αdebounce(t = 250) {
    let e = this[Vt],
      i = this;
    return (
      e.queue || (e.queue = []),
      e.queue.push((e.last = i)),
      new Promise(function (s) {
        return setTimeout(function () {
          return e.last == i
            ? ((i.debounced = e.queue), (e.last = null), (e.queue = []), s(!0))
            : s(!1);
        }, zt(t));
      })
    );
  }
  αflag(t, e) {
    const { element: i, step: s, state: n, id: l, current: h } = this[v];
    let o = A(e, Element) ? e : e ? i.closest(e) : i;
    if (!o) return !0;
    (this[v].commit = !0), (n[s] = l), o.flags.incr(t);
    let a = Date.now();
    return (
      xt(h, "end", function () {
        let f = Date.now() - a,
          u = Math.max(250 - f, 0);
        return setTimeout(function () {
          return o.flags.decr(t);
        }, u);
      }),
      !0
    );
  }
  αbusy(t) {
    return this.αflag("busy", t);
  }
  αoutside() {
    const { handler: t } = this[v];
    if (t && t[Os]) return !t[Os].parentNode.contains(this.target);
  }
  async αpost(t, e = {}) {
    return await globalThis.fetch(t, { method: "POST", ...e });
  }
  async αfetch(t, e = {}) {
    return await globalThis.fetch(t, e);
  }
};
c(Ti, Tl, "Event", 1, Event);
let Is = Ti,
  Pl = Symbol();
const Pi = class Pi {
  αself() {
    let t = this[v].element;
    return this.type == "focusout"
      ? this.relatedTarget && !t.contains(this.relatedTarget)
      : this.type == "focusin"
      ? !this.relatedTarget || !t.contains(this.relatedTarget)
      : this.target == t;
  }
};
c(Pi, Pl, "FocusEvent", 1, FocusEvent);
let zs = Pi;
function El() {
  return (globalThis.imba.uses_events = !0), !0;
}
let Ol = Symbol();
const Ei = class Ei {
  constructor(t, e) {
    (this.params = t), (this.closure = e);
  }
  getHandlerForMethod(t, e) {
    return t ? (t[e] ? t : this.getHandlerForMethod(t.parentNode, e)) : null;
  }
  abortCurrentHandlers() {
    var t;
    if (this.currentEvents)
      for (let e of Re(this.currentEvents))
        (e.aborted = !0),
          (t = e == null ? void 0 : e.resolver) == null || t.call(e, !0);
    return this;
  }
  emit(t, ...e) {
    return Ct(this, t, e);
  }
  on(t, ...e) {
    return oe(this, t, ...e);
  }
  once(t, ...e) {
    return xt(this, t, ...e);
  }
  un(t, ...e) {
    return Tr(this, t, ...e);
  }
  get passiveΦ() {
    return this.params.passive;
  }
  get captureΦ() {
    return this.params.capture;
  }
  get silentΦ() {
    return this.params.silent;
  }
  get globalΦ() {
    return this.params.global;
  }
  async handleEvent(t) {
    if (this.disabled) return;
    let e = this[wl] || t.currentTarget,
      i = this.params,
      s = null,
      n = i.silence || i.silent;
    this.count || (this.count = 0), this.state || (this.state = {});
    let l = (this.lastState = {
      element: e,
      event: t,
      modifiers: i,
      handler: this,
      id: ++this.count,
      step: -1,
      state: this.state,
      commit: null,
      called: !1,
      current: null,
      aborted: !1,
    });
    if (
      ((l.current = l),
      t.handle$mod && t.handle$mod.apply(l, i.options || []) == !1)
    )
      return;
    let h =
      Event[this.type + "$handle"] ||
      Event[t.type + "$handle"] ||
      t.handle$mod ||
      this.guard;
    if (!(h && h.apply(l, i.options || []) == !1)) {
      this.currentEvents || (this.currentEvents = new Set()),
        this.currentEvents.add(l);
      for (
        let o = 0, a = Object.keys(i), f = a.length, u, b;
        o < f && ((u = a[o]), (b = i[u]), !l.aborted);
        o++
      ) {
        if ((l.step++, u[0] == "_")) continue;
        u.indexOf("~") > 0 && (u = u.split("~")[0]);
        let x = null,
          $ = [t, l],
          g,
          S = null,
          O,
          j = !1;
        if (u[0] == "$" && u[1] == "_" && A(b[0], Function))
          (u = b[0]),
            (l.called = !0),
            u.passive || (l.commit = !0),
            ($ = [t, l].concat(b.slice(1))),
            (S = e);
        else if (A(b, Array)) {
          ($ = b.slice()), (x = $);
          for (let p = 0, y = Re($), w = y.length; p < w; p++) {
            let F = y[p];
            if (typeof F == "string" && F[0] == "~" && F[1] == "$") {
              let D = F.slice(2).split("."),
                N = l[D.shift()] || t;
              for (let C = 0, it = Re(D), K = it.length; C < K; C++) {
                let Z = it[C];
                N = N ? N[Z] : void 0;
              }
              $[p] = N;
            }
          }
        }
        if (
          (typeof u == "string" &&
            (O = u.match(
              /^(emit|flag|mod|moved|pin|fit|refit|map|remap|css)-(.+)$/
            )) &&
            (x || (x = $ = []), $.unshift(O[2]), (u = O[1])),
          u == "trap")
        )
          (t[si] = !0),
            t.stopImmediatePropagation(),
            (t[ie] = !0),
            t.preventDefault();
        else if (u == "stop") (t[si] = !0), t.stopImmediatePropagation();
        else if (u == "prevent") (t[ie] = !0), t.preventDefault();
        else if (u == "commit") l.commit = !0;
        else if (u == "once") e.removeEventListener(t.type, this);
        else {
          if (u == "options" || u == "silence" || u == "silent") continue;
          if (u == "emit") {
            let p = $[0],
              y = $[1];
            l.called = !0;
            let w = new CustomEvent(p, { bubbles: !0, detail: y });
            (w.originalEvent = t), (this[Nl] || e).dispatchEvent(w);
          } else if (typeof u == "string") {
            u[0] == "!" && ((j = !0), (u = u.slice(1)));
            let p = "α" + u,
              y = t[p];
            y || (y = this.type && Event[this.type + "$" + u + "$mod"]),
              y ||
                (y =
                  t[u + "$mod"] ||
                  Event[t.type + "$" + u] ||
                  Event[u + "$mod"]),
              A(y, Function)
                ? ((u = y),
                  (S = l),
                  ($ = x || []),
                  t[p] && ((S = t), (t[v] = l)))
                : u[0] == "_"
                ? ((u = u.slice(1)), (S = this.closure))
                : (S = this.getHandlerForMethod(e, u));
          }
        }
        try {
          A(u, Function)
            ? (g = u.apply(S || e, $))
            : S && (g = S[u].apply(S, $)),
            g &&
              A(g.then, Function) &&
              g != P.$promise &&
              (l.commit && !n && P.commit(), (g = await g));
        } catch (p) {
          s = p;
          break;
        }
        if ((j && g === !0) || (!j && g === !1)) break;
        l.value = g;
      }
      if (
        (Ct(l, "end", l),
        l.commit && !n && P.commit(),
        this.currentEvents.delete(l),
        this.currentEvents.size == 0 && this.emit("idle"),
        s != null)
      ) {
        if (this.type != "error") {
          let o = A(s, Error) ? s.message : s,
            a = new CustomEvent("error", {
              detail: o,
              bubbles: !0,
              cancelable: !0,
            });
          if (
            ((a.error = s),
            (a.originalEvent = t),
            e.dispatchEvent(a),
            a.defaultPrevented)
          )
            return;
        }
        throw s;
      }
      return l;
    }
  }
};
c(Ei, Ol, "EventHandler", 16);
let se = Ei,
  Fl = Symbol();
const Oi = class Oi {
  on$(t, e, i) {
    let s = "on$" + t,
      n = e.capture || !1,
      l = e.passive,
      h,
      o = n;
    return (
      l && (o = { passive: l, capture: n }),
      A(this[s], Function)
        ? (this[s].length > 2 && (h = new se(e, i)), (h = this[s](e, i, h, o)))
        : ((h = new se(e, i)), this.addEventListener(t, h, o)),
      h
    );
  }
  on$error(t, e, i, s) {
    var n;
    return (
      (n = t.options) != null &&
        n.length &&
        (i.guard = function (...l) {
          let h = this.event.error;
          return !!l.find(function (a) {
            return A(h, a);
          });
        }),
      this.addEventListener("error", i, s),
      i
    );
  }
};
c(Oi, Fl, "Element", 1, Element);
let Ds = Oi;
yl(), El(), Rr();
const Il = Symbol.for("#beforeReconcile"),
  _ = Symbol.for("#placeChild"),
  V = Symbol.for("##up"),
  js = Symbol.for("#afterVisit"),
  zl = Symbol.for("#appendChild"),
  Dl = Symbol.for("#afterReconcile");
var Ms = Symbol(),
  Rs = Symbol(),
  ks = Symbol(),
  As = Symbol(),
  Ls = Symbol(),
  qs = Symbol(),
  Hs = Symbol(),
  Bs = Symbol(),
  Vs = Symbol(),
  Ws = Symbol(),
  Ks = Symbol(),
  Gs = Symbol(),
  Us = Symbol(),
  Qs = Symbol(),
  Ys = Symbol(),
  Zs = Symbol(),
  Js = Symbol(),
  Ae = Symbol(),
  Le = Symbol(),
  Xs = Symbol(),
  qe = Symbol(),
  tr = Symbol(),
  er = Symbol(),
  ir = Symbol(),
  sr = Symbol(),
  rr = Symbol(),
  nr = Symbol(),
  lr = Symbol(),
  or = Symbol(),
  hr = Symbol(),
  ur = Symbol(),
  ar = Symbol(),
  fr = Symbol(),
  cr = Symbol(),
  dr = Symbol(),
  mr = Symbol(),
  $r = Symbol(),
  pr = Symbol(),
  gr = Symbol(),
  yr = Symbol(),
  br = Symbol();
function jl(r, t) {
  return (
    (r = Math.ceil(r)),
    (t = Math.floor(t)),
    Math.floor(Math.random() * (t - r + 1) + r)
  );
}
function Sr() {
  var r, t;
  let e = [];
  t = [];
  for (let i = 0; i < 20; i++) {
    (e[i] = []), (r = []);
    for (let s = 0; s < 20; s++)
      r.push(
        (i === 0 && s === 0) || (i === 19 && s === 19)
          ? (e[i][s] = 0)
          : (e[i][s] = jl(1, 9))
      );
    t.push(r);
  }
  return t;
}
let Ml = Symbol();
const ne = class ne extends ee {
  get $intro() {
    let t = m("video", null, `z13dtrln-bg ${this._ns_ || ""} $intro`, null);
    return Object.defineProperty(this, "$intro", { value: t }), t;
  }
  [W](t = null, e = !0, i = !0) {
    var s;
    super[W](...arguments),
      (this.score = t && (s = t.score) !== void 0 ? s : 0),
      (this.matrix = t && (s = t.matrix) !== void 0 ? s : Sr()),
      (this.done = t && (s = t.done) !== void 0 ? s : new Set()),
      (this.isIntroPlaying = t && (s = t.isIntroPlaying) !== void 0 ? s : !1),
      (this.miniLogoHide = t && (s = t.miniLogoHide) !== void 0 ? s : !0),
      (this.init = t && (s = t.init) !== void 0 ? s : !0),
      (this.time = t && (s = t.time) !== void 0 ? s : 0),
      (this.currentPoint = t && (s = t.currentPoint) !== void 0 ? s : [19, 19]);
  }
  reset() {
    return (
      (this.init = !1),
      (this.score = 0),
      (this.time = 45e3),
      (this.matrix = Sr()),
      (this.done = new Set()),
      (this.currentPoint = [0, 0]),
      (this.isIntroPlaying = !0),
      (this.miniLogoHide = !0),
      this.subtractApp()
    );
  }
  handleWay(t) {
    if (this.time > 0)
      return (
        t.key === "ArrowRight" && this.currentPoint[1] < 19
          ? (this.done.add(
              "" + this.currentPoint[0] + "x" + this.currentPoint[1]
            ),
            this.currentPoint[1]++,
            (this.score +=
              this.matrix[this.currentPoint[0]][this.currentPoint[1]]))
          : t.key === "ArrowDown" &&
            this.currentPoint[0] < 19 &&
            (this.done.add(
              "" + this.currentPoint[0] + "x" + this.currentPoint[1]
            ),
            this.currentPoint[0]++,
            (this.score +=
              this.matrix[this.currentPoint[0]][this.currentPoint[1]])),
        this.render()
      );
  }
  mount() {
    var t = this;
    return globalThis.document.body.addEventListener("keydown", function (e) {
      return e.preventDefault(), t.handleWay(e);
    });
  }
  showAfter() {
    return (this.miniLogoHide = !1);
  }
  subtractApp() {
    if (
      ((this.time -= 10),
      this.render(),
      this.time > 10 &&
        this.currentPoint[0] != 19 &&
        this.currentPoint[1] != 19)
    )
      return setTimeout(this.subtractApp.bind(this), 10);
  }
  play() {
    return (this.time = 45e3), this.subtractApp;
  }
  playIntro() {
    return (
      console.log("playIntro"),
      this.$intro.play(),
      setTimeout(this.stopIntro.bind(this), 5e3)
    );
  }
  stopIntro() {
    return (
      console.log("stopIntro"),
      this.$intro.pause(),
      setTimeout(this.endIntro.bind(this), 7e3)
    );
  }
  endIntro() {
    return console.log("endIntro"), this.$intro.play();
  }
  replayIntro() {
    return console.log("replay"), setTimeout(this.playIntro.bind(this), 1e3);
  }
  render() {
    var t = this,
      e,
      i,
      s,
      n,
      l,
      h,
      o,
      a,
      f,
      u = this._ns_ || "",
      b,
      x,
      $,
      g,
      S,
      O,
      j,
      p,
      y,
      w,
      F,
      I,
      D,
      N,
      C,
      it,
      K,
      Z,
      he,
      d,
      ue,
      mt,
      st,
      ae,
      Ot,
      fe,
      ce,
      de,
      Ft,
      L,
      me,
      $e,
      pe,
      ge,
      ye,
      be,
      Se,
      Fi,
      rt,
      M,
      R,
      _e,
      nt;
    (o = this),
      o[Il](),
      (a = f = 1),
      o[Ms] === 1 || ((a = f = 0), (o[Ms] = 1)),
      (!a || f & 2) && o.flagSelf$("z13dtrln-ag"),
      (b = o[Rs]) || (o[Rs] = b = m("div", o, `z13dtrln-ah ${u}`, null)),
      (x = o[ks]) || (o[ks] = x = m("div", b, `z13dtrln-ai ${u}`, null)),
      ($ = o[As]) || (o[As] = $ = m("div", x, `z13dtrln-aj ${u}`, null)),
      (g = o[Ls]) || (o[Ls] = g = m("div", $, `z13dtrln-ak topBar ${u}`, null)),
      (S = o[qs]) || (o[qs] = S = m("div", g, `${u}`, null)),
      a || S[_]("Wynik:"),
      (O = o[Hs]) || (o[Hs] = O = m("span", S, `count ${u}`, null)),
      (j = this.score),
      (j === o[Vs] && a) || (o[Bs] = O[_]((o[Vs] = j), 384, o[Bs])),
      (p = o[Ws]) || (o[Ws] = p = m("div", g, `${u}`, null)),
      a || p[_]("Czas:"),
      (y = o[Ks]) || (o[Ks] = y = m("span", p, `count ${u}`, null)),
      (E.context = o[Us] || (o[Us] = { _: y })),
      (w = Math.round(this.time / 1e3)),
      (E.context = null),
      (w === o[Qs] && a) || (o[Gs] = y[_]((o[Qs] = w), 128, o[Gs])),
      a || m("span", y, `z13dtrln-ap ${u}`, "s"),
      (F = o[Ys]) || (o[Ys] = F = m("table", $, `table ${u}`, null)),
      (I = o[Zs]) || (o[Zs] = I = Ss(384, F)),
      (D = 0),
      (N = I.$);
    for (let T = 0; T < 20; T++) {
      (it = 1),
        (C = N[D]) || ((it = 0), (N[D] = C = m("tr", I, `${u}`, null))),
        it || (C[V] = I),
        (K = C[Js]) || (C[Js] = K = Ss(384, C)),
        (Z = 0),
        (he = K.$);
      for (let k = 0; k < 20; k++) {
        let Ar = this.done.has("" + T + "x" + k),
          Ii = zi(this.currentPoint[0], T) && zi(this.currentPoint[1], k);
        (ue = mt = 1),
          (d = he[Z]) ||
            ((ue = mt = 0), (he[Z] = d = m("td", K, `cell ${u}`, null))),
          ue || (d[V] = K),
          (st = Ar || void 0),
          st === d[Ae] || ((mt |= 2), (d[Ae] = st)),
          (st = Ii || void 0),
          st === d[Le] || ((mt |= 2), (d[Le] = st)),
          mt & 2 &&
            d.flag$(
              `cell ${u} ` +
                (d[Ae] ? "done" : "") +
                " " +
                (d[Le] ? "currentPoint" : "")
            ),
          (e = null),
          (T === 0 && k === 0) || (T === 19 && k === 19)
            ? ((ae = Ot = 1),
              (e = d[Xs]) ||
                ((ae = Ot = 0),
                (d[Xs] = e = m("i", null, `ri-flag-2-fill ${u}`, null))),
              ae || (e[V] = d),
              (fe =
                this.currentPoint[0] != 19 ||
                this.currentPoint[1] != 19 ||
                void 0),
              fe === e[qe] || ((Ot |= 2), (e[qe] = fe)),
              Ot & 2 && e.flag$(`ri-flag-2-fill ${u} ` + (e[qe] ? "flag" : "")))
            : (e = this.matrix[T][k]),
          (d[tr] = d[_](e, 0, d[tr])),
          (i = s = null),
          Ii &&
            (this.currentPoint[1] != 19 &&
              ((ce = 1),
              (i = d[er]) ||
                ((ce = 0),
                (d[er] = i = m("div", null, `z13dtrln-au arrow ${u}`, null))),
              ce || (i[V] = d)),
            this.currentPoint[0] != 19 &&
              ((de = 1),
              (s = d[ir]) ||
                ((de = 0),
                (d[ir] = s = m("div", null, `z13dtrln-av arrow ${u}`, null))),
              de || (s[V] = d))),
          (d[sr] = d[_](i, 0, d[sr])),
          (d[rr] = d[_](s, 0, d[rr])),
          Z++;
      }
      K[js](Z), D++;
    }
    return (
      I[js](D),
      (n = l = null),
      this.currentPoint[0] == 19 &&
        this.currentPoint[1] == 19 &&
        ((Ft = 1),
        (n = o[nr]) ||
          ((Ft = 0), (o[nr] = n = m("div", null, `z13dtrln-aw ${u}`, null))),
        Ft || (n[V] = $),
        Ft || (n.ease = "ease"),
        this.init ||
          ((L = 1),
          (l = o[lr]) ||
            ((L = 0), (o[lr] = l = m("div", null, `z13dtrln-ax ${u}`, null))),
          L || (l[V] = $),
          L || (me = m("div", l, `${u}`, null)),
          ($e = l[or]) || (l[or] = $e = m("div", me, `z13dtrln-az ${u}`, null)),
          L || $e[_]("Twój wynik to"),
          (pe = l[hr]) || (l[hr] = pe = m("div", me, `z13dtrln-ba ${u}`, null)),
          (ge = this.score + " punktów"),
          (ge === l[ar] && L) || (l[ur] = pe[_]((l[ar] = ge), 128, l[ur])),
          L || (ye = m("div", l, `${u}`, null)),
          L || m("div", ye, `${u}`, "Zdobyty w czasie"),
          (be = l[fr]) || (l[fr] = be = m("div", ye, `z13dtrln-bd ${u}`, null)),
          (Se = 45e3 - this.time + " ms"),
          (Se === l[dr] && L) || (l[cr] = be[_]((l[dr] = Se), 128, l[cr])))),
      (o[mr] = $[_](n, 0, o[mr])),
      (o[$r] = $[_](l, 0, o[$r])),
      a || (Fi = m("div", x, `${u}`, null)),
      (rt = o[pr]) || (o[pr] = rt = m("div", Fi, `z13dtrln-bf ${u}`, null)),
      (R = 1),
      (M = o[gr]) || ((R = 0), (o[gr] = ((M = this.$intro), (M[V] = rt), M))),
      R ||
        M.on$(
          "loadeddata",
          {
            $_: [
              function (T, k) {
                return t.playIntro(T);
              },
            ],
          },
          this
        ),
      R || (M.muted = "muted"),
      R ||
        M.on$(
          "ended",
          {
            $_: [
              function (T, k) {
                return t.replayIntro(T);
              },
            ],
          },
          this
        ),
      R || (_e = m("source", M, `${u}`, null)),
      R || (_e.src = "./teambit_logo_full_white.mp4"),
      R || (_e.type = "video/mp4"),
      R || M[_]("Your browser does not support the video tag."),
      R || rt[zl](M),
      (h = null),
      this.currentPoint[0] == 19 &&
        this.currentPoint[1] == 19 &&
        ((nt = 1),
        (h = o[yr]) ||
          ((nt = 0), (o[yr] = h = m("button", null, `z13dtrln-bi ${u}`, null))),
        nt || (h[V] = rt),
        nt ||
          h.on$(
            "click",
            {
              $_: [
                function (T, k) {
                  return t.reset(T);
                },
              ],
            },
            this
          ),
        nt || (h.ease = "ease"),
        nt || h[_]("Losuj planszę i rozpocznij")),
      (o[br] = rt[_](h, 0, o[br])),
      o[Dl](f),
      o
    );
  }
};
c(ne, Ml, "Suway", 2),
  Dr("suway-z13dtrln-bj", ne, { cssns: "z13dtrln_af", name: "Suway" });
let ri = ne;
const Rl = Symbol.for("#beforeReconcile"),
  kr = Symbol.for("#afterVisit"),
  kl = Symbol.for("#appendChild"),
  Al = Symbol.for("#afterReconcile"),
  Ll = Symbol.for("##up");
var _r = Symbol(),
  vr = Symbol(),
  U,
  _t = hn(),
  xr = Symbol(),
  Wt,
  Kt;
let ql = Symbol();
const le = class le extends ee {
  [W](t = null, e = !0, i = !0) {
    var s;
    super[W](...arguments),
      (this.count = t && (s = t.count) !== void 0 ? s : 0);
  }
  render() {
    var t,
      e,
      i = this._ns_ || "",
      s,
      n,
      l;
    return (
      (t = this),
      t[Rl](),
      (e = 1),
      t[_r] === 1 || ((e = 0), (t[_r] = 1)),
      (n = l = 1),
      (s = t[vr]) || ((n = l = 0), (t[vr] = s = zr(ri, t, `${i}`))),
      n || !s.setup || s.setup(l),
      s[kr](l),
      n || t[kl](s),
      t[Al](e),
      t
    );
  }
};
c(le, ql, "app", 2), Dr("app", le, {});
let wr = le;
jr(
  ((Wt = Kt = 1),
  (U = _t[xr]) || ((Wt = Kt = 0), (U = _t[xr] = U = zr("app", null, null))),
  Wt || (U[Ll] = _t._),
  Wt || _t.sym || !U.setup || U.setup(Kt),
  _t.sym || U[kr](Kt),
  U)
);
