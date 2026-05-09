//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: ee } = Object, m = globalThis, h = m.trustedTypes, te = h ? h.emptyScript : "", ne = m.reactiveElementPolyfillSupport, g = (e, t) => e, _ = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? te : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, v = (e, t) => !l(e, t), y = {
	attribute: !0,
	type: String,
	converter: _,
	reflect: !1,
	useDefault: !1,
	hasChanged: v
};
Symbol.metadata ??= Symbol("metadata"), m.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = y) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? y;
	}
	static _$Ei() {
		if (this.hasOwnProperty(g("elementProperties"))) return;
		let e = ee(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(g("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(g("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(Infinity).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? _ : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? _ : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? v)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[g("elementProperties")] = /* @__PURE__ */ new Map(), b[g("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: b }), (m.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var x = globalThis, S = (e) => e, C = x.trustedTypes, w = C ? C.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, T = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, D = "?" + E, O = `<${D}>`, k = document, A = () => k.createComment(""), j = (e) => e === null || typeof e != "object" && typeof e != "function", M = Array.isArray, N = (e) => M(e) || typeof e?.[Symbol.iterator] == "function", P = "[ 	\n\f\r]", F = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, I = /-->/g, L = />/g, R = RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), z = /'/g, B = /"/g, V = /^(?:script|style|textarea|title)$/i, H = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), U = Symbol.for("lit-noChange"), W = Symbol.for("lit-nothing"), G = /* @__PURE__ */ new WeakMap(), K = k.createTreeWalker(k, 129);
function q(e, t) {
	if (!M(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return w === void 0 ? t : w.createHTML(t);
}
var re = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = F;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === F ? c[1] === "!--" ? o = I : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = R) : (V.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = R) : o = L : o === R ? c[0] === ">" ? (o = i ?? F, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? R : c[3] === "\"" ? B : z) : o === B || o === z ? o = R : o === I || o === L ? o = F : (o = R, i = void 0);
		let d = o === R && e[t + 1].startsWith("/>") ? " " : "";
		a += o === F ? n + O : l >= 0 ? (r.push(s), n.slice(0, l) + T + n.slice(l) + E + d) : n + E + (l === -2 ? t : d);
	}
	return [q(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, J = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = re(t, n);
		if (this.el = e.createElement(l, r), K.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = K.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(T)) {
					let t = u[o++], n = i.getAttribute(e).split(E), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ae : r[1] === "?" ? oe : r[1] === "@" ? se : Z
					}), i.removeAttribute(e);
				} else e.startsWith(E) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (V.test(i.tagName)) {
					let e = i.textContent.split(E), t = e.length - 1;
					if (t > 0) {
						i.textContent = C ? C.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], A()), K.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], A());
					}
				}
			} else if (i.nodeType === 8) if (i.data === D) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(E, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += E.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = k.createElement("template");
		return n.innerHTML = e, n;
	}
};
function Y(e, t, n = e, r) {
	if (t === U) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = j(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = Y(e, i._$AS(e, t.values), i, r)), t;
}
var ie = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? k).importNode(t, !0);
		K.currentNode = r;
		let i = K.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new X(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ce(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = K.nextNode(), a++);
		}
		return K.currentNode = k, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, X = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = W, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = Y(this, e, t), j(e) ? e === W || e == null || e === "" ? (this._$AH !== W && this._$AR(), this._$AH = W) : e !== this._$AH && e !== U && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? N(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== W && j(this._$AH) ? this._$AA.nextSibling.data = e : this.T(k.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = J.createElement(q(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ie(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = G.get(e.strings);
		return t === void 0 && G.set(e.strings, t = new J(e)), t;
	}
	k(t) {
		M(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(A()), this.O(A()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = S(e).nextSibling;
			S(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Z = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = W, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = W;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = Y(this, e, t, 0), a = !j(e) || e !== this._$AH && e !== U, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = Y(this, r[n + o], t, o), s === U && (s = this._$AH[o]), a ||= !j(s) || s !== this._$AH[o], s === W ? e = W : e !== W && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === W ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ae = class extends Z {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === W ? void 0 : e;
	}
}, oe = class extends Z {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== W);
	}
}, se = class extends Z {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = Y(this, e, t, 0) ?? W) === U) return;
		let n = this._$AH, r = e === W && n !== W || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== W && (n === W || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ce = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		Y(this, e);
	}
}, le = x.litHtmlPolyfillSupport;
le?.(J, X), (x.litHtmlVersions ??= []).push("3.3.2");
var ue = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new X(t.insertBefore(A(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Q = globalThis, $ = class extends b {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ue(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return U;
	}
};
$._$litElement$ = !0, $.finalized = !0, Q.litElementHydrateSupport?.({ LitElement: $ });
var de = Q.litElementPolyfillSupport;
de?.({ LitElement: $ }), (Q.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/tv-planner-card.ts
var fe = class extends $ {
	static styles = o`
    h2 {
      margin-top: 0;
    }

    button {
      cursor: pointer;
    }

    #refresh {
      margin-bottom: 12px;
    }

    .event {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 0;
      border-top: 1px solid var(--divider-color);
    }

    .event-main {
      min-width: 0;
    }

    .time,
    .description {
      color: var(--secondary-text-color);
      font-size: 0.9em;
      margin-top: 3px;
    }

    .copy {
      align-self: center;
      white-space: nowrap;
    }

    .day-separator {
      margin-top: 14px;
      padding: 6px 0;
      font-weight: 700;
      border-top: 1px solid var(--divider-color);
      color: var(--accent-color);
      font-size: 1.05em;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .success {
      color: var(--accent-color);
      font-size: 0.9em;
    }

    .source-selector {
      margin: 10px 0 14px 0;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .source-selector select {
      flex: 1;
    }
  `;
	setConfig(e) {
		this.config = e, this.events = [], this.loading = !1, this.selectedSourceEntity = e.source_entity || e.sources?.[0]?.entity || "";
	}
	set hass(e) {
		this._hass = e, this.loaded || (this.loaded = !0, this.loadEvents());
	}
	async loadEvents() {
		this.loading = !0, this.requestUpdate();
		try {
			this.config.source_type === "ha_epg" ? this.loadHaEpgEvents() : await this.loadCalendarEvents();
		} catch (e) {
			console.error("Calendar Copy Card: failed to load events", e), this.events = [];
		}
		this.loading = !1, this.requestUpdate();
	}
	async loadCalendarEvents() {
		let e = /* @__PURE__ */ new Date(), t = /* @__PURE__ */ new Date();
		t.setDate(t.getDate() + (this.config.days_to_show || 14));
		let n = await this._hass.callService("calendar", "get_events", {
			start_date_time: e.toISOString(),
			end_date_time: t.toISOString()
		}, { entity_id: this.config.source_calendar }, !1, !0);
		console.log("Calendar Copy Card response:", n);
		let r = n?.response || n;
		Array.isArray(r) ? this.events = r : r?.events ? this.events = r.events : r?.[this.config.source_calendar]?.events ? this.events = r[this.config.source_calendar].events : this.events = [];
	}
	async copyEvent(e) {
		if (!e) {
			alert("Could not find this event.");
			return;
		}
		console.log("Calendar Copy Card selected event:", e), confirm(`Copy "${e.summary}" to ${this.config.target_calendar}?`) && (await this._hass.callService("script", this.config.copy_script, {
			source_type: this.config.source_type || "calendar",
			source_calendar: this.config.source_calendar || "",
			source_entity: this.selectedSourceEntity || this.config.source_entity || "",
			target_calendar: this.config.target_calendar,
			summary: e.summary || "",
			description: e.description || "",
			location: e.location || "",
			start_date_time: e.start,
			end_date_time: e.end
		}), this.lastCopied = e.summary || "Event", this.requestUpdate());
	}
	render() {
		return H`
      <ha-card>
        <div class="card-content">
          <h2>TV Planner Card</h2>
        </div>
      </ha-card>
    `;
	}
	renderSourceSelector() {
		return this.config.sources?.length ? `
      <div class="source-selector">
        <label for="source-select">Channel</label>
        <select id="source-select">
          ${this.config.sources.map((e) => `
                <option
                  value="${e.entity}"
                  ${e.entity === this.selectedSourceEntity ? "selected" : ""}
                >
                  ${e.label}
                </option>
              `).join("")}
        </select>
      </div>
    ` : "";
	}
	formatDate(e) {
		return e ? new Date(e).toLocaleString(void 0, {
			weekday: "short",
			day: "2-digit",
			month: "2-digit",
			hour: "2-digit",
			minute: "2-digit"
		}) : "";
	}
	groupEventsByDay() {
		return this.events.reduce((e, t) => {
			let n = new Date(t.start).toDateString();
			return e[n] || (e[n] = []), e[n].push(t), e;
		}, {});
	}
	formatDay(e) {
		return new Date(e).toLocaleDateString(void 0, {
			weekday: "long",
			day: "numeric",
			month: "long"
		});
	}
	getCardSize() {
		return 4;
	}
	loadHaEpgEvents() {
		let e = this._hass.states[this.selectedSourceEntity];
		if (!e) {
			console.error("Calendar Copy Card: HA-EPG entity not found", this.selectedSourceEntity), this.events = [];
			return;
		}
		let t = e.attributes, n = t.channel_display_name || "", r = t.channel_icon || "", i = this.epgDayToEvents(t.today, 0, n, r), a = this.epgDayToEvents(t.tomorrow, 1, n, r);
		this.events = [...i, ...a];
	}
	epgDayToEvents(e, t, n, r) {
		if (!e) return [];
		let i = /* @__PURE__ */ new Date();
		return i.setDate(i.getDate() + t), Object.values(e).map((e) => {
			let t = this.combineDateAndTime(i, e.start), a = this.combineDateAndTime(i, e.end);
			a <= t && a.setDate(a.getDate() + 1);
			let o = e.sub_title ? `${n} | ${e.title} • ${e.sub_title}` : `${n} | ${e.title}`;
			return {
				start: t.toISOString(),
				end: a.toISOString(),
				summary: o,
				description: e.desc || "",
				location: n,
				channel_icon: r,
				source: "ha_epg"
			};
		});
	}
	combineDateAndTime(e, t) {
		let [n, r] = t.split(":").map(Number), i = new Date(e);
		return i.setHours(n, r, 0, 0), i;
	}
};
customElements.define("tv-planner-card", fe);
//#endregion

//# sourceMappingURL=tv-planner-card.js.map