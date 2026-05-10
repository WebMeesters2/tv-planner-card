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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, p = f.trustedTypes, re = p ? p.emptyScript : "", ie = f.reactiveElementPolyfillSupport, m = (e, t) => e, h = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? re : null;
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
}, g = (e, t) => !l(e, t), _ = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	useDefault: !1,
	hasChanged: g
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var v = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = _) {
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
		return this.elementProperties.get(e) ?? _;
	}
	static _$Ei() {
		if (this.hasOwnProperty(m("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(m("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(m("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? h : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? h : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? g)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[m("elementProperties")] = /* @__PURE__ */ new Map(), v[m("finalized")] = /* @__PURE__ */ new Map(), ie?.({ ReactiveElement: v }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var y = globalThis, b = (e) => e, x = y.trustedTypes, S = x ? x.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, C = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, T = "?" + w, ae = `<${T}>`, E = document, D = () => E.createComment(""), O = (e) => e === null || typeof e != "object" && typeof e != "function", k = Array.isArray, oe = (e) => k(e) || typeof e?.[Symbol.iterator] == "function", A = "[ 	\n\f\r]", j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, M = /-->/g, N = />/g, P = RegExp(`>|${A}(?:([^\\s"'>=/]+)(${A}*=${A}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), F = /'/g, I = /"/g, L = /^(?:script|style|textarea|title)$/i, R = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), z = Symbol.for("lit-noChange"), B = Symbol.for("lit-nothing"), V = /* @__PURE__ */ new WeakMap(), H = E.createTreeWalker(E, 129);
function U(e, t) {
	if (!k(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return S === void 0 ? t : S.createHTML(t);
}
var se = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = j;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === j ? c[1] === "!--" ? o = M : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = P) : (L.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = P) : o = N : o === P ? c[0] === ">" ? (o = i ?? j, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? P : c[3] === "\"" ? I : F) : o === I || o === F ? o = P : o === M || o === N ? o = j : (o = P, i = void 0);
		let d = o === P && e[t + 1].startsWith("/>") ? " " : "";
		a += o === j ? n + ae : l >= 0 ? (r.push(s), n.slice(0, l) + C + n.slice(l) + w + d) : n + w + (l === -2 ? t : d);
	}
	return [U(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, W = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = se(t, n);
		if (this.el = e.createElement(l, r), H.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = H.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(C)) {
					let t = u[o++], n = i.getAttribute(e).split(w), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? le : r[1] === "?" ? ue : r[1] === "@" ? de : q
					}), i.removeAttribute(e);
				} else e.startsWith(w) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (L.test(i.tagName)) {
					let e = i.textContent.split(w), t = e.length - 1;
					if (t > 0) {
						i.textContent = x ? x.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], D()), H.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], D());
					}
				}
			} else if (i.nodeType === 8) if (i.data === T) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(w, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += w.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = E.createElement("template");
		return n.innerHTML = e, n;
	}
};
function G(e, t, n = e, r) {
	if (t === z) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = O(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = G(e, i._$AS(e, t.values), i, r)), t;
}
var ce = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? E).importNode(t, !0);
		H.currentNode = r;
		let i = H.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new K(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new fe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = H.nextNode(), a++);
		}
		return H.currentNode = E, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, K = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = B, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = G(this, e, t), O(e) ? e === B || e == null || e === "" ? (this._$AH !== B && this._$AR(), this._$AH = B) : e !== this._$AH && e !== z && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? oe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== B && O(this._$AH) ? this._$AA.nextSibling.data = e : this.T(E.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = W.createElement(U(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ce(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = V.get(e.strings);
		return t === void 0 && V.set(e.strings, t = new W(e)), t;
	}
	k(t) {
		k(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(D()), this.O(D()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = b(e).nextSibling;
			b(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, q = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = B, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = B;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = G(this, e, t, 0), a = !O(e) || e !== this._$AH && e !== z, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = G(this, r[n + o], t, o), s === z && (s = this._$AH[o]), a ||= !O(s) || s !== this._$AH[o], s === B ? e = B : e !== B && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === B ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, le = class extends q {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === B ? void 0 : e;
	}
}, ue = class extends q {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== B);
	}
}, de = class extends q {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = G(this, e, t, 0) ?? B) === z) return;
		let n = this._$AH, r = e === B && n !== B || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== B && (n === B || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, fe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		G(this, e);
	}
}, pe = y.litHtmlPolyfillSupport;
pe?.(W, K), (y.litHtmlVersions ??= []).push("3.3.2");
var me = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new K(t.insertBefore(D(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, J = globalThis, Y = class extends v {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = me(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return z;
	}
};
Y._$litElement$ = !0, Y.finalized = !0, J.litElementHydrateSupport?.({ LitElement: Y });
var he = J.litElementPolyfillSupport;
he?.({ LitElement: Y }), (J.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var ge = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	hasChanged: g
}, _e = (e = ge, t, n) => {
	let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
	if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
		let { name: r } = n;
		return {
			set(n) {
				let i = t.get.call(this);
				t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
			},
			init(t) {
				return t !== void 0 && this.C(r, void 0, e, t), t;
			}
		};
	}
	if (r === "setter") {
		let { name: r } = n;
		return function(n) {
			let i = this[r];
			t.call(this, n), this.requestUpdate(r, i, e, !0, n);
		};
	}
	throw Error("Unsupported decorator location: " + r);
};
function X(e) {
	return (t, n) => typeof n == "object" ? _e(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function Z(e) {
	return X({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region \0@oxc-project+runtime@0.128.0/helpers/decorate.js
function Q(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/tv-planner-card.ts
var $ = class extends Y {
	constructor(...e) {
		super(...e), this.events = [], this.loading = !1, this.selectedSourceEntity = "", this.lastCopied = "", this.loaded = !1, this.errorMessage = "", this.externalChannelIcons = {}, this.expandedEvents = {};
	}
	static {
		this.styles = o`
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

    button[disabled] {
      opacity: 0.6;
      cursor: wait;
    }

    .success,
    .error {
      font-size: 0.9em;
    }

    .success {
      color: var(--accent-color);
    }

    .error {
      color: var(--error-color);
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

    .event-main {
      min-width: 0;
      flex: 1 1 auto;
    }

    .event-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .event-title {
      overflow-wrap: anywhere;
    }

    .channel-icon {
      width: 28px;
      height: 28px;
      object-fit: contain;
      flex: 0 0 auto;
    }

    .description-toggle {
      margin-top: 4px;
      cursor: pointer;
      color: var(--accent-color);
      font-size: 0.9em;
      user-select: none;
    }
  `;
	}
	setConfig(e) {
		this.config = e, this.events = [], this.loading = !1, this.errorMessage = "", this.selectedSourceEntity = e.source_entity || e.sources?.[0]?.entity || "", this.loadExternalChannelIcons();
	}
	set hass(e) {
		this._hass = e, this.loaded || (this.loaded = !0, this.loadEvents());
	}
	getCardSize() {
		return 4;
	}
	render() {
		return !this._hass || !this.config ? R`` : R`
      <ha-card>
        <div class="card-content">
          <h2>${this.config.title || "TV Planner Card"}</h2>

          <button
            id="refresh"
            ?disabled=${this.loading}
            @click=${() => this.loadEvents()}
          >
            ${this.loading ? "Loading..." : "Reload events"}
          </button>

          <button id="browser-refresh" @click=${() => this.refreshDashboard()}>
            Refresh dashboard
          </button>

          ${this.lastCopied ? R`<p class="success">Copied: ${this.lastCopied}</p>` : R``}
          ${this.renderSourceSelector()} ${this.renderBody()}
        </div>
      </ha-card>
    `;
	}
	renderBody() {
		return this.loading ? R`<p>Loading events...</p>` : this.errorMessage ? R`<p class="error">Error: ${this.errorMessage}</p>` : this.events.length === 0 ? R`<p>No events found.</p>` : this.renderEventGroups();
	}
	renderSourceSelector() {
		let e = this.config?.sources;
		return e?.length ? R`
      <div class="source-selector">
        <label for="source-select">Channel</label>

        <select
          id="source-select"
          .value=${this.selectedSourceEntity}
          @change=${(e) => this.sourceChanged(e)}
        >
          ${e.map((e) => R`
              <option value=${e.entity}>${e.label}</option>
            `)}
        </select>
      </div>
    ` : R``;
	}
	renderEventGroups() {
		return Object.values(this.groupEventsByDay()).map((e) => R`
        <div class="day-separator">
          ${e[0] ? this.formatDay(e[0].start) : ""}
        </div>

        ${e.map((e) => this.renderEvent(e))}
      `);
	}
	renderEvent(e) {
		let t = this.getEventIcon(e);
		return console.log("TV Planner Card render event:", e), R`
      <div class="event">
        <div class="event-main">
          <div class="event-title-row">
            ${t ? R`<img class="channel-icon" src=${t} alt="" />` : R``}

            <strong class="event-title"
              >${e.summary || "Unknown Event"}</strong
            >
          </div>

          <div class="time">
            ${this.formatDate(e.start)} → ${this.formatDate(e.end)}
          </div>

          ${this.renderDescription(e)}
        </div>

        <button class="copy" @click=${() => this.copyEvent(e)}>Copy</button>
      </div>
    `;
	}
	renderDescription(e) {
		let t = this.config?.description_mode || "visible";
		if (!e.description || t === "hidden") return R``;
		if (t === "visible") return R`<div class="description">${e.description}</div>`;
		let n = this.getEventKey(e), r = t === "toggle-on", i = this.expandedEvents[n] ?? r;
		return R`
      <div
        class="description-toggle"
        @click=${() => this.toggleEventDescription(e)}
      >
        ${i ? "▼ Hide description" : "▶ Show description"}
      </div>

      ${i ? R`<div class="description">${e.description}</div>` : R``}
    `;
	}
	sourceChanged(e) {
		let t = e.target;
		this.selectedSourceEntity = t.value, this.loadEvents();
	}
	refreshDashboard() {
		let e = this._hass;
		if (!e) {
			alert("Home Assistant connection not found.");
			return;
		}
		e.callService("browser_mod", "refresh");
	}
	async copyEvent(e) {
		let t = this.config, n = this._hass;
		if (!t) {
			alert("Configuration not found.");
			return;
		}
		if (!n) {
			alert("Home Assistant connection not found.");
			return;
		}
		confirm(`Copy "${e.summary}" to ${t.target_calendar}?`) && (await n.callService("script", t.copy_script, {
			source_type: t.source_type || "calendar",
			source_calendar: t.source_calendar || "",
			source_entity: this.selectedSourceEntity || t.source_entity || "",
			target_calendar: t.target_calendar,
			summary: e.summary,
			description: e.description,
			location: e.location,
			start_date_time: e.start,
			end_date_time: e.end
		}), this.lastCopied = e.summary || "Event", t.refresh_after_copy && await this.loadEvents(), t.browser_refresh_after_copy && await n.callService("browser_mod", "refresh"));
	}
	async loadEvents() {
		if (!this.loading) {
			this.loading = !0, this.errorMessage = "";
			try {
				let e = this.config;
				if (!e) {
					this.events = [];
					return;
				}
				e.source_type === "ha_epg" ? this.loadHaEpgEvents() : await this.loadCalendarEvents();
			} catch (e) {
				console.error("TV Planner Card: failed to load events", e), this.events = [], this.errorMessage = e instanceof Error ? e.message : "Failed to load events";
			} finally {
				this.loading = !1;
			}
		}
	}
	async loadCalendarEvents() {
		let e = this.config, t = this._hass;
		if (!e || !t || !e.source_calendar) {
			this.events = [];
			return;
		}
		let n = /* @__PURE__ */ new Date(), r = /* @__PURE__ */ new Date();
		r.setDate(r.getDate() + (e.days_to_show || 14));
		let i = await t.callService("calendar", "get_events", {
			start_date_time: n.toISOString(),
			end_date_time: r.toISOString()
		}, { entity_id: e.source_calendar }, !1, !0);
		console.log("TV Planner Card calendar response:", i);
		let a = this.extractCalendarEvents(i, e.source_calendar);
		this.events = a.map((e) => this.normalizeCalendarEvent(e));
	}
	loadHaEpgEvents() {
		let e = this._hass;
		if (!e) {
			alert("Home Assistant connection not found.");
			return;
		}
		let t = e.states[this.selectedSourceEntity];
		if (!t) {
			console.error("TV Planner Card: HA-EPG entity not found", this.selectedSourceEntity), this.events = [];
			return;
		}
		let n = t.attributes, r = this.asString(n.channel_display_name), i = this.asString(n.channel_icon), a = this.epgDayToEvents(n.today, 0, r, i), o = this.epgDayToEvents(n.tomorrow, 1, r, i);
		this.events = [...a, ...o];
	}
	extractCalendarEvents(e, t) {
		let n = this.getResponsePayload(e);
		if (Array.isArray(n)) return n;
		if (!this.isRecord(n)) return [];
		if (Array.isArray(n.events)) return n.events;
		let r = n[t];
		return this.isRecord(r) && Array.isArray(r.events) ? r.events : [];
	}
	normalizeCalendarEvent(e) {
		return {
			start: this.extractCalendarDate(e.start),
			end: this.extractCalendarDate(e.end),
			summary: this.asString(e.summary || e.title),
			description: this.asString(e.description),
			location: this.asString(e.location),
			channel_icon: this.asString(e.channel_icon),
			source: "calendar"
		};
	}
	extractCalendarDate(e) {
		return typeof e == "string" ? e : this.isRecord(e) ? this.asString(e.dateTime || e.date) : "";
	}
	epgDayToEvents(e, t, n, r) {
		if (!this.isRecord(e)) return [];
		let i = /* @__PURE__ */ new Date();
		return i.setDate(i.getDate() + t), Object.values(e).filter((e) => this.isRecord(e)).map((e) => this.epgProgramToEvent(e, i, n, r));
	}
	epgProgramToEvent(e, t, n, r) {
		let i = this.combineDateAndTime(t, this.asString(e.start)), a = this.getProgramEndDate(t, i, this.asString(e.end)), o = this.asString(e.title), s = this.asString(e.sub_title);
		return {
			start: i.toISOString(),
			end: a.toISOString(),
			summary: s ? `${n} | ${o} • ${s}` : `${n} | ${o}`,
			description: this.asString(e.desc),
			location: n,
			channel_icon: r,
			source: "ha_epg"
		};
	}
	getProgramEndDate(e, t, n) {
		let r = this.combineDateAndTime(e, n);
		return r <= t && r.setDate(r.getDate() + 1), r;
	}
	async loadExternalChannelIcons() {
		let e = this.config?.channel_icons_url;
		if (!e) {
			this.externalChannelIcons = {};
			return;
		}
		try {
			let t = await fetch(e);
			if (!t.ok) throw Error(`HTTP ${t.status} while loading ${e}`);
			let n = await t.json();
			if (!this.isRecord(n)) throw Error("Channel icons JSON is not an object");
			let r = {};
			Object.entries(n).forEach(([e, t]) => {
				if (typeof t == "string") for (let n of this.getChannelAliases(e)) r[n] = t;
			}), this.externalChannelIcons = r;
		} catch (e) {
			console.error("TV Planner Card: failed to load channel icons", e), this.externalChannelIcons = {};
		}
	}
	getEventIcon(e) {
		try {
			if (e.channel_icon) return e.channel_icon;
			let t = this.getEventChannel(e);
			if (!t) return "";
			let n = this.getCombinedChannelIcons();
			for (let e of this.getChannelAliases(t)) if (n[e]) return n[e];
			return "";
		} catch (t) {
			return console.warn("TV Planner Card: icon lookup failed", t, e), "";
		}
	}
	getEventChannel(e) {
		return e.location ? e.location.trim() : e.summary.includes("|") ? e.summary?.split("|")[0]?.trim() ?? "Unknown Event" : "";
	}
	getCombinedChannelIcons() {
		let e = {};
		return this.addChannelIcons(e, this.externalChannelIcons), this.addChannelIcons(e, this.config?.channel_icons), this.addChannelIcons(e, this.getChannelIconMap()), e;
	}
	getChannelIconMap() {
		let e = this._hass, t = this.config?.sources || [], n = {};
		if (!e) return n;
		for (let r of t) {
			let t = e.states[r.entity];
			if (!t) continue;
			let i = this.asString(t.attributes.channel_display_name) || r.label, a = this.asString(t.attributes.channel_icon);
			a && (n[i] = a, n[r.label] = a);
		}
		return n;
	}
	addChannelIcons(e, t) {
		t && Object.entries(t).forEach(([t, n]) => {
			if (n) for (let r of this.getChannelAliases(t)) e[r] = n;
		});
	}
	getChannelAliases(e) {
		let t = e.trim(), n = this.normalizeChannelName(t), r = n.replace(/\s+/g, ""), i = n.replace(/^([A-Z]+)([0-9]+)$/u, "$1 $2");
		return [...new Set([
			t,
			n,
			r,
			i
		])].filter(Boolean);
	}
	normalizeChannelName(e) {
		return e.replace(/\s+/g, " ").trim().toUpperCase();
	}
	groupEventsByDay() {
		return this.events.reduce((e, t) => {
			let n = new Date(t.start).toDateString();
			return e[n] || (e[n] = []), e[n].push(t), e;
		}, {});
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
	formatDay(e) {
		return new Date(e).toLocaleDateString(void 0, {
			weekday: "long",
			day: "numeric",
			month: "long"
		});
	}
	combineDateAndTime(e, t) {
		let [n = 0, r = 0] = t.split(":").map(Number), i = new Date(e);
		return i.setHours(n, r, 0, 0), i;
	}
	getEventKey(e) {
		return [
			e.start,
			e.end,
			e.summary
		].join("|");
	}
	toggleEventDescription(e) {
		let t = this.getEventKey(e), n = (this.config?.description_mode || "visible") === "toggle-on";
		this.expandedEvents = {
			...this.expandedEvents,
			[t]: !(this.expandedEvents[t] ?? n)
		};
	}
	getResponsePayload(e) {
		return this.isRecord(e) && "response" in e ? e.response : e;
	}
	isRecord(e) {
		return !!e && typeof e == "object" && !Array.isArray(e);
	}
	asString(e) {
		return typeof e == "string" ? e : "";
	}
};
Q([X({ attribute: !1 })], $.prototype, "config", void 0), Q([Z()], $.prototype, "events", void 0), Q([Z()], $.prototype, "loading", void 0), Q([Z()], $.prototype, "selectedSourceEntity", void 0), Q([Z()], $.prototype, "lastCopied", void 0), Q([Z()], $.prototype, "loaded", void 0), Q([Z()], $.prototype, "errorMessage", void 0), Q([Z()], $.prototype, "externalChannelIcons", void 0), Q([Z()], $.prototype, "expandedEvents", void 0), customElements.define("tv-planner-card", $);
//#endregion

//# sourceMappingURL=tv-planner-card.js.map