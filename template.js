var template = (function (exports) {
  'use strict';

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reI = "\\s*([+-]?\\d+)\\s*",
      reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex = /^#([0-9a-f]{3,8})$/,
      reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
      reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
      reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
      reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
      reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
      reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    copy(channels) {
      return Object.assign(new this.constructor, this, channels);
    },
    displayable() {
      return this.rgb().displayable();
    },
    hex: color_formatHex, // Deprecated! Use color.formatHex.
    formatHex: color_formatHex,
    formatHex8: color_formatHex8,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
  });

  function color_formatHex() {
    return this.rgb().formatHex();
  }

  function color_formatHex8() {
    return this.rgb().formatHex8();
  }

  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }

  function color_formatRgb() {
    return this.rgb().formatRgb();
  }

  function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
        : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
        : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
        : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
        : null) // invalid hex
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb, extend(Color, {
    brighter(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb() {
      return this;
    },
    clamp() {
      return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
    },
    displayable() {
      return (-0.5 <= this.r && this.r < 255.5)
          && (-0.5 <= this.g && this.g < 255.5)
          && (-0.5 <= this.b && this.b < 255.5)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: rgb_formatHex, // Deprecated! Use color.formatHex.
    formatHex: rgb_formatHex,
    formatHex8: rgb_formatHex8,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
  }));

  function rgb_formatHex() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
  }

  function rgb_formatHex8() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
  }

  function rgb_formatRgb() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
  }

  function clampa(opacity) {
    return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
  }

  function clampi(value) {
    return Math.max(0, Math.min(255, Math.round(value) || 0));
  }

  function hex(value) {
    value = clampi(value);
    return (value < 16 ? "0" : "") + value.toString(16);
  }

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend(Color, {
    brighter(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    clamp() {
      return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
    },
    displayable() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    formatHsl() {
      const a = clampa(this.opacity);
      return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
    }
  }));

  function clamph(value) {
    value = (value || 0) % 360;
    return value < 0 ? value + 360 : value;
  }

  function clampt(value) {
    return Math.max(0, Math.min(1, value || 0));
  }

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var prefix = "$";

  function Map$1() {}

  Map$1.prototype = map$1.prototype = {
    constructor: Map$1,
    has: function(key) {
      return (prefix + key) in this;
    },
    get: function(key) {
      return this[prefix + key];
    },
    set: function(key, value) {
      this[prefix + key] = value;
      return this;
    },
    remove: function(key) {
      var property = prefix + key;
      return property in this && delete this[property];
    },
    clear: function() {
      for (var property in this) if (property[0] === prefix) delete this[property];
    },
    keys: function() {
      var keys = [];
      for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
      return keys;
    },
    values: function() {
      var values = [];
      for (var property in this) if (property[0] === prefix) values.push(this[property]);
      return values;
    },
    entries: function() {
      var entries = [];
      for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
      return entries;
    },
    size: function() {
      var size = 0;
      for (var property in this) if (property[0] === prefix) ++size;
      return size;
    },
    empty: function() {
      for (var property in this) if (property[0] === prefix) return false;
      return true;
    },
    each: function(f) {
      for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
    }
  };

  function map$1(object, f) {
    var map = new Map$1;

    // Copy constructor.
    if (object instanceof Map$1) object.each(function(value, key) { map.set(key, value); });

    // Index array by numeric index or specified key function.
    else if (Array.isArray(object)) {
      var i = -1,
          n = object.length,
          o;

      if (f == null) while (++i < n) map.set(i, object[i]);
      else while (++i < n) map.set(f(o = object[i], i, object), o);
    }

    // Convert object to map.
    else if (object) for (var key in object) map.set(key, object[key]);

    return map;
  }

  function Set() {}

  var proto = map$1.prototype;

  Set.prototype = {
    constructor: Set,
    has: proto.has,
    add: function(value) {
      value += "";
      this[prefix + value] = value;
      return this;
    },
    remove: proto.remove,
    clear: proto.clear,
    values: proto.keys,
    size: proto.size,
    empty: proto.empty,
    each: proto.each
  };

  function createScreenshotSVG(target, id) {
  	if (typeof target == "string") target = document.querySelector(target);
  	if (!target) {
  		console.error("No valid target in createScreenshotSVG");
  		return null;
  	}
  	const { width, height, x, y } = target.getBoundingClientRect();
  	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  	svg.id = id;
  	svg.classList.add("flourish-screenshot-svg-container");
  	svg.style.left = x + "px";
  	svg.style.top = y + "px";
  	svg.style.width = width + "px";
  	svg.style.height = height + "px";
  	svg.style.position = "absolute";

  	target.appendChild(svg);

  	function addTextElements(els) {
  		if (typeof els == "string") els = target.querySelectorAll(els);
  		if (!els) {
  			console.error("No valid els inside addTextElements");
  			return null;
  		}

  		for (const el of els) {
  			const { x, y, width } = el.getBoundingClientRect();

  			const svg_text_el = document.createElementNS(
  				"http://www.w3.org/2000/svg",
  				"text",
  			);
  			const {
  				color: fill,
  				"font-family": fontFamily,
  				"font-size": fontSize,
  				"font-weight": fontWeight,
  				"line-height": lineHeight,
  				"padding-left": paddingLeft,
  				"padding-top": paddingTop,
  			} = window.getComputedStyle(el);
  			const string_style = `${fontWeight} ${fontSize} ${fontFamily}`;
  			const lines = wrapStringToLines(
  				el.innerText,
  				string_style,
  				null,
  				Math.ceil(width),
  			);
  			const lineHeightParsed = isNaN(parseFloat(lineHeight))
  				? parseFloat(fontSize) * 1.2 + "px"
  				: lineHeight;
  			const opacity = window.getComputedStyle(
  				el.closest("[style*='opacity']") || el,
  			).opacity;
  			lines.forEach((d, i) => {
  				const svg_tspan_el = document.createElementNS(
  					"http://www.w3.org/2000/svg",
  					"tspan",
  				);
  				svg_tspan_el.innerHTML = d;
  				svg_tspan_el.setAttribute(
  					"dy",
  					i === 0 ? parseFloat(paddingTop) : lineHeightParsed,
  				);
  				svg_tspan_el.setAttribute("dx", parseFloat(paddingLeft));
  				svg_tspan_el.setAttribute("x", x);
  				svg_tspan_el.setAttribute("opacity", opacity);

  				svg_text_el.appendChild(svg_tspan_el);
  			});

  			svg_text_el.style.dominantBaseline = "text-before-edge";
  			svg_text_el.setAttribute("x", x + "px");
  			svg_text_el.setAttribute("y", y + "px");
  			svg_text_el.setAttribute("font-family", fontFamily);
  			svg_text_el.setAttribute("font-size", fontSize);
  			svg_text_el.setAttribute("font-weight", fontWeight);
  			svg_text_el.setAttribute("fill", fill);

  			svg.appendChild(svg_text_el);
  		}
  		return this;
  	}

  	function addCircleElements(els) {
  		if (typeof els == "string") els = target.querySelectorAll(els);
  		if (!els) {
  			console.error("No valid els inside addCircleElements");
  			return null;
  		}

  		for (const el of els) {
  			const svg_circle_el = document.createElementNS(
  				"http://www.w3.org/2000/svg",
  				"circle",
  			);
  			const { x, y, width } = el.getBoundingClientRect();
  			const fill = window.getComputedStyle(el)["background-color"];
  			const opacity = window.getComputedStyle(
  				el.closest("[style*='opacity']") || el,
  			).opacity;
  			const radius = width / 2;
  			svg_circle_el.setAttribute("cx", x + radius + "px");
  			svg_circle_el.setAttribute("cy", y + radius + "px");
  			svg_circle_el.setAttribute("r", radius + "px");
  			svg_circle_el.setAttribute("opacity", opacity);
  			svg_circle_el.setAttribute("fill", fill);
  			// If there's no background, add a border
  			if (fill === "rgba(0, 0, 0, 0)")
  				svg_circle_el.setAttribute("stroke", "#CCC");
  			svg.appendChild(svg_circle_el);
  		}

  		return this;
  	}

  	function addSwatchElements(els, label_els) {
  		if (typeof els == "string") els = target.querySelectorAll(els);
  		if (!els) {
  			console.error("No valid els inside addSwatchElements");
  			return null;
  		}
  		if (typeof label_els == "string")
  			label_els = target.querySelectorAll(label_els);

  		for (const [index, el] of els.entries()) {
  			const svg_swatch_el = document.createElementNS(
  				"http://www.w3.org/2000/svg",
  				"rect",
  			);
  			const { x, y, width, height } = el.getBoundingClientRect();
  			const label_y = label_els[index]?.getBoundingClientRect()?.y;
  			const fill = window.getComputedStyle(el)["background-color"];
  			const border = window.getComputedStyle(el).border;
  			const [, r, g, b, a] = border
  				.replace(/\s/g, "")
  				.match(
  					/rgba?\((\d+(?:\.\d+)?),(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)(?:,(\d+(?:\.\d+)?))?\)/i,
  				);
  			const border_color = a
  				? `rgba(${r},${g},${b},${a})`
  				: `rgb(${r},${g},${b})` || "#000";
  			const border_width = border.split(" ")[0] || 0;
  			let border_radius = window.getComputedStyle(el)["border-radius"] || 0;
  			border_radius = parseFloat(border_radius);
  			const opacity = window.getComputedStyle(
  				el.closest("[style*='opacity']") || el,
  			).opacity;
  			svg_swatch_el.setAttribute("x", x);
  			svg_swatch_el.setAttribute("y", label_y || y);
  			svg_swatch_el.setAttribute("width", `${width}px`);
  			svg_swatch_el.setAttribute("height", `${height}px`);
  			svg_swatch_el.setAttribute("rx", border_radius);
  			svg_swatch_el.setAttribute("ry", border_radius);
  			svg_swatch_el.setAttribute("opacity", opacity);
  			svg_swatch_el.setAttribute("fill", fill);
  			svg_swatch_el.setAttribute("stroke", border_color);
  			svg_swatch_el.setAttribute("stroke-width", border_width);
  			// If there's no background, add a border
  			if (fill === "rgba(0, 0, 0, 0)")
  				svg_swatch_el.setAttribute("stroke", "#CCC");
  			svg.appendChild(svg_swatch_el);
  		}

  		return this;
  	}

  	function addGradient(el, colorFunction, domain) {
  		if (typeof el == "string") el = target.querySelector(el);
  		if (!el) {
  			console.error("No valid els inside addCircleElements");
  			return null;
  		}

  		const svg_gradient_el = document.createElementNS(
  			"http://www.w3.org/2000/svg",
  			"g",
  		);
  		const { x, y, width, height } = el.getBoundingClientRect();
  		const { max, min } = domain;
  		const range = max - min;
  		for (let line_x = 0; line_x <= width; line_x++) {
  			const svg_line_el = document.createElementNS(
  				"http://www.w3.org/2000/svg",
  				"line",
  			);
  			svg_line_el.setAttribute(
  				"stroke",
  				colorFunction(min + (line_x * range) / width),
  			);
  			svg_line_el.setAttribute("x1", line_x + x);
  			svg_line_el.setAttribute("y1", y);
  			svg_line_el.setAttribute("x2", line_x + x);
  			svg_line_el.setAttribute("y2", height + y);
  			svg_gradient_el.appendChild(svg_line_el);
  		}
  		svg.appendChild(svg_gradient_el);

  		return this;
  	}

  	function remove() {
  		svg.remove();
  	}

  	return {
  		addTextElements,
  		addCircleElements,
  		addSwatchElements,
  		addGradient,
  		remove,
  	};
  }

  // This is an exception because mocha doesn't run in a browser context, so some
  // browser methods aren't available.
  const is_browser =
  	typeof window !== "undefined" &&
  	typeof document !== "undefined" &&
  	typeof document.createElement === "function" &&
  	typeof document.body?.appendChild === "function" &&
  	typeof HTMLElement !== "undefined";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const tnums_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const tnums_text_element = document.createElementNS(
  	"http://www.w3.org/2000/svg",
  	"text",
  );
  tnums_svg.appendChild(tnums_text_element);
  if (is_browser) {
  	canvas.style.position = "fixed";
  	canvas.style.left = "1000vw";
  	tnums_svg.style.position = "fixed";
  	tnums_svg.style.left = "1000vw";
  	document.body.appendChild(canvas);
  	document.body.appendChild(tnums_svg);
  }
  let is_browser_supporting_tnums_in_canvas = null;

  function checkBrowserTnumSupport() {
  	const test_tnum_string = "0123456789.,£";
  	const no_tnum_canvas = document.createElement("canvas");
  	const tnum_canvas = document.createElement("canvas");
  	const no_tnum_ctx = no_tnum_canvas.getContext("2d");
  	const tnum_ctx = tnum_canvas.getContext("2d");

  	no_tnum_canvas.setAttribute(
  		"style",
  		"font-feature-settings: normal; font-variant-numeric: normal; position: fixed; left: 1000vw;",
  	);
  	tnum_canvas.setAttribute(
  		"style",
  		'font-feature-settings: "tnum" 1; font-variant-numeric: tabular-nums; position: fixed; left: 1000vw;',
  	);

  	no_tnum_ctx.font = tnum_ctx.font = ctx.font;

  	document.body.appendChild(no_tnum_canvas);
  	document.body.appendChild(tnum_canvas);

  	const width_no_tnum = no_tnum_ctx.measureText(test_tnum_string).width;
  	const width_tnum = tnum_ctx.measureText(test_tnum_string).width;

  	is_browser_supporting_tnums_in_canvas = width_no_tnum !== width_tnum;

  	document.body.removeChild(no_tnum_canvas);
  	document.body.removeChild(tnum_canvas);

  	return is_browser_supporting_tnums_in_canvas;
  }

  ctx.measureTextWithTnums = function (text) {
  	if (!is_browser) return ctx.measureText(text);
  	const computed_style = window.getComputedStyle(this.canvas);
  	const is_tnums_style_set =
  		(computed_style.fontFeatureSettings || "").includes("tnum") ||
  		(computed_style.fontVariantNumeric || "").includes("tabular-nums");

  	// No tnums set for this text, so measure using canvas
  	if (!is_tnums_style_set) return this.measureText(text);

  	// Tnums are set, check if browser supports it
  	if (is_browser_supporting_tnums_in_canvas === null) checkBrowserTnumSupport();

  	// Browser supports tnums in canvas, measure text
  	if (is_browser_supporting_tnums_in_canvas) return this.measureText(text);

  	// Browser does not support tnums in canvas, measure text using svg instead
  	tnums_text_element.textContent = text;
  	tnums_text_element.setAttribute(
  		"style",
  		`font: ${ctx.font}; font-feature-settings: 'tnum' 1; font-variant-numeric: tabular-nums; position: fixed; left: 1000vw;`,
  	);

  	let svg_text_width = tnums_text_element.getBBox().width;

  	// measureText in order to return a full TextMetrics object with the svg measured width
  	const measured_text = this.measureText(text);
  	return {
  		...measured_text,
  		width: svg_text_width,
  	};
  };

  function wrapStringToLines(
  	text,
  	font_styles,
  	max_lines,
  	max_width,
  	allow_single_word_truncation = true,
  ) {
  	if (typeof text !== "string") text = String(text);
  	const isOverflow = (string) =>
  		ctx.measureTextWithTnums(string).width > max_width;
  	const truncateStringToWidth = (string, width) => {
  		let string_width = ctx.measureText(string).width;
  		// Check if the string needs truncation
  		if (string_width <= width) {
  			return string;
  		}

  		let remove_counter = 1;
  		let truncated_string = string;
  		do {
  			truncated_string =
  				string.substring(0, string.length - remove_counter) + "…";
  			string_width = ctx.measureTextWithTnums(truncated_string).width;
  		} while (string_width > width && ++remove_counter < string.length);
  		if (truncated_string.length < 1)
  			truncated_string = string.substring(0, 1) + "…";
  		return truncated_string;
  	};
  	ctx.font = font_styles;
  	let lines = [];
  	Object.defineProperty(lines, "widest_line", {
  		value: 0,
  		enumerable: true,
  		writable: true,
  	});

  	Object.defineProperty(lines, "has_truncated", {
  		value: false,
  		enumerable: true,
  		writable: true,
  	});

  	if (
  		typeof text === "undefined" ||
  		(Number.isInteger(max_lines) && max_lines <= 0)
  	)
  		return lines;
  	if (text.length === 0) {
  		lines.push("");
  		return lines;
  	}
  	if (max_width <= 0) {
  		if (text.length > 0) {
  			lines.push(text.slice(0, 1) + "…");
  			lines.widest_line = ctx.measureTextWithTnums(lines[0]).width;
  		}
  		return lines;
  	}

  	if (!text || text.length === 0 || max_lines === 0 || max_width <= 0)
  		return lines;
  	const all_words = text.split(/\s+/g);

  	// Check if whole label fits ok - no work needed - return it
  	if (!isOverflow(text)) {
  		lines.push(text);
  		lines.widest_line = ctx.measureTextWithTnums(text).width;
  		lines.has_truncated = false;
  		return lines;
  	}

  	// Check if the first word doesn't even fit in the space - return truncated first word
  	let first_word = new String(all_words[0]);
  	if (first_word && isOverflow(first_word)) {
  		if (allow_single_word_truncation) {
  			first_word = truncateStringToWidth(first_word, max_width);
  		} else if (all_words.length > 1) {
  			first_word += "…";
  		}
  		lines.push(first_word);
  		lines.widest_line = ctx.measureTextWithTnums(first_word).width;
  		lines.has_truncated = true;
  		return lines;
  	}

  	// Fit words in line by line, truncating if necessary - return
  	let currentLine = "";
  	let has_truncated = false;
  	all_words.forEach((word) => {
  		if (has_truncated) return;
  		if (isOverflow(currentLine + (currentLine ? " " : "") + word)) {
  			if (currentLine) {
  				const currentLineWidth = ctx.measureTextWithTnums(currentLine).width;
  				if (currentLineWidth > max_width) {
  					currentLine = truncateStringToWidth(currentLine, max_width);
  					has_truncated = true;
  				}
  				lines.push(currentLine);
  				currentLine = "";
  			}
  			currentLine = word;
  		} else {
  			currentLine += (currentLine ? " " : "") + word;
  		}
  	});

  	if (currentLine && !has_truncated) {
  		lines.push(truncateStringToWidth(currentLine, max_width));
  	}

  	if (lines.length > max_lines) {
  		// can't have more lines than max_lines, so slice and add ellipses.
  		const to_truncate = lines.length > max_lines;
  		if (to_truncate && Number.isInteger(max_lines)) {
  			lines.splice(max_lines, lines.length - max_lines);
  			let last_line = lines[lines.length - 1];

  			// check if adding an ellipsis will exceed max_width
  			if (isOverflow(last_line + "…")) {
  				// truncate further before adding ellipsis
  				last_line = truncateStringToWidth(
  					last_line,
  					max_width - ctx.measureTextWithTnums("…").width,
  				);
  			}

  			// add ellipsis if not already present
  			if (last_line.slice(-1) !== "…") {
  				last_line += "…";
  			}

  			lines[lines.length - 1] = last_line;
  			has_truncated = true;
  		}
  	}

  	// find the widest entry in lines and measure it
  	lines.widest_line = Math.max(
  		...lines.map((line) => ctx.measureTextWithTnums(line).width),
  	);
  	lines.has_truncated = has_truncated;

  	return lines;
  }

  var style_el;
  var font_samples_el;
  var font_weights;

  function initFontStyles() {
  	style_el = document.createElement("style");
  	style_el.id = "flourish-page-styles";
  	style_el.type = "text/css";
  	document.head.appendChild(style_el);
  }

  function toAbsoluteURL(url) {
  	try {
  		return new URL(url, document.baseURI).href;
  	} catch {
  		// if malformed, fall back without throwing
  		return url;
  	}
  }
  function appendFontSample(font) {
  	if (!document.body.querySelector(".font-samples")) {
  		font_samples_el = document.createElement("div");
  		font_samples_el.className = "font-samples";
  		font_samples_el.style.visibility = "hidden";
  		font_samples_el.style.overflow = "hidden";
  		font_samples_el.style.height = 0;
  		document.body.appendChild(font_samples_el);
  	}
  	font_weights.forEach(function (font_weight) {
  		var sample_text_el = document.createElement("div");
  		sample_text_el.className = "font-sample-el";
  		sample_text_el.innerText = font.name;
  		sample_text_el.style.fontFamily = font.name;
  		sample_text_el.style.fontWeight = font_weight;
  		font_samples_el.appendChild(sample_text_el);
  	});
  }

  function removeFontSamples() {
  	document.body.querySelector(".font-samples").innerHTML = "";
  }

  function updateFontStyles(custom_font_weights) {
  	if (!font_weights) font_weights = custom_font_weights || ["normal", "bold"];
  	var breakpoints = ["mobile_big", "tablet", "desktop", "big_screen"];
  	var breakpoint_css = "";

  	breakpoints.forEach(function (breakpoint_name) {
  		var css_media_query =
  			"@media(min-width: " + state$1["breakpoint_" + breakpoint_name] + "px) {\n";
  		var css_font_size =
  			"html { font-size:" + state$1["font_size_" + breakpoint_name] + "%; }";
  		breakpoint_css += css_media_query + css_font_size + "\n}\n\n";
  	});

  	var general_styles =
  		"html { \n font-size:" +
  		state$1.font_size_mobile_small +
  		"%; \n -webkit-font-smoothing: antialiased; \n -moz-osx-font-smoothing: auto; } \n\n\n";
  	style_el.innerHTML = general_styles + breakpoint_css;

  	// Check if we need to load fonts
  	var fonts = [
  		state$1.body_font,
  		state$1.title_font,
  		state$1.subtitle_font,
  		state$1.footer_font,
  	];
  	fonts.forEach(function (font) {
  		if (!font) return;
  		var font_already_loaded = false;
  		var font_url_absolute = toAbsoluteURL(font.url);

  		var layout_fonts = document.head.querySelectorAll("link.layout-font");
  		for (var i = 0; i < layout_fonts.length; i++) {
  			var font_el = layout_fonts[i];
  			if (font_el.href === font_url_absolute) font_already_loaded = true;
  		}

  		if (!font_already_loaded) {
  			var font_link = document.createElement("link");
  			font_link.setAttribute("rel", "stylesheet");
  			font_link.setAttribute("href", font.url);
  			font_link.className = "layout-font";
  			document.head.appendChild(font_link);
  			appendFontSample(font);
  		}
  	});

  	// Check if we need to remove fonts
  	var layout_fonts = document.head.querySelectorAll("link.layout-font");
  	for (var i = 0; i < layout_fonts.length; i++) {
  		var font_el = layout_fonts[i];
  		var font_needed = false;
  		fonts.forEach(function (font) {
  			if (font && toAbsoluteURL(font.url) === font_el.href) font_needed = true;
  		});
  		if (!font_needed) font_el.parentElement.removeChild(font_el);
  	}

  	document.body.style.fontFamily = state$1.body_font.name;
  }

  var LAYOUTS = Object.freeze({
  	"stack-default": ["header", "controls", "legend", "primary", "footer"],
  	"stack-2": ["primary", "header", "controls", "legend", "footer"],
  	"stack-3": ["header", "primary", "controls", "legend", "footer"],
  	"stack-4": ["controls", "primary", "header", "legend", "footer"],
  	"stack-5": ["header", "controls", "primary", "legend", "footer"],
  	"stack-6": ["header", "legend", "primary", "controls", "footer"],
  	"grid-1": {
  		wrapper: {
  			display: "grid",
  			"grid-template-rows":
  				"min-content min-content minmax(min-content,auto) min-content",
  			"grid-template-columns": "1fr 2fr",
  		},
  		header: { "grid-column-start": 1 },
  		legend: { "grid-column-start": 1 },
  		controls: { "grid-column-start": 1 },
  		primary: {
  			"grid-column-start": 2,
  			"grid-row": "1 / -1",
  		},
  		footer: {
  			"grid-column-start": "1",
  			"grid-row-start": 4,
  		},
  	},
  });

  var window_width, base_size;

  function remToPx(rem) {
  	if (window.innerWidth !== window_width) {
  		window_width = window.innerWidth;
  		base_size = parseFloat(getComputedStyle(document.documentElement).fontSize);
  	}
  	return rem * base_size;
  }

  // these two functions are hacky way to avoid breaking themes.
  // we avoid changing the settings to avoid breaking themes and instead convert
  // the existing settings to the values we want them to be
  function getJustifyContent(align) {
  	if (align == "justify") return "space-between";
  	if (align == "left") return "flex-start";
  	if (align == "right") return "flex-end";
  	if (align == "center") return "center";
  }
  function getTextAlign(align) {
  	if (align == "justify") return "";
  	if (align == "left") return "start";
  	if (align == "right") return "end";
  	if (align == "center") return "center";
  }

  function addHttp(url) {
  	if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0)
  		return "http://" + url;
  	else return url;
  }

  var header_el,
  	title_el,
  	subtitle_el,
  	text_el$1,
  	clearfix_el,
  	logo_el$1,
  	logo_img$1,
  	logo_link$1;

  function hasHeaderLogo() {
  	return state$1.header_logo_enabled && state$1.header_logo_src;
  }

  function updateHeaderLogo() {
  	logo_el$1.innerHTML = "";

  	if (!hasHeaderLogo()) {
  		return;
  	}

  	logo_img$1 = logo_img$1 || document.createElement("img");
  	logo_img$1.className = "flourish-header-logo";
  	logo_img$1.src = addHttp(state$1.header_logo_src);
  	logo_img$1.alt = state$1.header_logo_alt;

  	logo_img$1.style.position = state$1.header_logo_align == "inside" ? "" : "fixed";
  	logo_img$1.style.height = state$1.header_logo_height + "rem";
  	logo_img$1.style.top = state$1.header_logo_align == "outside" ? 0 : "";
  	logo_img$1.style.left =
  		state$1.header_logo_align == "outside" &&
  		state$1.header_logo_position_outside == "left"
  			? 0
  			: "";
  	logo_img$1.style.right =
  		state$1.header_logo_align == "outside" &&
  		state$1.header_logo_position_outside == "right"
  			? 0
  			: "";
  	logo_img$1.style.marginTop = state$1.header_logo_margin_top + "rem";
  	logo_img$1.style.marginBottom = state$1.header_logo_margin_bottom + "rem";
  	logo_img$1.style.marginLeft = state$1.header_logo_margin_left + "rem";
  	logo_img$1.style.marginRight = state$1.header_logo_margin_right + "rem";
  	logo_img$1.style.float =
  		state$1.header_logo_position_inside == "top" ||
  		state$1.header_logo_align == "outside"
  			? ""
  			: state$1.header_logo_position_inside;
  	logo_img$1.style.width = "auto";

  	if (state$1.header_logo_link_url) {
  		logo_link$1 = document.createElement("a");
  		logo_link$1.target = "_blank";

  		logo_link$1.appendChild(logo_img$1);
  		logo_el$1.appendChild(logo_link$1);
  		logo_img$1.style.cursor = "pointer";

  		logo_link$1.href = addHttp(state$1.header_logo_link_url);
  	} else {
  		logo_el$1.appendChild(logo_img$1);
  	}
  }

  function init$3() {
  	header_el = document.createElement("header");
  	header_el.className = "flourish-header";

  	var hgroup_el = document.createElement("hgroup");
  	title_el = document.createElement("h2");
  	subtitle_el = document.createElement("h3");
  	text_el$1 = document.createElement("p");
  	clearfix_el = document.createElement("div");
  	clearfix_el.className = "clearfix";
  	logo_el$1 = document.createElement("div");
  	logo_el$1.className = "flourish-header-logo-container";

  	header_el.appendChild(logo_el$1);
  	header_el.appendChild(hgroup_el);
  	hgroup_el.appendChild(title_el);
  	hgroup_el.appendChild(subtitle_el);
  	header_el.appendChild(text_el$1);
  	header_el.appendChild(clearfix_el);

  	return header_el;
  }

  function update$3() {
  	var top_border =
  		state$1.header_border == "top" || state$1.header_border == "top_and_bottom";
  	var bottom_border =
  		state$1.header_border == "bottom" || state$1.header_border == "top_and_bottom";

  	header_el.style.textAlign = getTextAlign(state$1.header_align);
  	header_el.style.margin = 0;
  	header_el.style.borderTop = top_border
  		? state$1.header_border_width +
  			"px " +
  			state$1.header_border_style +
  			" " +
  			state$1.header_border_color
  		: null;
  	header_el.style.borderBottom = bottom_border
  		? state$1.header_border_width +
  			"px " +
  			state$1.header_border_style +
  			" " +
  			state$1.header_border_color
  		: null;
  	header_el.style.paddingTop = top_border
  		? state$1.header_border_space + "rem"
  		: "";
  	header_el.style.paddingBottom = bottom_border
  		? state$1.header_border_space + "rem"
  		: "";

  	title_el.innerHTML = state$1.title ? state$1.title : "";
  	title_el.setAttribute("id", "flourish-header-title");
  	title_el.style.fontFamily = state$1.title_font
  		? state$1.title_font.name
  		: "inherit"; // Check for inherit, then font name
  	title_el.style.fontSize =
  		(state$1.title_size != "custom"
  			? state$1.title_size
  			: state$1.title_size_custom) + "rem";
  	title_el.style.lineHeight = state$1.title_line_height;
  	title_el.style.fontWeight = state$1.title_weight;
  	title_el.style.color = state$1.title_color || state$1.font_color;
  	title_el.style.margin = 0;
  	title_el.style.paddingTop = !state$1.title
  		? 0
  		: (state$1.title_space_above == "custom"
  				? state$1.title_space_above_custom
  				: state$1.title_space_above) + "rem";

  	subtitle_el.innerHTML = state$1.subtitle ? state$1.subtitle : "";
  	subtitle_el.setAttribute("id", "flourish-header-subtitle");
  	subtitle_el.style.fontFamily = state$1.subtitle_font
  		? state$1.subtitle_font.name
  		: "inherit"; // Check for inherit, then font name
  	subtitle_el.style.fontSize =
  		(state$1.subtitle_size != "custom"
  			? state$1.subtitle_size
  			: state$1.subtitle_size_custom) + "rem";
  	subtitle_el.style.lineHeight = state$1.subtitle_line_height;
  	subtitle_el.style.fontWeight = state$1.subtitle_weight;
  	subtitle_el.style.color = state$1.subtitle_color || state$1.font_color;
  	subtitle_el.style.margin = 0;
  	subtitle_el.style.paddingTop = !state$1.subtitle
  		? 0
  		: (state$1.subtitle_space_above == "custom"
  				? state$1.subtitle_space_above_custom
  				: state$1.subtitle_space_above) + "rem";

  	text_el$1.innerHTML = state$1.header_text ? state$1.header_text : "";
  	text_el$1.setAttribute("id", "flourish-header-text");
  	text_el$1.style.fontSize =
  		(state$1.header_text_size != "custom"
  			? state$1.header_text_size
  			: state$1.header_text_size_custom) + "rem";
  	text_el$1.style.lineHeight = state$1.header_text_line_height;
  	text_el$1.style.fontWeight = state$1.header_text_weight;
  	text_el$1.style.margin = 0;
  	text_el$1.style.color = state$1.header_text_color || state$1.font_color;
  	text_el$1.style.paddingTop = !state$1.header_text
  		? 0
  		: (state$1.header_text_space_above == "custom"
  				? state$1.header_text_space_above_custom
  				: state$1.header_text_space_above) + "rem";

  	clearfix_el.style.clear = "both";

  	updateHeaderLogo();
  }

  function preloadHeaderLogo() {
  	if (!hasHeaderLogo()) return;

  	return new Promise(function (resolve) {
  		var src = addHttp(state$1.header_logo_src);

  		logo_img$1 = logo_img$1 || document.createElement("img");
  		logo_img$1.onload = onLoad;
  		logo_img$1.onerror = onError;
  		logo_img$1.oncancel = onError;
  		logo_img$1.src = src;

  		function onLoad() {
  			resolve();
  		}

  		function onError() {
  			if (typeof Flourish !== "undefined" && Flourish.warn) {
  				Flourish.warn("flourish-layout unable to load image: " + src);
  			}

  			resolve();
  		}
  	});
  }

  ///////////////////////////////////////////////////////////////////////////////
  /** @preserve
  /////    SAPC APCA - Advanced Perceptual Contrast Algorithm
  /////           Beta 0.1.9 W3 • contrast function only
  /////           DIST: W3 • Revision date: July 3, 2022
  /////    Function to parse color values and determine Lc contrast
  /////    Copyright © 2019-2022 by Andrew Somers. All Rights Reserved.
  /////    LICENSE: W3 LICENSE
  /////    CONTACT: Please use the ISSUES or DISCUSSIONS tab at:
  /////    https://github.com/Myndex/SAPC-APCA/
  /////
  ///////////////////////////////////////////////////////////////////////////////
  /////
  /////    MINIMAL IMPORTS:
  /////      import { APCAcontrast, sRGBtoY, displayP3toY,
  /////               calcAPCA, fontLookupAPCA } from 'apca-w3';
  /////      import { colorParsley } from 'colorparsley';
  /////
  /////    FORWARD CONTRAST USAGE:
  /////      Lc = APCAcontrast( sRGBtoY( TEXTcolor ) , sRGBtoY( BACKGNDcolor ) );
  /////    Where the colors are sent as an rgba array [255,255,255,1]
  /////
  /////    Retrieving an array of font sizes for the contrast:
  /////      fontArray = fontLookupAPCA(Lc);
  /////
  /////    Live Demonstrator at https://www.myndex.com/APCA/
  // */
  ///////////////////////////////////////////////////////////////////////////////

  // */ //// END LOCAL TESTING SWITCH


  /////  Module Scope Object Containing Constants  /////
  /////   APCA   0.0.98G - 4g - W3 Compatible Constants

  /////  𝒦 SA98G  ///////////////////////////////////
      const SA98G = {

          mainTRC: 2.4, // 2.4 exponent for emulating actual monitor perception

              // sRGB coefficients
          sRco: 0.2126729, 
          sGco: 0.7151522, 
          sBco: 0.0721750, 

                // G-4g constants for use with 2.4 exponent
          normBG: 0.56, 
          normTXT: 0.57,
          revTXT: 0.62,
          revBG: 0.65,

                // G-4g Clamps and Scalers
          blkThrs: 0.022,
          blkClmp: 1.414, 
          scaleBoW: 1.14,
          scaleWoB: 1.14,
          loBoWoffset: 0.027,
          loWoBoffset: 0.027,
          deltaYmin: 0.0005,
          loClip: 0.1};




  //////////////////////////////////////////////////////////////////////////////
  //////////  APCA CALCULATION FUNCTIONS \/////////////////////////////////////

  //////////  ƒ  APCAcontrast()  ////////////////////////////////////////////
  function APCAcontrast (txtY,bgY,places = -1) {
                   // send linear Y (luminance) for text and background.
                  // txtY and bgY must be between 0.0-1.0
                 // IMPORTANT: Do not swap, polarity is important.

    const icp = [0.0,1.1];     // input range clamp / input error check

    if(isNaN(txtY)||isNaN(bgY)||Math.min(txtY,bgY)<icp[0]||
                                Math.max(txtY,bgY)>icp[1]){
      return 0.0;  // return zero on error
      // return 'error'; // optional string return for error
    }
  //////////   SAPC LOCAL VARS   /////////////////////////////////////////

    let SAPC = 0.0;            // For raw SAPC values
    let outputContrast = 0.0; // For weighted final values
    let polCat = 'BoW';      // Alternate Polarity Indicator. N normal R reverse

    // TUTORIAL

    // Use Y for text and BG, and soft clamp black,
    // return 0 for very close luminances, determine
    // polarity, and calculate SAPC raw contrast
    // Then scale for easy to remember levels.

    // Note that reverse contrast (white text on black)
    // intentionally returns a negative number
    // Proper polarity is important!

  //////////   BLACK SOFT CLAMP   ////////////////////////////////////////

            // Soft clamps Y for either color if it is near black.
    txtY = (txtY > SA98G.blkThrs) ? txtY :
                           txtY + Math.pow(SA98G.blkThrs - txtY, SA98G.blkClmp);
    bgY = (bgY > SA98G.blkThrs) ? bgY :
                            bgY + Math.pow(SA98G.blkThrs - bgY, SA98G.blkClmp);

         ///// Return 0 Early for extremely low ∆Y
    if ( Math.abs(bgY - txtY) < SA98G.deltaYmin ) { return 0.0; }


  //////////   APCA/SAPC CONTRAST - LOW CLIP (W3 LICENSE)  ///////////////

    if ( bgY > txtY ) {  // For normal polarity, black text on white (BoW)

                // Calculate the SAPC contrast value and scale
      SAPC = ( Math.pow(bgY, SA98G.normBG) - 
               Math.pow(txtY, SA98G.normTXT) ) * SA98G.scaleBoW;

              // Low Contrast smooth rollout to prevent polarity reversal
             // and also a low-clip for very low contrasts
      outputContrast = (SAPC < SA98G.loClip) ? 0.0 : SAPC - SA98G.loBoWoffset;

    } else {  // For reverse polarity, light text on dark (WoB)
             // WoB should always return negative value.
      polCat = 'WoB';

      SAPC = ( Math.pow(bgY, SA98G.revBG) - 
               Math.pow(txtY, SA98G.revTXT) ) * SA98G.scaleWoB;

      outputContrast = (SAPC > -0.1) ? 0.0 : SAPC + SA98G.loWoBoffset;
    }

           // return Lc (lightness contrast) as a signed numeric value 
          // Round to the nearest whole number as string is optional.
         // Rounded can be a signed INT as output will be within ± 127 
        // places = -1 returns signed float, 1 or more set that many places
       // 0 returns rounded string, uses BoW or WoB instead of minus sign

    if(places < 0 ){  // Default (-1) number out, all others are strings
      return  outputContrast * 100.0;
    } else if(places == 0 ){
      return  Math.round(Math.abs(outputContrast)*100.0)+'<sub>'+polCat+'</sub>';
    } else if(Number.isInteger(places)){
      return  (outputContrast * 100.0).toFixed(places);
    } else { return 0.0 }

  } // End APCAcontrast()

  /////////\                                      ///////////////////////////\
  //////////\  END  fontLookupAPCA()  0.1.7 (G)  /////////////////////////////\
  /////////////////////////////////////////////////////////////////////////////\




  //////////////////////////////////////////////////////////////////////////////
  //////////  LUMINANCE CONVERTERS  |//////////////////////////////////////////


  //////////  ƒ  sRGBtoY()  //////////////////////////////////////////////////
  function sRGBtoY (rgb = [0,0,0]) { // send sRGB 8bpc (0xFFFFFF) or string

  // NOTE: Currently expects 0-255

  /////   APCA   0.0.98G - 4g - W3 Compatible Constants   ////////////////////
  /*
  const mainTRC = 2.4; // 2.4 exponent emulates actual monitor perception
      
  const sRco = 0.2126729, 
        sGco = 0.7151522, 
        sBco = 0.0721750; // sRGB coefficients
        */
  // Future:
  // 0.2126478133913640	0.7151791475336150	0.0721730390750208
  // Derived from:
  // xW	yW	K	xR	yR	xG	yG	xB	yB
  // 0.312720	0.329030	6504	0.640	0.330	0.300	0.600	0.150	0.060

           // linearize r, g, or b then apply coefficients
          // and sum then return the resulting luminance

    function simpleExp (chan) { return Math.pow(chan/255.0, SA98G.mainTRC); }
    return SA98G.sRco * simpleExp(rgb[0]) +
           SA98G.sGco * simpleExp(rgb[1]) +
           SA98G.sBco * simpleExp(rgb[2]);
           
  } // End sRGBtoY()




  //\                                     ////////////////////////////////////////
  ///\                                   ////////////////////////////////////////
  ////\                                 ////////////////////////////////////////
  /////\  END APCA 0.1.9  G-4g  BLOCK  ////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  function hexToColor(hex_string, opacity) {
  	if (typeof hex_string != "string") return false;
  	var c = color(hex_string);
  	c.opacity = 1;

  	return c;
  }

  function getAPCAContrast(text_hex, background_hex) {
  	if (!text_hex || !background_hex) {
  		console.warn("No valid color", text_hex, background_hex);
  		return;
  	}
  	const text_y = sRGBtoY(Object.values(hexToColor(text_hex)));
  	const background_y = sRGBtoY(Object.values(hexToColor(background_hex)));
  	return Math.abs(APCAcontrast(text_y, background_y));
  }

  function isPaleBackground(background_hex) {
  	if (!background_hex) {
  		console.warn("No valid color", background_hex);
  		return;
  	}

  	const black_contrast = getAPCAContrast("#000000", background_hex);
  	const white_contrast = getAPCAContrast("#ffffff", background_hex);
  	return white_contrast < black_contrast ? true : false;
  }

  const t0$1 = new Date, t1$1 = new Date;

  function timeInterval(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
    }

    interval.floor = (date) => {
      return floori(date = new Date(+date)), date;
    };

    interval.ceil = (date) => {
      return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
    };

    interval.round = (date) => {
      const d0 = interval(date), d1 = interval.ceil(date);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.offset = (date, step) => {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = (start, stop, step) => {
      const range = [];
      start = interval.ceil(start);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      let previous;
      do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
      while (previous < start && start < stop);
      return range;
    };

    interval.filter = (test) => {
      return timeInterval((date) => {
        if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
      }, (date, step) => {
        if (date >= date) {
          if (step < 0) while (++step <= 0) {
            while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
          } else while (--step >= 0) {
            while (offseti(date, 1), !test(date)) {} // eslint-disable-line no-empty
          }
        }
      });
    };

    if (count) {
      interval.count = (start, end) => {
        t0$1.setTime(+start), t1$1.setTime(+end);
        floori(t0$1), floori(t1$1);
        return Math.floor(count(t0$1, t1$1));
      };

      interval.every = (step) => {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? (d) => field(d) % step === 0
                : (d) => interval.count(0, d) % step === 0);
      };
    }

    return interval;
  }

  const durationSecond = 1000;
  const durationMinute$1 = durationSecond * 60;
  const durationHour = durationMinute$1 * 60;
  const durationDay$1 = durationHour * 24;
  const durationWeek$1 = durationDay$1 * 7;

  const timeDay = timeInterval(
    date => date.setHours(0, 0, 0, 0),
    (date, step) => date.setDate(date.getDate() + step),
    (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationDay$1,
    date => date.getDate() - 1
  );

  timeDay.range;

  const utcDay$1 = timeInterval((date) => {
    date.setUTCHours(0, 0, 0, 0);
  }, (date, step) => {
    date.setUTCDate(date.getUTCDate() + step);
  }, (start, end) => {
    return (end - start) / durationDay$1;
  }, (date) => {
    return date.getUTCDate() - 1;
  });

  utcDay$1.range;

  const unixDay = timeInterval((date) => {
    date.setUTCHours(0, 0, 0, 0);
  }, (date, step) => {
    date.setUTCDate(date.getUTCDate() + step);
  }, (start, end) => {
    return (end - start) / durationDay$1;
  }, (date) => {
    return Math.floor(date / durationDay$1);
  });

  unixDay.range;

  function timeWeekday(i) {
    return timeInterval((date) => {
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
      date.setHours(0, 0, 0, 0);
    }, (date, step) => {
      date.setDate(date.getDate() + step * 7);
    }, (start, end) => {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationWeek$1;
    });
  }

  const timeSunday = timeWeekday(0);
  const timeMonday = timeWeekday(1);
  const timeTuesday = timeWeekday(2);
  const timeWednesday = timeWeekday(3);
  const timeThursday = timeWeekday(4);
  const timeFriday = timeWeekday(5);
  const timeSaturday = timeWeekday(6);

  timeSunday.range;
  timeMonday.range;
  timeTuesday.range;
  timeWednesday.range;
  timeThursday.range;
  timeFriday.range;
  timeSaturday.range;

  function utcWeekday$1(i) {
    return timeInterval((date) => {
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
      date.setUTCHours(0, 0, 0, 0);
    }, (date, step) => {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, (start, end) => {
      return (end - start) / durationWeek$1;
    });
  }

  const utcSunday$1 = utcWeekday$1(0);
  const utcMonday$1 = utcWeekday$1(1);
  const utcTuesday$1 = utcWeekday$1(2);
  const utcWednesday$1 = utcWeekday$1(3);
  const utcThursday$1 = utcWeekday$1(4);
  const utcFriday$1 = utcWeekday$1(5);
  const utcSaturday$1 = utcWeekday$1(6);

  utcSunday$1.range;
  utcMonday$1.range;
  utcTuesday$1.range;
  utcWednesday$1.range;
  utcThursday$1.range;
  utcFriday$1.range;
  utcSaturday$1.range;

  const timeYear = timeInterval((date) => {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, (date, step) => {
    date.setFullYear(date.getFullYear() + step);
  }, (start, end) => {
    return end.getFullYear() - start.getFullYear();
  }, (date) => {
    return date.getFullYear();
  });

  // An optimized implementation for this simple case.
  timeYear.every = (k) => {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : timeInterval((date) => {
      date.setFullYear(Math.floor(date.getFullYear() / k) * k);
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, (date, step) => {
      date.setFullYear(date.getFullYear() + step * k);
    });
  };

  timeYear.range;

  const utcYear$1 = timeInterval((date) => {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, (date, step) => {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, (start, end) => {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, (date) => {
    return date.getUTCFullYear();
  });

  // An optimized implementation for this simple case.
  utcYear$1.every = (k) => {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : timeInterval((date) => {
      date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, (date, step) => {
      date.setUTCFullYear(date.getUTCFullYear() + step * k);
    });
  };

  utcYear$1.range;

  function localDate$1(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  function utcDate$1(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function newDate$1(y, m, d) {
    return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
  }

  function formatLocale$2(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodRe = formatRe$1(locale_periods),
        periodLookup = formatLookup$1(locale_periods),
        weekdayRe = formatRe$1(locale_weekdays),
        weekdayLookup = formatLookup$1(locale_weekdays),
        shortWeekdayRe = formatRe$1(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup$1(locale_shortWeekdays),
        monthRe = formatRe$1(locale_months),
        monthLookup = formatLookup$1(locale_months),
        shortMonthRe = formatRe$1(locale_shortMonths),
        shortMonthLookup = formatLookup$1(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth$1,
      "e": formatDayOfMonth$1,
      "f": formatMicroseconds$1,
      "g": formatYearISO$1,
      "G": formatFullYearISO$1,
      "H": formatHour24$1,
      "I": formatHour12$1,
      "j": formatDayOfYear$1,
      "L": formatMilliseconds$1,
      "m": formatMonthNumber$1,
      "M": formatMinutes$1,
      "p": formatPeriod,
      "q": formatQuarter,
      "Q": formatUnixTimestamp$1,
      "s": formatUnixTimestampSeconds$1,
      "S": formatSeconds$1,
      "u": formatWeekdayNumberMonday$1,
      "U": formatWeekNumberSunday$1,
      "V": formatWeekNumberISO$1,
      "w": formatWeekdayNumberSunday$1,
      "W": formatWeekNumberMonday$1,
      "x": null,
      "X": null,
      "y": formatYear$1,
      "Y": formatFullYear$1,
      "Z": formatZone$1,
      "%": formatLiteralPercent$1
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth$1,
      "e": formatUTCDayOfMonth$1,
      "f": formatUTCMicroseconds$1,
      "g": formatUTCYearISO$1,
      "G": formatUTCFullYearISO$1,
      "H": formatUTCHour24$1,
      "I": formatUTCHour12$1,
      "j": formatUTCDayOfYear$1,
      "L": formatUTCMilliseconds$1,
      "m": formatUTCMonthNumber$1,
      "M": formatUTCMinutes$1,
      "p": formatUTCPeriod,
      "q": formatUTCQuarter,
      "Q": formatUnixTimestamp$1,
      "s": formatUnixTimestampSeconds$1,
      "S": formatUTCSeconds$1,
      "u": formatUTCWeekdayNumberMonday$1,
      "U": formatUTCWeekNumberSunday$1,
      "V": formatUTCWeekNumberISO$1,
      "w": formatUTCWeekdayNumberSunday$1,
      "W": formatUTCWeekNumberMonday$1,
      "x": null,
      "X": null,
      "y": formatUTCYear$1,
      "Y": formatUTCFullYear$1,
      "Z": formatUTCZone$1,
      "%": formatLiteralPercent$1
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth$1,
      "e": parseDayOfMonth$1,
      "f": parseMicroseconds$1,
      "g": parseYear$1,
      "G": parseFullYear$1,
      "H": parseHour24$1,
      "I": parseHour24$1,
      "j": parseDayOfYear$1,
      "L": parseMilliseconds$1,
      "m": parseMonthNumber$1,
      "M": parseMinutes$1,
      "p": parsePeriod,
      "q": parseQuarter$1,
      "Q": parseUnixTimestamp$1,
      "s": parseUnixTimestampSeconds$1,
      "S": parseSeconds$1,
      "u": parseWeekdayNumberMonday$1,
      "U": parseWeekNumberSunday$1,
      "V": parseWeekNumberISO$1,
      "w": parseWeekdayNumberSunday$1,
      "W": parseWeekNumberMonday$1,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear$1,
      "Y": parseFullYear$1,
      "Z": parseZone$1,
      "%": parseLiteralPercent$1
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function(date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        if (!(date instanceof Date)) date = new Date(+date);

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads$1[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            else pad = c === "e" ? " " : "0";
            if (format = formats[c]) c = format(date, pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, Z) {
      return function(string) {
        var d = newDate$1(1900, undefined, 1),
            i = parseSpecifier(d, specifier, string += "", 0),
            week, day;
        if (i != string.length) return null;

        // If a UNIX timestamp is specified, return it.
        if ("Q" in d) return new Date(d.Q);
        if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

        // If this is utcParse, never use the local timezone.
        if (Z && !("Z" in d)) d.Z = 0;

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // If the month was not specified, inherit from the quarter.
        if (d.m === undefined) d.m = "q" in d ? d.q : 0;

        // Convert day-of-week and week-of-year to day-of-year.
        if ("V" in d) {
          if (d.V < 1 || d.V > 53) return null;
          if (!("w" in d)) d.w = 1;
          if ("Z" in d) {
            week = utcDate$1(newDate$1(d.y, 0, 1)), day = week.getUTCDay();
            week = day > 4 || day === 0 ? utcMonday$1.ceil(week) : utcMonday$1(week);
            week = utcDay$1.offset(week, (d.V - 1) * 7);
            d.y = week.getUTCFullYear();
            d.m = week.getUTCMonth();
            d.d = week.getUTCDate() + (d.w + 6) % 7;
          } else {
            week = localDate$1(newDate$1(d.y, 0, 1)), day = week.getDay();
            week = day > 4 || day === 0 ? timeMonday.ceil(week) : timeMonday(week);
            week = timeDay.offset(week, (d.V - 1) * 7);
            d.y = week.getFullYear();
            d.m = week.getMonth();
            d.d = week.getDate() + (d.w + 6) % 7;
          }
        } else if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
          day = "Z" in d ? utcDate$1(newDate$1(d.y, 0, 1)).getUTCDay() : localDate$1(newDate$1(d.y, 0, 1)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
        }

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate$1(d);
        }

        // Otherwise, all fields are in local time.
        return localDate$1(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads$1 ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parsePeriod(d, string, i) {
      var n = periodRe.exec(string.slice(i));
      return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatQuarter(d) {
      return 1 + ~~(d.getMonth() / 3);
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    function formatUTCQuarter(d) {
      return 1 + ~~(d.getUTCMonth() / 3);
    }

    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.toString = function() { return specifier; };
        return f;
      },
      parse: function(specifier) {
        var p = newParse(specifier += "", false);
        p.toString = function() { return specifier; };
        return p;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.toString = function() { return specifier; };
        return f;
      },
      utcParse: function(specifier) {
        var p = newParse(specifier += "", true);
        p.toString = function() { return specifier; };
        return p;
      }
    };
  }

  var pads$1 = {"-": "", "_": " ", "0": "0"},
      numberRe$1 = /^\s*\d+/, // note: ignores next directive
      percentRe$1 = /^%/,
      requoteRe$1 = /[\\^$*+?|[\]().{}]/g;

  function pad$1(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function requote$1(s) {
    return s.replace(requoteRe$1, "\\$&");
  }

  function formatRe$1(names) {
    return new RegExp("^(?:" + names.map(requote$1).join("|") + ")", "i");
  }

  function formatLookup$1(names) {
    return new Map(names.map((name, i) => [name.toLowerCase(), i]));
  }

  function parseWeekdayNumberSunday$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekdayNumberMonday$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 1));
    return n ? (d.u = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 2));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberISO$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 2));
    return n ? (d.V = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 2));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function parseYear$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseZone$1(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  }

  function parseQuarter$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 1));
    return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
  }

  function parseMonthNumber$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseMicroseconds$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i, i + 6));
    return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
  }

  function parseLiteralPercent$1(d, string, i) {
    var n = percentRe$1.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function parseUnixTimestamp$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i));
    return n ? (d.Q = +n[0], i + n[0].length) : -1;
  }

  function parseUnixTimestampSeconds$1(d, string, i) {
    var n = numberRe$1.exec(string.slice(i));
    return n ? (d.s = +n[0], i + n[0].length) : -1;
  }

  function formatDayOfMonth$1(d, p) {
    return pad$1(d.getDate(), p, 2);
  }

  function formatHour24$1(d, p) {
    return pad$1(d.getHours(), p, 2);
  }

  function formatHour12$1(d, p) {
    return pad$1(d.getHours() % 12 || 12, p, 2);
  }

  function formatDayOfYear$1(d, p) {
    return pad$1(1 + timeDay.count(timeYear(d), d), p, 3);
  }

  function formatMilliseconds$1(d, p) {
    return pad$1(d.getMilliseconds(), p, 3);
  }

  function formatMicroseconds$1(d, p) {
    return formatMilliseconds$1(d, p) + "000";
  }

  function formatMonthNumber$1(d, p) {
    return pad$1(d.getMonth() + 1, p, 2);
  }

  function formatMinutes$1(d, p) {
    return pad$1(d.getMinutes(), p, 2);
  }

  function formatSeconds$1(d, p) {
    return pad$1(d.getSeconds(), p, 2);
  }

  function formatWeekdayNumberMonday$1(d) {
    var day = d.getDay();
    return day === 0 ? 7 : day;
  }

  function formatWeekNumberSunday$1(d, p) {
    return pad$1(timeSunday.count(timeYear(d) - 1, d), p, 2);
  }

  function dISO$1(d) {
    var day = d.getDay();
    return (day >= 4 || day === 0) ? timeThursday(d) : timeThursday.ceil(d);
  }

  function formatWeekNumberISO$1(d, p) {
    d = dISO$1(d);
    return pad$1(timeThursday.count(timeYear(d), d) + (timeYear(d).getDay() === 4), p, 2);
  }

  function formatWeekdayNumberSunday$1(d) {
    return d.getDay();
  }

  function formatWeekNumberMonday$1(d, p) {
    return pad$1(timeMonday.count(timeYear(d) - 1, d), p, 2);
  }

  function formatYear$1(d, p) {
    return pad$1(d.getFullYear() % 100, p, 2);
  }

  function formatYearISO$1(d, p) {
    d = dISO$1(d);
    return pad$1(d.getFullYear() % 100, p, 2);
  }

  function formatFullYear$1(d, p) {
    return pad$1(d.getFullYear() % 10000, p, 4);
  }

  function formatFullYearISO$1(d, p) {
    var day = d.getDay();
    d = (day >= 4 || day === 0) ? timeThursday(d) : timeThursday.ceil(d);
    return pad$1(d.getFullYear() % 10000, p, 4);
  }

  function formatZone$1(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad$1(z / 60 | 0, "0", 2)
        + pad$1(z % 60, "0", 2);
  }

  function formatUTCDayOfMonth$1(d, p) {
    return pad$1(d.getUTCDate(), p, 2);
  }

  function formatUTCHour24$1(d, p) {
    return pad$1(d.getUTCHours(), p, 2);
  }

  function formatUTCHour12$1(d, p) {
    return pad$1(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCDayOfYear$1(d, p) {
    return pad$1(1 + utcDay$1.count(utcYear$1(d), d), p, 3);
  }

  function formatUTCMilliseconds$1(d, p) {
    return pad$1(d.getUTCMilliseconds(), p, 3);
  }

  function formatUTCMicroseconds$1(d, p) {
    return formatUTCMilliseconds$1(d, p) + "000";
  }

  function formatUTCMonthNumber$1(d, p) {
    return pad$1(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMinutes$1(d, p) {
    return pad$1(d.getUTCMinutes(), p, 2);
  }

  function formatUTCSeconds$1(d, p) {
    return pad$1(d.getUTCSeconds(), p, 2);
  }

  function formatUTCWeekdayNumberMonday$1(d) {
    var dow = d.getUTCDay();
    return dow === 0 ? 7 : dow;
  }

  function formatUTCWeekNumberSunday$1(d, p) {
    return pad$1(utcSunday$1.count(utcYear$1(d) - 1, d), p, 2);
  }

  function UTCdISO$1(d) {
    var day = d.getUTCDay();
    return (day >= 4 || day === 0) ? utcThursday$1(d) : utcThursday$1.ceil(d);
  }

  function formatUTCWeekNumberISO$1(d, p) {
    d = UTCdISO$1(d);
    return pad$1(utcThursday$1.count(utcYear$1(d), d) + (utcYear$1(d).getUTCDay() === 4), p, 2);
  }

  function formatUTCWeekdayNumberSunday$1(d) {
    return d.getUTCDay();
  }

  function formatUTCWeekNumberMonday$1(d, p) {
    return pad$1(utcMonday$1.count(utcYear$1(d) - 1, d), p, 2);
  }

  function formatUTCYear$1(d, p) {
    return pad$1(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCYearISO$1(d, p) {
    d = UTCdISO$1(d);
    return pad$1(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCFullYear$1(d, p) {
    return pad$1(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCFullYearISO$1(d, p) {
    var day = d.getUTCDay();
    d = (day >= 4 || day === 0) ? utcThursday$1(d) : utcThursday$1.ceil(d);
    return pad$1(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCZone$1() {
    return "+0000";
  }

  function formatLiteralPercent$1() {
    return "%";
  }

  function formatUnixTimestamp$1(d) {
    return +d;
  }

  function formatUnixTimestampSeconds$1(d) {
    return Math.floor(+d / 1000);
  }

  var locale$1;
  var timeFormat;

  defaultLocale$1({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  function defaultLocale$1(definition) {
    locale$1 = formatLocale$2(definition);
    timeFormat = locale$1.format;
    locale$1.parse;
    locale$1.utcFormat;
    locale$1.utcParse;
    return locale$1;
  }

  function parseTimeStamp(timestamp, format) {
  	let output = "n/a";
  	if (timestamp !== null) {
  		const formatTime = timeFormat(format);
  		output = formatTime(timestamp);
  	}
  	return output;
  }

  // DEFLATE is a complex format; to read this code, you should probably check the RFC first:
  // https://tools.ietf.org/html/rfc1951
  // You may also wish to take a look at the guide I made about this program:
  // https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
  // Some of the following code is similar to that of UZIP.js:
  // https://github.com/photopea/UZIP.js
  // However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
  // Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
  // is better for memory in most engines (I *think*).

  // aliases for shorter compressed code (most minifers don't do this)
  var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array;
  // fixed length extra bits
  var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
  // fixed distance extra bits
  var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
  // code length index map
  var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  // get base, reverse index map from extra bits
  var freb = function (eb, start) {
      var b = new u16(31);
      for (var i = 0; i < 31; ++i) {
          b[i] = start += 1 << eb[i - 1];
      }
      // numbers here are at max 18 bits
      var r = new i32(b[30]);
      for (var i = 1; i < 30; ++i) {
          for (var j = b[i]; j < b[i + 1]; ++j) {
              r[j] = ((j - b[i]) << 5) | i;
          }
      }
      return { b: b, r: r };
  };
  var _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
  // we can ignore the fact that the other numbers are wrong; they never happen anyway
  fl[28] = 258, revfl[258] = 28;
  var _b = freb(fdeb, 0), revfd = _b.r;
  // map of value to reverse (assuming 16 bits)
  var rev = new u16(32768);
  for (var i = 0; i < 32768; ++i) {
      // reverse table algorithm from SO
      var x = ((i & 0xAAAA) >> 1) | ((i & 0x5555) << 1);
      x = ((x & 0xCCCC) >> 2) | ((x & 0x3333) << 2);
      x = ((x & 0xF0F0) >> 4) | ((x & 0x0F0F) << 4);
      rev[i] = (((x & 0xFF00) >> 8) | ((x & 0x00FF) << 8)) >> 1;
  }
  // create huffman tree from u8 "map": index -> code length for code index
  // mb (max bits) must be at most 15
  // TODO: optimize/split up?
  var hMap = (function (cd, mb, r) {
      var s = cd.length;
      // index
      var i = 0;
      // u16 "map": index -> # of codes with bit length = index
      var l = new u16(mb);
      // length of cd must be 288 (total # of codes)
      for (; i < s; ++i) {
          if (cd[i])
              ++l[cd[i] - 1];
      }
      // u16 "map": index -> minimum code for bit length = index
      var le = new u16(mb);
      for (i = 1; i < mb; ++i) {
          le[i] = (le[i - 1] + l[i - 1]) << 1;
      }
      var co;
      if (r) {
          // u16 "map": index -> number of actual bits, symbol for code
          co = new u16(1 << mb);
          // bits to remove for reverser
          var rvb = 15 - mb;
          for (i = 0; i < s; ++i) {
              // ignore 0 lengths
              if (cd[i]) {
                  // num encoding both symbol and bits read
                  var sv = (i << 4) | cd[i];
                  // free bits
                  var r_1 = mb - cd[i];
                  // start value
                  var v = le[cd[i] - 1]++ << r_1;
                  // m is end value
                  for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                      // every 16 bit value starting with the code yields the same result
                      co[rev[v] >> rvb] = sv;
                  }
              }
          }
      }
      else {
          co = new u16(s);
          for (i = 0; i < s; ++i) {
              if (cd[i]) {
                  co[i] = rev[le[cd[i] - 1]++] >> (15 - cd[i]);
              }
          }
      }
      return co;
  });
  // fixed length tree
  var flt = new u8(288);
  for (var i = 0; i < 144; ++i)
      flt[i] = 8;
  for (var i = 144; i < 256; ++i)
      flt[i] = 9;
  for (var i = 256; i < 280; ++i)
      flt[i] = 7;
  for (var i = 280; i < 288; ++i)
      flt[i] = 8;
  // fixed distance tree
  var fdt = new u8(32);
  for (var i = 0; i < 32; ++i)
      fdt[i] = 5;
  // fixed length map
  var flm = /*#__PURE__*/ hMap(flt, 9, 0);
  // fixed distance map
  var fdm = /*#__PURE__*/ hMap(fdt, 5, 0);
  // get end of byte
  var shft = function (p) { return ((p + 7) / 8) | 0; };
  // typed array slice - allows garbage collector to free original reference,
  // while being more compatible than .slice
  var slc = function (v, s, e) {
      if (e == null || e > v.length)
          e = v.length;
      // can't use .constructor in case user-supplied
      return new u8(v.subarray(s, e));
  };
  // error codes
  var ec = [
      'unexpected EOF',
      'invalid block type',
      'invalid length/literal',
      'invalid distance',
      'stream finished',
      'no stream handler',
      ,
      'no callback',
      'invalid UTF-8 data',
      'extra field too long',
      'date not in range 1980-2099',
      'filename too long',
      'stream finishing',
      'invalid zip data'
      // determined by unknown compression method
  ];
  var err = function (ind, msg, nt) {
      var e = new Error(msg || ec[ind]);
      e.code = ind;
      if (Error.captureStackTrace)
          Error.captureStackTrace(e, err);
      if (!nt)
          throw e;
      return e;
  };
  // starting at p, write the minimum number of bits that can hold v to d
  var wbits = function (d, p, v) {
      v <<= p & 7;
      var o = (p / 8) | 0;
      d[o] |= v;
      d[o + 1] |= v >> 8;
  };
  // starting at p, write the minimum number of bits (>8) that can hold v to d
  var wbits16 = function (d, p, v) {
      v <<= p & 7;
      var o = (p / 8) | 0;
      d[o] |= v;
      d[o + 1] |= v >> 8;
      d[o + 2] |= v >> 16;
  };
  // creates code lengths from a frequency table
  var hTree = function (d, mb) {
      // Need extra info to make a tree
      var t = [];
      for (var i = 0; i < d.length; ++i) {
          if (d[i])
              t.push({ s: i, f: d[i] });
      }
      var s = t.length;
      var t2 = t.slice();
      if (!s)
          return { t: et, l: 0 };
      if (s == 1) {
          var v = new u8(t[0].s + 1);
          v[t[0].s] = 1;
          return { t: v, l: 1 };
      }
      t.sort(function (a, b) { return a.f - b.f; });
      // after i2 reaches last ind, will be stopped
      // freq must be greater than largest possible number of symbols
      t.push({ s: -1, f: 25001 });
      var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
      t[0] = { s: -1, f: l.f + r.f, l: l, r: r };
      // efficient algorithm from UZIP.js
      // i0 is lookbehind, i2 is lookahead - after processing two low-freq
      // symbols that combined have high freq, will start processing i2 (high-freq,
      // non-composite) symbols instead
      // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
      while (i1 != s - 1) {
          l = t[t[i0].f < t[i2].f ? i0++ : i2++];
          r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
          t[i1++] = { s: -1, f: l.f + r.f, l: l, r: r };
      }
      var maxSym = t2[0].s;
      for (var i = 1; i < s; ++i) {
          if (t2[i].s > maxSym)
              maxSym = t2[i].s;
      }
      // code lengths
      var tr = new u16(maxSym + 1);
      // max bits in tree
      var mbt = ln(t[i1 - 1], tr, 0);
      if (mbt > mb) {
          // more algorithms from UZIP.js
          // TODO: find out how this code works (debt)
          //  ind    debt
          var i = 0, dt = 0;
          //    left            cost
          var lft = mbt - mb, cst = 1 << lft;
          t2.sort(function (a, b) { return tr[b.s] - tr[a.s] || a.f - b.f; });
          for (; i < s; ++i) {
              var i2_1 = t2[i].s;
              if (tr[i2_1] > mb) {
                  dt += cst - (1 << (mbt - tr[i2_1]));
                  tr[i2_1] = mb;
              }
              else
                  break;
          }
          dt >>= lft;
          while (dt > 0) {
              var i2_2 = t2[i].s;
              if (tr[i2_2] < mb)
                  dt -= 1 << (mb - tr[i2_2]++ - 1);
              else
                  ++i;
          }
          for (; i >= 0 && dt; --i) {
              var i2_3 = t2[i].s;
              if (tr[i2_3] == mb) {
                  --tr[i2_3];
                  ++dt;
              }
          }
          mbt = mb;
      }
      return { t: new u8(tr), l: mbt };
  };
  // get the max length and assign length codes
  var ln = function (n, l, d) {
      return n.s == -1
          ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
          : (l[n.s] = d);
  };
  // length codes generation
  var lc = function (c) {
      var s = c.length;
      // Note that the semicolon was intentional
      while (s && !c[--s])
          ;
      var cl = new u16(++s);
      //  ind      num         streak
      var cli = 0, cln = c[0], cls = 1;
      var w = function (v) { cl[cli++] = v; };
      for (var i = 1; i <= s; ++i) {
          if (c[i] == cln && i != s)
              ++cls;
          else {
              if (!cln && cls > 2) {
                  for (; cls > 138; cls -= 138)
                      w(32754);
                  if (cls > 2) {
                      w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
                      cls = 0;
                  }
              }
              else if (cls > 3) {
                  w(cln), --cls;
                  for (; cls > 6; cls -= 6)
                      w(8304);
                  if (cls > 2)
                      w(((cls - 3) << 5) | 8208), cls = 0;
              }
              while (cls--)
                  w(cln);
              cls = 1;
              cln = c[i];
          }
      }
      return { c: cl.subarray(0, cli), n: s };
  };
  // calculate the length of output from tree, code lengths
  var clen = function (cf, cl) {
      var l = 0;
      for (var i = 0; i < cl.length; ++i)
          l += cf[i] * cl[i];
      return l;
  };
  // writes a fixed block
  // returns the new bit pos
  var wfblk = function (out, pos, dat) {
      // no need to write 00 as type: TypedArray defaults to 0
      var s = dat.length;
      var o = shft(pos + 2);
      out[o] = s & 255;
      out[o + 1] = s >> 8;
      out[o + 2] = out[o] ^ 255;
      out[o + 3] = out[o + 1] ^ 255;
      for (var i = 0; i < s; ++i)
          out[o + i + 4] = dat[i];
      return (o + 4 + s) * 8;
  };
  // writes a block
  var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
      wbits(out, p++, final);
      ++lf[256];
      var _a = hTree(lf, 15), dlt = _a.t, mlb = _a.l;
      var _b = hTree(df, 15), ddt = _b.t, mdb = _b.l;
      var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
      var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
      var lcfreq = new u16(19);
      for (var i = 0; i < lclt.length; ++i)
          ++lcfreq[lclt[i] & 31];
      for (var i = 0; i < lcdt.length; ++i)
          ++lcfreq[lcdt[i] & 31];
      var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
      var nlcc = 19;
      for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
          ;
      var flen = (bl + 5) << 3;
      var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
      var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
      if (bs >= 0 && flen <= ftlen && flen <= dtlen)
          return wfblk(out, p, dat.subarray(bs, bs + bl));
      var lm, ll, dm, dl;
      wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
      if (dtlen < ftlen) {
          lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
          var llm = hMap(lct, mlcb, 0);
          wbits(out, p, nlc - 257);
          wbits(out, p + 5, ndc - 1);
          wbits(out, p + 10, nlcc - 4);
          p += 14;
          for (var i = 0; i < nlcc; ++i)
              wbits(out, p + 3 * i, lct[clim[i]]);
          p += 3 * nlcc;
          var lcts = [lclt, lcdt];
          for (var it = 0; it < 2; ++it) {
              var clct = lcts[it];
              for (var i = 0; i < clct.length; ++i) {
                  var len = clct[i] & 31;
                  wbits(out, p, llm[len]), p += lct[len];
                  if (len > 15)
                      wbits(out, p, (clct[i] >> 5) & 127), p += clct[i] >> 12;
              }
          }
      }
      else {
          lm = flm, ll = flt, dm = fdm, dl = fdt;
      }
      for (var i = 0; i < li; ++i) {
          var sym = syms[i];
          if (sym > 255) {
              var len = (sym >> 18) & 31;
              wbits16(out, p, lm[len + 257]), p += ll[len + 257];
              if (len > 7)
                  wbits(out, p, (sym >> 23) & 31), p += fleb[len];
              var dst = sym & 31;
              wbits16(out, p, dm[dst]), p += dl[dst];
              if (dst > 3)
                  wbits16(out, p, (sym >> 5) & 8191), p += fdeb[dst];
          }
          else {
              wbits16(out, p, lm[sym]), p += ll[sym];
          }
      }
      wbits16(out, p, lm[256]);
      return p + ll[256];
  };
  // deflate options (nice << 13) | chain
  var deo = /*#__PURE__*/ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
  // empty
  var et = /*#__PURE__*/ new u8(0);
  // compresses data into a raw DEFLATE buffer
  var dflt = function (dat, lvl, plvl, pre, post, st) {
      var s = st.z || dat.length;
      var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post);
      // writing to this writes to the output buffer
      var w = o.subarray(pre, o.length - post);
      var lst = st.l;
      var pos = (st.r || 0) & 7;
      if (lvl) {
          if (pos)
              w[0] = st.r >> 3;
          var opt = deo[lvl - 1];
          var n = opt >> 13, c = opt & 8191;
          var msk_1 = (1 << plvl) - 1;
          //    prev 2-byte val map    curr 2-byte val map
          var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
          var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
          var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
          // 24576 is an arbitrary number of maximum symbols per block
          // 424 buffer for last block
          var syms = new i32(25000);
          // length/literal freq   distance freq
          var lf = new u16(288), df = new u16(32);
          //  l/lcnt  exbits  index          l/lind  waitdx          blkpos
          var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
          for (; i + 2 < s; ++i) {
              // hash value
              var hv = hsh(i);
              // index mod 32768    previous index mod
              var imod = i & 32767, pimod = head[hv];
              prev[imod] = pimod;
              head[hv] = imod;
              // We always should modify head and prev, but only add symbols if
              // this data is not yet processed ("wait" for wait index)
              if (wi <= i) {
                  // bytes remaining
                  var rem = s - i;
                  if ((lc_1 > 7000 || li > 24576) && (rem > 423 || !lst)) {
                      pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                      li = lc_1 = eb = 0, bs = i;
                      for (var j = 0; j < 286; ++j)
                          lf[j] = 0;
                      for (var j = 0; j < 30; ++j)
                          df[j] = 0;
                  }
                  //  len    dist   chain
                  var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
                  if (rem > 2 && hv == hsh(i - dif)) {
                      var maxn = Math.min(n, rem) - 1;
                      var maxd = Math.min(32767, i);
                      // max possible length
                      // not capped at dif because decompressors implement "rolling" index population
                      var ml = Math.min(258, rem);
                      while (dif <= maxd && --ch_1 && imod != pimod) {
                          if (dat[i + l] == dat[i + l - dif]) {
                              var nl = 0;
                              for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                                  ;
                              if (nl > l) {
                                  l = nl, d = dif;
                                  // break out early when we reach "nice" (we are satisfied enough)
                                  if (nl > maxn)
                                      break;
                                  // now, find the rarest 2-byte sequence within this
                                  // length of literals and search for that instead.
                                  // Much faster than just using the start
                                  var mmd = Math.min(dif, nl - 2);
                                  var md = 0;
                                  for (var j = 0; j < mmd; ++j) {
                                      var ti = i - dif + j & 32767;
                                      var pti = prev[ti];
                                      var cd = ti - pti & 32767;
                                      if (cd > md)
                                          md = cd, pimod = ti;
                                  }
                              }
                          }
                          // check the previous match
                          imod = pimod, pimod = prev[imod];
                          dif += imod - pimod & 32767;
                      }
                  }
                  // d will be nonzero only when a match was found
                  if (d) {
                      // store both dist and len data in one int32
                      // Make sure this is recognized as a len/dist with 28th bit (2^28)
                      syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
                      var lin = revfl[l] & 31, din = revfd[d] & 31;
                      eb += fleb[lin] + fdeb[din];
                      ++lf[257 + lin];
                      ++df[din];
                      wi = i + l;
                      ++lc_1;
                  }
                  else {
                      syms[li++] = dat[i];
                      ++lf[dat[i]];
                  }
              }
          }
          for (i = Math.max(i, wi); i < s; ++i) {
              syms[li++] = dat[i];
              ++lf[dat[i]];
          }
          pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
          if (!lst) {
              st.r = (pos & 7) | w[(pos / 8) | 0] << 3;
              // shft(pos) now 1 less if pos & 7 != 0
              pos -= 7;
              st.h = head, st.p = prev, st.i = i, st.w = wi;
          }
      }
      else {
          for (var i = st.w || 0; i < s + lst; i += 65535) {
              // end
              var e = i + 65535;
              if (e >= s) {
                  // write final block
                  w[(pos / 8) | 0] = lst;
                  e = s;
              }
              pos = wfblk(w, pos + 1, dat.subarray(i, e));
          }
          st.i = s;
      }
      return slc(o, 0, pre + shft(pos) + post);
  };
  // CRC32 table
  var crct = /*#__PURE__*/ (function () {
      var t = new Int32Array(256);
      for (var i = 0; i < 256; ++i) {
          var c = i, k = 9;
          while (--k)
              c = ((c & 1) && -306674912) ^ (c >>> 1);
          t[i] = c;
      }
      return t;
  })();
  // CRC32
  var crc = function () {
      var c = -1;
      return {
          p: function (d) {
              // closures have awful performance
              var cr = c;
              for (var i = 0; i < d.length; ++i)
                  cr = crct[(cr & 255) ^ d[i]] ^ (cr >>> 8);
              c = cr;
          },
          d: function () { return ~c; }
      };
  };
  // deflate with opts
  var dopt = function (dat, opt, pre, post, st) {
      if (!st) {
          st = { l: 1 };
          if (opt.dictionary) {
              var dict = opt.dictionary.subarray(-32768);
              var newDat = new u8(dict.length + dat.length);
              newDat.set(dict);
              newDat.set(dat, dict.length);
              dat = newDat;
              st.w = dict.length;
          }
      }
      return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? (st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20) : (12 + opt.mem), pre, post, st);
  };
  // Walmart object spread
  var mrg = function (a, b) {
      var o = {};
      for (var k in a)
          o[k] = a[k];
      for (var k in b)
          o[k] = b[k];
      return o;
  };
  // write bytes
  var wbytes = function (d, b, v) {
      for (; v; ++b)
          d[b] = v, v >>>= 8;
  };
  /**
   * Compresses data with DEFLATE without any wrapper
   * @param data The data to compress
   * @param opts The compression options
   * @returns The deflated version of the data
   */
  function deflateSync(data, opts) {
      return dopt(data, opts || {}, 0, 0);
  }
  // flatten a directory structure
  var fltn = function (d, p, t, o) {
      for (var k in d) {
          var val = d[k], n = p + k, op = o;
          if (Array.isArray(val))
              op = mrg(o, val[1]), val = val[0];
          if (val instanceof u8)
              t[n] = [val, op];
          else {
              t[n += '/'] = [new u8(0), op];
              fltn(val, n, t, o);
          }
      }
  };
  // text encoder
  var te = typeof TextEncoder != 'undefined' && /*#__PURE__*/ new TextEncoder();
  // text decoder
  var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
  // text decoder stream
  var tds = 0;
  try {
      td.decode(et, { stream: true });
      tds = 1;
  }
  catch (e) { }
  /**
   * Converts a string into a Uint8Array for use with compression/decompression methods
   * @param str The string to encode
   * @param latin1 Whether or not to interpret the data as Latin-1. This should
   *               not need to be true unless decoding a binary string.
   * @returns The string encoded in UTF-8/Latin-1 binary
   */
  function strToU8(str, latin1) {
      var i; 
      if (te)
          return te.encode(str);
      var l = str.length;
      var ar = new u8(str.length + (str.length >> 1));
      var ai = 0;
      var w = function (v) { ar[ai++] = v; };
      for (var i = 0; i < l; ++i) {
          if (ai + 5 > ar.length) {
              var n = new u8(ai + 8 + ((l - i) << 1));
              n.set(ar);
              ar = n;
          }
          var c = str.charCodeAt(i);
          if (c < 128 || latin1)
              w(c);
          else if (c < 2048)
              w(192 | (c >> 6)), w(128 | (c & 63));
          else if (c > 55295 && c < 57344)
              c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
                  w(240 | (c >> 18)), w(128 | ((c >> 12) & 63)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
          else
              w(224 | (c >> 12)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
      }
      return slc(ar, 0, ai);
  }
  // extra field length
  var exfl = function (ex) {
      var le = 0;
      if (ex) {
          for (var k in ex) {
              var l = ex[k].length;
              if (l > 65535)
                  err(9);
              le += l + 4;
          }
      }
      return le;
  };
  // write zip header
  var wzh = function (d, b, f, fn, u, c, ce, co) {
      var fl = fn.length, ex = f.extra, col = co && co.length;
      var exl = exfl(ex);
      wbytes(d, b, ce != null ? 0x2014B50 : 0x4034B50), b += 4;
      if (ce != null)
          d[b++] = 20, d[b++] = f.os;
      d[b] = 20, b += 2; // spec compliance? what's that?
      d[b++] = (f.flag << 1) | (c < 0 && 8), d[b++] = u && 8;
      d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
      var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
      if (y < 0 || y > 119)
          err(10);
      wbytes(d, b, (y << 25) | ((dt.getMonth() + 1) << 21) | (dt.getDate() << 16) | (dt.getHours() << 11) | (dt.getMinutes() << 5) | (dt.getSeconds() >> 1)), b += 4;
      if (c != -1) {
          wbytes(d, b, f.crc);
          wbytes(d, b + 4, c < 0 ? -c - 2 : c);
          wbytes(d, b + 8, f.size);
      }
      wbytes(d, b + 12, fl);
      wbytes(d, b + 14, exl), b += 16;
      if (ce != null) {
          wbytes(d, b, col);
          wbytes(d, b + 6, f.attrs);
          wbytes(d, b + 10, ce), b += 14;
      }
      d.set(fn, b);
      b += fl;
      if (exl) {
          for (var k in ex) {
              var exf = ex[k], l = exf.length;
              wbytes(d, b, +k);
              wbytes(d, b + 2, l);
              d.set(exf, b + 4), b += 4 + l;
          }
      }
      if (col)
          d.set(co, b), b += col;
      return b;
  };
  // write zip footer (end of central directory)
  var wzf = function (o, b, c, d, e) {
      wbytes(o, b, 0x6054B50); // skip disk
      wbytes(o, b + 8, c);
      wbytes(o, b + 10, c);
      wbytes(o, b + 12, d);
      wbytes(o, b + 16, e);
  };
  /**
   * Synchronously creates a ZIP file. Prefer using `zip` for better performance
   * with more than one file.
   * @param data The directory structure for the ZIP archive
   * @param opts The main options, merged with per-file options
   * @returns The generated ZIP archive
   */
  function zipSync(data, opts) {
      if (!opts)
          opts = {};
      var r = {};
      var files = [];
      fltn(data, '', r, opts);
      var o = 0;
      var tot = 0;
      for (var fn in r) {
          var _a = r[fn], file = _a[0], p = _a[1];
          var compression = p.level == 0 ? 0 : 8;
          var f = strToU8(fn), s = f.length;
          var com = p.comment, m = com && strToU8(com), ms = m && m.length;
          var exl = exfl(p.extra);
          if (s > 65535)
              err(11);
          var d = compression ? deflateSync(file, p) : file, l = d.length;
          var c = crc();
          c.p(file);
          files.push(mrg(p, {
              size: file.length,
              crc: c.d(),
              c: d,
              f: f,
              m: m,
              u: s != fn.length || (m && (com.length != ms)),
              o: o,
              compression: compression
          }));
          o += 30 + s + exl + l;
          tot += 76 + 2 * (s + exl) + (ms || 0) + l;
      }
      var out = new u8(tot + 22), oe = o, cdl = tot - o;
      for (var i = 0; i < files.length; ++i) {
          var f = files[i];
          wzh(out, f.o, f, f.f, f.u, f.c.length);
          var badd = 30 + f.f.length + exfl(f.extra);
          out.set(f.c, f.o + badd);
          wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
      }
      wzf(out, o, files.length, cdl, oe);
      return out;
  }

  var t0 = new Date,
      t1 = new Date;

  function newInterval(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
    }

    interval.floor = function(date) {
      return floori(date = new Date(+date)), date;
    };

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
    };

    interval.round = function(date) {
      var d0 = interval(date),
          d1 = interval.ceil(date);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [], previous;
      start = interval.ceil(start);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
      while (previous < start && start < stop);
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        if (date >= date) {
          if (step < 0) while (++step <= 0) {
            while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
          } else while (--step >= 0) {
            while (offseti(date, 1), !test(date)) {} // eslint-disable-line no-empty
          }
        }
      });
    };

    if (count) {
      interval.count = function(start, end) {
        t0.setTime(+start), t1.setTime(+end);
        floori(t0), floori(t1);
        return Math.floor(count(t0, t1));
      };

      interval.every = function(step) {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? function(d) { return field(d) % step === 0; }
                : function(d) { return interval.count(0, d) % step === 0; });
      };
    }

    return interval;
  }

  var durationMinute = 6e4;
  var durationDay = 864e5;
  var durationWeek = 6048e5;

  var day = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
  }, function(date) {
    return date.getDate() - 1;
  });
  day.range;

  function weekday(i) {
    return newInterval(function(date) {
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  sunday.range;
  monday.range;
  tuesday.range;
  wednesday.range;
  thursday.range;
  friday.range;
  saturday.range;

  var year = newInterval(function(date) {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  }, function(date) {
    return date.getFullYear();
  });

  // An optimized implementation for this simple case.
  year.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setFullYear(Math.floor(date.getFullYear() / k) * k);
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step * k);
    });
  };
  year.range;

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / durationDay;
  }, function(date) {
    return date.getUTCDate() - 1;
  });
  utcDay.range;

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / durationWeek;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  utcSunday.range;
  utcMonday.range;
  utcTuesday.range;
  utcWednesday.range;
  utcThursday.range;
  utcFriday.range;
  utcSaturday.range;

  var utcYear = newInterval(function(date) {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, function(date) {
    return date.getUTCFullYear();
  });

  // An optimized implementation for this simple case.
  utcYear.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step * k);
    });
  };
  utcYear.range;

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function newDate(y, m, d) {
    return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
  }

  function formatLocale$1(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodRe = formatRe(locale_periods),
        periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "f": formatMicroseconds,
      "g": formatYearISO,
      "G": formatFullYearISO,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "q": formatQuarter,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatSeconds,
      "u": formatWeekdayNumberMonday,
      "U": formatWeekNumberSunday,
      "V": formatWeekNumberISO,
      "w": formatWeekdayNumberSunday,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "f": formatUTCMicroseconds,
      "g": formatUTCYearISO,
      "G": formatUTCFullYearISO,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "q": formatUTCQuarter,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatUTCSeconds,
      "u": formatUTCWeekdayNumberMonday,
      "U": formatUTCWeekNumberSunday,
      "V": formatUTCWeekNumberISO,
      "w": formatUTCWeekdayNumberSunday,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "f": parseMicroseconds,
      "g": parseYear,
      "G": parseFullYear,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "q": parseQuarter,
      "Q": parseUnixTimestamp,
      "s": parseUnixTimestampSeconds,
      "S": parseSeconds,
      "u": parseWeekdayNumberMonday,
      "U": parseWeekNumberSunday,
      "V": parseWeekNumberISO,
      "w": parseWeekdayNumberSunday,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function(date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        if (!(date instanceof Date)) date = new Date(+date);

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            else pad = c === "e" ? " " : "0";
            if (format = formats[c]) c = format(date, pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, Z) {
      return function(string) {
        var d = newDate(1900, undefined, 1),
            i = parseSpecifier(d, specifier, string += "", 0),
            week, day$1;
        if (i != string.length) return null;

        // If a UNIX timestamp is specified, return it.
        if ("Q" in d) return new Date(d.Q);
        if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

        // If this is utcParse, never use the local timezone.
        if (Z && !("Z" in d)) d.Z = 0;

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // If the month was not specified, inherit from the quarter.
        if (d.m === undefined) d.m = "q" in d ? d.q : 0;

        // Convert day-of-week and week-of-year to day-of-year.
        if ("V" in d) {
          if (d.V < 1 || d.V > 53) return null;
          if (!("w" in d)) d.w = 1;
          if ("Z" in d) {
            week = utcDate(newDate(d.y, 0, 1)), day$1 = week.getUTCDay();
            week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
            week = utcDay.offset(week, (d.V - 1) * 7);
            d.y = week.getUTCFullYear();
            d.m = week.getUTCMonth();
            d.d = week.getUTCDate() + (d.w + 6) % 7;
          } else {
            week = localDate(newDate(d.y, 0, 1)), day$1 = week.getDay();
            week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
            week = day.offset(week, (d.V - 1) * 7);
            d.y = week.getFullYear();
            d.m = week.getMonth();
            d.d = week.getDate() + (d.w + 6) % 7;
          }
        } else if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
          day$1 = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
        }

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }

        // Otherwise, all fields are in local time.
        return localDate(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parsePeriod(d, string, i) {
      var n = periodRe.exec(string.slice(i));
      return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatQuarter(d) {
      return 1 + ~~(d.getMonth() / 3);
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    function formatUTCQuarter(d) {
      return 1 + ~~(d.getUTCMonth() / 3);
    }

    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.toString = function() { return specifier; };
        return f;
      },
      parse: function(specifier) {
        var p = newParse(specifier += "", false);
        p.toString = function() { return specifier; };
        return p;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.toString = function() { return specifier; };
        return f;
      },
      utcParse: function(specifier) {
        var p = newParse(specifier += "", true);
        p.toString = function() { return specifier; };
        return p;
      }
    };
  }

  var pads = {"-": "", "_": " ", "0": "0"},
      numberRe = /^\s*\d+/, // note: ignores next directive
      percentRe = /^%/,
      requoteRe = /[\\^$*+?|[\]().{}]/g;

  function pad(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function formatLookup(names) {
    var map = {}, i = -1, n = names.length;
    while (++i < n) map[names[i].toLowerCase()] = i;
    return map;
  }

  function parseWeekdayNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekdayNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.u = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberISO(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.V = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseZone(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  }

  function parseQuarter(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
  }

  function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseMicroseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 6));
    return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
  }

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function parseUnixTimestamp(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.Q = +n[0], i + n[0].length) : -1;
  }

  function parseUnixTimestampSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.s = +n[0], i + n[0].length) : -1;
  }

  function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
  }

  function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
  }

  function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
  }

  function formatDayOfYear(d, p) {
    return pad(1 + day.count(year(d), d), p, 3);
  }

  function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
  }

  function formatMicroseconds(d, p) {
    return formatMilliseconds(d, p) + "000";
  }

  function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
  }

  function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
  }

  function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
  }

  function formatWeekdayNumberMonday(d) {
    var day = d.getDay();
    return day === 0 ? 7 : day;
  }

  function formatWeekNumberSunday(d, p) {
    return pad(sunday.count(year(d) - 1, d), p, 2);
  }

  function dISO(d) {
    var day = d.getDay();
    return (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
  }

  function formatWeekNumberISO(d, p) {
    d = dISO(d);
    return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
  }

  function formatWeekdayNumberSunday(d) {
    return d.getDay();
  }

  function formatWeekNumberMonday(d, p) {
    return pad(monday.count(year(d) - 1, d), p, 2);
  }

  function formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
  }

  function formatYearISO(d, p) {
    d = dISO(d);
    return pad(d.getFullYear() % 100, p, 2);
  }

  function formatFullYear(d, p) {
    return pad(d.getFullYear() % 10000, p, 4);
  }

  function formatFullYearISO(d, p) {
    var day = d.getDay();
    d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
    return pad(d.getFullYear() % 10000, p, 4);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad(z / 60 | 0, "0", 2)
        + pad(z % 60, "0", 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
  }

  function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCDayOfYear(d, p) {
    return pad(1 + utcDay.count(utcYear(d), d), p, 3);
  }

  function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
  }

  function formatUTCMicroseconds(d, p) {
    return formatUTCMilliseconds(d, p) + "000";
  }

  function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
  }

  function formatUTCWeekdayNumberMonday(d) {
    var dow = d.getUTCDay();
    return dow === 0 ? 7 : dow;
  }

  function formatUTCWeekNumberSunday(d, p) {
    return pad(utcSunday.count(utcYear(d) - 1, d), p, 2);
  }

  function UTCdISO(d) {
    var day = d.getUTCDay();
    return (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
  }

  function formatUTCWeekNumberISO(d, p) {
    d = UTCdISO(d);
    return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
  }

  function formatUTCWeekdayNumberSunday(d) {
    return d.getUTCDay();
  }

  function formatUTCWeekNumberMonday(d, p) {
    return pad(utcMonday.count(utcYear(d) - 1, d), p, 2);
  }

  function formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCYearISO(d, p) {
    d = UTCdISO(d);
    return pad(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCFullYearISO(d, p) {
    var day = d.getUTCDay();
    d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
    return pad(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCZone() {
    return "+0000";
  }

  function formatLiteralPercent() {
    return "%";
  }

  function formatUnixTimestamp(d) {
    return +d;
  }

  function formatUnixTimestampSeconds(d) {
    return Math.floor(+d / 1000);
  }

  var locale;
  var utcFormat;
  var utcParse;

  defaultLocale({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  function defaultLocale(definition) {
    locale = formatLocale$1(definition);
    locale.format;
    locale.parse;
    utcFormat = locale.utcFormat;
    utcParse = locale.utcParse;
    return locale;
  }

  function notAStringError(not_a_str) {
  	throw new TypeError(
  		"Expected a value of type string but got a value of type " +
  			typeof not_a_str,
  	);
  }

  function shield(func) {
  	return function (str) {
  		if (typeof str !== "string") notAStringError(str);
  		str = str.trim();
  		return str ? func(str) : null;
  	};
  }

  var EXAMPLE_DATETIME = new Date(1972, 3, 27, 19, 45, 5); // End of Apollo 16 mission

  var CUSTOM_FORMAT_REGEXES = {
  	// Regexes matching dates where the month would commonly be written with 4-letters
  	// e.g. Sept 21, june 09, July 7
  	"%b %d": [
  		{
  			regex: /^june\s(30|[12][0-9]|0?[1-9])$/i, // matches dates from June 0-30
  			toDate: function (str) {
  				return new Date(null, 5, str.split(/\s/)[1]);
  			},
  		},
  		{
  			regex: /^july\s(3[01]|[12][0-9]|0?[1-9])$/i, // matches dates from July 0-31
  			toDate: function (str) {
  				return new Date(null, 6, str.split(/\s/)[1]);
  			},
  		},
  		{
  			regex: /^sept\s(30|[12][0-9]|0?[1-9])$/i, // matches dates from September 0-30 using the 4-letter 'Sept' abbreviation
  			toDate: function (str) {
  				return new Date(null, 8, str.split(/\s/)[1]);
  			},
  		},
  	],
  	// Regexes matching dates where the month would commonly be written with 4-letters
  	// e.g. 21 Sept, 09 june, 7 July
  	"%d %b": [
  		{
  			regex: /^(0?[1-9]|[1-9][0-9])\sjune$/i, // matches dates from 0-99 June
  			toDate: function (str) {
  				return new Date(null, 5, str.split(/\s/)[0]);
  			},
  		},
  		{
  			regex: /^(0?[1-9]|[1-9][0-9])\sjuly$/i, // matches dates from 0-99 July
  			toDate: function (str) {
  				return new Date(null, 6, str.split(/\s/)[0]);
  			},
  		},
  		{
  			regex: /^(0?[1-9]|[1-9][0-9])\ssept$/i, // matches dates from 0-99 September using the 4-letter 'Sept' abbreviation
  			toDate: function (str) {
  				return new Date(null, 8, str.split(/\s/)[0]);
  			},
  		},
  	],
  };

  // Checks a string against datetime regexes for different strftime date formats so that
  // non-standard datetime strings can still be parsed as dates by d3-time-parse
  function customDatetimeParser(strftime_formats) {
  	return function (str) {
  		var parsed_datetime = null;
  		strftime_formats.forEach(function (strftime_format) {
  			var valid_datetime = str.match(strftime_format.regex);
  			if (valid_datetime) parsed_datetime = strftime_format.toDate(str);
  		});
  		return parsed_datetime;
  	};
  }

  function createDatetimeInterpretation(format_string, secondaryTest) {
  	var parser = utcParse(format_string);
  	var formatter = utcFormat(format_string);
  	var test;
  	if (typeof secondaryTest === "function") {
  		test = shield(function (str) {
  			return secondaryTest(str, parser(str) !== null);
  		});
  	} else {
  		test = shield(function (str) {
  			return parser(str) !== null;
  		});
  	}

  	return Object.freeze({
  		test: test,
  		parse: shield(function (str) {
  			return (
  				parser(str) ||
  				(CUSTOM_FORMAT_REGEXES[format_string]
  					? customDatetimeParser(CUSTOM_FORMAT_REGEXES[format_string])(str)
  					: null)
  			);
  		}),
  		format: function (dt) {
  			return formatter(dt);
  		},
  		type: "datetime",
  		description: format_string,
  		id: "datetime$" + format_string,
  		example: formatter(EXAMPLE_DATETIME),
  	});
  }

  var datetime_interpretations = Object.freeze([
  	createDatetimeInterpretation("%Y-%m-%dT%H:%M:%S.%LZ"), // 1972-04-27T10:10:10.303Z
  	createDatetimeInterpretation("%Y-%m-%d %H:%M:%S"), // 1972-04-27 07:45:05
  	createDatetimeInterpretation("%Y-%m-%dT%H:%M:%S"), // 1972-04-27T07:45:05
  	createDatetimeInterpretation("%Y-%m-%dT%H:%M:%SZ"), // 1972-04-27T10:10:10Z

  	createDatetimeInterpretation("%d/%m/%Y", function (str, passed_primary_test) {
  		// 27/04/1972
  		if (!passed_primary_test) return false;
  		var arr = str.split("/").map(parseFloat);
  		return (
  			arr[0] > 0 && arr[0] <= 31 && arr[1] > 0 && arr[1] <= 12 && arr[2] >= 1000
  		);
  	}),
  	createDatetimeInterpretation(
  		"%d/%m/%Y %H:%M",
  		function (str, passed_primary_test) {
  			// 27/04/1972 19:45
  			if (!passed_primary_test) return false;
  			var arr = str.split(/[/ :]/).map(parseFloat);
  			return (
  				arr[0] > 0 &&
  				arr[0] <= 31 &&
  				arr[1] > 0 &&
  				arr[1] <= 12 &&
  				arr[2] >= 1000 &&
  				arr[3] >= 0 &&
  				arr[3] < 24 &&
  				arr[4] >= 0 &&
  				arr[4] < 60
  			);
  		},
  	),
  	createDatetimeInterpretation("%d/%m/%y", function (str, passed_primary_test) {
  		// 27/04/72
  		if (!passed_primary_test) return false;
  		var arr = str.split("/").map(parseFloat);
  		return (
  			arr[0] > 0 && arr[0] <= 31 && arr[1] > 0 && arr[1] <= 12 && !isNaN(arr[2])
  		);
  	}),
  	createDatetimeInterpretation("%m/%d/%Y", function (str, passed_primary_test) {
  		// 04/27/1972
  		if (!passed_primary_test) return false;
  		var arr = str.split("/").map(parseFloat);
  		return (
  			arr[0] > 0 && arr[0] <= 12 && arr[1] > 0 && arr[1] <= 31 && arr[2] >= 1000
  		);
  	}),
  	createDatetimeInterpretation(
  		"%m/%d/%Y %H:%M",
  		function (str, passed_primary_test) {
  			// 04/27/1972 19:45
  			if (!passed_primary_test) return false;
  			var arr = str.split(/[/ :]/).map(parseFloat);
  			return (
  				arr[0] > 0 &&
  				arr[0] <= 12 &&
  				arr[1] > 0 &&
  				arr[1] <= 31 &&
  				arr[2] >= 1000 &&
  				arr[3] >= 0 &&
  				arr[3] < 24 &&
  				arr[4] >= 0 &&
  				arr[4] < 60
  			);
  		},
  	),
  	createDatetimeInterpretation("%m/%d/%y", function (str, passed_primary_test) {
  		// 04/27/72
  		if (!passed_primary_test) return false;
  		var arr = str.split("/").map(parseFloat);
  		return (
  			arr[0] > 0 && arr[0] <= 12 && arr[1] > 0 && arr[1] <= 31 && !isNaN(arr[2])
  		);
  	}),
  	createDatetimeInterpretation("%Y/%m/%d", function (str, passed_primary_test) {
  		// 1972/04/27
  		if (!passed_primary_test) return false;
  		var arr = str.split("/").map(parseFloat);
  		return (
  			arr[0] >= 1000 && arr[1] > 0 && arr[1] <= 12 && arr[2] > 0 && arr[2] <= 31
  		);
  	}),

  	createDatetimeInterpretation("%d-%m-%Y", function (str, passed_primary_test) {
  		// 27-04-1972
  		if (!passed_primary_test) return false;
  		var arr = str.split("-").map(parseFloat);
  		return (
  			arr[0] > 0 && arr[0] <= 31 && arr[1] > 0 && arr[1] <= 12 && arr[2] >= 1000
  		);
  	}),
  	createDatetimeInterpretation("%d-%m-%y", function (str, passed_primary_test) {
  		// 27-04-72
  		if (!passed_primary_test) return false;
  		var arr = str.split("-").map(parseFloat);
  		return (
  			arr[0] > 0 && arr[0] <= 31 && arr[1] > 0 && arr[1] <= 12 && !isNaN(arr[2])
  		);
  	}),

  	createDatetimeInterpretation("%d.%m.%Y", function (str, passed_primary_test) {
  		// 27.04.1972
  		if (!passed_primary_test) return false;

  		var arr = str.split(".").map(parseFloat);
  		return (
  			arr[0] > 0 && arr[0] <= 31 && arr[1] > 0 && arr[1] <= 12 && arr[2] >= 1000
  		);
  	}),

  	createDatetimeInterpretation("%m.%d.%y", function (str, passed_primary_test) {
  		// 04.27.72
  		if (!passed_primary_test) return false;

  		var arr = str.split(".").map(parseFloat);
  		return (
  			arr[0] > 0 && arr[0] <= 12 && arr[1] > 0 && arr[1] <= 31 && !isNaN(arr[2])
  		);
  	}),

  	createDatetimeInterpretation("%m-%d-%Y", function (str, passed_primary_test) {
  		// 04-27-1972
  		if (!passed_primary_test) return false;
  		var arr = str.split("-").map(parseFloat);
  		return (
  			arr[0] > 0 && arr[0] <= 12 && arr[1] > 0 && arr[1] <= 31 && arr[2] >= 1000
  		);
  	}),
  	createDatetimeInterpretation("%m-%d-%y", function (str, passed_primary_test) {
  		// 04-27-72
  		if (!passed_primary_test) return false;
  		var arr = str.split("-").map(parseFloat);
  		return (
  			arr[0] > 0 && arr[0] <= 12 && arr[1] > 0 && arr[1] <= 31 && !isNaN(arr[2])
  		);
  	}),
  	createDatetimeInterpretation("%Y-%m-%d", function (str, passed_primary_test) {
  		// 1972-04-27
  		if (!passed_primary_test) return false;
  		var arr = str.split("-").map(parseFloat);
  		return (
  			arr[0] >= 1000 && arr[1] > 0 && arr[1] <= 12 && arr[2] > 0 && arr[2] <= 31
  		);
  	}),
  	createDatetimeInterpretation("%Y-%m", function (str, passed_primary_test) {
  		// 1972-04
  		if (!passed_primary_test) return false;
  		var arr = str.split("-").map(parseFloat);
  		return arr[0] >= 1000 && arr[1] > 0 && arr[1] <= 12;
  	}),

  	createDatetimeInterpretation("%d %b %Y", function (str, passed_primary_test) {
  		// 27 Apr 1972
  		if (!passed_primary_test) return false;
  		var arr = str.split(" ").map(parseFloat);
  		return arr[0] > 0 && arr[0] <= 31 && arr[2] >= 1000;
  	}),
  	createDatetimeInterpretation("%d %B %Y", function (str, passed_primary_test) {
  		// 27 April 1972
  		if (!passed_primary_test) return false;
  		var arr = str.split(" ").map(parseFloat);
  		return arr[0] > 0 && arr[0] <= 31 && arr[2] >= 1000;
  	}),
  	createDatetimeInterpretation("%d %b %y"), // 27 Apr 72
  	createDatetimeInterpretation("%-d %b ’%y"), // 27 Apr ’72
  	createDatetimeInterpretation("%d %B %y"), // 27 April 72
  	createDatetimeInterpretation("%d-%b-%Y", function (str, passed_primary_test) {
  		// 27-Apr-1972
  		if (!passed_primary_test) return false;
  		var arr = str.split("-").map(parseFloat);
  		return arr[0] > 0 && arr[0] <= 31 && arr[2] >= 1000;
  	}),
  	createDatetimeInterpretation("%d-%B-%Y", function (str, passed_primary_test) {
  		// 27-April-1972
  		if (!passed_primary_test) return false;
  		var arr = str.split("-").map(parseFloat);
  		return arr[0] > 0 && arr[0] <= 31 && arr[2] >= 1000;
  	}),
  	createDatetimeInterpretation("%d-%b-%y"), // 27-Apr-72
  	createDatetimeInterpretation("%d-%B-%y"), // 27-April-72

  	createDatetimeInterpretation("%m/%Y", function (str, passed_primary_test) {
  		// 04/1972
  		if (!passed_primary_test) return false;
  		var arr = str.split("/").map(parseFloat);
  		return arr[0] > 0 && arr[0] <= 12 && arr[1] >= 1000;
  	}),
  	createDatetimeInterpretation("%m/%y"), // 04/72
  	createDatetimeInterpretation("%b %Y", function (str, passed_primary_test) {
  		// Apr 1972
  		if (!passed_primary_test) return false;
  		var arr = str.split(" ").map(parseFloat);
  		return arr[1] >= 1000;
  	}),
  	createDatetimeInterpretation("%B %Y", function (str, passed_primary_test) {
  		// April 1972
  		if (!passed_primary_test) return false;
  		var arr = str.split(" ").map(parseFloat);
  		return arr[1] >= 1000;
  	}),
  	createDatetimeInterpretation("%b-%y"), // Apr-72
  	createDatetimeInterpretation("%b %y"), // Apr 72
  	createDatetimeInterpretation("%B %y"), // April 72
  	createDatetimeInterpretation("%b '%y"), // Apr '72
  	createDatetimeInterpretation("%b ’%y"), // Apr ’72
  	createDatetimeInterpretation("%B %-d %Y"), // April 27 1972

  	createDatetimeInterpretation("%d %b", function (str, passed_primary_test) {
  		if (passed_primary_test) return true;
  		return !!customDatetimeParser(CUSTOM_FORMAT_REGEXES["%d %b"])(str);
  	}),
  	createDatetimeInterpretation("%d %B"), // 27 April
  	createDatetimeInterpretation("%b %d", function (str, passed_primary_test) {
  		if (passed_primary_test) return true;
  		return !!customDatetimeParser(CUSTOM_FORMAT_REGEXES["%b %d"])(str);
  	}),
  	createDatetimeInterpretation("%B %d"), // April 27
  	createDatetimeInterpretation("%d-%m", function (str, passed_primary_test) {
  		// 27-04
  		if (!passed_primary_test) return false;
  		var arr = str.split("-").map(parseFloat);
  		return arr[0] > 0 && arr[0] <= 31 && arr[1] > 0 && arr[1] <= 12;
  	}),
  	createDatetimeInterpretation("%m-%d"), // 04-27
  	createDatetimeInterpretation("%d/%m"), // 27/04
  	createDatetimeInterpretation("%m/%d"), // 04/27
  	createDatetimeInterpretation("%b %d %Y"), // Apr 27 1972
  	createDatetimeInterpretation("%b %d %Y, %-I.%M%p"), // Apr 27 1972, 5.30PM

  	createDatetimeInterpretation("%B"), // April
  	createDatetimeInterpretation("%b"), // Apr

  	createDatetimeInterpretation("%X"), // 7:45:05 PM
  	createDatetimeInterpretation("%I:%M %p"), // 07:45 PM
  	createDatetimeInterpretation("%-I.%M%p"), // 7.45PM
  	createDatetimeInterpretation("%H:%M", function (str, passed_primary_test) {
  		// 19:45
  		if (!passed_primary_test) return false;
  		var arr = str.split(":").map(parseFloat);
  		return arr[0] >= 0 && arr[0] < 24;
  	}),
  	createDatetimeInterpretation("%H:%M:%S"), // 19:45:05
  	createDatetimeInterpretation("%M:%S"), // 45:05
  	createDatetimeInterpretation("%-I%p"), // 7PM

  	createDatetimeInterpretation("Q%q %Y", function (str, passed_primary_test) {
  		// Q2 1972
  		if (!passed_primary_test) return false;
  		return str.replace(/\s/g, "").length === 6;
  	}),
  	createDatetimeInterpretation("%Y Q%q", function (str, passed_primary_test) {
  		// 1972 Q2
  		if (!passed_primary_test) return false;
  		return str.replace(/\s/g, "").length === 6;
  	}),
  	createDatetimeInterpretation("%YM%m", function (str, passed_primary_test) {
  		// 1972M04
  		if (!passed_primary_test) return false;
  		var arr = str.split("M").map(parseFloat);
  		return arr[0] >= 1000 && arr[1] > 0 && arr[1] <= 12;
  	}),
  	createDatetimeInterpretation("%YQ%q", function (str, passed_primary_test) {
  		// 1972Q2
  		if (!passed_primary_test) return false;
  		var arr = str.split("Q").map(parseFloat);
  		return arr[0] >= 1000 && arr[1] > 0 && arr[1] <= 4;
  	}),
  	createDatetimeInterpretation("%YÁ%q", function (str, passed_primary_test) {
  		// 1972Á2
  		if (!passed_primary_test) return false;
  		var arr = str.split("Á").map(parseFloat);
  		return arr[0] >= 1000 && arr[1] > 0 && arr[1] <= 4;
  	}),
  ]);

  // Datetime format-only interpretations - formats that could be confused with numbers
  // These are available for explicit formatting but not for auto-detection
  var datetime_format_only = Object.freeze([
  	createDatetimeInterpretation("%Y", function (str, passed_primary_test) {
  		// 1972 - could be confused with a plain number
  		if (!passed_primary_test) return false;
  		var val = parseFloat(str);
  		return val > 1499 && val < 2200;
  	}),
  	createDatetimeInterpretation("%Y%m", function (str, passed_primary_test) {
  		// 197204 - could be confused with a 6-digit number
  		if (!passed_primary_test) return false;
  		var year = parseFloat(str.slice(0, 4));
  		var month = parseFloat(str.slice(4));
  		return year > 1000 && month > 0 && month <= 12;
  	}),
  ]);

  function formatDecimal(x) {
    return Math.abs(x = Math.round(x)) >= 1e21
        ? x.toLocaleString("en").replace(/,/g, "")
        : x.toString(10);
  }

  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimalParts(1.23) returns ["123", 0].
  function formatDecimalParts(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  function exponent(x) {
    return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
  }

  function formatGroup(grouping, thousands) {
    return function(value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  }

  function formatNumerals(numerals) {
    return function(value) {
      return value.replace(/[0-9]/g, function(i) {
        return numerals[+i];
      });
    };
  }

  // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
  var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

  function formatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
    var match;
    return new FormatSpecifier({
      fill: match[1],
      align: match[2],
      sign: match[3],
      symbol: match[4],
      zero: match[5],
      width: match[6],
      comma: match[7],
      precision: match[8] && match[8].slice(1),
      trim: match[9],
      type: match[10]
    });
  }

  formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

  function FormatSpecifier(specifier) {
    this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
    this.align = specifier.align === undefined ? ">" : specifier.align + "";
    this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
    this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
    this.zero = !!specifier.zero;
    this.width = specifier.width === undefined ? undefined : +specifier.width;
    this.comma = !!specifier.comma;
    this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
    this.trim = !!specifier.trim;
    this.type = specifier.type === undefined ? "" : specifier.type + "";
  }

  FormatSpecifier.prototype.toString = function() {
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width === undefined ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
        + (this.trim ? "~" : "")
        + this.type;
  };

  // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
  function formatTrim(s) {
    out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (s[i]) {
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
      }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
  }

  var prefixExponent;

  function formatPrefixAuto(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
  }

  function formatRounded(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  var formatTypes = {
    "%": function(x, p) { return (x * 100).toFixed(p); },
    "b": function(x) { return Math.round(x).toString(2); },
    "c": function(x) { return x + ""; },
    "d": formatDecimal,
    "e": function(x, p) { return x.toExponential(p); },
    "f": function(x, p) { return x.toFixed(p); },
    "g": function(x, p) { return x.toPrecision(p); },
    "o": function(x) { return Math.round(x).toString(8); },
    "p": function(x, p) { return formatRounded(x * 100, p); },
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
    "x": function(x) { return Math.round(x).toString(16); }
  };

  function identity$1(x) {
    return x;
  }

  var map = Array.prototype.map,
      prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

  function formatLocale(locale) {
    var group = locale.grouping === undefined || locale.thousands === undefined ? identity$1 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
        currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
        currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
        decimal = locale.decimal === undefined ? "." : locale.decimal + "",
        numerals = locale.numerals === undefined ? identity$1 : formatNumerals(map.call(locale.numerals, String)),
        percent = locale.percent === undefined ? "%" : locale.percent + "",
        minus = locale.minus === undefined ? "-" : locale.minus + "",
        nan = locale.nan === undefined ? "NaN" : locale.nan + "";

    function newFormat(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          trim = specifier.trim,
          type = specifier.type;

      // The "n" type is an alias for ",g".
      if (type === "n") comma = true, type = "g";

      // The "" type, and any invalid type, is an alias for ".12~g".
      else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

      // If zero fill is specified, padding goes after sign and before digits.
      if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision === undefined ? 6
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));

      function format(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix,
            i, n, c;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Determine the sign. -0 is not less than 0, but 1 / -0 is!
          var valueNegative = value < 0 || 1 / value < 0;

          // Perform the initial formatting.
          value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

          // Trim insignificant zeros.
          if (trim) value = formatTrim(value);

          // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
          if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            i = -1, n = value.length;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<": value = valuePrefix + value + valueSuffix + padding; break;
          case "=": value = valuePrefix + padding + value + valueSuffix; break;
          case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
          default: value = padding + valuePrefix + value + valueSuffix; break;
        }

        return numerals(value);
      }

      format.toString = function() {
        return specifier + "";
      };

      return format;
    }

    function formatPrefix(specifier, value) {
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: newFormat,
      formatPrefix: formatPrefix
    };
  }

  function getFormatFunction(interp) {
  	var decimal = interp.decimal_mark;
  	var thousands = interp.thousand_separator;
  	var locale = formatLocale({
  		decimal: decimal,
  		thousands: thousands,
  		grouping: [3],
  		currency: ["", ""],
  	});
  	var format, specifier;

  	return function (value, spec) {
  		if (value === null) return "";
  		if (!spec) spec = ",.2f";
  		if (spec !== specifier) {
  			specifier = spec;
  			format = locale.format(specifier);
  		}
  		return format(value);
  	};
  }

  // https://stackoverflow.com/a/16148273
  var comma_point = {
  	test: shield(function (str) {
  		return /^(\+|-)?\d{1,3}(,\d{3})*(\.\d+)?((e|E)(\+|-)?\d+)?$/.test(
  			str.trim(),
  		);
  	}),
  	parse: shield(function (str) {
  		return parseFloat(str.replace(/,/g, ""));
  	}),
  	description: "Comma thousand separator, point decimal mark",
  	thousand_separator: ",",
  	decimal_mark: ".",
  	id: "number$comma_point",
  	example: "12,235.56",
  };

  var space_point = {
  	test: shield(function (str) {
  		return /^(\+|-)?\d{1,3}(\s\d{3})*(\.\d+)?((e|E)(\+|-)?\d+)?$/.test(
  			str.trim(),
  		);
  	}),
  	parse: shield(function (str) {
  		return parseFloat(str.replace(/\s/g, ""));
  	}),
  	description: "Space thousand separator, point decimal mark",
  	thousand_separator: " ",
  	decimal_mark: ".",
  	id: "number$space_point",
  	example: "12 235.56",
  };

  var none_point = {
  	test: shield(function (str) {
  		return /^(\+|-)?\d+(\.\d+)?((e|E)(\+|-)?\d+)?$/.test(str.trim());
  	}),
  	parse: shield(function (str) {
  		return parseFloat(str);
  	}),
  	description: "No thousand separator, point decimal mark",
  	thousand_separator: "",
  	decimal_mark: ".",
  	id: "number$none_point",
  	example: "12235.56",
  };

  var point_comma = {
  	test: shield(function (str) {
  		return /^(\+|-)?\d{1,3}(\.\d{3})*(,\d+)?((e|E)(\+|-)?\d+)?$/.test(
  			str.trim(),
  		);
  	}),
  	parse: shield(function (str) {
  		return parseFloat(str.replace(/\./g, "").replace(/,/, "."));
  	}),
  	description: "Point thousand separator, comma decimal mark",
  	thousand_separator: ".",
  	decimal_mark: ",",
  	id: "number$point_comma",
  	example: "12.235,56",
  };

  var space_comma = {
  	test: shield(function (str) {
  		return /^(\+|-)?\d{1,3}(\s\d{3})*(,\d+)?((e|E)(\+|-)?\d+)?$/.test(
  			str.trim(),
  		);
  	}),
  	parse: shield(function (str) {
  		return parseFloat(str.replace(/\s/g, "").replace(/,/, "."));
  	}),
  	description: "Space thousand separator, comma decimal mark",
  	thousand_separator: " ",
  	decimal_mark: ",",
  	id: "number$space_comma",
  	example: "12 235,56",
  };

  var none_comma = {
  	test: shield(function (str) {
  		return /^(\+|-)?\d+(,\d+)?((e|E)(\+|-)?\d+)?$/.test(str.trim());
  	}),
  	parse: shield(function (str) {
  		return parseFloat(str.replace(/,/, "."));
  	}),
  	description: "No thousand separator, comma decimal mark",
  	thousand_separator: "",
  	decimal_mark: ",",
  	id: "number$none_comma",
  	example: "12235,56",
  };

  var number_interpretations = Object.freeze([
  	comma_point,
  	space_point,
  	point_comma,
  	space_comma,
  	none_point,
  	none_comma,
  ]);

  number_interpretations.forEach(function (interp) {
  	interp.type = "number";
  	interp.format = getFormatFunction(interp);
  	Object.freeze(interp);
  });

  var string_interpretation = Object.freeze({
  	test: function (str) {
  		return typeof str === "string" ? true : notAStringError(str);
  	},
  	parse: function (str) {
  		return typeof str === "string" ? str : notAStringError(str);
  	},
  	format: function (str) {
  		if (typeof str === "string") return str;
  	},
  	type: "string",
  	description: "Arbitrary string",
  	id: "string$arbitrary_string",
  });

  var INTERPRETATION_OPTIONS = Object.freeze({
  	datetime: datetime_interpretations,
  	number: number_interpretations,
  });

  var DEFAULT_INTERPRETATIONS_ARRAY = Object.freeze([
  	"datetime",
  	"number",
  	"string",
  ]);

  var DEFAULT_OPTIONS = Object.freeze({
  	n_max: 250,
  	n_failing_values: 0,
  	failure_fraction: 5 / 100,
  	sort: true,
  });

  var OPTION_KEYS = Object.freeze(Object.keys(DEFAULT_OPTIONS));

  function snakeToCamel(snake_string) {
  	return snake_string.replace(/_(\w)/g, function (match, capture) {
  		return capture.toUpperCase();
  	});
  }

  function noSort(a, b) {
  	return a.index - b.index;
  }
  function sortBySuccess(a, b) {
  	return b.n_success - a.n_success || noSort(a, b);
  }

  function trim(value) {
  	return ("" + value).trim();
  }

  function createAccessorFunction(accessor) {
  	if (accessor === undefined)
  		return function (value) {
  			return trim(value);
  		};
  	if (typeof accessor === "function")
  		return function (value, index) {
  			return trim(accessor(value, index));
  		};
  	return function (value) {
  		return trim(value["" + accessor]);
  	};
  }

  function createInterpreter(interpretations_array) {
  	if (!interpretations_array)
  		interpretations_array = DEFAULT_INTERPRETATIONS_ARRAY;
  	else if (!Array.isArray(interpretations_array))
  		interpretations_array = [interpretations_array];

  	var interpretations = interpretations_array.reduce(function (
  		arr,
  		interp_string,
  	) {
  		var interps = INTERPRETATION_OPTIONS[interp_string];
  		if (interps) Array.prototype.push.apply(arr, interps);
  		return arr;
  	}, []);

  	var include_string = interpretations_array.indexOf("string") !== -1;

  	var options = OPTION_KEYS.reduce(function (obj, key) {
  		obj[key] = DEFAULT_OPTIONS[key];
  		return obj;
  	}, {});

  	var interpreter = function (input_array, accessor) {
  		accessor = createAccessorFunction(accessor);
  		var data = input_array.map(accessor).filter(Boolean);
  		if (!data.length) return include_string ? [string_interpretation] : [];
  		var n = Math.min(options.n_max, data.length);
  		var n_max_failure = Math.floor(n * options.failure_fraction);
  		var n_failing_values = options.n_failing_values;
  		var sortMethod = options.sort ? sortBySuccess : noSort;

  		var valid_interpreters = interpretations
  			.slice()
  			.reduce(function (keep, interp, index) {
  				var n_fail = (i = 0);
  				var failing_values = [];
  				var complete_failure = false;

  				for (var i = 0; i < n; i++) {
  					var val = data[i];
  					var is_valid = interp.test(val);
  					if (is_valid) continue;
  					if (++n_fail > n_max_failure) complete_failure = true;
  					else if (failing_values.indexOf(val) === -1) {
  						failing_values.push(val);
  						if (failing_values.length > n_failing_values)
  							complete_failure = true;
  					}
  					if (complete_failure) break;
  				}

  				if (!complete_failure)
  					keep.push({ interp: interp, n_success: n - n_fail, index: index });

  				return keep;
  			}, [])
  			.sort(sortMethod)
  			.map(function (valid) {
  				return valid.interp;
  			});

  		if (include_string) valid_interpreters.push(string_interpretation);

  		return valid_interpreters;
  	};

  	OPTION_KEYS.forEach(function (option) {
  		interpreter[snakeToCamel(option)] = function (value) {
  			if (value === undefined) return options[option];
  			options[option] = value;
  			return interpreter;
  		};
  	});

  	return interpreter;
  }

  createInterpreter.DATETIME_IDS = Object.freeze(
  	datetime_interpretations.concat(datetime_format_only).map(function (d) {
  		return d.id;
  	}),
  );
  createInterpreter.NUMBER_IDS = Object.freeze(
  	number_interpretations.map(function (d) {
  		return d.id;
  	}),
  );
  createInterpreter.STRING_IDS = Object.freeze([string_interpretation.id]);
  createInterpreter.DATETIME_FORMAT_ONLY_IDS = Object.freeze(
  	datetime_format_only.map(function (d) {
  		return d.id;
  	}),
  );

  createInterpreter.getInterpretation = (function () {
  	var interpretations = datetime_interpretations.concat(
  		datetime_format_only,
  		number_interpretations,
  		string_interpretation,
  	);
  	var lookup = interpretations.reduce(function (l, d) {
  		l[d.id] = d;
  		return l;
  	}, {});
  	return function (id) {
  		return lookup[id];
  	};
  })();

  createInterpreter._createAccessorFunction = createAccessorFunction;

  createInterpreter.getInterpretation;

  function getFormatter(format_id) {
  	const interp = createInterpreter.getInterpretation(format_id);
  	if (!interp) throw new Error(`format_id ${format_id} not recognised`);
  	return function (...args) {
  		return interp.format(...args);
  	};
  }

  function addDataDownloadLink(input_string) {
  	const download_links = [
  		...document.querySelectorAll(".fl-data-download-button"),
  	];
  	const first_header_title = [
  		...document.querySelectorAll(
  			"#flourish-header-title, #flourish-header-subtitle, #flourish-header-text",
  		),
  	].find((header) => Boolean(header.textContent.trim()));

  	const link_id = `fl-data-download-button-${download_links.length}`;
  	const link_labeledby = first_header_title
  		? `aria-labelledby='${first_header_title.id} ${link_id}'`
  		: "";
  	let link_text = `Download data`;

  	if (input_string.includes(`"`)) {
  		const first_quote = input_string.indexOf('"');
  		const last_quote = input_string.lastIndexOf('"');
  		link_text = input_string.slice(first_quote + 1, last_quote);
  	}

  	return `<a id='${link_id}' ${link_labeledby} href='#' class='fl-data-download-button'>${link_text}</a>`;
  }

  function isUTCDate(date_string) {
  	const utcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  	return utcRegex.test(date_string);
  }

  function formatDates(format, input_date) {
  	let date = input_date;
  	if (isUTCDate(input_date)) date = new Date(input_date);
  	else if (typeof input_date === "string") {
  		const dateInterpretter = createInterpreter.getInterpretation(format);
  		date = dateInterpretter.parse(date);
  	}

  	const dateFormat = getFormatter(format);
  	return dateFormat(date);
  }

  function formatNumber(format, number) {
  	const parsed_number = parseFloat(number);
  	const decimal_places = (number.toString().split(".")[1] || "").length;
  	const format_with_dps = `,.${decimal_places}f`;

  	const numFormat = getFormatter(format);
  	let formatted = numFormat(number, format_with_dps);
  	// remove trailing 0s if original number doesn't have them
  	const separator_map = {
  		none: "",
  		comma: ",",
  		point: ".",
  		space: " ",
  	};
  	const decimal_separator = format.split("$")[1].split("_")[1];
  	if (Number.isInteger(parsed_number)) {
  		formatted = formatted.split(separator_map[decimal_separator])[0];
  	}
  	return formatted;
  }

  function formatColumnValue(str, data_type = null, type_id = null) {
  	let output = str;
  	if (data_type === "datetime" && Boolean(output)) {
  		output = formatDates(type_id, output);
  	}
  	if (data_type === "number" && Boolean(output)) {
  		output = formatNumber(type_id, output);
  	}
  	if (
  		String(output).includes(",") ||
  		String(output).includes('"') ||
  		String(output).includes("\r") ||
  		String(output).includes("\n")
  	) {
  		output = `"${String(output).replace(/"/g, '""')}"`;
  	}
  	return output;
  }

  function processDataset(dataset, headers, header_index_lookup) {
  	const rows = [];
  	dataset.forEach((data_row) => {
  		const row = [];
  		for (const key in data_row) {
  			const columns = data_row[key];
  			const header_index = header_index_lookup[key];
  			let data_type = dataset.metadata ? dataset.metadata[key]?.type : null;
  			let type_id = dataset.metadata ? dataset.metadata[key]?.type_id : null;

  			if (Array.isArray(columns)) {
  				columns.forEach((col_value, i) => {
  					data_type = dataset.metadata[key][i]?.type;
  					type_id = dataset.metadata[key][i]?.type_id;
  					row[header_index[i]] = formatColumnValue(
  						col_value,
  						data_type,
  						type_id,
  					);
  				});
  			} else {
  				row[header_index] = formatColumnValue(columns, data_type, type_id);
  			}
  		}
  		rows.push(row);
  	});

  	const csv_string = [headers.join(",")]
  		.concat(rows.map((row) => row.join(",")))
  		.join("\n");
  	return csv_string;
  }

  function generateHeaderIndexLookup(dataset) {
  	const headers = [];
  	const header_index_lookup = {};

  	for (const binding in dataset.column_names) {
  		// remove any column names that are undefined or null
  		if (!dataset.column_names[binding]) continue;

  		const column_names = Array.isArray(dataset.column_names[binding])
  			? dataset.column_names[binding]
  			: [dataset.column_names[binding]];

  		column_names.forEach((column_name) => {
  			let formatColumn = formatColumnValue(column_name);
  			if (!headers.includes(formatColumn)) headers.push(formatColumn);
  		});

  		// Create lookup based on column name positions
  		if (Array.isArray(dataset.column_names[binding])) {
  			header_index_lookup[binding] = dataset.column_names[binding].map(
  				(col_name) => headers.indexOf(formatColumnValue(col_name)),
  			);
  		} else {
  			header_index_lookup[binding] = headers.indexOf(
  				formatColumnValue(dataset.column_names[binding]),
  			);
  		}
  	}
  	return { headers, header_index_lookup };
  }

  function filterData(datasets, dataset_key) {
  	const dataset = JSON.parse(JSON.stringify(datasets[dataset_key]));
  	dataset.column_names = datasets[dataset_key].column_names || {};
  	dataset.metadata = datasets[dataset_key].metadata || {};

  	dataset.forEach((row) => {
  		Object.keys(row).forEach((key) => {
  			if (!Object.keys(dataset.column_names).includes(key)) {
  				delete row[key];
  			}
  		});
  	});
  	return dataset;
  }

  function formatData(datasets) {
  	const dataset_keys = Object.keys(datasets);
  	let formatted_datasets = {};
  	const datasets_to_not_download = [
  		"lines",
  		"order",
  		"labels",
  		"colors",
  		"regions_geometry",
  		"geo_regions",
  	];
  	const datasets_to_download = dataset_keys.filter(
  		(dataset_key) =>
  			!datasets_to_not_download.includes(dataset_key) &&
  			datasets[dataset_key].length !== 0, // Don't download empty datasets
  	);

  	datasets_to_download.forEach((dataset_key) => {
  		const filtered_dataset = filterData(datasets, dataset_key);
  		formatted_datasets[dataset_key] = filtered_dataset;
  	});
  	return { formatted_datasets, datasets_to_download };
  }

  function generateCSVString(formatted_datasets, dataset_key) {
  	const dataset = formatted_datasets[dataset_key];
  	const { headers, header_index_lookup } = generateHeaderIndexLookup(dataset);
  	const csv_string = processDataset(dataset, headers, header_index_lookup);
  	return csv_string;
  }

  function sanitizeFilename(filename) {
  	return (
  		filename
  			// Remove path traversal
  			.replace(/^\.+/, "")
  			// eslint-disable-next-line no-useless-escape
  			.replace(/[\/\\]/g, "_")
  			// Remove invalid characters
  			// eslint-disable-next-line no-control-regex
  			.replace(/[<>:"|?*\x00-\x1f]/g, "_")
  			// Handle Windows reserved names
  			.replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i, "_$1")
  			// Remove leading/trailing spaces and dots
  			.trim()
  			.replace(/[\s.]+$/, "")
  			// Limit length (preserve extension)
  			.slice(0, 255)
  	);
  }

  function generateCSVFilename(extension = "csv") {
  	const visualization_title = window.template?.metadata?.visualization_title;
  	const sanitized_title = sanitizeFilename(
  		visualization_title || "Untitled_Visualization",
  	);
  	const filename = `${sanitized_title}.${extension}`;

  	return filename;
  }

  async function getData() {
  	const zip_files = {};
  	const { formatted_datasets, datasets_to_download } = formatData(
  		window.template?.data,
  	);

  	// UTF-8 BOM (Byte Order Mark) to ensure Excel correctly interprets UTF-8 encoding
  	const utf8_bom = "\ufeff";

  	if (datasets_to_download.length === 1) {
  		// If there's only one dataset, we don't need to zip them
  		const dataset_name = datasets_to_download[0];
  		const file_name = generateCSVFilename("csv");
  		const csv_string = generateCSVString(formatted_datasets, dataset_name);
  		// Add BOM to CSV string before creating the blob
  		const blob = new Blob([utf8_bom + csv_string], { type: "text/csv" });
  		return { file_name, blob };
  	} else if (datasets_to_download.length > 1) {
  		datasets_to_download.forEach((dataset_key) => {
  			const csv_string = generateCSVString(formatted_datasets, dataset_key);
  			// Add BOM to each CSV string before converting to Uint8Array
  			zip_files[`${dataset_key}.csv`] = strToU8(utf8_bom + csv_string);
  		});

  		const file_name = generateCSVFilename("zip");
  		const zip_data = zipSync(zip_files);
  		const blob = new Blob([zip_data], { type: "application/zip" });
  		return { file_name, blob };
  	} else {
  		Flourish.warn("There is no data to download");
  		return null;
  	}
  }

  /*
  * FileSaver.js
  * A saveAs() FileSaver implementation.
  *
  * By Eli Grey, http://eligrey.com
  *
  * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
  * source  : http://purl.eligrey.com/github/FileSaver.js
  */

  // The one and only way of getting global scope in all environments
  // https://stackoverflow.com/q/3277182/1008999
  var _global = typeof window === 'object' && window.window === window
    ? window : typeof self === 'object' && self.self === self
    ? self : typeof global === 'object' && global.global === global
    ? global
    : undefined;

  function bom (blob, opts) {
    if (typeof opts === 'undefined') opts = { autoBom: false };
    else if (typeof opts !== 'object') {
      console.warn('Deprecated: Expected third argument to be a object');
      opts = { autoBom: !opts };
    }

    // prepend BOM for UTF-8 XML and text/* types (including HTML)
    // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
    if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type })
    }
    return blob
  }

  function download (url, name, opts) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      saveAs(xhr.response, name, opts);
    };
    xhr.onerror = function () {
      console.error('could not download file');
    };
    xhr.send();
  }

  function corsEnabled (url) {
    var xhr = new XMLHttpRequest();
    // use sync to avoid popup blocker
    xhr.open('HEAD', url, false);
    try {
      xhr.send();
    } catch (e) {}
    return xhr.status >= 200 && xhr.status <= 299
  }

  // `a.click()` doesn't work for all browsers (#465)
  function click (node) {
    try {
      node.dispatchEvent(new MouseEvent('click'));
    } catch (e) {
      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                            20, false, false, false, false, 0, null);
      node.dispatchEvent(evt);
    }
  }

  // Detect WebView inside a native macOS app by ruling out all browsers
  // We just need to check for 'Safari' because all other browsers (besides Firefox) include that too
  // https://www.whatismybrowser.com/guides/the-latest-user-agent/macos
  var isMacOSWebView = _global.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent);

  var saveAs = _global.saveAs || (
    // probably in some web worker
    (typeof window !== 'object' || window !== _global)
      ? function saveAs () { /* noop */ }

    // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView
    : ('download' in HTMLAnchorElement.prototype && !isMacOSWebView)
    ? function saveAs (blob, name, opts) {
      var URL = _global.URL || _global.webkitURL;
      var a = document.createElement('a');
      name = name || blob.name || 'download';

      a.download = name;
      a.rel = 'noopener'; // tabnabbing

      // TODO: detect chrome extensions & packaged apps
      // a.target = '_blank'

      if (typeof blob === 'string') {
        // Support regular links
        a.href = blob;
        if (a.origin !== location.origin) {
          corsEnabled(a.href)
            ? download(blob, name, opts)
            : click(a, a.target = '_blank');
        } else {
          click(a);
        }
      } else {
        // Support blobs
        a.href = URL.createObjectURL(blob);
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4E4); // 40s
        setTimeout(function () { click(a); }, 0);
      }
    }

    // Use msSaveOrOpenBlob as a second approach
    : 'msSaveOrOpenBlob' in navigator
    ? function saveAs (blob, name, opts) {
      name = name || blob.name || 'download';

      if (typeof blob === 'string') {
        if (corsEnabled(blob)) {
          download(blob, name, opts);
        } else {
          var a = document.createElement('a');
          a.href = blob;
          a.target = '_blank';
          setTimeout(function () { click(a); });
        }
      } else {
        navigator.msSaveOrOpenBlob(bom(blob, opts), name);
      }
    }

    // Fallback to using FileReader and a popup
    : function saveAs (blob, name, opts, popup) {
      // Open a popup immediately do go around popup blocker
      // Mostly only available on user interaction and the fileReader is async so...
      popup = popup || open('', '_blank');
      if (popup) {
        popup.document.title =
        popup.document.body.innerText = 'downloading...';
      }

      if (typeof blob === 'string') return download(blob, name, opts)

      var force = blob.type === 'application/octet-stream';
      var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari;
      var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

      if ((isChromeIOS || (force && isSafari) || isMacOSWebView) && typeof FileReader !== 'undefined') {
        // Safari doesn't allow downloading of blob URLs
        var reader = new FileReader();
        reader.onloadend = function () {
          var url = reader.result;
          url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;');
          if (popup) popup.location.href = url;
          else location = url;
          popup = null; // reverse-tabnabbing #460
        };
        reader.readAsDataURL(blob);
      } else {
        var URL = _global.URL || _global.webkitURL;
        var url = URL.createObjectURL(blob);
        if (popup) popup.location = url;
        else location.href = url;
        popup = null; // reverse-tabnabbing #460
        setTimeout(function () { URL.revokeObjectURL(url); }, 4E4); // 40s
      }
    }
  );

  _global.saveAs = saveAs.saveAs = saveAs;

  let footer_el, text_el, logo_el, logo_img, logo_link;
  let has_footer = false;

  function appendStyles() {
  	var css = document.createElement("style");
  	css.type = "text/css";
  	css.innerHTML =
  		".flourish-footer { margin: 0; } .flourish-footer p { margin: 0; display: inline; } .flourish-footer p:empty { height: 0; } .flourish-footer a { color: inherit; }";
  	document.head.appendChild(css);
  }

  function updateFooterLogo() {
  	logo_el.innerHTML = "";

  	if (!hasFooterLogo()) {
  		return;
  	}

  	logo_img = logo_img || document.createElement("img");
  	logo_img.className = "flourish-footer-logo";
  	logo_img.src = addHttp(getFooterLogoSrc());
  	logo_img.alt = state$1.footer_logo_alt;

  	logo_img.style.height = state$1.footer_logo_height + "rem";
  	logo_img.style.marginRight =
  		state$1.footer_logo_order == "left" ? state$1.footer_logo_margin + "rem" : "";
  	logo_img.style.marginLeft =
  		state$1.footer_logo_order == "right" ? state$1.footer_logo_margin + "rem" : "";
  	logo_img.style.verticalAlign = state$1.footer_align_vertical;
  	logo_img.style.display = hasFooterLogo() ? "" : "none";

  	if (state$1.footer_logo_link_url) {
  		logo_link = document.createElement("a");
  		logo_link.target = "_blank";

  		logo_link.appendChild(logo_img);
  		logo_el.appendChild(logo_link);
  		logo_img.style.cursor = "pointer";

  		logo_link.href = addHttp(state$1.footer_logo_link_url);
  	} else {
  		logo_el.appendChild(logo_img);
  	}
  }

  function init$2() {
  	appendStyles();

  	footer_el = document.createElement("footer");
  	footer_el.className = "flourish-footer";

  	text_el = document.createElement("div");
  	text_el.className = "flourish-footer-text";
  	text_el.setAttribute("id", "flourish-footer-text");

  	logo_el = document.createElement("div");
  	logo_el.className = "flourish-footer-logo-container";

  	footer_el.appendChild(text_el);
  	footer_el.appendChild(logo_el);

  	return footer_el;
  }

  function darkBackground() {
  	return (
  		state$1.background_color_enabled && !isPaleBackground(state$1.background_color)
  	);
  }

  function getFooterLogoSrc() {
  	var src = state$1.footer_logo_src ? state$1.footer_logo_src : "";

  	if (state$1.footer_logo_src_light && darkBackground()) {
  		src = state$1.footer_logo_src_light;
  	}

  	return src;
  }

  function hasFooterLogo() {
  	return state$1.footer_logo_enabled && getFooterLogoSrc();
  }

  function update$2() {
  	var sources = [
  		{ name: state$1.source_name, url: state$1.source_url },
  		{
  			name: state$1.multiple_sources ? state$1.source_name_2 : "",
  			url: state$1.multiple_sources ? state$1.source_url_2 : "",
  		},
  		{
  			name: state$1.multiple_sources ? state$1.source_name_3 : "",
  			url: state$1.multiple_sources ? state$1.source_url_3 : "",
  		},
  	].filter(function (source) {
  		return source.name || source.url;
  	});

  	has_footer =
  		sources.length > 0 ||
  		state$1.footer_note ||
  		state$1.footer_note_secondary ||
  		hasFooterLogo();

  	var top_border =
  		state$1.footer_border == "top" || state$1.footer_border == "top_and_bottom";
  	var bottom_border =
  		state$1.footer_border == "bottom" || state$1.footer_border == "top_and_bottom";

  	footer_el.style.display = "flex";
  	footer_el.style.height = has_footer ? null : 0;
  	footer_el.style.width = "100%";
  	footer_el.style.paddingTop = top_border
  		? state$1.footer_border_space + "rem"
  		: "";
  	footer_el.style.paddingBottom = bottom_border
  		? state$1.footer_border_space + "rem"
  		: "";
  	footer_el.style.borderTop = top_border
  		? state$1.footer_border_width +
  			"px " +
  			state$1.footer_border_style +
  			" " +
  			state$1.footer_border_color
  		: "";
  	footer_el.style.borderBottom = bottom_border
  		? state$1.footer_border_width +
  			"px " +
  			state$1.footer_border_style +
  			" " +
  			state$1.footer_border_color
  		: "";
  	footer_el.style.fontFamily = state$1.footer_font
  		? state$1.footer_font.name
  		: "inherit"; // Check for inherit, then font name
  	footer_el.style.fontWeight = state$1.footer_text_weight;

  	footer_el.style.justifyContent = getJustifyContent(state$1.footer_align);

  	footer_el.style.fontSize = state$1.footer_text_size + "rem";
  	footer_el.style.color = state$1.footer_text_color || state$1.font_color;
  	footer_el.style.alignItems = state$1.footer_align_vertical;

  	var source_container = document.createElement("span");
  	sources.forEach(function (source, i) {
  		var link_container = document.createElement("p");
  		if (i > 0) link_container.innerText = ", ";
  		if (source.url) {
  			var link_el = document.createElement("a");
  			link_el.innerText = source.name || source.url;
  			link_el.href = addHttp(source.url);
  			link_el.target = "_blank";
  			link_container.appendChild(link_el);
  		} else {
  			link_container.innerText += source.name || source.url;
  		}

  		source_container.innerHTML += link_container.innerHTML;
  	});

  	text_el.style.order = state$1.footer_logo_order == "left" ? 2 : "";
  	text_el.style.textAlign = getTextAlign(state$1.footer_align);

  	const text_el_source =
  		source_container.innerHTML !== ""
  			? `${state$1.source_label} ${source_container.innerHTML}`
  			: "";
  	const text_el_note = state$1.footer_note
  		? (source_container.innerHTML !== "" ? " • " : "") +
  			getFooterContent("primary")
  		: "";
  	const text_el_note_secondary = state$1.footer_note_secondary
  		? `<br /><p>${getFooterContent("secondary")}</p>`
  		: "";
  	text_el.innerHTML = `<p>${text_el_source}${text_el_note}</p>${text_el_note_secondary}`;

  	updateFooterLogo();
  	updateClickEvent();
  }

  function getFooterContent(note_type) {
  	const template =
  		note_type === "primary" ? state$1.footer_note : state$1.footer_note_secondary;

  	const content = template.replace(/{{([^}]+)}}/g, (e, input_string) => {
  		if (input_string === "data_last_updated") {
  			const timestamp = getTimeStamp(input_string);
  			return parseTimeStamp(timestamp, state$1.footer_timestamp_format);
  		} else if (input_string.includes("download_data")) {
  			const has_data = window.template.data
  				? window.template.data.length ||
  					Object.keys(window.template.data).length
  				: false;
  			if (!has_data) {
  				Flourish.warn("There is no data to download");
  				return "";
  			} else return addDataDownloadLink(input_string);
  		} else return "";
  	});

  	return content;
  }

  function getTimeStamp(timestamp_string) {
  	const timestamp_key =
  		timestamp_string === "data_last_updated"
  			? "last_updated"
  			: timestamp_string;
  	const datasets = Object.keys(window.template?.data);
  	if (datasets.length > 0) {
  		const all_timestamps = datasets
  			.map(
  				(dataset) =>
  					window.template.data[dataset].timestamps?.[timestamp_key] || null,
  			)
  			.filter((timestamp) => timestamp !== null);
  		if (all_timestamps.length === 0) return null;
  		const latest_timestamp = Math.max(...all_timestamps);
  		return latest_timestamp;
  	}
  	return null;
  }

  function updateClickEvent() {
  	const download_links = document.querySelectorAll(".fl-data-download-button");
  	download_links.forEach((download_link) => {
  		download_link.addEventListener("click", async (evt) => {
  			evt.preventDefault();
  			const { file_name, blob } = await getData();
  			try {
  				saveAs(blob, file_name);
  			} catch (error) {
  				console.error("An error occurred while saving the file:", error);
  			}
  		});
  	});
  }

  function preloadFooterLogo() {
  	if (!hasFooterLogo()) return;

  	return new Promise(function (resolve) {
  		var src = addHttp(getFooterLogoSrc());

  		logo_img = logo_img || document.createElement("img");
  		logo_img.onload = onLoad;
  		logo_img.onerror = onError;
  		logo_img.oncancel = onError;
  		logo_img.src = src;

  		function onLoad() {
  			resolve();
  		}

  		function onError() {
  			if (typeof Flourish !== "undefined" && Flourish.warn) {
  				Flourish.warn("flourish-layout unable to load image: " + src);
  			}

  			resolve();
  		}
  	});
  }

  function update$1() {
  	updateFontStyles();
  	update$3();
  	update$2();
  	updateBackground();

  	var wrapper_style = elements.wrapper.style;
  	wrapper_style.display = "flex";
  	wrapper_style.height = "100vh"; // reset to take up page height
  	wrapper_style.color = state$1.font_color;
  	wrapper_style.maxWidth =
  		state$1.max_width_target == "wrapper" ? state$1.max_width + "px" : "";
  	wrapper_style.marginLeft =
  		state$1.max_width_target == "wrapper" && state$1.max_width_align != "left"
  			? "auto"
  			: "";
  	wrapper_style.marginRight =
  		state$1.max_width_target == "wrapper" && state$1.max_width_align != "right"
  			? "auto"
  			: "";
  	wrapper_style.padding =
  		state$1.margin_top +
  		"rem " +
  		state$1.margin_right +
  		"rem " +
  		state$1.margin_bottom +
  		"rem " +
  		state$1.margin_left +
  		"rem";
  	wrapper_style.borderTop = state$1.border.enabled
  		? state$1.border.top.width +
  			"px " +
  			state$1.border.top.style +
  			" " +
  			state$1.border.top.color
  		: "";
  	wrapper_style.borderRight = state$1.border.enabled
  		? state$1.border.right.width +
  			"px " +
  			state$1.border.right.style +
  			" " +
  			state$1.border.right.color
  		: "";
  	wrapper_style.borderBottom = state$1.border.enabled
  		? state$1.border.bottom.width +
  			"px " +
  			state$1.border.bottom.style +
  			" " +
  			state$1.border.bottom.color
  		: "";
  	wrapper_style.borderLeft = state$1.border.enabled
  		? state$1.border.left.width +
  			"px " +
  			state$1.border.left.style +
  			" " +
  			state$1.border.left.color
  		: "";

  	var p_style = elements.primary.outer.style;
  	var l_style = elements.legend.outer.style;

  	var selected_layout = getLayoutOrder();
  	if (selected_layout.mode == "stack")
  		selected_layout.elements.forEach(function (el, i) {
  			elements[el].outer.style.order = 10 * i;
  		});
  	else {
  		for (var el in selected_layout.elements) {
  			for (var prop in selected_layout.elements[el]) {
  				var target = elements[el].outer || elements[el];
  				target.style[prop] = selected_layout.elements[el][prop];
  				target.style.order = "";
  			}
  		}
  	}

  	// Resetting the "display" style of each section, as it
  	// might've been previously hidden
  	elements.header.outer.style.display = "";
  	elements.footer.outer.style.display = "";
  	elements.controls.outer.style.display = "";
  	p_style.display = "flex";
  	l_style.display = "";

  	p_style.flex = "1 1 auto";
  	p_style.height = null;

  	elements.primary.outer.style.maxWidth =
  		state$1.max_width_target == "primary" ? state$1.max_width + "px" : "";
  	elements.primary.outer.style.marginLeft =
  		state$1.max_width_target == "primary" && state$1.max_width_align != "left"
  			? "auto"
  			: "";
  	elements.primary.outer.style.marginRight =
  		state$1.max_width_target == "primary" && state$1.max_width_align != "right"
  			? "auto"
  			: "";

  	var use_screenreader_text = state$1.screenreader_text_primary.trim() != "";
  	var description_node = document.getElementById(
  		"fl-layout-primary-description",
  	);
  	elements.primary.outer.setAttribute(
  		"aria-label",
  		"primary visualisation container",
  	);
  	description_node.innerText = state$1.screenreader_text_primary;
  	use_screenreader_text
  		? elements.primary.outer.setAttribute(
  				"aria-describedBy",
  				"fl-layout-primary-description",
  			)
  		: elements.primary.outer.removeAttribute("aria-describedBy");
  	state$1.screenreader_hide_primary
  		? elements.primary.inner.setAttribute("aria-hidden", true)
  		: elements.primary.inner.removeAttribute("aria-hidden");

  	state$1.screenreader_label.trim() != ""
  		? getWrapper().setAttribute("aria-label", state$1.screenreader_label)
  		: getWrapper().removeAttribute("aria-label");

  	SECTIONS.map(function (el) {
  		var containers = elements[el];
  		var style = containers.outer.style;
  		var inner = containers.inner;
  		return {
  			name: el,
  			height: getHeight(inner),
  			order: parseFloat(style.order),
  			style: style,
  		};
  	})
  		.sort(function (a, b) {
  			return a.order - b.order;
  		})
  		.filter(function (obj) {
  			if (obj.height || obj.name == "primary") return true;
  			// If a section has no height we remove the padding and set it to display: none
  			// This is to make sure that empty sections don't take up unnecessary space
  			// We exclude the primary container from this logic, as that container usually
  			// gets filled after layout.update() gets called and therefore don't want to
  			// hide if it's empty at this point
  			obj.style.paddingBottom = "";
  			obj.style.paddingTop = "";
  			obj.style.display = "none";
  		})
  		.forEach(function (obj, i, arr) {
  			obj.style.width = "100%";
  			obj.style.paddingTop = i ? getMargin$1("padding") : "";
  			obj.style.paddingBottom = i < arr.length - 1 ? getMargin$1("padding") : "";
  		});

  	elements.wrapper.style.gridColumnGap = getMargin$1("gap");
  	elements.wrapper.style.gridRowGap = getMargin$1("gap");

  	document.body.setAttribute("dir", state$1.read_direction);
  	elements.wrapper.setAttribute("dir", state$1.read_direction);
  	document.getElementById("fl-layout-wrapper-outer").setAttribute("dir", "ltr");
  }

  function getLayoutOrder() {
  	var is_mobile = window.innerWidth < state$1.breakpoint_mobile_big;
  	var is_grid = state$1.layout_order.indexOf("grid") > -1;
  	var layout = {
  		id: state$1.layout_order,
  		mode: is_grid ? "grid" : "stack",
  		elements: LAYOUTS[state$1.layout_order],
  	};
  	if (is_mobile && is_grid) {
  		(layout.id = "stack-default"),
  			(layout.mode = "stack"),
  			(layout.elements = LAYOUTS["stack-default"]);
  	}
  	return layout;
  }

  function getMargin$1(mode) {
  	var current_layout = getLayoutOrder();
  	var full_margin;
  	if (state$1.space_between_sections == "custom")
  		full_margin = state$1.space_between_sections_custom;
  	else full_margin = state$1.space_between_sections;

  	if (current_layout.mode == "grid")
  		return mode == "gap" ? full_margin + "rem" : "";
  	else return mode == "gap" ? "" : full_margin / 2 + "rem";
  }

  function updateBackground() {
  	document.body.style.backgroundColor = state$1.background_color_enabled
  		? state$1.background_color
  		: "transparent";
  	document.body.style.backgroundImage = state$1.background_image_enabled
  		? "url(" + state$1.background_image_src + ")"
  		: "";
  	document.body.style.backgroundSize = state$1.background_image_size;
  	document.body.style.backgroundRepeat = "no-repeat";
  	document.body.style.backgroundPosition = state$1.background_image_position;
  }

  var DEFAULTS = Object.freeze({
  	body_font: {
  		name: "Canva Sans Variable",
  		url: "https://public.flourish.studio/resources/fonts/canva-sans.css",
  	},
  	title_font: null,
  	subtitle_font: null,
  	footer_font: null,
  	read_direction: "ltr",

  	border: {
  		enabled: false,
  		top: {
  			width: 1,
  			color: "#dddddd",
  			style: "solid",
  		},
  		right: {
  			width: 1,
  			color: "#dddddd",
  			style: "solid",
  		},
  		bottom: {
  			width: 1,
  			color: "#dddddd",
  			style: "solid",
  		},
  		left: {
  			width: 1,
  			color: "#dddddd",
  			style: "solid",
  		},
  	},

  	layout_order: "stack-default",

  	margin_top: 0.75,
  	margin_right: 0.75,
  	margin_bottom: 0.75,
  	margin_left: 0.75,

  	space_between_sections: 1,
  	space_between_sections_custom: 1,

  	background_color_enabled: true,
  	background_color: "#ffffff",
  	background_image_enabled: false,
  	background_image_src: "",
  	background_image_size: "cover",
  	background_image_position: "center center",

  	max_width: 600,
  	max_width_target: "none",
  	max_width_align: "center",

  	breakpoint_mobile_small: 0,
  	breakpoint_mobile_big: 380,
  	breakpoint_tablet: 580,
  	breakpoint_desktop: 1080,
  	breakpoint_big_screen: 1280,

  	font_color: "#333333",
  	font_size_mobile_small: 62.5,
  	font_size_mobile_big: 75,
  	font_size_tablet: 87.5,
  	font_size_desktop: 100,
  	font_size_big_screen: 120,

  	// header
  	header_align: "left",
  	header_border: "none",
  	header_border_width: 1,
  	header_border_color: "#dddddd",
  	header_border_style: "solid",
  	header_border_space: 0.5,

  	header_logo_enabled: false,
  	header_logo_align: "inside",
  	header_logo_src: "",
  	header_logo_alt: "Header logo",
  	header_logo_link_url: "",
  	header_logo_height: 3,
  	header_logo_position_inside: "left",
  	header_logo_position_outside: "left",
  	header_logo_margin_top: 0.25,
  	header_logo_margin_right: 0.5,
  	header_logo_margin_bottom: 0,
  	header_logo_margin_left: 0,

  	title: "",
  	title_size: 2,
  	title_size_custom: 1.6,
  	title_line_height: 1.2,
  	title_color: null,
  	title_weight: "bold",
  	title_space_above: 0,
  	title_space_above_custom: 1.5,
  	title_styling: false,

  	subtitle: "",
  	subtitle_size: 1.4,
  	subtitle_size_custom: 1.6,
  	subtitle_line_height: 1.2,
  	subtitle_color: null,
  	subtitle_weight: "normal",
  	subtitle_space_above: 0.5,
  	subtitle_space_above_custom: 1.5,
  	subtitle_styling: false,

  	header_text: "",
  	header_text_size: 1.2,
  	header_text_size_custom: 1.2,
  	header_text_line_height: 1.2,
  	header_text_color: null,
  	header_text_weight: "normal",
  	header_text_space_above: 0.5,
  	header_text_space_above_custom: 1.5,

  	// footer
  	source_label: "Source: ",
  	source_name: "",
  	source_url: "",
  	source_name_2: "",
  	source_url_2: "",
  	source_name_3: "",
  	source_url_3: "",

  	footer_note: "",
  	footer_note_secondary: "",
  	footer_text_size: 1,
  	footer_text_color: null,
  	footer_styling: false,
  	footer_text_weight: "normal",

  	footer_align: "justify",
  	footer_align_vertical: "center",
  	footer_border: "none",
  	footer_border_width: 1,
  	footer_border_color: "#dddddd",
  	footer_border_style: "solid",
  	footer_border_space: 0.5,

  	footer_logo_enabled: false,
  	footer_logo_src: "",
  	footer_logo_src_light: "",
  	footer_logo_alt: "Footer logo",
  	footer_logo_link_url: "",
  	footer_logo_height: 1.5,
  	footer_logo_margin: 0.25,
  	footer_logo_order: "right",

  	footer_timestamp_format: "%H:%M:%S",

  	screenreader_hide_primary: true,
  	screenreader_text_primary: "",
  	screenreader_label: "",
  });

  function getDefaultHeight() {
  	if (Flourish.fixed_height) return window.innerHeight;
  	var width = window.innerWidth;
  	if (width > 999) return 650;
  	if (width > 599) return 575;
  	return 400;
  }

  var DEFAULT_OVERLAY_MESSAGE =
  	"Your web browser does not support the features used by this content. Consider updating to a modern browser.";

  function awaitFonts(callback, duration, font_weights) {
  	// Note: Font loading event behavior differs between browsers, network, server and cache conditions.
  	// As a result first load of live visualisations may trigger different font event(s) than loading from cache or local server.

  	// We allow multiple callbacks as browsers may trigger multiple or premature font events, especially Firefox discussed below.
  	// If loading stutter is visible, try adding a short delay e.g. 300ms before any intro animations on your template.

  	updateFontStyles(font_weights); // Gets fonts to start loading

  	callback = callback || window.template.update;
  	callback = alsoAddFontLoadedClass(callback);

  	// Start counting the specified max delay
  	var timeout = setTimeout(callback, isNaN(duration) ? 500 : duration);

  	var tasks = [];

  	if (document.fonts) tasks.push(document.fonts.ready);
  	if (hasFooterLogo()) tasks.push(preloadFooterLogo());
  	if (hasHeaderLogo()) tasks.push(preloadHeaderLogo());

  	// document.fonts.ready won't work on browsers that don't support the CSS Font
  	// Loading Module API, so if we have nothing to do we just return and let the
  	// callback fire via the timeout. This way the fonts have a chance of loading
  	// pre-render.
  	if (!tasks.length) return;

  	// If we have a footer logo but no way to detect fonts have finished loading,
  	// we still want to wait 500ms even after the logo has been loaded.
  	if (!document.fonts) {
  		tasks.push(
  			new Promise(function (resolve) {
  				setTimeout(resolve, 500);
  			}),
  		);
  	}

  	// Otherwise call the callback when fonts load if this happens
  	// before the timeout fires
  	Promise.all(tasks).then(function (events) {
  		if (document.fonts && events[0].size) {
  			clearTimeout(timeout);
  			callback();
  			removeFontSamples();
  		}

  		// Firefox especially may trigger multiple "loadingdone" events for the same font, sometimes prematurely.
  		// The final event is crucial for correct text measurement, but we can't identify which is final.
  		// Solution: Allow multiple font load callbacks instead of blocking or debouncing duplicates.
  		// This fixes Firefox text measurement issues and shouldn't affect other browsers.
  		document.fonts.addEventListener("loadingdone", function () {
  			clearTimeout(timeout);
  			callback();
  			removeFontSamples();
  		});
  	});
  }

  function alsoAddFontLoadedClass(callback) {
  	return function () {
  		document.body.classList.add("fl-fonts-loaded");
  		return callback.apply(this, arguments);
  	};
  }

  // Globals ------------------------------------------------------
  var state$1;
  var SECTIONS = ["header", "controls", "legend", "primary", "footer"];
  var overlay;
  var elements = {};

  // Helper functions ------------------
  function getWidth(node) {
  	return node.getBoundingClientRect().width;
  }

  function getHeight(node) {
  	return node.getBoundingClientRect().height;
  }

  function createWrapper() {
  	var outer_wrapper = document.createElement("div");
  	outer_wrapper.id = "fl-layout-wrapper-outer";
  	outer_wrapper.style.display = "flex";

  	var wrapper = document.createElement("main");
  	wrapper.id = "fl-layout-wrapper";
  	wrapper.style.display = "flex";
  	wrapper.style.flexGrow = "1";
  	wrapper.style.flexDirection = "column";
  	wrapper.style.boxSizing = "border-box";
  	// This will make sure the wrapper won't grow in width when
  	// there are child elements that exceed the width
  	wrapper.style.overflow = "hidden";

  	var aside = document.createElement("aside");
  	aside.id = "fl-layout-sidebar";
  	aside.style.position = "relative";

  	elements.sidebar = aside;

  	outer_wrapper.appendChild(wrapper);
  	outer_wrapper.appendChild(aside);

  	document.body.appendChild(outer_wrapper);

  	return wrapper;
  }

  function addElement(name, i) {
  	var id = "fl-layout-" + name;

  	var outer_el = document.createElement("section");
  	outer_el.className = "fl-layout-container";
  	outer_el.id = id + "-container";
  	outer_el.style.width = "100%";
  	outer_el.style.position = "relative";
  	outer_el.style.order = i;

  	var inner_el = document.createElement("div");
  	inner_el.className = "fl-layout-inner";
  	inner_el.id = id;
  	inner_el.style.width = "100%";

  	// This was added in a later version so that absolute elements in the
  	// primary container align with the edge of the inner primary container.
  	// We've found one issue with this in the arc map, that is documented
  	// in issue 72 of this repository
  	inner_el.style.position = "relative";

  	// The height of the outer primary container is decided by flexbox
  	// and depends on the remaining available vertical space. As such
  	// there is no explicity height set to this container (like a % or px)
  	// Safari gets confused by this and any child elements (the primary inner
  	// in this case) with an height of 100% will be calculated as "height: auto"
  	// Setting the primary outer to "display: flex" will cause the child element
  	// to stretch out over the available space. Solution found here:
  	// https://stackoverflow.com/a/33644245
  	if (name == "primary") {
  		outer_el.style.display = "flex";
  		getScreenreaderText(outer_el);
  	}

  	outer_el.appendChild(inner_el);
  	elements.wrapper.appendChild(outer_el);

  	return {
  		outer: outer_el,
  		inner: inner_el,
  	};
  }

  function getScreenreaderText(container) {
  	var el = document.createElement("p");
  	el.id = "fl-layout-primary-description";
  	var style = el.style;
  	style.border = "0";
  	style.height = "1px";
  	style.width = "1px";
  	style.margin = "-1px";
  	style.overflow = "hidden";
  	style.padding = "0";
  	style.position = "absolute";
  	style.clip = "rect(0 0 0 0)";
  	container.appendChild(el);
  	return el;
  }

  function createOverlay() {
  	var primary = elements.primary.outer;
  	primary.style.position = "relative";
  	overlay = document.createElement("div");
  	overlay.id = "fl-layout-overlay";
  	var style = overlay.style;
  	style.position = "absolute";
  	style.display = "none";
  	style.width = "100%";
  	style.height = "100%";
  	style.top = 0;
  	style.left = 0;
  	style.backgroundColor = "rgb(200,200,200)";
  	style.zIndex = 999999;
  	style.pointerEvents = "none";
  	var p = document.createElement("p");
  	p.className = "fl-layout-overlay-message";
  	style = p.style;
  	style.color = "#333333";
  	style.fontSize = "1.5rem";
  	style.paddingLeft = "15%";
  	style.paddingRight = "15%";
  	style.width = "100%";
  	style.boxSizing = "border-box";
  	style.position = "absolute";
  	style.top = "50%";
  	style.transform = "translate(0, -50%)";
  	style.margin = "0";
  	style.textAlign = "center";
  	overlay.appendChild(p);
  	primary.appendChild(overlay);
  	return overlay;
  }

  // Functions returned by init ------------------
  function getWrapper() {
  	return elements.wrapper;
  }

  function getSidebar() {
  	return elements.sidebar;
  }

  function getSection(section) {
  	return SECTIONS.indexOf(section) !== -1 ? elements[section].inner : null;
  }

  function getOuterWidth(el) {
  	if (!elements[el] && el !== undefined) return null;
  	return el == "wrapper" || el === undefined
  		? getWidth(elements.wrapper)
  		: getWidth(elements[el].outer);
  }

  function getInnerWidth(el) {
  	if (!elements[el] && el !== undefined) return null;
  	return el == "wrapper" || el === undefined
  		? getWidth(elements.wrapper) -
  				getMargin("horizontal") -
  				getBorderWidth("horizontal")
  		: getWidth(elements[el].inner);
  }

  function getOuterHeight(el) {
  	if (!elements[el] && el !== undefined) return null;
  	return el == "wrapper" || el === undefined
  		? getHeight(elements.wrapper)
  		: getHeight(elements[el].outer);
  }

  function getInnerHeight(el) {
  	if (!elements[el] && el !== undefined) return null;
  	return el == "wrapper" || el === undefined
  		? getHeight(elements.wrapper) -
  				getMargin("vertical") -
  				getBorderWidth("vertical")
  		: getHeight(elements[el].inner);
  }

  function getPrimaryHeight() {
  	var current_layout = getLayoutOrder();
  	var primary_padding =
  		current_layout.mode == "grid"
  			? 0
  			: getVerticalPadding(elements.primary.outer);
  	return getHeight(elements.primary.outer) - primary_padding;
  }

  function getPrimaryWidth() {
  	return getWidth(elements.primary.inner);
  }

  function getPrimaryScreenReadability() {
  	return state$1.screenreader_hide_primary ? "hidden" : "readable";
  }

  function getVerticalPadding(node) {
  	var current_layout = getLayoutOrder();
  	if (current_layout.mode == "grid")
  		return parseFloat(getComputedStyle(elements.wrapper).gap) || 0;
  	else {
  		var primary_padding_top =
  			parseFloat(getComputedStyle(node).paddingTop) || 0;
  		var primary_padding_bottom =
  			parseFloat(getComputedStyle(node).paddingBottom) || 0;
  		return primary_padding_top + primary_padding_bottom;
  	}
  }

  function getDefaultPrimaryHeight() {
  	var default_inner_height =
  		getDefaultHeight() - getMargin("vertical") - getBorderWidth("vertical");
  	var other_height = getHeightFromNonPrimaryContainers();
  	var current_layout = getLayoutOrder();
  	var primary_padding =
  		current_layout.mode == "grid"
  			? 0
  			: getVerticalPadding(elements.primary.outer);
  	return default_inner_height - other_height - primary_padding;
  }

  function getHeightFromNonPrimaryContainers() {
  	var current_layout = getLayoutOrder();
  	// There are no sections above or below the primary in grid mode, so no height to deduct
  	var containers =
  		current_layout.id == "grid-1"
  			? []
  			: ["header", "controls", "legend", "footer"];
  	return containers.reduce(function (sum, el) {
  		var el_height = getOuterHeight(el);
  		if (el_height > 0 && current_layout.mode == "grid")
  			el_height += getVerticalPadding();
  		return (sum += el_height);
  	}, 0);
  }

  function getMargin(side) {
  	var margin;

  	if (side == "left") margin = state$1.margin_left;
  	else if (side == "right") margin = state$1.margin_right;
  	else if (side == "top") margin = state$1.margin_top;
  	else if (side == "bottom") margin = state$1.margin_bottom;
  	else if (side == "horizontal")
  		margin = state$1.margin_left + state$1.margin_right;
  	else if (side == "vertical") margin = state$1.margin_top + state$1.margin_bottom;

  	return remToPx(margin);
  }

  function getBorderWidth(space) {
  	if (!state$1.border.enabled) return 0;
  	if (space == "vertical")
  		return state$1.border.top.width + state$1.border.bottom.width;
  	if (space == "horizontal")
  		return state$1.border.left.width + state$1.border.right.width;
  	return null;
  }

  function setHeight(primary_height) {
  	var primary = elements.primary;
  	if (Flourish.fixed_height || Flourish.fixed_height === undefined) {
  		primary.inner.style.height = "";
  		return;
  	}

  	var is_null = primary_height === null;
  	var p_height = is_null ? getDefaultPrimaryHeight() : primary_height;

  	if (
  		p_height + getVerticalPadding(elements.primary.outer) ===
  		parseFloat(primary.outer.style.height)
  	)
  		return;
  	elements.wrapper.style.height = "";

  	primary.outer.style.flex = "";
  	primary.inner.style.height = p_height + "px";
  	Flourish.setHeight(is_null ? null : getOuterHeight());
  }

  function showOverlay(show_overlay) {
  	var p = overlay.querySelector(".fl-layout-overlay-message");
  	if (show_overlay) {
  		overlay.style.display = "block";
  		var message =
  			typeof show_overlay === "string" ? show_overlay : DEFAULT_OVERLAY_MESSAGE;
  		p.innerHTML = message;
  	} else {
  		p.textContent = "";
  		overlay.style.display = "none";
  	}
  }

  function getOverlay() {
  	return overlay;
  }

  let layout_screenshot_svg;

  function prepareScreenshotSVG() {
  	if (layout_screenshot_svg) clearScreenshotSVG();
  	layout_screenshot_svg = createScreenshotSVG(
  		this.getWrapper(),
  		"fl-layout-svg-screenshot-container",
  	);
  	layout_screenshot_svg.addTextElements("#fl-layout-header-container h2");
  	layout_screenshot_svg.addTextElements("#fl-layout-header-container h3");
  	layout_screenshot_svg.addTextElements("#fl-layout-header-container p");
  	layout_screenshot_svg.addTextElements(
  		"#fl-layout-footer .flourish-footer-text",
  	);
  }

  function clearScreenshotSVG() {
  	layout_screenshot_svg.remove();
  	layout_screenshot_svg = null;
  }

  // Main init function ----------------------------------------
  function init$1(state_) {
  	state$1 = state_;
  	for (var key in DEFAULTS) {
  		if (state$1[key] === undefined) state$1[key] = DEFAULTS[key];
  	}

  	initFontStyles();
  	elements.wrapper = createWrapper();
  	SECTIONS.forEach(function (section, i) {
  		elements[section] = addElement(section, i);
  	});
  	getSection("header").appendChild(init$3());
  	getSection("footer").appendChild(init$2());
  	elements.primary.outer.style.overflow = "hidden";
  	createOverlay();

  	return {
  		update: update$1,
  		getWrapper: getWrapper,
  		getSidebar: getSidebar,
  		getSection: getSection,
  		getOuterWidth: getOuterWidth,
  		getInnerWidth: getInnerWidth,
  		getOuterHeight: getOuterHeight,
  		getInnerHeight: getInnerHeight,
  		getPrimaryHeight: getPrimaryHeight,
  		getPrimaryWidth: getPrimaryWidth,
  		getDefaultPrimaryHeight: getDefaultPrimaryHeight,
  		getPrimaryScreenReadability: getPrimaryScreenReadability,
  		setHeight: setHeight,
  		showOverlay: showOverlay,
  		remToPx: remToPx,
  		getOverlay: getOverlay,
  		awaitFonts: awaitFonts,
  		prepareScreenshotSVG: prepareScreenshotSVG,
  		clearScreenshotSVG: clearScreenshotSVG,
  	};
  }

  var state = {
      example_state_property: 25,

      layout: {}, // layout module state properties
  };

  var layout = init$1(state.layout);

  var data = {};

  var noop$1 = {value: () => {}};

  function dispatch$1() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch$1(_);
  }

  function Dispatch$1(_) {
    this._ = _;
  }

  function parseTypenames$2(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch$1.prototype = dispatch$1.prototype = {
    constructor: Dispatch$1,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames$2(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get$2(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set$2(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set$2(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch$1(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get$2(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set$2(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  var xhtml = "http://www.w3.org/1999/xhtml";

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
  }

  function creatorInherit(name) {
    return function() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    };
  }

  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }

  function creator(name) {
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  }

  function none() {}

  function selector(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  function selection_select(select) {
    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }

    return new Selection$1(subgroups, this._parents);
  }

  // Given something array like (or null), returns something that is strictly an
  // array. This is used to ensure that array-like objects passed to d3.selectAll
  // or selection.selectAll are converted into proper arrays when creating a
  // selection; we don’t ever want to create a selection backed by a live
  // HTMLCollection or NodeList. However, note that selection.selectAll will use a
  // static NodeList as a group, since it safely derived from querySelectorAll.
  function array(x) {
    return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
  }

  function empty() {
    return [];
  }

  function selectorAll(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  function arrayAll(select) {
    return function() {
      return array(select.apply(this, arguments));
    };
  }

  function selection_selectAll(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }

    return new Selection$1(subgroups, parents);
  }

  function matcher(selector) {
    return function() {
      return this.matches(selector);
    };
  }

  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }

  var find = Array.prototype.find;

  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }

  function childFirst() {
    return this.firstElementChild;
  }

  function selection_selectChild(match) {
    return this.select(match == null ? childFirst
        : childFind(typeof match === "function" ? match : childMatcher(match)));
  }

  var filter = Array.prototype.filter;

  function children() {
    return Array.from(this.children);
  }

  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }

  function selection_selectChildren(match) {
    return this.selectAll(match == null ? children
        : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }

  function selection_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Selection$1(subgroups, this._parents);
  }

  function sparse(update) {
    return new Array(update.length);
  }

  function selection_enter() {
    return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
  }

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
    querySelector: function(selector) { return this._parent.querySelector(selector); },
    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
  };

  function constant$1(x) {
    return function() {
      return x;
    };
  }

  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;

    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }

  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = new Map,
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;

    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }

    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = key.call(parent, data[i], i, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
        exit[i] = node;
      }
    }
  }

  function datum(node) {
    return node.__data__;
  }

  function selection_data(value, key) {
    if (!arguments.length) return Array.from(this, datum);

    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;

    if (typeof value !== "function") value = constant$1(value);

    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);

      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        }
      }
    }

    update = new Selection$1(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }

  // Given some data, this returns an array-like view of it: an object that
  // exposes a length property and allows numeric indexing. Note that unlike
  // selectAll, this isn’t worried about “live” collections because the resulting
  // array will only be used briefly while data is being bound. (It is possible to
  // cause the data to change while iterating by using a key function, but please
  // don’t; we’d rather avoid a gratuitous copy.)
  function arraylike(data) {
    return typeof data === "object" && "length" in data
      ? data // Array, TypedArray, NodeList, array-like
      : Array.from(data); // Map, Set, iterable, string, or anything else
  }

  function selection_exit() {
    return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
  }

  function selection_join(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    if (typeof onenter === "function") {
      enter = onenter(enter);
      if (enter) enter = enter.selection();
    } else {
      enter = enter.append(onenter + "");
    }
    if (onupdate != null) {
      update = onupdate(update);
      if (update) update = update.selection();
    }
    if (onexit == null) exit.remove(); else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }

  function selection_merge(context) {
    var selection = context.selection ? context.selection() : context;

    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Selection$1(merges, this._parents);
  }

  function selection_order() {

    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }

    return this;
  }

  function selection_sort(compare) {
    if (!compare) compare = ascending;

    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }

    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }

    return new Selection$1(sortgroups, this._parents).order();
  }

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  function selection_nodes() {
    return Array.from(this);
  }

  function selection_node() {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }

    return null;
  }

  function selection_size() {
    let size = 0;
    for (const node of this) ++size; // eslint-disable-line no-unused-vars
    return size;
  }

  function selection_empty() {
    return !this.node();
  }

  function selection_each(callback) {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }

    return this;
  }

  function attrRemove$1(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS$1(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant$1(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }

  function attrConstantNS$1(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }

  function attrFunction$1(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }

  function attrFunctionNS$1(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }

  function selection_attr(name, value) {
    var fullname = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    }

    return this.each((value == null
        ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
        : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
  }

  function defaultView(node) {
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  }

  function styleRemove$1(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant$1(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }

  function styleFunction$1(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }

  function selection_style(name, value, priority) {
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove$1 : typeof value === "function"
              ? styleFunction$1
              : styleConstant$1)(name, value, priority == null ? "" : priority))
        : styleValue(this.node(), name);
  }

  function styleValue(node, name) {
    return node.style.getPropertyValue(name)
        || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }

  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }

  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }

  function selection_property(name, value) {
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  }

  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }

  function classList(node) {
    return node.classList || new ClassList(node);
  }

  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }

  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };

  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }

  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }

  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }

  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }

  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }

  function selection_classed(name, value) {
    var names = classArray(name + "");

    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }

    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  }

  function textRemove() {
    this.textContent = "";
  }

  function textConstant$1(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction$1(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }

  function selection_text(value) {
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction$1
            : textConstant$1)(value))
        : this.node().textContent;
  }

  function htmlRemove() {
    this.innerHTML = "";
  }

  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }

  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }

  function selection_html(value) {
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  }

  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }

  function selection_raise() {
    return this.each(raise);
  }

  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }

  function selection_lower() {
    return this.each(lower);
  }

  function selection_append(name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() {
      return this.appendChild(create.apply(this, arguments));
    });
  }

  function constantNull() {
    return null;
  }

  function selection_insert(name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }

  function selection_remove() {
    return this.each(remove);
  }

  function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_clone(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  function selection_datum(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  }

  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }

  function parseTypenames$1(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return {type: t, name: name};
    });
  }

  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }

  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, options);
      o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }

  function selection_on(typename, value, options) {
    var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }

    on = value ? onAdd : onRemove;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
    return this;
  }

  function dispatchEvent(node, type, params) {
    var window = defaultView(node),
        event = window.CustomEvent;

    if (typeof event === "function") {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function dispatchConstant(type, params) {
    return function() {
      return dispatchEvent(this, type, params);
    };
  }

  function dispatchFunction(type, params) {
    return function() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }

  function selection_dispatch(type, params) {
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  }

  function* selection_iterator() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) yield node;
      }
    }
  }

  var root = [null];

  function Selection$1(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }

  function selection() {
    return new Selection$1([[document.documentElement]], root);
  }

  function selection_selection() {
    return this;
  }

  Selection$1.prototype = selection.prototype = {
    constructor: Selection$1,
    select: selection_select,
    selectAll: selection_selectAll,
    selectChild: selection_selectChild,
    selectChildren: selection_selectChildren,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    join: selection_join,
    merge: selection_merge,
    selection: selection_selection,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch,
    [Symbol.iterator]: selection_iterator
  };

  var constant = x => () => x;

  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant(isNaN(a) ? b : a);
  }

  var interpolateRgb = (function rgbGamma(y) {
    var color = gamma(y);

    function rgb$1(start, end) {
      var r = color((start = rgb(start)).r, (end = rgb(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb$1.gamma = rgbGamma;

    return rgb$1;
  })(1);

  function interpolateNumber(a, b) {
    return a = +a, b = +b, function(t) {
      return a * (1 - t) + b * t;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      reB = new RegExp(reA.source, "g");

  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function interpolateString(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: interpolateNumber(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  var degrees = 180 / Math.PI;

  var identity = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };

  function decompose(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var svgNode;

  /* eslint-disable no-undef */
  function parseCss(value) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m.isIdentity ? identity : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
  }

  function parseSvg(value) {
    if (value == null) return identity;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
    value = value.matrix;
    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  function interpolateTransform(parse, pxComma, pxParen, degParen) {

    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }

    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }

    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
        q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }

    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }

    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }

    return function(a, b) {
      var s = [], // string constants and placeholders
          q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }

  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  var frame$1 = 0, // is an animation frame pending?
      timeout$2 = 0, // is a timeout pending?
      interval$1 = 0, // are any timers active?
      pokeDelay$1 = 1000, // how frequently we check for clock skew
      taskHead$1,
      taskTail$1,
      clockLast$1 = 0,
      clockNow$1 = 0,
      clockSkew$1 = 0,
      clock$1 = typeof performance === "object" && performance.now ? performance : Date,
      setFrame$1 = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

  function now$1() {
    return clockNow$1 || (setFrame$1(clearNow$1), clockNow$1 = clock$1.now() + clockSkew$1);
  }

  function clearNow$1() {
    clockNow$1 = 0;
  }

  function Timer$1() {
    this._call =
    this._time =
    this._next = null;
  }

  Timer$1.prototype = timer$1.prototype = {
    constructor: Timer$1,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now$1() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail$1 !== this) {
        if (taskTail$1) taskTail$1._next = this;
        else taskHead$1 = this;
        taskTail$1 = this;
      }
      this._call = callback;
      this._time = time;
      sleep$1();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep$1();
      }
    }
  };

  function timer$1(callback, delay, time) {
    var t = new Timer$1;
    t.restart(callback, delay, time);
    return t;
  }

  function timerFlush$1() {
    now$1(); // Get the current time, if not already set.
    ++frame$1; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead$1, e;
    while (t) {
      if ((e = clockNow$1 - t._time) >= 0) t._call.call(undefined, e);
      t = t._next;
    }
    --frame$1;
  }

  function wake$1() {
    clockNow$1 = (clockLast$1 = clock$1.now()) + clockSkew$1;
    frame$1 = timeout$2 = 0;
    try {
      timerFlush$1();
    } finally {
      frame$1 = 0;
      nap$1();
      clockNow$1 = 0;
    }
  }

  function poke$1() {
    var now = clock$1.now(), delay = now - clockLast$1;
    if (delay > pokeDelay$1) clockSkew$1 -= delay, clockLast$1 = now;
  }

  function nap$1() {
    var t0, t1 = taskHead$1, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead$1 = t2;
      }
    }
    taskTail$1 = t0;
    sleep$1(time);
  }

  function sleep$1(time) {
    if (frame$1) return; // Soonest alarm already set, or will be.
    if (timeout$2) timeout$2 = clearTimeout(timeout$2);
    var delay = time - clockNow$1; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) timeout$2 = setTimeout(wake$1, time - clock$1.now() - clockSkew$1);
      if (interval$1) interval$1 = clearInterval(interval$1);
    } else {
      if (!interval$1) clockLast$1 = clock$1.now(), interval$1 = setInterval(poke$1, pokeDelay$1);
      frame$1 = 1, setFrame$1(wake$1);
    }
  }

  function timeout$1(callback, delay, time) {
    var t = new Timer$1;
    delay = delay == null ? 0 : +delay;
    t.restart(elapsed => {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }

  var emptyOn = dispatch$1("start", "end", "cancel", "interrupt");
  var emptyTween = [];

  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;

  function schedule(node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id in schedules) return;
    create(node, id, {
      name: name,
      index: index, // For context during callback.
      group: group, // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }

  function init(node, id) {
    var schedule = get$1(node, id);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }

  function set$1(node, id) {
    var schedule = get$1(node, id);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
  }

  function get$1(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
    return schedule;
  }

  function create(node, id, self) {
    var schedules = node.__transition,
        tween;

    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = timer$1(schedule, 0, self.time);

    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start, self.delay, self.time);

      // If the elapsed delay is less than our first sleep, start immediately.
      if (self.delay <= elapsed) start(elapsed - self.delay);
    }

    function start(elapsed) {
      var i, j, n, o;

      // If the state is not SCHEDULED, then we previously errored on start.
      if (self.state !== SCHEDULED) return stop();

      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self.name) continue;

        // While this element already has a starting transition during this frame,
        // defer starting an interrupting transition until that transition has a
        // chance to tick (and possibly end); see d3/d3-transition#54!
        if (o.state === STARTED) return timeout$1(start);

        // Interrupt the active transition, if any.
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }

        // Cancel any pre-empted transitions.
        else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
      }

      // Defer the first tick to end of the current frame; see d3/d3#1576.
      // Note the transition may be canceled after start and before the first tick!
      // Note this must be scheduled before the start event; see d3/d3-transition#16!
      // Assuming this is successful, subsequent callbacks go straight to tick.
      timeout$1(function() {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });

      // Dispatch the start event.
      // Note this must be done before the tween are initialized.
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return; // interrupted
      self.state = STARTED;

      // Initialize the tween, deleting null tween.
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }

    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
          i = -1,
          n = tween.length;

      while (++i < n) {
        tween[i].call(node, t);
      }

      // Dispatch the end event.
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }

    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id];
      for (var i in schedules) return; // eslint-disable-line no-unused-vars
      delete node.__transition;
    }
  }

  function interrupt(node, name) {
    var schedules = node.__transition,
        schedule,
        active,
        empty = true,
        i;

    if (!schedules) return;

    name = name == null ? null : name + "";

    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    }

    if (empty) delete node.__transition;
  }

  function selection_interrupt(name) {
    return this.each(function() {
      interrupt(this, name);
    });
  }

  function tweenRemove(id, name) {
    var tween0, tween1;
    return function() {
      var schedule = set$1(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }

      schedule.tween = tween1;
    };
  }

  function tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() {
      var schedule = set$1(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }

      schedule.tween = tween1;
    };
  }

  function transition_tween(name, value) {
    var id = this._id;

    name += "";

    if (arguments.length < 2) {
      var tween = get$1(this.node(), id).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }

    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
  }

  function tweenValue(transition, name, value) {
    var id = transition._id;

    transition.each(function() {
      var schedule = set$1(this, id);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });

    return function(node) {
      return get$1(node, id).value[name];
    };
  }

  function interpolate(a, b) {
    var c;
    return (typeof b === "number" ? interpolateNumber
        : b instanceof color ? interpolateRgb
        : (c = color(b)) ? (b = c, interpolateRgb)
        : interpolateString)(a, b);
  }

  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttribute(name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrConstantNS(fullname, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttributeNS(fullname.space, fullname.local);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrFunction(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttribute(name);
      string0 = this.getAttribute(name);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function attrFunctionNS(fullname, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      string0 = this.getAttributeNS(fullname.space, fullname.local);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function transition_attr(name, value) {
    var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
    return this.attrTween(name, typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
        : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
        : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
  }

  function attrInterpolate(name, i) {
    return function(t) {
      this.setAttribute(name, i.call(this, t));
    };
  }

  function attrInterpolateNS(fullname, i) {
    return function(t) {
      this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
  }

  function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function attrTween(name, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_attrTween(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }

  function delayFunction(id, value) {
    return function() {
      init(this, id).delay = +value.apply(this, arguments);
    };
  }

  function delayConstant(id, value) {
    return value = +value, function() {
      init(this, id).delay = value;
    };
  }

  function transition_delay(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? delayFunction
            : delayConstant)(id, value))
        : get$1(this.node(), id).delay;
  }

  function durationFunction(id, value) {
    return function() {
      set$1(this, id).duration = +value.apply(this, arguments);
    };
  }

  function durationConstant(id, value) {
    return value = +value, function() {
      set$1(this, id).duration = value;
    };
  }

  function transition_duration(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? durationFunction
            : durationConstant)(id, value))
        : get$1(this.node(), id).duration;
  }

  function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error;
    return function() {
      set$1(this, id).ease = value;
    };
  }

  function transition_ease(value) {
    var id = this._id;

    return arguments.length
        ? this.each(easeConstant(id, value))
        : get$1(this.node(), id).ease;
  }

  function easeVarying(id, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (typeof v !== "function") throw new Error;
      set$1(this, id).ease = v;
    };
  }

  function transition_easeVarying(value) {
    if (typeof value !== "function") throw new Error;
    return this.each(easeVarying(this._id, value));
  }

  function transition_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Transition(subgroups, this._parents, this._name, this._id);
  }

  function transition_merge(transition) {
    if (transition._id !== this._id) throw new Error;

    for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Transition(merges, this._parents, this._name, this._id);
  }

  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }

  function onFunction(id, name, listener) {
    var on0, on1, sit = start(name) ? init : set$1;
    return function() {
      var schedule = sit(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

      schedule.on = on1;
    };
  }

  function transition_on(name, listener) {
    var id = this._id;

    return arguments.length < 2
        ? get$1(this.node(), id).on.on(name)
        : this.each(onFunction(id, name, listener));
  }

  function removeFunction(id) {
    return function() {
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id) return;
      if (parent) parent.removeChild(this);
    };
  }

  function transition_remove() {
    return this.on("end.remove", removeFunction(this._id));
  }

  function transition_select(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
        }
      }
    }

    return new Transition(subgroups, this._parents, name, id);
  }

  function transition_selectAll(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          for (var children = select.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) {
            if (child = children[k]) {
              schedule(child, name, id, k, children, inherit);
            }
          }
          subgroups.push(children);
          parents.push(node);
        }
      }
    }

    return new Transition(subgroups, parents, name, id);
  }

  var Selection = selection.prototype.constructor;

  function transition_selection() {
    return new Selection(this._groups, this._parents);
  }

  function styleNull(name, interpolate) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          string1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
  }

  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = styleValue(this, name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function styleFunction(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          value1 = value(this),
          string1 = value1 + "";
      if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function styleMaybeRemove(id, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
    return function() {
      var schedule = set$1(this, id),
          on = schedule.on,
          listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

      schedule.on = on1;
    };
  }

  function transition_style(name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
    return value == null ? this
        .styleTween(name, styleNull(name, i))
        .on("end.style." + name, styleRemove(name))
      : typeof value === "function" ? this
        .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
        .each(styleMaybeRemove(this._id, name))
      : this
        .styleTween(name, styleConstant(name, i, value), priority)
        .on("end.style." + name, null);
  }

  function styleInterpolate(name, i, priority) {
    return function(t) {
      this.style.setProperty(name, i.call(this, t), priority);
    };
  }

  function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
      return t;
    }
    tween._value = value;
    return tween;
  }

  function transition_styleTween(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }

  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }

  function transition_text(value) {
    return this.tween("text", typeof value === "function"
        ? textFunction(tweenValue(this, "text", value))
        : textConstant(value == null ? "" : value + ""));
  }

  function textInterpolate(i) {
    return function(t) {
      this.textContent = i.call(this, t);
    };
  }

  function textTween(value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_textTween(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, textTween(value));
  }

  function transition_transition() {
    var name = this._name,
        id0 = this._id,
        id1 = newId();

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          var inherit = get$1(node, id0);
          schedule(node, name, id1, i, group, {
            time: inherit.time + inherit.delay + inherit.duration,
            delay: 0,
            duration: inherit.duration,
            ease: inherit.ease
          });
        }
      }
    }

    return new Transition(groups, this._parents, name, id1);
  }

  function transition_end() {
    var on0, on1, that = this, id = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
      var cancel = {value: reject},
          end = {value: function() { if (--size === 0) resolve(); }};

      that.each(function() {
        var schedule = set$1(this, id),
            on = schedule.on;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) {
          on1 = (on0 = on).copy();
          on1._.cancel.push(cancel);
          on1._.interrupt.push(cancel);
          on1._.end.push(end);
        }

        schedule.on = on1;
      });

      // The selection was empty, resolve end immediately
      if (size === 0) resolve();
    });
  }

  var id = 0;

  function Transition(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
  }

  function newId() {
    return ++id;
  }

  var selection_prototype = selection.prototype;

  Transition.prototype = {
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    selectChild: selection_prototype.selectChild,
    selectChildren: selection_prototype.selectChildren,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    textTween: transition_textTween,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease,
    easeVarying: transition_easeVarying,
    end: transition_end,
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
  };

  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  var defaultTiming = {
    time: null, // Set on use.
    delay: 0,
    duration: 250,
    ease: cubicInOut
  };

  function inherit(node, id) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id])) {
      if (!(node = node.parentNode)) {
        throw new Error(`transition ${id} not found`);
      }
    }
    return timing;
  }

  function selection_transition(name) {
    var id,
        timing;

    if (name instanceof Transition) {
      id = name._id, name = name._name;
    } else {
      id = newId(), (timing = defaultTiming).time = now$1(), name = name == null ? null : name + "";
    }

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          schedule(node, name, id, i, group, timing || inherit(node, id));
        }
      }
    }

    return new Transition(groups, this._parents, name, id);
  }

  selection.prototype.interrupt = selection_interrupt;
  selection.prototype.transition = selection_transition;

  function count(node) {
    var sum = 0,
        children = node.children,
        i = children && children.length;
    if (!i) sum = 1;
    else while (--i >= 0) sum += children[i].value;
    node.value = sum;
  }

  function node_count() {
    return this.eachAfter(count);
  }

  function node_each(callback, that) {
    let index = -1;
    for (const node of this) {
      callback.call(that, node, ++index, this);
    }
    return this;
  }

  function node_eachBefore(callback, that) {
    var node = this, nodes = [node], children, i, index = -1;
    while (node = nodes.pop()) {
      callback.call(that, node, ++index, this);
      if (children = node.children) {
        for (i = children.length - 1; i >= 0; --i) {
          nodes.push(children[i]);
        }
      }
    }
    return this;
  }

  function node_eachAfter(callback, that) {
    var node = this, nodes = [node], next = [], children, i, n, index = -1;
    while (node = nodes.pop()) {
      next.push(node);
      if (children = node.children) {
        for (i = 0, n = children.length; i < n; ++i) {
          nodes.push(children[i]);
        }
      }
    }
    while (node = next.pop()) {
      callback.call(that, node, ++index, this);
    }
    return this;
  }

  function node_find(callback, that) {
    let index = -1;
    for (const node of this) {
      if (callback.call(that, node, ++index, this)) {
        return node;
      }
    }
  }

  function node_sum(value) {
    return this.eachAfter(function(node) {
      var sum = +value(node.data) || 0,
          children = node.children,
          i = children && children.length;
      while (--i >= 0) sum += children[i].value;
      node.value = sum;
    });
  }

  function node_sort(compare) {
    return this.eachBefore(function(node) {
      if (node.children) {
        node.children.sort(compare);
      }
    });
  }

  function node_path(end) {
    var start = this,
        ancestor = leastCommonAncestor(start, end),
        nodes = [start];
    while (start !== ancestor) {
      start = start.parent;
      nodes.push(start);
    }
    var k = nodes.length;
    while (end !== ancestor) {
      nodes.splice(k, 0, end);
      end = end.parent;
    }
    return nodes;
  }

  function leastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = a.ancestors(),
        bNodes = b.ancestors(),
        c = null;
    a = aNodes.pop();
    b = bNodes.pop();
    while (a === b) {
      c = a;
      a = aNodes.pop();
      b = bNodes.pop();
    }
    return c;
  }

  function node_ancestors() {
    var node = this, nodes = [node];
    while (node = node.parent) {
      nodes.push(node);
    }
    return nodes;
  }

  function node_descendants() {
    return Array.from(this);
  }

  function node_leaves() {
    var leaves = [];
    this.eachBefore(function(node) {
      if (!node.children) {
        leaves.push(node);
      }
    });
    return leaves;
  }

  function node_links() {
    var root = this, links = [];
    root.each(function(node) {
      if (node !== root) { // Don’t include the root’s parent, if any.
        links.push({source: node.parent, target: node});
      }
    });
    return links;
  }

  function* node_iterator() {
    var node = this, current, next = [node], children, i, n;
    do {
      current = next.reverse(), next = [];
      while (node = current.pop()) {
        yield node;
        if (children = node.children) {
          for (i = 0, n = children.length; i < n; ++i) {
            next.push(children[i]);
          }
        }
      }
    } while (next.length);
  }

  function hierarchy(data, children) {
    if (data instanceof Map) {
      data = [undefined, data];
      if (children === undefined) children = mapChildren;
    } else if (children === undefined) {
      children = objectChildren;
    }

    var root = new Node(data),
        node,
        nodes = [root],
        child,
        childs,
        i,
        n;

    while (node = nodes.pop()) {
      if ((childs = children(node.data)) && (n = (childs = Array.from(childs)).length)) {
        node.children = childs;
        for (i = n - 1; i >= 0; --i) {
          nodes.push(child = childs[i] = new Node(childs[i]));
          child.parent = node;
          child.depth = node.depth + 1;
        }
      }
    }

    return root.eachBefore(computeHeight);
  }

  function node_copy() {
    return hierarchy(this).eachBefore(copyData);
  }

  function objectChildren(d) {
    return d.children;
  }

  function mapChildren(d) {
    return Array.isArray(d) ? d[1] : null;
  }

  function copyData(node) {
    if (node.data.value !== undefined) node.value = node.data.value;
    node.data = node.data.data;
  }

  function computeHeight(node) {
    var height = 0;
    do node.height = height;
    while ((node = node.parent) && (node.height < ++height));
  }

  function Node(data) {
    this.data = data;
    this.depth =
    this.height = 0;
    this.parent = null;
  }

  Node.prototype = hierarchy.prototype = {
    constructor: Node,
    count: node_count,
    each: node_each,
    eachAfter: node_eachAfter,
    eachBefore: node_eachBefore,
    find: node_find,
    sum: node_sum,
    sort: node_sort,
    path: node_path,
    ancestors: node_ancestors,
    descendants: node_descendants,
    leaves: node_leaves,
    links: node_links,
    copy: node_copy,
    [Symbol.iterator]: node_iterator
  };

  function Transform(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
  }

  Transform.prototype = {
    constructor: Transform,
    scale: function(k) {
      return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
    },
    translate: function(x, y) {
      return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
    },
    apply: function(point) {
      return [point[0] * this.k + this.x, point[1] * this.k + this.y];
    },
    applyX: function(x) {
      return x * this.k + this.x;
    },
    applyY: function(y) {
      return y * this.k + this.y;
    },
    invert: function(location) {
      return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
    },
    invertX: function(x) {
      return (x - this.x) / this.k;
    },
    invertY: function(y) {
      return (y - this.y) / this.k;
    },
    rescaleX: function(x) {
      return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
    },
    rescaleY: function(y) {
      return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
    },
    toString: function() {
      return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    }
  };

  Transform.prototype;

  function d3PolygonArea(polygon) {
    var i = -1,
        n = polygon.length,
        a,
        b = polygon[n - 1],
        area = 0;

    while (++i < n) {
      a = b;
      b = polygon[i];
      area += a[1] * b[0] - a[0] * b[1];
    }

    return area / 2;
  }

  function d3PolygonCentroid(polygon) {
    var i = -1,
        n = polygon.length,
        x = 0,
        y = 0,
        a,
        b = polygon[n - 1],
        c,
        k = 0;

    while (++i < n) {
      a = b;
      b = polygon[i];
      k += c = a[0] * b[1] - b[0] * a[1];
      x += (a[0] + b[0]) * c;
      y += (a[1] + b[1]) * c;
    }

    return k *= 3, [x / k, y / k];
  }

  function d3PolygonContains(polygon, point) {
    var n = polygon.length,
        p = polygon[n - 1],
        x = point[0], y = point[1],
        x0 = p[0], y0 = p[1],
        x1, y1,
        inside = false;

    for (var i = 0; i < n; ++i) {
      p = polygon[i], x1 = p[0], y1 = p[1];
      if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside;
      x0 = x1, y0 = y1;
    }

    return inside;
  }

  var frame = 0, // is an animation frame pending?
      timeout = 0, // is a timeout pending?
      interval = 0, // are any timers active?
      pokeDelay = 1000, // how frequently we check for clock skew
      taskHead,
      taskTail,
      clockLast = 0,
      clockNow = 0,
      clockSkew = 0,
      clock = typeof performance === "object" && performance.now ? performance : Date,
      setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }

  function clearNow() {
    clockNow = 0;
  }

  function Timer() {
    this._call =
    this._time =
    this._next = null;
  }

  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };

  function timer(callback, delay, time) {
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
  }

  function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
      t = t._next;
    }
    --frame;
  }

  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }

  function poke() {
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
  }

  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }

  function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  var noop = {value: () => {}};

  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }

  function Dispatch(_) {
    this._ = _;
  }

  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  function d3Extent(values, valueof) {
    let min;
    let max;
    {
      for (const value of values) {
        if (value != null) {
          if (min === undefined) {
            if (value >= value) min = max = value;
          } else {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
    return [min, max];
  }

  // Returns the 2D cross product of AB and AC vectors, i.e., the z-component of
  // the 3D cross product in a quadrant I Cartesian coordinate system (+x is
  // right, +y is up). Returns a positive value if ABC is counter-clockwise,
  // negative if clockwise, and zero if the points are collinear.
  function cross(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  }

  function lexicographicOrder(a, b) {
    return a[0] - b[0] || a[1] - b[1];
  }

  // Computes the upper convex hull per the monotone chain algorithm.
  // Assumes points.length >= 3, is sorted by x, unique in y.
  // Returns an array of indices into points in left-to-right order.
  function computeUpperHullIndexes(points) {
    const n = points.length,
        indexes = [0, 1];
    let size = 2, i;

    for (i = 2; i < n; ++i) {
      while (size > 1 && cross(points[indexes[size - 2]], points[indexes[size - 1]], points[i]) <= 0) --size;
      indexes[size++] = i;
    }

    return indexes.slice(0, size); // remove popped points
  }

  function d3PolygonHull(points) {
    if ((n = points.length) < 3) return null;

    var i,
        n,
        sortedPoints = new Array(n),
        flippedPoints = new Array(n);

    for (i = 0; i < n; ++i) sortedPoints[i] = [+points[i][0], +points[i][1], i];
    sortedPoints.sort(lexicographicOrder);
    for (i = 0; i < n; ++i) flippedPoints[i] = [sortedPoints[i][0], -sortedPoints[i][1]];

    var upperIndexes = computeUpperHullIndexes(sortedPoints),
        lowerIndexes = computeUpperHullIndexes(flippedPoints);

    // Construct the hull polygon, removing possible duplicate endpoints.
    var skipLeft = lowerIndexes[0] === upperIndexes[0],
        skipRight = lowerIndexes[lowerIndexes.length - 1] === upperIndexes[upperIndexes.length - 1],
        hull = [];

    // Add upper hull in right-to-l order.
    // Then add lower hull in left-to-right order.
    for (i = upperIndexes.length - 1; i >= 0; --i) hull.push(points[sortedPoints[upperIndexes[i]][2]]);
    for (i = +skipLeft; i < lowerIndexes.length - skipRight; ++i) hull.push(points[sortedPoints[lowerIndexes[i]][2]]);

    return hull;
  }

  function polygonLength(polygon) {
    var i = -1,
        n = polygon.length,
        b = polygon[n - 1],
        xa,
        ya,
        xb = b[0],
        yb = b[1],
        perimeter = 0;

    while (++i < n) {
      xa = xb;
      ya = yb;
      b = polygon[i];
      xb = b[0];
      yb = b[1];
      xa -= xb;
      ya -= yb;
      perimeter += Math.hypot(xa, ya);
    }

    return perimeter;
  }

  var epsilon = 1e-10;

  function epsilonesque(n) {
    return n <= epsilon && n >= -epsilon;
  }

  // IN: vectors or vertices
  // OUT: dot product
  function dot(v0, v1) {
    return v0.x * v1.x + v0.y * v1.y + v0.z * v1.z;
  }

  // IN: two vertex objects, v0 and v1
  // OUT: true if they are linearly dependent, false otherwise
  // from https://math.stackexchange.com/questions/1144357/how-can-i-prove-that-two-vectors-in-%E2%84%9D3-are-linearly-independent-iff-their-cro
  function linearDependent(v0, v1) {
    return (
      epsilonesque(v0.x * v1.y - v0.y * v1.x) &&
      epsilonesque(v0.y * v1.z - v0.z * v1.y) &&
      epsilonesque(v0.z * v1.x - v0.x * v1.z)
    );
  }

  // IN: an array of 2D-points [x,y]
  // OUT: true if the set defines a convex polygon (non-intersecting, hole-free, non-concave)
  // from https://gist.github.com/annatomka/82715127b74473859054, adapted to [x,y] syntax (instead of {x: ..., y: ...}) and optimizations
  function polygonDirection(polygon) {
    var sign, crossproduct, p0, p1, p2, v0, v1, i;

    //begin: initialization
    p0 = polygon[polygon.length - 2];
    p1 = polygon[polygon.length - 1];
    p2 = polygon[0];
    v0 = vect(p0, p1);
    v1 = vect(p1, p2);
    crossproduct = calculateCrossproduct(v0, v1);
    // console.log(`[[${p0}], [${p1}], [${p2}]] => (${v0}) x (${v1}) = ${crossproduct}`);
    sign = Math.sign(crossproduct);
    //end: initialization

    p0 = p1; // p0 = polygon[polygon.length - 1];
    p1 = p2; // p1 = polygon[0];
    p2 = polygon[1];
    v0 = v1;
    v1 = vect(p1, p2);
    crossproduct = calculateCrossproduct(v0, v1);
    // console.log(`[[${p0}], [${p1}], [${p2}]] => (${v0}) x (${v1}) = ${crossproduct}`);
    if (Math.sign(crossproduct) !== sign) {
      return undefined;
    } //different signs in cross products means concave polygon

    //iterate on remaining 3 consecutive points
    for (i = 2; i < polygon.length - 1; i++) {
      p0 = p1;
      p1 = p2;
      p2 = polygon[i];
      v0 = v1;
      v1 = vect(p1, p2);
      crossproduct = calculateCrossproduct(v0, v1);
      // console.log(`[[${p0}], [${p1}], [${p2}]] => (${v0}) x (${v1}) = ${crossproduct}`);
      if (Math.sign(crossproduct) !== sign) {
        return undefined;
      } //different signs in cross products means concave polygon
    }

    return sign;
  }

  function vect(from, to) {
    return [to[0] - from[0], to[1] - from[1]];
  }

  function calculateCrossproduct(v0, v1) {
    return v0[0] * v1[1] - v0[1] * v1[0];
  }

  // ConflictList and ConflictListNode

  function ConflictListNode (face, vert) {
    this.face = face;
    this.vert = vert;
    this.nextf = null;
    this.prevf = null;
    this.nextv = null;
    this.prevv = null;
  }

  // IN: boolean forFace
  function ConflictList (forFace) {
    this.forFace = forFace;
    this.head = null;
  }

  // IN: ConflictListNode cln
  ConflictList.prototype.add = function(cln) {
    if (this.head === null) {
      this.head = cln;
    } else {
      if (this.forFace) {  // Is FaceList
        this.head.prevv = cln;
        cln.nextv = this.head;
        this.head = cln;
      } else {  // Is VertexList
        this.head.prevf = cln;
        cln.nextf = this.head;
        this.head = cln;
      }
    }
  };

  ConflictList.prototype.isEmpty = function() {
    return this.head === null;
  };

  // Array of faces visible
  ConflictList.prototype.fill = function(visible) {
    if (this.forFace) {
      return;
    }
    var curr = this.head;
    do {
      visible.push(curr.face);
      curr.face.marked = true;
      curr = curr.nextf;
    } while (curr !== null);
  };

  ConflictList.prototype.removeAll = function() {
    if (this.forFace) {  // Remove all vertices from Face
      var curr = this.head;
      do {
        if (curr.prevf === null) {  // Node is head
          if (curr.nextf === null) {
            curr.vert.conflicts.head = null;
          } else {
            curr.nextf.prevf = null;
            curr.vert.conflicts.head = curr.nextf;
          }
        } else {  // Node is not head
          if (curr.nextf != null) {
            curr.nextf.prevf = curr.prevf;
          }
          curr.prevf.nextf = curr.nextf;
        }
        curr = curr.nextv;
        if (curr != null) {
          curr.prevv = null;
        }
      } while (curr != null);
    } else {  // Remove all JFaces from vertex
      var curr = this.head;
      do {
        if (curr.prevv == null) {  // Node is head
          if (curr.nextv == null) {
            curr.face.conflicts.head = null;
          } else {
            curr.nextv.prevv = null;
            curr.face.conflicts.head = curr.nextv;
          }
        } else {  // Node is not head
          if (curr.nextv != null) {
            curr.nextv.prevv = curr.prevv;
          }
          curr.prevv.nextv = curr.nextv;
        }
        curr = curr.nextf;
        if (curr != null)
          curr.prevf = null;
      } while (curr != null);
    }
  };

  // IN: list of vertices
  ConflictList.prototype.getVertices = function() {
    var list = [],
    		curr = this.head;
    while (curr !== null) {
      list.push(curr.vert);
      curr = curr.nextv;
    }
    return list;
  };

  // Vertex

  // IN: coordinates x, y, z
  function Vertex (x, y, z, weight, orig, isDummy) {
    this.x = x;
    this.y = y;
    this.weight = epsilon;
    this.index = 0;
    this.conflicts = new ConflictList(false);
    this.neighbours = null;  // Potential trouble
    this.nonClippedPolygon = null;
    this.polygon = null;
    this.originalObject = null;
    this.isDummy = false;

    if (orig !== undefined) {
      this.originalObject = orig;
    }
    if (isDummy != undefined) {
      this.isDummy = isDummy;
    }
    if (weight != null) {
      this.weight = weight;
    }
    if (z != null) {
      this.z = z;
    } else {
      this.z = this.projectZ(this.x, this.y, this.weight);
    }
  }

  Vertex.prototype.projectZ = function(x, y, weight) {
    return ((x*x) + (y*y) - weight);
  };

  Vertex.prototype.setWeight = function(weight) {
    this.weight = weight;
    this.z = this.projectZ(this.x, this.y, this.weight);
  };

  Vertex.prototype.subtract = function(v) {
    return new Vertex(v.x - this.x, v.y - this.y, v.z - this.z);
  };

  Vertex.prototype.crossproduct = function(v) {
    return new Vertex((this.y * v.z) - (this.z * v.y), (this.z * v.x) - (this.x * v.z), (this.x * v.y) - (this.y * v.x));
  };

  Vertex.prototype.equals = function(v) {
    return (this.x === v.x && this.y === v.y && this.z === v.z);
  };

  // Plane3D and Point2D

  // IN: Face face
  function Plane3D (face) {
    var p1 = face.verts[0];
    var p2 = face.verts[1];
    var p3 = face.verts[2];
    this.a = p1.y * (p2.z-p3.z) + p2.y * (p3.z-p1.z) + p3.y * (p1.z-p2.z);
    this.b = p1.z * (p2.x-p3.x) + p2.z * (p3.x-p1.x) + p3.z * (p1.x-p2.x);
    this.c = p1.x * (p2.y-p3.y) + p2.x * (p3.y-p1.y) + p3.x * (p1.y-p2.y);
    this.d = -1 * (p1.x * (p2.y*p3.z - p3.y*p2.z) + p2.x * (p3.y*p1.z - p1.y*p3.z) + p3.x * (p1.y*p2.z - p2.y*p1.z));	
  }

  Plane3D.prototype.getNormZPlane = function() {
    return [
      -1 * (this.a / this.c),
      -1 * (this.b / this.c),
      -1 * (this.d / this.c)
    ];
  };

  // OUT: point2D
  Plane3D.prototype.getDualPointMappedToPlane = function() {
    var nplane = this.getNormZPlane();
    var dualPoint = new Point2D(nplane[0]/2, nplane[1]/2);
    return dualPoint;
  };

  // IN: doubles x and y
  function Point2D (x, y) {
    this.x = x;
    this.y = y;
  }

  // Vector

  // IN: coordinates x, y, z
  function Vector (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  Vector.prototype.negate = function() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
  };

  // Normalizes X Y and Z in-place
  Vector.prototype.normalize = function() {
    var lenght = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    if (lenght > 0) {
      this.x /= lenght;
      this.y /= lenght;
      this.z /= lenght;
    }
  };

  // HEdge

  // IN: vertex orig, vertex dest, Face face
  function HEdge (orig, dest, face) {
    this.next = null;
    this.prev = null;
    this.twin = null;
    this.orig = orig;
    this.dest = dest;
    this.iFace = face;
  }

  HEdge.prototype.isHorizon = function() {
    return this.twin !== null && !this.iFace.marked && this.twin.iFace.marked;
  };

  // IN: array horizon
  HEdge.prototype.findHorizon = function(horizon) {
    if (this.isHorizon()) {
      if (horizon.length > 0 && this === horizon[0]) {
        return;
      } else {
        horizon.push(this);
        this.next.findHorizon(horizon);
      }
    } else {
      if (this.twin !== null) {
        this.twin.next.findHorizon(horizon);
      }
    }
  };

  // IN: vertices origin and dest
  HEdge.prototype.isEqual = function(origin, dest) {
    return ((this.orig.equals(origin) && this.dest.equals(dest)) || (this.orig.equals(dest) && this.dest.equals(origin)));
  };

  // from https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
  // (above link provided by https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

  function d3WeightedVoronoiError(message) {
    this.message = message;
    this.stack = new Error().stack;
  }

  d3WeightedVoronoiError.prototype.name = 'd3WeightedVoronoiError';
  d3WeightedVoronoiError.prototype = new Error();

  // Face


  // IN: Vertices a, b, c
  function Face(a, b, c, orient) {
    this.conflicts = new ConflictList(true);
    this.verts = [a, b, c];
    this.marked = false;
    var t = a.subtract(b).crossproduct(b.subtract(c));

    this.normal = new Vector(-t.x, -t.y, -t.z);
    this.normal.normalize();
    this.createEdges();
    this.dualPoint = null;

    if (orient != undefined) {
      this.orient(orient);
    }
  }

  // OUT: Point2D
  Face.prototype.getDualPoint = function () {
    if (this.dualPoint == null) {
      var plane3d = new Plane3D(this);
      this.dualPoint = plane3d.getDualPointMappedToPlane();
    }
    return this.dualPoint;
  };

  Face.prototype.isVisibleFromBelow = function () {
    return this.normal.z < -1.4259414393190911e-9;
  };

  Face.prototype.createEdges = function () {
    this.edges = [];
    this.edges[0] = new HEdge(this.verts[0], this.verts[1], this);
    this.edges[1] = new HEdge(this.verts[1], this.verts[2], this);
    this.edges[2] = new HEdge(this.verts[2], this.verts[0], this);
    this.edges[0].next = this.edges[1];
    this.edges[0].prev = this.edges[2];
    this.edges[1].next = this.edges[2];
    this.edges[1].prev = this.edges[0];
    this.edges[2].next = this.edges[0];
    this.edges[2].prev = this.edges[1];
  };

  // IN: vertex orient
  Face.prototype.orient = function (orient) {
    if (!(dot(this.normal, orient) < dot(this.normal, this.verts[0]))) {
      var temp = this.verts[1];
      this.verts[1] = this.verts[2];
      this.verts[2] = temp;
      this.normal.negate();
      this.createEdges();
    }
  };

  // IN: two vertices v0 and v1
  Face.prototype.getEdge = function (v0, v1) {
    for (var i = 0; i < 3; i++) {
      if (this.edges[i].isEqual(v0, v1)) {
        return this.edges[i];
      }
    }
    return null;
  };

  // IN: Face face, vertices v0 and v1
  Face.prototype.link = function (face, v0, v1) {
    if (face instanceof Face) {
      var twin = face.getEdge(v0, v1);
      if (twin === null) {
        throw new d3WeightedVoronoiError('when linking, twin is null');
      }
      var edge = this.getEdge(v0, v1);
      if (edge === null) {
        throw new d3WeightedVoronoiError('when linking, twin is null');
      }
      twin.twin = edge;
      edge.twin = twin;
    } else {
      var twin = face; // face is a hEdge
      var edge = this.getEdge(twin.orig, twin.dest);
      twin.twin = edge;
      edge.twin = twin;
    }
  };

  // IN: vertex v
  Face.prototype.conflict = function (v) {
    return dot(this.normal, v) > dot(this.normal, this.verts[0]) + epsilon;
  };

  Face.prototype.getHorizon = function () {
    for (var i = 0; i < 3; i++) {
      if (this.edges[i].twin !== null && this.edges[i].twin.isHorizon()) {
        return this.edges[i];
      }
    }
    return null;
  };

  Face.prototype.removeConflict = function () {
    this.conflicts.removeAll();
  };

  // convexHull.js

  function ConvexHull() {
    this.points = [];
    this.facets = [];
    this.created = [];
    this.horizon = [];
    this.visible = [];
    this.current = 0;
  }

  // IN: sites (x,y,z)
  ConvexHull.prototype.init = function (boundingSites, sites) {
    this.points = [];
    for (var i = 0; i < sites.length; i++) {
      this.points[i] = new Vertex(sites[i].x, sites[i].y, sites[i].z, null, sites[i], false);
    }
    this.points = this.points.concat(boundingSites);
  };

  ConvexHull.prototype.permutate = function () {
    var pointSize = this.points.length;
    for (var i = pointSize - 1; i > 0; i--) {
      var ra = Math.floor(Math.random() * i);
      var temp = this.points[ra];
      temp.index = i;
      var currentItem = this.points[i];
      currentItem.index = ra;
      this.points.splice(ra, 1, currentItem);
      this.points.splice(i, 1, temp);
    }
  };

  (ConvexHull.prototype.prep = function () {
    if (this.points.length <= 3) {
      throw new d3WeightedVoronoiError('Less than 4 points');
    }
    for (var i = 0; i < this.points.length; i++) {
      this.points[i].index = i;
    }

    var v0, v1, v2, v3;
    var f1, f2, f3, f0;
    v0 = this.points[0];
    v1 = this.points[1];
    v2 = v3 = null;

    // Searching for a third vertex, not aligned with the 2 firsts
    for (var i = 2; i < this.points.length; i++) {
      if (!(linearDependent(v0, this.points[i]) && linearDependent(v1, this.points[i]))) {
        v2 = this.points[i];
        v2.index = 2;
        this.points[2].index = i;
        this.points.splice(i, 1, this.points[2]);
        this.points.splice(2, 1, v2);
        break;
      }
    }
    if (v2 === null) {
      throw new d3WeightedVoronoiError('Not enough non-planar Points (v2 is null)');
    }

    // Create first JFace
    f0 = new Face(v0, v1, v2);
    // Searching for a fourth vertex, not coplanar to the 3 firsts
    for (var i = 3; i < this.points.length; i++) {
      if (!epsilonesque(dot(f0.normal, f0.verts[0]) - dot(f0.normal, this.points[i]))) {
        v3 = this.points[i];
        v3.index = 3;
        this.points[3].index = i;
        this.points.splice(i, 1, this.points[3]);
        this.points.splice(3, 1, v3);
        break;
      }
    }
    if (v3 === null) {
      throw new d3WeightedVoronoiError('Not enough non-planar Points (v3 is null)');
    }

    f0.orient(v3);
    f1 = new Face(v0, v2, v3, v1);
    f2 = new Face(v0, v1, v3, v2);
    f3 = new Face(v1, v2, v3, v0);
    this.addFacet(f0);
    this.addFacet(f1);
    this.addFacet(f2);
    this.addFacet(f3);
    // Connect facets
    f0.link(f1, v0, v2);
    f0.link(f2, v0, v1);
    f0.link(f3, v1, v2);
    f1.link(f2, v0, v3);
    f1.link(f3, v2, v3);
    f2.link(f3, v3, v1);
    this.current = 4;

    var v;
    for (var i = this.current; i < this.points.length; i++) {
      v = this.points[i];
      if (f0.conflict(v)) {
        this.addConflict(f0, v);
      }
      if (f1.conflict(v)) {
        this.addConflict(f1, v);
      }
      if (f2.conflict(v)) {
        this.addConflict(f2, v);
      }
      if (f3.conflict(v)) {
        this.addConflict(f3, v);
      }
    }
  }),
    // IN: Faces old1 old2 and fn
    (ConvexHull.prototype.addConflicts = function (old1, old2, fn) {
      var l1 = old1.conflicts.getVertices();
      var l2 = old2.conflicts.getVertices();
      var nCL = [];
      var v1, v2;
      var i, l;
      i = l = 0;
      // Fill the possible new Conflict List
      while (i < l1.length || l < l2.length) {
        if (i < l1.length && l < l2.length) {
          v1 = l1[i];
          v2 = l2[l];
          // If the index is the same, it's the same vertex and only 1 has to be added
          if (v1.index === v2.index) {
            nCL.push(v1);
            i++;
            l++;
          } else if (v1.index > v2.index) {
            nCL.push(v1);
            i++;
          } else {
            nCL.push(v2);
            l++;
          }
        } else if (i < l1.length) {
          nCL.push(l1[i++]);
        } else {
          nCL.push(l2[l++]);
        }
      }
      // Check if the possible conflicts are real conflicts
      for (var i = nCL.length - 1; i >= 0; i--) {
        v1 = nCL[i];
        if (fn.conflict(v1)) this.addConflict(fn, v1);
      }
    });

  // IN: Face face, Vertex v
  ConvexHull.prototype.addConflict = function (face, vert) {
    var e = new ConflictListNode(face, vert);
    face.conflicts.add(e);
    vert.conflicts.add(e);
  };

  // IN: Face f
  ConvexHull.prototype.removeConflict = function (f) {
    f.removeConflict();
    var index = f.index;
    f.index = -1;
    if (index === this.facets.length - 1) {
      this.facets.splice(this.facets.length - 1, 1);
      return;
    }
    if (index >= this.facets.length || index < 0) return;
    var last = this.facets.splice(this.facets.length - 1, 1);
    last[0].index = index;
    this.facets.splice(index, 1, last[0]);
  };

  // IN: Face face
  ConvexHull.prototype.addFacet = function (face) {
    face.index = this.facets.length;
    this.facets.push(face);
  };

  ConvexHull.prototype.compute = function () {
    this.prep();
    while (this.current < this.points.length) {
      var next = this.points[this.current];
      if (next.conflicts.isEmpty()) {
        // No conflict, point in hull
        this.current++;
        continue;
      }
      this.created = []; // TODO: make sure this is okay and doesn't dangle references
      this.horizon = [];
      this.visible = [];
      // The visible faces are also marked
      next.conflicts.fill(this.visible);
      // Horizon edges are orderly added to the horizon list
      var e;
      for (var jF = 0; jF < this.visible.length; jF++) {
        e = this.visible[jF].getHorizon();
        if (e !== null) {
          e.findHorizon(this.horizon);
          break;
        }
      }
      var last = null,
        first = null;
      // Iterate over horizon edges and create new faces oriented with the marked face 3rd unused point
      for (var hEi = 0; hEi < this.horizon.length; hEi++) {
        var hE = this.horizon[hEi];
        var fn = new Face(next, hE.orig, hE.dest, hE.twin.next.dest);
        fn.conflicts = new ConflictList(true);
        // Add to facet list
        this.addFacet(fn);
        this.created.push(fn);
        // Add new conflicts
        this.addConflicts(hE.iFace, hE.twin.iFace, fn);
        // Link the new face with the horizon edge
        fn.link(hE);
        if (last !== null) fn.link(last, next, hE.orig);
        last = fn;
        if (first === null) first = fn;
      }
      // Links the first and the last created JFace
      if (first !== null && last !== null) {
        last.link(first, next, this.horizon[0].orig);
      }
      if (this.created.length != 0) {
        // update conflict graph
        for (var f = 0; f < this.visible.length; f++) {
          this.removeConflict(this.visible[f]);
        }
        this.current++;
        this.created = [];
      }
    }
    return this.facets;
  };

  ConvexHull.prototype.clear = function () {
    this.points = [];
    this.facets = [];
    this.created = [];
    this.horizon = [];
    this.visible = [];
    this.current = 0;
  };

  function polygonClip(clip, subject) {
    // Version 0.0.0. Copyright 2017 Mike Bostock.

    // Clips the specified subject polygon to the specified clip polygon;
    // requires the clip polygon to be counterclockwise and convex.
    // https://en.wikipedia.org/wiki/Sutherland–Hodgman_algorithm
    // https://observablehq.com/@d3/polygonclip

    var input,
      closed = polygonClosed(subject),
      i = -1,
      n = clip.length - polygonClosed(clip),
      j,
      m,
      a = clip[n - 1],
      b,
      c,
      d,
      intersection;

    while (++i < n) {
      input = subject.slice();
      subject.length = 0;
      b = clip[i];
      c = input[(m = input.length - closed) - 1];
      j = -1;
      while (++j < m) {
        d = input[j];
        if (polygonInside(d, a, b)) {
          if (!polygonInside(c, a, b)) {
            intersection = polygonIntersect(c, d, a, b);
            if (isFinite(intersection[0])) {
              subject.push(intersection);
            }
          }
          subject.push(d);
        } else if (polygonInside(c, a, b)) {
          intersection = polygonIntersect(c, d, a, b);
          if (isFinite(intersection[0])) {
            subject.push(intersection);
          }
        }
        c = d;
      }
      if (closed) subject.push(subject[0]);
      a = b;
    }

    return subject;
  }

  function polygonInside(p, a, b) {
    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
  }

  // Intersect two infinite lines cd and ab.
  // Return Infinity if cd and ab colinear
  function polygonIntersect(c, d, a, b) {
    var x1 = c[0],
      x3 = a[0],
      x21 = d[0] - x1,
      x43 = b[0] - x3,
      y1 = c[1],
      y3 = a[1],
      y21 = d[1] - y1,
      y43 = b[1] - y3,
      ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
    return [x1 + ua * x21, y1 + ua * y21];
  }

  // Returns true if the polygon is closed.
  function polygonClosed(coordinates) {
    var a = coordinates[0],
      b = coordinates[coordinates.length - 1];
    return !(a[0] - b[0] || a[1] - b[1]);
  }

  // powerDiagram.js - computePowerDiagramIntegrated() and subroutines

  // IN: HEdge edge
  function getFacesOfDestVertex(edge) {
    var faces = [];
    var previous = edge;
    var first = edge.dest;
    var site = first.originalObject;
    var neighbours = [];
    do {
      previous = previous.twin.prev;
      var siteOrigin = previous.orig.originalObject;
      if (!siteOrigin.isDummy) {
        neighbours.push(siteOrigin);
      }
      var iFace = previous.iFace;
      if (iFace.isVisibleFromBelow()) {
        faces.push(iFace);
      }
    } while (previous !== edge);
    site.neighbours = neighbours;
    return faces;
  }

  // IN: Omega = convex bounding polygon
  // IN: S = unique set of sites with weights
  // OUT: Set of lines making up the voronoi power diagram
  function computePowerDiagramIntegrated (sites, boundingSites, clippingPolygon) {
    var convexHull = new ConvexHull();
    convexHull.clear();
    convexHull.init(boundingSites, sites);

    var facets = convexHull.compute(sites);
    var polygons = []; 
    var verticesVisited = [];
    var facetCount = facets.length;

    for (var i = 0; i < facetCount; i++) {
      var facet = facets[i];
      if (facet.isVisibleFromBelow()) {
        for (var e = 0; e < 3; e++) {
          // go through the edges and start to build the polygon by going through the double connected edge list
          var edge = facet.edges[e];
          var destVertex = edge.dest;
          var site = destVertex.originalObject; 

          if (!verticesVisited[destVertex.index]) {
            verticesVisited[destVertex.index] = true;
            if (site.isDummy) {
              // Check if this is one of the sites making the bounding polygon
              continue;
            }
            // faces around the vertices which correspond to the polygon corner points
            var faces = getFacesOfDestVertex(edge);
            var protopoly = [];
            var lastX = null;
            var lastY = null;
            var dx = 1;
            var dy = 1;
            for (var j = 0; j < faces.length; j++) {
              var point = faces[j].getDualPoint();
              var x1 = point.x;
              var y1 = point.y;
              if (lastX !== null) {
                dx = lastX - x1;
                dy = lastY - y1;
                if (dx < 0) {
                  dx = -dx;
                }
                if (dy < 0) {
                  dy = -dy;
                }
              }
              if (dx > epsilon || dy > epsilon) {
                protopoly.push([x1, y1]);
                lastX = x1;
                lastY = y1;
              }
            }
            
            site.nonClippedPolygon = protopoly.reverse();
            if (!site.isDummy && polygonLength(site.nonClippedPolygon) > 0) {
              var clippedPoly = polygonClip(clippingPolygon, site.nonClippedPolygon);
              site.polygon = clippedPoly;
              clippedPoly.site = site;
              if (clippedPoly.length > 0) {
                polygons.push(clippedPoly);
              }
            }
          }
        }
      }
    }
    return polygons;
  }

  function weightedVoronoi() {
    /////// Inputs ///////
    var x = function (d) {
      return d.x;
    }; // accessor to the x value
    var y = function (d) {
      return d.y;
    }; // accessor to the y value
    var weight = function (d) {
      return d.weight;
    }; // accessor to the weight
    var clip = [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ]; // clipping polygon
    var extent = [
      [0, 0],
      [1, 1],
    ]; // extent of the clipping polygon
    var size = [1, 1]; // [width, height] of the clipping polygon

    ///////////////////////
    ///////// API /////////
    ///////////////////////

    function _weightedVoronoi(data) {
      var formatedSites;

      //begin: map sites to the expected format of PowerDiagram
      formatedSites = data.map(function (d) {
        return new Vertex(x(d), y(d), null, weight(d), d, false);
      });
      //end: map sites to the expected format of PowerDiagram

      return computePowerDiagramIntegrated(formatedSites, boundingSites(), clip);
    }

    _weightedVoronoi.x = function (_) {
      if (!arguments.length) {
        return x;
      }

      x = _;
      return _weightedVoronoi;
    };

    _weightedVoronoi.y = function (_) {
      if (!arguments.length) {
        return y;
      }

      y = _;
      return _weightedVoronoi;
    };

    _weightedVoronoi.weight = function (_) {
      if (!arguments.length) {
        return weight;
      }

      weight = _;
      return _weightedVoronoi;
    };

    _weightedVoronoi.clip = function (_) {
      var direction, xExtent, yExtent;

      if (!arguments.length) {
        return clip;
      }

      xExtent = d3Extent(
        _.map(function (c) {
          return c[0];
        })
      );
      yExtent = d3Extent(
        _.map(function (c) {
          return c[1];
        })
      );
      direction = polygonDirection(_);
      if (direction === undefined) {
        clip = d3PolygonHull(_); // ensure clip to be a convex, hole-free, counterclockwise polygon
      } else if (direction === 1) {
        clip = _.reverse(); // already convex, order array in the same direction as d3-polygon.polygonHull(...)
      } else {
        clip = _;
      }
      extent = [
        [xExtent[0], yExtent[0]],
        [xExtent[1], yExtent[1]],
      ];
      size = [xExtent[1] - xExtent[0], yExtent[1] - yExtent[0]];
      return _weightedVoronoi;
    };

    _weightedVoronoi.extent = function (_) {
      if (!arguments.length) {
        return extent;
      }

      clip = [_[0], [_[0][0], _[1][1]], _[1], [_[1][0], _[0][1]]];
      extent = _;
      size = [_[1][0] - _[0][0], _[1][1] - _[0][1]];
      return _weightedVoronoi;
    };

    _weightedVoronoi.size = function (_) {
      if (!arguments.length) {
        return size;
      }

      clip = [
        [0, 0],
        [0, _[1]],
        [_[0], _[1]],
        [_[0], 0],
      ];
      extent = [[0, 0], _];
      size = _;
      return _weightedVoronoi;
    };

    ///////////////////////
    /////// Private ///////
    ///////////////////////

    function boundingSites() {
      var minX,
        maxX,
        minY,
        maxY,
        width,
        height,
        x0,
        x1,
        y0,
        y1,
        boundingData = [],
        boundingSites = [];

      minX = extent[0][0];
      maxX = extent[1][0];
      minY = extent[0][1];
      maxY = extent[1][1];
      width = maxX - minX;
      height = maxY - minY;
      x0 = minX - width;
      x1 = maxX + width;
      y0 = minY - height;
      y1 = maxY + height;

      // MUST be counterclockwise
      // if not, may produce 'TypeError: Cannot set property 'twin' of null' during computation
      // don't know how to test as it is not exposed
      boundingData[0] = [x0, y0];
      boundingData[1] = [x0, y1];
      boundingData[2] = [x1, y1];
      boundingData[3] = [x1, y0];

      for (var i = 0; i < 4; i++) {
        boundingSites.push(
          new Vertex(
            boundingData[i][0],
            boundingData[i][1],
            null,
            epsilon,
            new Vertex(boundingData[i][0], boundingData[i][1], null, epsilon, null, true),
            true
          )
        );
      }

      return boundingSites;
    }

    return _weightedVoronoi;
  }

  function FlickeringMitigation () {
    /////// Inputs ///////
    this.growthChangesLength = DEFAULT_LENGTH;
    this.totalAvailableArea = NaN;

    //begin: internals
    this.lastAreaError = NaN;
    this.lastGrowth = NaN;
    this.growthChanges = [];
    this.growthChangeWeights = generateGrowthChangeWeights(this.growthChangesLength); //used to make recent changes weighter than older changes
    this.growthChangeWeightsSum = computeGrowthChangeWeightsSum(this.growthChangeWeights);
    //end: internals
  }

  var DEFAULT_LENGTH = 10;

  function direction(h0, h1) {
    return (h0 >= h1)? 1 : -1;
  }

  function generateGrowthChangeWeights(length) {
    var initialWeight = 3;   // a magic number
    var weightDecrement = 1; // a magic number
    var minWeight = 1;

    var weightedCount = initialWeight;
    var growthChangeWeights = [];

    for (var i=0; i<length; i++) {
      growthChangeWeights.push(weightedCount);
      weightedCount -= weightDecrement;
      if (weightedCount<minWeight) { weightedCount = minWeight; }
    }
    return growthChangeWeights;
  }

  function computeGrowthChangeWeightsSum (growthChangeWeights) {
    var growthChangeWeightsSum = 0;
    for (var i=0; i<growthChangeWeights.length; i++) {
      growthChangeWeightsSum += growthChangeWeights[i];
    }
    return growthChangeWeightsSum;
  }

  ///////////////////////
  ///////// API /////////
  ///////////////////////

  FlickeringMitigation.prototype.reset = function () {
    this.lastAreaError = NaN;
    this.lastGrowth = NaN;
    this.growthChanges = [];
    this.growthChangesLength = DEFAULT_LENGTH;
    this.growthChangeWeights = generateGrowthChangeWeights(this.growthChangesLength);
    this.growthChangeWeightsSum = computeGrowthChangeWeightsSum(this.growthChangeWeights);
    this.totalAvailableArea = NaN;

    return this;
  };

  FlickeringMitigation.prototype.clear = function () {
    this.lastAreaError = NaN;
    this.lastGrowth = NaN;
    this.growthChanges = [];

    return this;
  };

  FlickeringMitigation.prototype.length = function (_) {
    if (!arguments.length) { return this.growthChangesLength; }

    if (parseInt(_)>0) {
      this.growthChangesLength = Math.floor(parseInt(_));
      this.growthChangeWeights = generateGrowthChangeWeights(this.growthChangesLength);
      this.growthChangeWeightsSum = computeGrowthChangeWeightsSum(this.growthChangeWeights);
    } else {
      console.warn("FlickeringMitigation.length() accepts only positive integers; unable to handle "+_);
    }
    return this;
  };

  FlickeringMitigation.prototype.totalArea = function (_) {
    if (!arguments.length) { return this.totalAvailableArea; }

    if (parseFloat(_)>0) {
      this.totalAvailableArea = parseFloat(_);
    } else {
      console.warn("FlickeringMitigation.totalArea() accepts only positive numbers; unable to handle "+_);
    }
    return this;
  };

  FlickeringMitigation.prototype.add = function (areaError) {
    var secondToLastAreaError, secondToLastGrowth;

    secondToLastAreaError = this.lastAreaError;
    this.lastAreaError = areaError;
    if (!isNaN(secondToLastAreaError)) {
      secondToLastGrowth = this.lastGrowth;
      this.lastGrowth = direction(this.lastAreaError, secondToLastAreaError);
    }
    if (!isNaN(secondToLastGrowth)) {
      this.growthChanges.unshift(this.lastGrowth!=secondToLastGrowth);
    }

    if (this.growthChanges.length>this.growthChangesLength) {
      this.growthChanges.pop();
    }
    return this;
  };

  FlickeringMitigation.prototype.ratio = function () {
    var weightedChangeCount = 0;
    var ratio;

    if (this.growthChanges.length < this.growthChangesLength) { return 0; }
    if (this.lastAreaError > this.totalAvailableArea/10) { return 0; }

    for(var i=0; i<this.growthChangesLength; i++) {
      if (this.growthChanges[i]) {
        weightedChangeCount += this.growthChangeWeights[i];
      }
    }

    ratio = weightedChangeCount/this.growthChangeWeightsSum;

    /*
    if (ratio>0) {
      console.log("flickering mitigation ratio: "+Math.floor(ratio*1000)/1000);
    }
    */

    return ratio;
  };

  function randomInitialPosition () {

    //begin: internals
    var clippingPolygon,
      extent,
      minX, maxX,
      minY, maxY,
      dx, dy;
    //end: internals

    ///////////////////////
    ///////// API /////////
    ///////////////////////

    function _random(d, i, arr, voronoiMapSimulation) {
      var shouldUpdateInternals = false;
      var x, y;

      if (clippingPolygon !== voronoiMapSimulation.clip()) {
        clippingPolygon = voronoiMapSimulation.clip();
        extent = voronoiMapSimulation.extent();
        shouldUpdateInternals = true;
      }

      if (shouldUpdateInternals) {
        updateInternals();
      }

      x = minX + dx * voronoiMapSimulation.prng()();
      y = minY + dy * voronoiMapSimulation.prng()();
      while (!d3PolygonContains(clippingPolygon, [x, y])) {
        x = minX + dx * voronoiMapSimulation.prng()();
        y = minY + dy * voronoiMapSimulation.prng()();
      }
      return [x, y];
    }
    ///////////////////////
    /////// Private ///////
    ///////////////////////

    function updateInternals() {
      minX = extent[0][0];
      maxX = extent[1][0];
      minY = extent[0][1];
      maxY = extent[1][1];
      dx = maxX - minX;
      dy = maxY - minY;
    }
    return _random;
  }

  function halfAverageAreaInitialWeight () {
    //begin: internals
    var clippingPolygon,
      dataArray,
      siteCount,
      totalArea,
      halfAverageArea;
    //end: internals

    ///////////////////////
    ///////// API /////////
    ///////////////////////
    function _halfAverageArea(d, i, arr, voronoiMapSimulation) {
      var shouldUpdateInternals = false;
      if (clippingPolygon !== voronoiMapSimulation.clip()) {
        clippingPolygon = voronoiMapSimulation.clip();
        shouldUpdateInternals |= true;
      }
      if (dataArray !== arr) {
        dataArray = arr;
        shouldUpdateInternals |= true;
      }

      if (shouldUpdateInternals) {
        updateInternals();
      }

      return halfAverageArea;
    }
    ///////////////////////
    /////// Private ///////
    ///////////////////////

    function updateInternals() {
      siteCount = dataArray.length;
      totalArea = d3PolygonArea(clippingPolygon);
      halfAverageArea = totalArea / siteCount / 2; // half of the average area of the the clipping polygon
    }

    return _halfAverageArea;
  }

  // from https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
  // (above link provided by https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

  function d3VoronoiMapError(message) {
    this.message = message;
    this.stack = new Error().stack;
  }

  d3VoronoiMapError.prototype.name = 'd3VoronoiMapError';
  d3VoronoiMapError.prototype = new Error();

  function voronoiMapSimulation(data) {
    //begin: constants
    var DEFAULT_CONVERGENCE_RATIO = 0.01;
    var DEFAULT_MAX_ITERATION_COUNT = 50;
    var DEFAULT_MIN_WEIGHT_RATIO = 0.01;
    var DEFAULT_PRNG = Math.random;
    var DEFAULT_INITIAL_POSITION = randomInitialPosition();
    var DEFAULT_INITIAL_WEIGHT = halfAverageAreaInitialWeight();
    var epsilon = 1e-10;
    //end: constants

    /////// Inputs ///////
    var weight = function (d) {
      return d.weight;
    }; // accessor to the weight
    var convergenceRatio = DEFAULT_CONVERGENCE_RATIO; // targeted allowed error ratio; default 0.01 stops computation when cell areas error <= 1% clipping polygon's area
    var maxIterationCount = DEFAULT_MAX_ITERATION_COUNT; // maximum allowed iteration; stops computation even if convergence is not reached; use a large amount for a sole converge-based computation stop
    var minWeightRatio = DEFAULT_MIN_WEIGHT_RATIO; // used to compute the minimum allowed weight; default 0.01 means 1% of max weight; handle near-zero weights, and leaves enought space for cell hovering
    var prng = DEFAULT_PRNG; // pseudorandom number generator
    var initialPosition = DEFAULT_INITIAL_POSITION; // accessor to the initial position; defaults to a random position inside the clipping polygon
    var initialWeight = DEFAULT_INITIAL_WEIGHT; // accessor to the initial weight; defaults to the average area of the clipping polygon

    //begin: internals
    var weightedVoronoi$1 = weightedVoronoi(),
      flickeringMitigation = new FlickeringMitigation(),
      shouldInitialize = true, // should initialize due to changes via APIs
      siteCount, // number of sites
      totalArea, // area of the clipping polygon
      areaErrorTreshold, // targeted allowed area error (= totalArea * convergenceRatio); below this treshold, map is considered obtained and computation stops
      iterationCount, // current iteration
      polygons, // current computed polygons
      areaError, // current area error
      converged, // true if (areaError < areaErrorTreshold)
      ended; // stores if computation is ended, either if computation has converged or if it has reached the maximum allowed iteration
    //end: internals
    //being: internals/simulation
    var simulation,
      stepper = timer(step),
      event = dispatch('tick', 'end');
    //end: internals/simulation

    //begin: algorithm conf.
    const HANDLE_OVERWEIGHTED_VARIANT = 1; // this option still exists 'cause for further experiments
    const HANLDE_OVERWEIGHTED_MAX_ITERATION_COUNT = 1000; // max number of tries to handle overweigthed sites
    var handleOverweighted;
    //end: algorithm conf.

    //begin: utils
    function sqr(d) {
      return Math.pow(d, 2);
    }

    function squaredDistance(s0, s1) {
      return sqr(s1.x - s0.x) + sqr(s1.y - s0.y);
    }
    //end: utils

    ///////////////////////
    ///////// API /////////
    ///////////////////////

    simulation = {
      tick: tick,

      restart: function () {
        stepper.restart(step);
        return simulation;
      },

      stop: function () {
        stepper.stop();
        return simulation;
      },

      weight: function (_) {
        if (!arguments.length) {
          return weight;
        }

        weight = _;
        shouldInitialize = true;
        return simulation;
      },

      convergenceRatio: function (_) {
        if (!arguments.length) {
          return convergenceRatio;
        }

        convergenceRatio = _;
        shouldInitialize = true;
        return simulation;
      },

      maxIterationCount: function (_) {
        if (!arguments.length) {
          return maxIterationCount;
        }

        maxIterationCount = _;
        return simulation;
      },

      minWeightRatio: function (_) {
        if (!arguments.length) {
          return minWeightRatio;
        }

        minWeightRatio = _;
        shouldInitialize = true;
        return simulation;
      },

      clip: function (_) {
        if (!arguments.length) {
          return weightedVoronoi$1.clip();
        }

        weightedVoronoi$1.clip(_);
        shouldInitialize = true;
        return simulation;
      },

      extent: function (_) {
        if (!arguments.length) {
          return weightedVoronoi$1.extent();
        }

        weightedVoronoi$1.extent(_);
        shouldInitialize = true;
        return simulation;
      },

      size: function (_) {
        if (!arguments.length) {
          return weightedVoronoi$1.size();
        }

        weightedVoronoi$1.size(_);
        shouldInitialize = true;
        return simulation;
      },

      prng: function (_) {
        if (!arguments.length) {
          return prng;
        }

        prng = _;
        shouldInitialize = true;
        return simulation;
      },

      initialPosition: function (_) {
        if (!arguments.length) {
          return initialPosition;
        }

        initialPosition = _;
        shouldInitialize = true;
        return simulation;
      },

      initialWeight: function (_) {
        if (!arguments.length) {
          return initialWeight;
        }

        initialWeight = _;
        shouldInitialize = true;
        return simulation;
      },

      state: function () {
        if (shouldInitialize) {
          initializeSimulation();
        }
        return {
          ended: ended,
          iterationCount: iterationCount,
          convergenceRatio: areaError / totalArea,
          polygons: polygons,
        };
      },

      on: function (name, _) {
        if (arguments.length === 1) {
          return event.on(name);
        }

        event.on(name, _);
        return simulation;
      },
    };

    ///////////////////////
    /////// Private ///////
    ///////////////////////

    //begin: simulation's main loop
    function step() {
      tick();
      event.call('tick', simulation);
      if (ended) {
        stepper.stop();
        event.call('end', simulation);
      }
    }
    //end: simulation's main loop

    //begin: algorithm used at each iteration
    function tick() {
      if (!ended) {
        if (shouldInitialize) {
          initializeSimulation();
        }
        polygons = adapt(polygons, flickeringMitigation.ratio());
        iterationCount++;
        areaError = computeAreaError(polygons);
        flickeringMitigation.add(areaError);
        converged = areaError < areaErrorTreshold;
        ended = converged || iterationCount >= maxIterationCount;
        // console.log("error %: "+Math.round(areaError*100*1000/totalArea)/1000);
      }
    }
    //end: algorithm used at each iteration

    function initializeSimulation() {
      //begin: handle algorithm's variants
      setHandleOverweighted();
      //end: handle algorithm's variants

      siteCount = data.length;
      totalArea = Math.abs(d3PolygonArea(weightedVoronoi$1.clip()));
      areaErrorTreshold = convergenceRatio * totalArea;
      flickeringMitigation.clear().totalArea(totalArea);

      iterationCount = 0;
      converged = false;
      polygons = initialize(data, simulation);
      ended = false;
      shouldInitialize = false;
    }

    function initialize(data, simulation) {
      var maxWeight = data.reduce(function (max, d) {
          return Math.max(max, weight(d));
        }, -Infinity),
        minAllowedWeight = maxWeight * minWeightRatio;
      var weights, mapPoints;

      //begin: extract weights
      weights = data.map(function (d, i, arr) {
        return {
          index: i,
          weight: Math.max(weight(d), minAllowedWeight),
          initialPosition: initialPosition(d, i, arr, simulation),
          initialWeight: initialWeight(d, i, arr, simulation),
          originalData: d,
        };
      });
      //end: extract weights

      // create map-related points
      // (with targetedArea, initial position and initialWeight)
      mapPoints = createMapPoints(weights, simulation);
      handleOverweighted(mapPoints);
      return weightedVoronoi$1(mapPoints);
    }

    function createMapPoints(basePoints, simulation) {
      var totalWeight = basePoints.reduce(function (acc, bp) {
        return (acc += bp.weight);
      }, 0);
      var initialPosition;

      return basePoints.map(function (bp, i, bps) {
        initialPosition = bp.initialPosition;

        if (!d3PolygonContains(weightedVoronoi$1.clip(), initialPosition)) {
          initialPosition = DEFAULT_INITIAL_POSITION(bp, i, bps, simulation);
        }

        return {
          index: bp.index,
          targetedArea: (totalArea * bp.weight) / totalWeight,
          data: bp,
          x: initialPosition[0],
          y: initialPosition[1],
          weight: bp.initialWeight, // ArlindNocaj/Voronoi-Treemap-Library uses an epsilonesque initial weight; using heavier initial weights allows faster weight adjustements, hence faster stabilization
        };
      });
    }

    function adapt(polygons, flickeringMitigationRatio) {
      var adaptedMapPoints;

      adaptPositions(polygons, flickeringMitigationRatio);
      adaptedMapPoints = polygons.map(function (p) {
        return p.site.originalObject;
      });
      polygons = weightedVoronoi$1(adaptedMapPoints);
      if (polygons.length < siteCount) {
        throw new d3VoronoiMapError('at least 1 site has no area, which is not supposed to arise');
      }

      adaptWeights(polygons, flickeringMitigationRatio);
      adaptedMapPoints = polygons.map(function (p) {
        return p.site.originalObject;
      });
      polygons = weightedVoronoi$1(adaptedMapPoints);
      if (polygons.length < siteCount) {
        throw new d3VoronoiMapError('at least 1 site has no area, which is not supposed to arise');
      }

      return polygons;
    }

    function adaptPositions(polygons, flickeringMitigationRatio) {
      var newMapPoints = [],
        flickeringInfluence = 0.5;
      var flickeringMitigation, d, polygon, mapPoint, centroid, dx, dy;

      flickeringMitigation = flickeringInfluence * flickeringMitigationRatio;
      d = 1 - flickeringMitigation; // in [0.5, 1]
      for (var i = 0; i < siteCount; i++) {
        polygon = polygons[i];
        mapPoint = polygon.site.originalObject;
        centroid = d3PolygonCentroid(polygon);

        dx = centroid[0] - mapPoint.x;
        dy = centroid[1] - mapPoint.y;

        //begin: handle excessive change;
        dx *= d;
        dy *= d;
        //end: handle excessive change;

        mapPoint.x += dx;
        mapPoint.y += dy;

        newMapPoints.push(mapPoint);
      }

      handleOverweighted(newMapPoints);
    }

    function adaptWeights(polygons, flickeringMitigationRatio) {
      var newMapPoints = [],
        flickeringInfluence = 0.1;
      var flickeringMitigation, polygon, mapPoint, currentArea, adaptRatio, adaptedWeight;

      flickeringMitigation = flickeringInfluence * flickeringMitigationRatio;
      for (var i = 0; i < siteCount; i++) {
        polygon = polygons[i];
        mapPoint = polygon.site.originalObject;
        currentArea = d3PolygonArea(polygon);
        adaptRatio = mapPoint.targetedArea / currentArea;

        //begin: handle excessive change;
        adaptRatio = Math.max(adaptRatio, 1 - flickeringInfluence + flickeringMitigation); // in [(1-flickeringInfluence), 1]
        adaptRatio = Math.min(adaptRatio, 1 + flickeringInfluence - flickeringMitigation); // in [1, (1+flickeringInfluence)]
        //end: handle excessive change;

        adaptedWeight = mapPoint.weight * adaptRatio;
        adaptedWeight = Math.max(adaptedWeight, epsilon);

        mapPoint.weight = adaptedWeight;

        newMapPoints.push(mapPoint);
      }

      handleOverweighted(newMapPoints);
    }

    // heuristics: lower heavy weights
    function handleOverweighted0(mapPoints) {
      var fixCount = 0;
      var fixApplied, tpi, tpj, weightest, lightest, sqrD, adaptedWeight;
      do {
        if (fixCount > HANLDE_OVERWEIGHTED_MAX_ITERATION_COUNT) {
          throw new d3VoronoiMapError('handleOverweighted0 is looping too much');
        }
        fixApplied = false;
        for (var i = 0; i < siteCount; i++) {
          tpi = mapPoints[i];
          for (var j = i + 1; j < siteCount; j++) {
            tpj = mapPoints[j];
            if (tpi.weight > tpj.weight) {
              weightest = tpi;
              lightest = tpj;
            } else {
              weightest = tpj;
              lightest = tpi;
            }
            sqrD = squaredDistance(tpi, tpj);
            if (sqrD < weightest.weight - lightest.weight) {
              // adaptedWeight = sqrD - epsilon; // as in ArlindNocaj/Voronoi-Treemap-Library
              // adaptedWeight = sqrD + lightest.weight - epsilon; // works, but below heuristics performs better (less flickering)
              adaptedWeight = sqrD + lightest.weight / 2;
              adaptedWeight = Math.max(adaptedWeight, epsilon);
              weightest.weight = adaptedWeight;
              fixApplied = true;
              fixCount++;
              break;
            }
          }
          if (fixApplied) {
            break;
          }
        }
      } while (fixApplied);

      /*
      if (fixCount > 0) {
        console.log('# fix: ' + fixCount);
      }
      */
    }

    // heuristics: increase light weights
    function handleOverweighted1(mapPoints) {
      var fixCount = 0;
      var fixApplied, tpi, tpj, weightest, lightest, sqrD, overweight;
      do {
        if (fixCount > HANLDE_OVERWEIGHTED_MAX_ITERATION_COUNT) {
          throw new d3VoronoiMapError('handleOverweighted1 is looping too much');
        }
        fixApplied = false;
        for (var i = 0; i < siteCount; i++) {
          tpi = mapPoints[i];
          for (var j = i + 1; j < siteCount; j++) {
            tpj = mapPoints[j];
            if (tpi.weight > tpj.weight) {
              weightest = tpi;
              lightest = tpj;
            } else {
              weightest = tpj;
              lightest = tpi;
            }
            sqrD = squaredDistance(tpi, tpj);
            if (sqrD < weightest.weight - lightest.weight) {
              overweight = weightest.weight - lightest.weight - sqrD;
              lightest.weight += overweight + epsilon;
              fixApplied = true;
              fixCount++;
              break;
            }
          }
          if (fixApplied) {
            break;
          }
        }
      } while (fixApplied);

      /*
      if (fixCount > 0) {
        console.log('# fix: ' + fixCount);
      }
      */
    }

    function computeAreaError(polygons) {
      //convergence based on summation of all sites current areas
      var areaErrorSum = 0;
      var polygon, mapPoint, currentArea;
      for (var i = 0; i < siteCount; i++) {
        polygon = polygons[i];
        mapPoint = polygon.site.originalObject;
        currentArea = d3PolygonArea(polygon);
        areaErrorSum += Math.abs(mapPoint.targetedArea - currentArea);
      }
      return areaErrorSum;
    }

    function setHandleOverweighted() {
      switch (HANDLE_OVERWEIGHTED_VARIANT) {
        case 0:
          handleOverweighted = handleOverweighted0;
          break;
        case 1:
          handleOverweighted = handleOverweighted1;
          break;
        default:
          console.error("unknown 'handleOverweighted' variant; using variant #1");
          handleOverweighted = handleOverweighted0;
      }
    }

    return simulation;
  }

  function voronoiTreemap() {
    //begin: constants
    var DEFAULT_CONVERGENCE_RATIO = 0.01;
    var DEFAULT_MAX_ITERATION_COUNT = 50;
    var DEFAULT_MIN_WEIGHT_RATIO = 0.01;
    var DEFAULT_PRNG = Math.random;
    //end: constants

    /////// Inputs ///////
    var clip = [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ]; // clipping polygon
    var extent = [
      [0, 0],
      [1, 1],
    ]; // extent of the clipping polygon
    var size = [1, 1]; // [width, height] of the clipping polygon
    var convergenceRatio = DEFAULT_CONVERGENCE_RATIO; // targeted allowed error ratio; default 0.01 stops computation when cell areas error <= 1% clipping polygon's area
    var maxIterationCount = DEFAULT_MAX_ITERATION_COUNT; // maximum allowed iteration; stops computation even if convergence is not reached; use a large amount for a sole converge-based computation stop
    var minWeightRatio = DEFAULT_MIN_WEIGHT_RATIO; // used to compute the minimum allowed weight; default 0.01 means 1% of max weight; handle near-zero weights, and leaves enought space for cell hovering
    var prng = DEFAULT_PRNG; // pseudorandom number generator

    //begin: internals
    var unrelevantButNeedeData = [
      {
        weight: 1,
      },
      {
        weight: 1,
      },
    ];
    var _convenientReusableVoronoiMapSimulation = voronoiMapSimulation(unrelevantButNeedeData).stop();
    //end: internals

    ///////////////////////
    ///////// API /////////
    ///////////////////////

    function _voronoiTreemap(rootNode) {
      recurse(clip, rootNode);
    }

    _voronoiTreemap.convergenceRatio = function (_) {
      if (!arguments.length) {
        return convergenceRatio;
      }

      convergenceRatio = _;
      return _voronoiTreemap;
    };

    _voronoiTreemap.maxIterationCount = function (_) {
      if (!arguments.length) {
        return maxIterationCount;
      }

      maxIterationCount = _;
      return _voronoiTreemap;
    };

    _voronoiTreemap.minWeightRatio = function (_) {
      if (!arguments.length) {
        return minWeightRatio;
      }

      minWeightRatio = _;
      return _voronoiTreemap;
    };

    _voronoiTreemap.clip = function (_) {
      if (!arguments.length) {
        return clip;
      }

      //begin: use voronoiMap.clip() to handle clip/extent/size computation and borderline input (non-counterclockwise, non-convex, ...)
      _convenientReusableVoronoiMapSimulation.clip(_);
      //end: use voronoiMap.clip() to handle clip/extent/size computation
      clip = _convenientReusableVoronoiMapSimulation.clip();
      extent = _convenientReusableVoronoiMapSimulation.extent();
      size = _convenientReusableVoronoiMapSimulation.size();
      return _voronoiTreemap;
    };

    _voronoiTreemap.extent = function (_) {
      if (!arguments.length) {
        return extent;
      }

      //begin: use voronoiMap.extent() to handle clip/extent/size computation
      _convenientReusableVoronoiMapSimulation.extent(_);
      //end: use voronoiMap.clip() to handle clip/extent/size computation
      clip = _convenientReusableVoronoiMapSimulation.clip();
      extent = _convenientReusableVoronoiMapSimulation.extent();
      size = _convenientReusableVoronoiMapSimulation.size();
      return _voronoiTreemap;
    };

    _voronoiTreemap.size = function (_) {
      if (!arguments.length) {
        return size;
      }

      //begin: use voronoiMap.size() to handle clip/extent/size computation
      _convenientReusableVoronoiMapSimulation.size(_);
      //end: use voronoiMap.clip() to handle clip/extent/size computation
      clip = _convenientReusableVoronoiMapSimulation.clip();
      extent = _convenientReusableVoronoiMapSimulation.extent();
      size = _convenientReusableVoronoiMapSimulation.size();
      return _voronoiTreemap;
    };

    _voronoiTreemap.prng = function (_) {
      if (!arguments.length) {
        return prng;
      }

      prng = _;
      return _voronoiTreemap;
    };

    ///////////////////////
    /////// Private ///////
    ///////////////////////

    function recurse(clippingPolygon, node) {
      var simulation;

      //assign polygon to node
      node.polygon = clippingPolygon;

      if (node.height != 0) {
        //compute one-level Voronoi map of children
        simulation = voronoiMapSimulation(node.children)
          .clip(clippingPolygon)
          .weight(function (d) {
            return d.value;
          })
          .convergenceRatio(convergenceRatio)
          .maxIterationCount(maxIterationCount)
          .minWeightRatio(minWeightRatio)
          .prng(prng)
          .stop();

        var state = simulation.state(); // retrieve the Voronoï map simulation's state

        //begin: manually launch each iteration until the Voronoï map simulation ends
        while (!state.ended) {
          simulation.tick();
          state = simulation.state();
        }
        //end: manually launch each iteration until the Voronoï map simulation ends

        //begin: recurse on children
        state.polygons.forEach(function (cp) {
          recurse(cp, cp.site.originalObject.data.originalData);
        });
        //end: recurse on children
      }
    }

    return _voronoiTreemap;
  }

  const _voronoiTreemap = voronoiTreemap();

  function processData(data) {
      const rows = Array.isArray(data) ? data : data.data;
      if (!rows || rows.length === 0) return null;

      const hasTwoLevels = !!rows[0].secondLevel;

      let rootData;
      if (hasTwoLevels) {
          const grouped = {};
          rows.forEach(d => {
              if (!grouped[d.firstLevel]) grouped[d.firstLevel] = [];
              grouped[d.firstLevel].push(d);
          });

          rootData = {
              name: "root",
              children: Object.keys(grouped).map(key => ({
                  name: key,
                  children: grouped[key].map(d => ({
                      name: d.secondLevel,
                      value: +d.values || 0
                  }))
              }))
          };
      } else {
          rootData = {
              name: "root",
              children: rows.map(d => ({
                  name: d.firstLevel,
                  value: +d.values || 0
              }))
          };
      }

      return hierarchy(rootData)
          .sum(d => d.value);
  }

  function drawVoronoi(svg, hierarchy, width, height) {
      if (!hierarchy) return;

      // Clipping polygon (counterclockwise rectangle)
      const clip = [[0, 0], [0, height], [width, height], [width, 0]];

      _voronoiTreemap
          .clip(clip)
          .convergenceRatio(0.001)
          .maxIterationCount(50);

      _voronoiTreemap(hierarchy);

      // Clear previous paths
      const cells = svg.querySelector(".cells");
      if (cells) cells.remove();

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "cells");

      hierarchy.leaves().forEach(leaf => {
          if (!leaf.polygon || leaf.polygon.length === 0) return;

          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", "M" + leaf.polygon.map(pt => pt[0] + "," + pt[1]).join("L") + "Z");
          path.setAttribute("fill", "#ccc");
          path.setAttribute("stroke", "#fff");
          path.setAttribute("stroke-width", "1");
          g.appendChild(path);
      });

      svg.appendChild(g);
  }

  let svg;

  function sizeSvg() {
      const width = layout.getPrimaryWidth();
      const height = layout.getPrimaryHeight();
      svg.setAttribute("width", width);
      svg.setAttribute("height", height);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  }

  function draw() {
      const container = layout.getSection("primary");

      layout.update();

      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.style.border = "1px solid red";
      container.appendChild(svg);
      sizeSvg();

      console.log("data", data);
      console.log("processed data", processData(data));
  }

  function update() {
      layout.update();
      sizeSvg();

      const hierarchy = processData(data);
      if (!hierarchy) return;

      const width = layout.getPrimaryWidth();
      const height = layout.getPrimaryHeight();
      drawVoronoi(svg, hierarchy, width, height);
  }

  exports.data = data;
  exports.draw = draw;
  exports.state = state;
  exports.update = update;

  return exports;

})({});
//# sourceMappingURL=template.js.map
