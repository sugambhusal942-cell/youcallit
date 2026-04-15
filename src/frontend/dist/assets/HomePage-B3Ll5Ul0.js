import { c as createLucideIcon, f as frame, a as cancelFrame, i as interpolate, s as supportsViewTimeline, b as supportsScrollTimeline, p as progress, v as velocityPerSecond, d as isHTMLElement, e as defaultOffset$1, g as clamp, n as noop, r as resize, h as frameData, u as useConstant, j as reactExports, k as useIsomorphicLayoutEffect, l as invariant, m as motionValue, M as MotionConfigContext, o as collectMotionValues, q as jsxRuntimeExports, t as motion, L as Link, B as Button, w as MessageCircle, x as useCartStore, S as ShoppingCart, A as AnimatePresence } from "./index-BMSJKAYU.js";
import { S as Star } from "./star-CizS4Nlo.js";
import { C as ChevronDown } from "./chevron-down-CpJE65bI.js";
import { F as Flame, S as Sparkles } from "./sparkles-bNjp5k0Y.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
      key: "nnexq3"
    }
  ],
  ["path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12", key: "mt58a7" }]
];
const Leaf = createLucideIcon("leaf", __iconNode);
function observeTimeline(update, timeline) {
  let prevProgress;
  const onFrame = () => {
    const { currentTime } = timeline;
    const percentage = currentTime === null ? 0 : currentTime.value;
    const progress2 = percentage / 100;
    if (prevProgress !== progress2) {
      update(progress2);
    }
    prevProgress = progress2;
  };
  frame.preUpdate(onFrame, true);
  return () => cancelFrame(onFrame);
}
function transform(...args) {
  const useImmediate = !Array.isArray(args[0]);
  const argOffset = useImmediate ? 0 : -1;
  const inputValue = args[0 + argOffset];
  const inputRange = args[1 + argOffset];
  const outputRange = args[2 + argOffset];
  const options = args[3 + argOffset];
  const interpolator = interpolate(inputRange, outputRange, options);
  return useImmediate ? interpolator(inputValue) : interpolator;
}
function canUseNativeTimeline(target) {
  if (typeof window === "undefined")
    return false;
  return target ? supportsViewTimeline() : supportsScrollTimeline();
}
const maxElapsed = 50;
const createAxisInfo = () => ({
  current: 0,
  offset: [],
  progress: 0,
  scrollLength: 0,
  targetOffset: 0,
  targetLength: 0,
  containerLength: 0,
  velocity: 0
});
const createScrollInfo = () => ({
  time: 0,
  x: createAxisInfo(),
  y: createAxisInfo()
});
const keys = {
  x: {
    length: "Width",
    position: "Left"
  },
  y: {
    length: "Height",
    position: "Top"
  }
};
function updateAxisInfo(element, axisName, info, time) {
  const axis = info[axisName];
  const { length, position } = keys[axisName];
  const prev = axis.current;
  const prevTime = info.time;
  axis.current = Math.abs(element[`scroll${position}`]);
  axis.scrollLength = element[`scroll${length}`] - element[`client${length}`];
  axis.offset.length = 0;
  axis.offset[0] = 0;
  axis.offset[1] = axis.scrollLength;
  axis.progress = progress(0, axis.scrollLength, axis.current);
  const elapsed = time - prevTime;
  axis.velocity = elapsed > maxElapsed ? 0 : velocityPerSecond(axis.current - prev, elapsed);
}
function updateScrollInfo(element, info, time) {
  updateAxisInfo(element, "x", info, time);
  updateAxisInfo(element, "y", info, time);
  info.time = time;
}
function calcInset(element, container) {
  const inset = { x: 0, y: 0 };
  let current = element;
  while (current && current !== container) {
    if (isHTMLElement(current)) {
      inset.x += current.offsetLeft;
      inset.y += current.offsetTop;
      current = current.offsetParent;
    } else if (current.tagName === "svg") {
      const svgBoundingBox = current.getBoundingClientRect();
      current = current.parentElement;
      const parentBoundingBox = current.getBoundingClientRect();
      inset.x += svgBoundingBox.left - parentBoundingBox.left;
      inset.y += svgBoundingBox.top - parentBoundingBox.top;
    } else if (current instanceof SVGGraphicsElement) {
      const { x, y } = current.getBBox();
      inset.x += x;
      inset.y += y;
      let svg = null;
      let parent = current.parentNode;
      while (!svg) {
        if (parent.tagName === "svg") {
          svg = parent;
        }
        parent = current.parentNode;
      }
      current = svg;
    } else {
      break;
    }
  }
  return inset;
}
const namedEdges = {
  start: 0,
  center: 0.5,
  end: 1
};
function resolveEdge(edge, length, inset = 0) {
  let delta = 0;
  if (edge in namedEdges) {
    edge = namedEdges[edge];
  }
  if (typeof edge === "string") {
    const asNumber = parseFloat(edge);
    if (edge.endsWith("px")) {
      delta = asNumber;
    } else if (edge.endsWith("%")) {
      edge = asNumber / 100;
    } else if (edge.endsWith("vw")) {
      delta = asNumber / 100 * document.documentElement.clientWidth;
    } else if (edge.endsWith("vh")) {
      delta = asNumber / 100 * document.documentElement.clientHeight;
    } else {
      edge = asNumber;
    }
  }
  if (typeof edge === "number") {
    delta = length * edge;
  }
  return inset + delta;
}
const defaultOffset = [0, 0];
function resolveOffset(offset, containerLength, targetLength, targetInset) {
  let offsetDefinition = Array.isArray(offset) ? offset : defaultOffset;
  let targetPoint = 0;
  let containerPoint = 0;
  if (typeof offset === "number") {
    offsetDefinition = [offset, offset];
  } else if (typeof offset === "string") {
    offset = offset.trim();
    if (offset.includes(" ")) {
      offsetDefinition = offset.split(" ");
    } else {
      offsetDefinition = [offset, namedEdges[offset] ? offset : `0`];
    }
  }
  targetPoint = resolveEdge(offsetDefinition[0], targetLength, targetInset);
  containerPoint = resolveEdge(offsetDefinition[1], containerLength);
  return targetPoint - containerPoint;
}
const ScrollOffset = {
  Enter: [
    [0, 1],
    [1, 1]
  ],
  Exit: [
    [0, 0],
    [1, 0]
  ],
  Any: [
    [1, 0],
    [0, 1]
  ],
  All: [
    [0, 0],
    [1, 1]
  ]
};
const point = { x: 0, y: 0 };
function getTargetSize(target) {
  return "getBBox" in target && target.tagName !== "svg" ? target.getBBox() : { width: target.clientWidth, height: target.clientHeight };
}
function resolveOffsets(container, info, options) {
  const { offset: offsetDefinition = ScrollOffset.All } = options;
  const { target = container, axis = "y" } = options;
  const lengthLabel = axis === "y" ? "height" : "width";
  const inset = target !== container ? calcInset(target, container) : point;
  const targetSize = target === container ? { width: container.scrollWidth, height: container.scrollHeight } : getTargetSize(target);
  const containerSize = {
    width: container.clientWidth,
    height: container.clientHeight
  };
  info[axis].offset.length = 0;
  let hasChanged = !info[axis].interpolate;
  const numOffsets = offsetDefinition.length;
  for (let i = 0; i < numOffsets; i++) {
    const offset = resolveOffset(offsetDefinition[i], containerSize[lengthLabel], targetSize[lengthLabel], inset[axis]);
    if (!hasChanged && offset !== info[axis].interpolatorOffsets[i]) {
      hasChanged = true;
    }
    info[axis].offset[i] = offset;
  }
  if (hasChanged) {
    info[axis].interpolate = interpolate(info[axis].offset, defaultOffset$1(offsetDefinition), { clamp: false });
    info[axis].interpolatorOffsets = [...info[axis].offset];
  }
  info[axis].progress = clamp(0, 1, info[axis].interpolate(info[axis].current));
}
function measure(container, target = container, info) {
  info.x.targetOffset = 0;
  info.y.targetOffset = 0;
  if (target !== container) {
    let node = target;
    while (node && node !== container) {
      info.x.targetOffset += node.offsetLeft;
      info.y.targetOffset += node.offsetTop;
      node = node.offsetParent;
    }
  }
  info.x.targetLength = target === container ? target.scrollWidth : target.clientWidth;
  info.y.targetLength = target === container ? target.scrollHeight : target.clientHeight;
  info.x.containerLength = container.clientWidth;
  info.y.containerLength = container.clientHeight;
}
function createOnScrollHandler(element, onScroll, info, options = {}) {
  return {
    measure: (time) => {
      measure(element, options.target, info);
      updateScrollInfo(element, info, time);
      if (options.offset || options.target) {
        resolveOffsets(element, info, options);
      }
    },
    notify: () => onScroll(info)
  };
}
const scrollListeners = /* @__PURE__ */ new WeakMap();
const resizeListeners = /* @__PURE__ */ new WeakMap();
const onScrollHandlers = /* @__PURE__ */ new WeakMap();
const scrollSize = /* @__PURE__ */ new WeakMap();
const dimensionCheckProcesses = /* @__PURE__ */ new WeakMap();
const getEventTarget = (element) => element === document.scrollingElement ? window : element;
function scrollInfo(onScroll, { container = document.scrollingElement, trackContentSize = false, ...options } = {}) {
  if (!container)
    return noop;
  let containerHandlers = onScrollHandlers.get(container);
  if (!containerHandlers) {
    containerHandlers = /* @__PURE__ */ new Set();
    onScrollHandlers.set(container, containerHandlers);
  }
  const info = createScrollInfo();
  const containerHandler = createOnScrollHandler(container, onScroll, info, options);
  containerHandlers.add(containerHandler);
  if (!scrollListeners.has(container)) {
    const measureAll = () => {
      for (const handler of containerHandlers) {
        handler.measure(frameData.timestamp);
      }
      frame.preUpdate(notifyAll);
    };
    const notifyAll = () => {
      for (const handler of containerHandlers) {
        handler.notify();
      }
    };
    const listener2 = () => frame.read(measureAll);
    scrollListeners.set(container, listener2);
    const target = getEventTarget(container);
    window.addEventListener("resize", listener2);
    if (container !== document.documentElement) {
      resizeListeners.set(container, resize(container, listener2));
    }
    target.addEventListener("scroll", listener2);
    listener2();
  }
  if (trackContentSize && !dimensionCheckProcesses.has(container)) {
    const listener2 = scrollListeners.get(container);
    const size = {
      width: container.scrollWidth,
      height: container.scrollHeight
    };
    scrollSize.set(container, size);
    const checkScrollDimensions = () => {
      const newWidth = container.scrollWidth;
      const newHeight = container.scrollHeight;
      if (size.width !== newWidth || size.height !== newHeight) {
        listener2();
        size.width = newWidth;
        size.height = newHeight;
      }
    };
    const dimensionCheckProcess = frame.read(checkScrollDimensions, true);
    dimensionCheckProcesses.set(container, dimensionCheckProcess);
  }
  const listener = scrollListeners.get(container);
  frame.read(listener, false, true);
  return () => {
    var _a;
    cancelFrame(listener);
    const currentHandlers = onScrollHandlers.get(container);
    if (!currentHandlers)
      return;
    currentHandlers.delete(containerHandler);
    if (currentHandlers.size)
      return;
    const scrollListener = scrollListeners.get(container);
    scrollListeners.delete(container);
    if (scrollListener) {
      getEventTarget(container).removeEventListener("scroll", scrollListener);
      (_a = resizeListeners.get(container)) == null ? void 0 : _a();
      window.removeEventListener("resize", scrollListener);
    }
    const dimensionCheckProcess = dimensionCheckProcesses.get(container);
    if (dimensionCheckProcess) {
      cancelFrame(dimensionCheckProcess);
      dimensionCheckProcesses.delete(container);
    }
    scrollSize.delete(container);
  };
}
const presets = [
  [ScrollOffset.Enter, "entry"],
  [ScrollOffset.Exit, "exit"],
  [ScrollOffset.Any, "cover"],
  [ScrollOffset.All, "contain"]
];
const stringToProgress = {
  start: 0,
  end: 1
};
function parseStringOffset(s) {
  const parts = s.trim().split(/\s+/);
  if (parts.length !== 2)
    return void 0;
  const a = stringToProgress[parts[0]];
  const b = stringToProgress[parts[1]];
  if (a === void 0 || b === void 0)
    return void 0;
  return [a, b];
}
function normaliseOffset(offset) {
  if (offset.length !== 2)
    return void 0;
  const result = [];
  for (const item of offset) {
    if (Array.isArray(item)) {
      result.push(item);
    } else if (typeof item === "string") {
      const parsed = parseStringOffset(item);
      if (!parsed)
        return void 0;
      result.push(parsed);
    } else {
      return void 0;
    }
  }
  return result;
}
function matchesPreset(offset, preset) {
  const normalised = normaliseOffset(offset);
  if (!normalised)
    return false;
  for (let i = 0; i < 2; i++) {
    const o = normalised[i];
    const p = preset[i];
    if (o[0] !== p[0] || o[1] !== p[1])
      return false;
  }
  return true;
}
function offsetToViewTimelineRange(offset) {
  if (!offset) {
    return { rangeStart: "contain 0%", rangeEnd: "contain 100%" };
  }
  for (const [preset, name] of presets) {
    if (matchesPreset(offset, preset)) {
      return { rangeStart: `${name} 0%`, rangeEnd: `${name} 100%` };
    }
  }
  return void 0;
}
const timelineCache = /* @__PURE__ */ new Map();
function scrollTimelineFallback(options) {
  const currentTime = { value: 0 };
  const cancel = scrollInfo((info) => {
    currentTime.value = info[options.axis].progress * 100;
  }, options);
  return { currentTime, cancel };
}
function getTimeline({ source, container, ...options }) {
  const { axis } = options;
  if (source)
    container = source;
  let containerCache = timelineCache.get(container);
  if (!containerCache) {
    containerCache = /* @__PURE__ */ new Map();
    timelineCache.set(container, containerCache);
  }
  const targetKey = options.target ?? "self";
  let targetCache = containerCache.get(targetKey);
  if (!targetCache) {
    targetCache = {};
    containerCache.set(targetKey, targetCache);
  }
  const axisKey = axis + (options.offset ?? []).join(",");
  if (!targetCache[axisKey]) {
    if (options.target && canUseNativeTimeline(options.target)) {
      const range = offsetToViewTimelineRange(options.offset);
      if (range) {
        targetCache[axisKey] = new ViewTimeline({
          subject: options.target,
          axis
        });
      } else {
        targetCache[axisKey] = scrollTimelineFallback({
          container,
          ...options
        });
      }
    } else if (canUseNativeTimeline()) {
      targetCache[axisKey] = new ScrollTimeline({
        source: container,
        axis
      });
    } else {
      targetCache[axisKey] = scrollTimelineFallback({
        container,
        ...options
      });
    }
  }
  return targetCache[axisKey];
}
function attachToAnimation(animation, options) {
  const timeline = getTimeline(options);
  const range = options.target ? offsetToViewTimelineRange(options.offset) : void 0;
  const useNative = options.target ? canUseNativeTimeline(options.target) && !!range : canUseNativeTimeline();
  return animation.attachTimeline({
    timeline: useNative ? timeline : void 0,
    ...range && useNative && {
      rangeStart: range.rangeStart,
      rangeEnd: range.rangeEnd
    },
    observe: (valueAnimation) => {
      valueAnimation.pause();
      return observeTimeline((progress2) => {
        valueAnimation.time = valueAnimation.iterationDuration * progress2;
      }, timeline);
    }
  });
}
function isOnScrollWithInfo(onScroll) {
  return onScroll.length === 2;
}
function attachToFunction(onScroll, options) {
  if (isOnScrollWithInfo(onScroll)) {
    return scrollInfo((info) => {
      onScroll(info[options.axis].progress, info);
    }, options);
  } else {
    return observeTimeline(onScroll, getTimeline(options));
  }
}
function scroll(onScroll, { axis = "y", container = document.scrollingElement, ...options } = {}) {
  if (!container)
    return noop;
  const optionsWithDefaults = { axis, container, ...options };
  return typeof onScroll === "function" ? attachToFunction(onScroll, optionsWithDefaults) : attachToAnimation(onScroll, optionsWithDefaults);
}
const createScrollMotionValues = () => ({
  scrollX: motionValue(0),
  scrollY: motionValue(0),
  scrollXProgress: motionValue(0),
  scrollYProgress: motionValue(0)
});
const isRefPending = (ref) => {
  if (!ref)
    return false;
  return !ref.current;
};
function makeAccelerateConfig(axis, options, container, target) {
  return {
    factory: (animation) => scroll(animation, {
      ...options,
      axis,
      container: (container == null ? void 0 : container.current) || void 0,
      target: (target == null ? void 0 : target.current) || void 0
    }),
    times: [0, 1],
    keyframes: [0, 1],
    ease: (v) => v,
    duration: 1
  };
}
function canAccelerateScroll(target, offset) {
  if (typeof window === "undefined")
    return false;
  return target ? supportsViewTimeline() && !!offsetToViewTimelineRange(offset) : supportsScrollTimeline();
}
function useScroll({ container, target, ...options } = {}) {
  const values = useConstant(createScrollMotionValues);
  if (canAccelerateScroll(target, options.offset)) {
    values.scrollXProgress.accelerate = makeAccelerateConfig("x", options, container, target);
    values.scrollYProgress.accelerate = makeAccelerateConfig("y", options, container, target);
  }
  const scrollAnimation = reactExports.useRef(null);
  const needsStart = reactExports.useRef(false);
  const start = reactExports.useCallback(() => {
    scrollAnimation.current = scroll((_progress, { x, y }) => {
      values.scrollX.set(x.current);
      values.scrollXProgress.set(x.progress);
      values.scrollY.set(y.current);
      values.scrollYProgress.set(y.progress);
    }, {
      ...options,
      container: (container == null ? void 0 : container.current) || void 0,
      target: (target == null ? void 0 : target.current) || void 0
    });
    return () => {
      var _a;
      (_a = scrollAnimation.current) == null ? void 0 : _a.call(scrollAnimation);
    };
  }, [container, target, JSON.stringify(options.offset)]);
  useIsomorphicLayoutEffect(() => {
    needsStart.current = false;
    if (isRefPending(container) || isRefPending(target)) {
      needsStart.current = true;
      return;
    } else {
      return start();
    }
  }, [start]);
  reactExports.useEffect(() => {
    if (needsStart.current) {
      invariant(!isRefPending(container));
      invariant(!isRefPending(target));
      return start();
    } else {
      return;
    }
  }, [start]);
  return values;
}
function useMotionValue(initial) {
  const value = useConstant(() => motionValue(initial));
  const { isStatic } = reactExports.useContext(MotionConfigContext);
  if (isStatic) {
    const [, setLatest] = reactExports.useState(initial);
    reactExports.useEffect(() => value.on("change", setLatest), []);
  }
  return value;
}
function useCombineMotionValues(values, combineValues) {
  const value = useMotionValue(combineValues());
  const updateValue = () => value.set(combineValues());
  updateValue();
  useIsomorphicLayoutEffect(() => {
    const scheduleUpdate = () => frame.preRender(updateValue, false, true);
    const subscriptions = values.map((v) => v.on("change", scheduleUpdate));
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelFrame(updateValue);
    };
  });
  return value;
}
function useComputed(compute) {
  collectMotionValues.current = [];
  compute();
  const value = useCombineMotionValues(collectMotionValues.current, compute);
  collectMotionValues.current = void 0;
  return value;
}
function useTransform(input, inputRangeOrTransformer, outputRangeOrMap, options) {
  if (typeof input === "function") {
    return useComputed(input);
  }
  const isOutputMap = outputRangeOrMap !== void 0 && !Array.isArray(outputRangeOrMap) && typeof inputRangeOrTransformer !== "function";
  if (isOutputMap) {
    return useMapTransform(input, inputRangeOrTransformer, outputRangeOrMap, options);
  }
  const outputRange = outputRangeOrMap;
  const transformer = typeof inputRangeOrTransformer === "function" ? inputRangeOrTransformer : transform(inputRangeOrTransformer, outputRange, options);
  const result = Array.isArray(input) ? useListTransform(input, transformer) : useListTransform([input], ([latest]) => transformer(latest));
  const inputAccelerate = !Array.isArray(input) ? input.accelerate : void 0;
  if (inputAccelerate && !inputAccelerate.isTransformed && typeof inputRangeOrTransformer !== "function" && Array.isArray(outputRangeOrMap) && (options == null ? void 0 : options.clamp) !== false) {
    result.accelerate = {
      ...inputAccelerate,
      times: inputRangeOrTransformer,
      keyframes: outputRangeOrMap,
      isTransformed: true,
      ...{}
    };
  }
  return result;
}
function useListTransform(values, transformer) {
  const latest = useConstant(() => []);
  return useCombineMotionValues(values, () => {
    latest.length = 0;
    const numValues = values.length;
    for (let i = 0; i < numValues; i++) {
      latest[i] = values[i].get();
    }
    return transformer(latest);
  });
}
function useMapTransform(inputValue, inputRange, outputMap, options) {
  const keys2 = useConstant(() => Object.keys(outputMap));
  const output = useConstant(() => ({}));
  for (const key of keys2) {
    output[key] = useTransform(inputValue, inputRange, outputMap[key], options);
  }
  return output;
}
const FEATURED_DISHES = [
  {
    id: 1,
    name: "Wagyu Striploin",
    description: "A5 wagyu, truffle jus, gold leaf, microgreens",
    price: "$148",
    image: "/assets/generated/dish-wagyu-beef.dim_600x600.jpg",
    tag: "Chef's Choice"
  },
  {
    id: 2,
    name: "Seared Scallops",
    description: "Trio on cauliflower purée, champagne velouté",
    price: "$68",
    image: "/assets/generated/dish-seared-scallops.dim_600x600.jpg",
    tag: "Signature"
  },
  {
    id: 3,
    name: "Truffle Risotto",
    description: "Arborio, shaved black truffle, parmesan crisp",
    price: "$58",
    image: "/assets/generated/dish-truffle-risotto.dim_600x600.jpg",
    tag: "Vegetarian"
  },
  {
    id: 4,
    name: "Duck Confit",
    description: "Cherry port reduction, pomme purée, roasted veg",
    price: "$72",
    image: "/assets/generated/dish-duck-breast.dim_600x600.jpg",
    tag: "Seasonal"
  },
  {
    id: 5,
    name: "Lobster Bisque",
    description: "Maine lobster, saffron cream, caviar garnish",
    price: "$42",
    image: "/assets/generated/dish-lobster-bisque.dim_600x600.jpg",
    tag: "Fan Favourite"
  },
  {
    id: 6,
    name: "Chocolate Fondant",
    description: "Dark cocoa lava, raspberry coulis, edible gold",
    price: "$28",
    image: "/assets/generated/dish-chocolate-fondant.dim_600x600.jpg",
    tag: "Dessert"
  }
];
const CATEGORIES = [
  {
    id: 1,
    emoji: "🥩",
    name: "Mains",
    description: "Wagyu, duck, sea bass & more",
    image: "/assets/generated/dish-wagyu-beef.dim_600x600.jpg"
  },
  {
    id: 2,
    emoji: "🦞",
    name: "Starters",
    description: "Scallops, bisque & artisan breads",
    image: "/assets/generated/dish-seared-scallops.dim_600x600.jpg"
  },
  {
    id: 3,
    emoji: "🍄",
    name: "Vegetarian",
    description: "Truffle, forest mushrooms, seasonal",
    image: "/assets/generated/dish-truffle-risotto.dim_600x600.jpg"
  },
  {
    id: 4,
    emoji: "🍷",
    name: "Pairings",
    description: "Sommelier-selected wine pairings",
    image: "/assets/generated/restaurant-interior-ambiance.dim_1200x700.jpg"
  },
  {
    id: 5,
    emoji: "🍫",
    name: "Desserts",
    description: "Fondant, soufflé & mignardises",
    image: "/assets/generated/dish-chocolate-fondant.dim_600x600.jpg"
  }
];
const PILLARS = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Sourced daily from local farms and world-class suppliers. Nothing frozen, nothing compromised."
  },
  {
    icon: Flame,
    title: "Chef's Craft",
    description: "Each plate is a canvas. Our chefs trained at the finest establishments bring years of mastery."
  },
  {
    icon: Sparkles,
    title: "Your Wish, Our Command",
    description: "Dietary need? Flavor preference? Special occasion? Call it — we'll create something extraordinary."
  }
];
const CHEF_BULLETS = [
  "Real-time messaging during your order",
  "Custom modifications, no limits",
  "Allergy & dietary accommodations",
  "Surprise menu requests welcomed"
];
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};
const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
const slideRight = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
function AnimatedLogo() {
  const charData = [
    { id: "y", c: "y" },
    { id: "o", c: "o" },
    { id: "u", c: "u" },
    { id: "C", c: "C" },
    { id: "a", c: "a" },
    { id: "l1", c: "l" },
    { id: "l2", c: "l" },
    { id: "I", c: "I" },
    { id: "T", c: "T" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.h1,
    {
      className: "font-display italic text-[clamp(3.5rem,11vw,8.5rem)] leading-none tracking-tight text-gradient-gold",
      initial: "hidden",
      animate: "show",
      variants: {
        hidden: {},
        show: { transition: { staggerChildren: 0.045, delayChildren: 0.3 } }
      },
      "aria-label": "youCallIT",
      children: charData.map(({ id, c }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.span,
        {
          className: "inline-block",
          variants: {
            hidden: { opacity: 0, y: 55, rotateX: -28 },
            show: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: {
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1]
              }
            }
          },
          children: c === " " ? " " : c
        },
        id
      ))
    }
  );
}
function AnimatedTagline() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "relative inline-block",
      initial: "hidden",
      animate: "show",
      variants: {
        hidden: {},
        show: { transition: { staggerChildren: 0.18, delayChildren: 0.9 } }
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.p,
          {
            className: "font-body text-[clamp(0.9rem,2.2vw,1.3rem)] tracking-[0.28em] uppercase text-foreground/65",
            variants: {
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0, transition: { duration: 0.55 } }
            },
            children: "Fine Dining, Your Way"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "h-px mt-2.5 rounded-full origin-left",
            style: {
              background: "linear-gradient(90deg, transparent 0%, oklch(0.68 0.18 65) 50%, transparent 100%)"
            },
            variants: {
              hidden: { scaleX: 0, opacity: 0 },
              show: {
                scaleX: 1,
                opacity: 1,
                transition: {
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1]
                }
              }
            }
          }
        )
      ]
    }
  );
}
function DishCard({ dish, index }) {
  const [tilt, setTilt] = reactExports.useState({ x: 0, y: 0 });
  const [hovered, setHovered] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  const addItem = useCartStore((s) => s.addItem);
  const handleMouseMove = (e) => {
    var _a;
    const rect = (_a = ref.current) == null ? void 0 : _a.getBoundingClientRect();
    if (!rect) return;
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: cy * -13, y: cx * 13 });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      ref,
      className: "relative flex-shrink-0 w-64 sm:w-72",
      style: { perspective: 900 },
      onMouseMove: handleMouseMove,
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => {
        setTilt({ x: 0, y: 0 });
        setHovered(false);
      },
      animate: { rotateX: tilt.x, rotateY: tilt.y, scale: hovered ? 1.04 : 1 },
      transition: { type: "spring", stiffness: 240, damping: 20 },
      initial: { opacity: 0, y: 28 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      "data-ocid": `featured_dishes.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-white/8 rounded-2xl overflow-hidden shadow-elevated", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-52 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: dish.image,
              alt: dish.name,
              className: "w-full h-full object-cover",
              style: {
                transform: hovered ? "scale(1.09)" : "scale(1)",
                transition: "transform 0.55s ease"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-card via-card/15 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 text-xs font-body font-semibold tracking-widest uppercase text-primary bg-primary/12 border border-primary/25 px-2.5 py-0.5 rounded-full", children: dish.tag })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display italic text-xl text-foreground leading-tight", children: dish.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body mt-0.5 line-clamp-1", children: dish.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent-gold font-body font-semibold text-lg", children: dish.price }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "h-8 px-3 text-xs font-body gradient-gold-accent text-primary-foreground border-0 hover:opacity-90 transition-smooth shadow-gold-glow",
                onClick: () => addItem({
                  id: BigInt(dish.id),
                  name: dish.name,
                  price: BigInt(
                    Math.round(
                      Number.parseFloat(dish.price.replace("$", "")) * 100
                    )
                  ),
                  imageUrl: dish.image,
                  categoryId: 1n,
                  description: dish.description,
                  isAvailable: true,
                  isPopular: true,
                  tags: []
                }),
                "data-ocid": `featured_dishes.add_button.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-3 h-3 mr-1" }),
                  "Add"
                ]
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
const CHAT_BUBBLES = [
  {
    id: "b1",
    text: "Can I get extra truffle on the risotto?",
    from: "customer"
  },
  {
    id: "b2",
    text: "Absolument! Adding generous shavings now 🍄",
    from: "chef"
  },
  { id: "b3", text: "Also make it dairy-free please 🙏", from: "customer" },
  {
    id: "b4",
    text: "Done — switching to cashew cream. Excellent choice.",
    from: "chef"
  }
];
function ChefChatPreview() {
  const [visible, setVisible] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (visible >= CHAT_BUBBLES.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 900);
    return () => clearTimeout(t);
  }, [visible]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 min-h-[200px]", "data-ocid": "chef_chat.preview", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: CHAT_BUBBLES.slice(0, visible).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: `flex ${b.from === "chef" ? "justify-start" : "justify-end"}`,
      initial: { opacity: 0, y: 8, scale: 0.96 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1]
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `px-4 py-2.5 rounded-2xl text-sm font-body max-w-[88%] leading-relaxed ${b.from === "chef" ? "bg-primary/12 border border-primary/22 text-foreground rounded-tl-sm" : "bg-card border border-white/10 text-foreground/80 rounded-tr-sm"}`,
          children: [
            b.from === "chef" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary block mb-0.5 tracking-wide", children: "Chef Alexandre" }),
            b.text
          ]
        }
      )
    },
    b.id
  )) }) });
}
function HomePage() {
  const heroRef = reactExports.useRef(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, 110]);
  const heroOpacity = useTransform(scrollY, [0, 380], [1, 0]);
  const [hoveredCat, setHoveredCat] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        ref: heroRef,
        className: "relative min-h-screen flex items-center justify-center overflow-hidden",
        "data-ocid": "home.hero_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "absolute inset-0", style: { y: parallaxY }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: "/assets/generated/hero-signature-dish.dim_1600x900.jpg",
                alt: "",
                "aria-hidden": "true",
                className: "w-full h-full object-cover object-center"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 hero-overlay" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-0",
                style: {
                  background: "radial-gradient(ellipse at 68% 38%, oklch(0.68 0.18 65 / 0.07) 0%, transparent 55%)"
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: ["p0", "p1", "p2", "p3", "p4", "p5", "p6"].map(
            (pid, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "absolute rounded-full",
                style: {
                  background: "oklch(0.68 0.18 65 / 0.45)",
                  width: i % 2 === 0 ? 3 : 2,
                  height: i % 2 === 0 ? 3 : 2,
                  left: `${18 + i * 11}%`,
                  top: `${25 + i % 4 * 16}%`
                },
                animate: { y: [0, -18, 0], opacity: [0.25, 0.7, 0.25] },
                transition: {
                  duration: 3.2 + i * 0.45,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.35
                }
              },
              pid
            )
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "relative z-10 text-center px-4 sm:px-8 max-w-5xl mx-auto",
              style: { opacity: heroOpacity },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    className: "flex items-center justify-center gap-3 mb-7",
                    initial: { opacity: 0, y: -18 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.55, delay: 0.15 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-divider w-14" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body tracking-[0.32em] uppercase text-primary font-semibold whitespace-nowrap", children: "Michelin Fine Dining Experience" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-divider w-14" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedLogo, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 mb-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedTagline, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    className: "flex flex-col sm:flex-row items-center justify-center gap-4",
                    initial: { opacity: 0, y: 18 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.6, delay: 1.1 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/menu", "data-ocid": "home.explore_menu_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "lg",
                          className: "min-w-[200px] h-14 text-sm font-body tracking-[0.2em] uppercase gradient-gold-accent text-primary-foreground border-0 shadow-gold-glow hover:scale-105 hover:shadow-[0_0_30px_rgba(173,142,70,0.4)] transition-all duration-300",
                          children: "Explore Menu"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/reservations", "data-ocid": "home.reserve_table_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "lg",
                          variant: "outline",
                          className: "min-w-[200px] h-14 text-sm font-body tracking-[0.2em] uppercase border-primary/40 text-foreground hover:bg-primary/10 hover:border-primary/65 hover:scale-105 transition-all duration-300",
                          children: "Reserve a Table"
                        }
                      ) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    className: "flex items-center justify-center gap-1.5 mt-9",
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { delay: 1.45 },
                    children: [
                      ["s1", "s2", "s3", "s4", "s5"].map((sid) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Star,
                        {
                          className: "w-4 h-4 text-primary fill-primary"
                        },
                        sid
                      )),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs font-body text-muted-foreground tracking-[0.22em] uppercase", children: "Award-Winning Experience" })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10",
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 1.65 },
              "data-ocid": "home.scroll_indicator",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body tracking-[0.28em] uppercase text-muted-foreground", children: "Scroll" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    animate: { y: [0, 7, 0] },
                    transition: {
                      duration: 1.4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-5 h-5 text-primary" })
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-24 bg-card overflow-hidden",
        "data-ocid": "home.featured_dishes_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "text-center mb-12",
              variants: fadeUp,
              initial: "hidden",
              whileInView: "show",
              viewport: { once: true },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body tracking-[0.3em] uppercase text-primary mb-3", children: "Tonight's Selection" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display italic text-4xl sm:text-5xl text-foreground mb-4", children: "Featured Dishes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm max-w-md mx-auto", children: "Hand-selected by our executive chef. Each plate is an experience unto itself." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex gap-5 overflow-x-auto pb-4",
              style: { scrollbarWidth: "none", msOverflowStyle: "none" },
              "data-ocid": "featured_dishes.carousel",
              children: FEATURED_DISHES.map((dish, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(DishCard, { dish, index: idx }, dish.id))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "flex justify-center mt-10",
              variants: fadeUp,
              initial: "hidden",
              whileInView: "show",
              viewport: { once: true },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/menu", "data-ocid": "home.view_full_menu_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  className: "font-body tracking-[0.18em] uppercase border-primary/30 text-foreground hover:bg-primary/8 hover:border-primary/55 transition-smooth",
                  children: "View Full Menu"
                }
              ) })
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "relative py-28 bg-background overflow-hidden",
        "data-ocid": "home.story_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "relative",
              variants: slideLeft,
              initial: "hidden",
              whileInView: "show",
              viewport: { once: true },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-3xl overflow-hidden shadow-elevated aspect-[4/3]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: "/assets/generated/restaurant-interior-ambiance.dim_1200x700.jpg",
                      alt: "Restaurant interior",
                      className: "w-full h-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute inset-0",
                      style: {
                        background: "linear-gradient(135deg, oklch(0.12 0.018 50 / 0.28) 0%, transparent 55%)"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "absolute -bottom-5 -right-4 sm:-right-6 bg-card border border-primary/22 rounded-2xl px-5 py-4 shadow-elevated",
                    initial: { opacity: 0, scale: 0.82 },
                    whileInView: { opacity: 1, scale: 1 },
                    transition: { delay: 0.45, duration: 0.5 },
                    viewport: { once: true },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full gradient-gold-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-primary-foreground fill-primary-foreground" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-body font-semibold text-sm", children: "Michelin Recognition" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-xs", children: "Est. 2019" })
                      ] })
                    ] })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "space-y-6",
              variants: slideRight,
              initial: "hidden",
              whileInView: "show",
              viewport: { once: true },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body tracking-[0.3em] uppercase text-primary", children: "Our Story" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display italic text-4xl sm:text-5xl text-foreground leading-[1.15]", children: [
                  "A Culinary Journey",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "Without Limits" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "border-l-2 border-primary/45 pl-5 py-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display italic text-xl text-foreground/75 leading-relaxed", children: `"At youCallIT, dining is the most personal art form. Tell us your dream dish — we'll make it real."` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mt-3 text-sm font-body text-muted-foreground tracking-wide", children: "— Chef Alexandre Dubois, Executive Chef" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body leading-relaxed text-sm", children: "Born from the belief that fine dining should adapt to you — not the other way around. Our kitchen runs on one promise: if you dream it, we craft it. No restrictions. No compromises. Just pure culinary excellence, plated for you." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4 pt-3", children: [
                  { number: "12+", label: "Years of Craft" },
                  { number: "40K+", label: "Happy Guests" },
                  { number: "300+", label: "Unique Dishes" }
                ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display italic text-3xl text-accent-gold", children: stat.number }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground mt-1 tracking-wide", children: stat.label })
                ] }, stat.label)) })
              ]
            }
          )
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-24 bg-card", "data-ocid": "home.features_section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "text-center mb-16",
          variants: fadeUp,
          initial: "hidden",
          whileInView: "show",
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body tracking-[0.3em] uppercase text-primary mb-3", children: "Why youCallIT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display italic text-4xl sm:text-5xl text-foreground", children: "Three Pillars of Excellence" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          className: "grid grid-cols-1 md:grid-cols-3 gap-8",
          variants: stagger,
          initial: "hidden",
          whileInView: "show",
          viewport: { once: true },
          children: PILLARS.map((pillar, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "group relative p-8 rounded-2xl border border-white/8 bg-background hover:border-primary/25 transition-smooth hover:shadow-gold-glow",
              variants: fadeUp,
              whileHover: { y: -5 },
              "data-ocid": `home.feature_card.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl gradient-gold-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth shadow-gold-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(pillar.icon, { className: "w-6 h-6 text-primary-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display italic text-2xl text-foreground mb-3", children: pillar.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body leading-relaxed text-sm", children: pillar.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "absolute bottom-0 left-0 right-0 h-px rounded-b-2xl origin-left",
                    style: {
                      background: "linear-gradient(90deg, transparent, oklch(0.68 0.18 65 / 0.5), transparent)"
                    },
                    initial: { scaleX: 0 },
                    whileHover: { scaleX: 1 },
                    transition: { duration: 0.28 }
                  }
                )
              ]
            },
            pillar.title
          ))
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-24 bg-background",
        "data-ocid": "home.categories_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "text-center mb-14",
              variants: fadeUp,
              initial: "hidden",
              whileInView: "show",
              viewport: { once: true },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body tracking-[0.3em] uppercase text-primary mb-3", children: "The Menu" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display italic text-4xl sm:text-5xl text-foreground", children: "Explore the Collection" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body mt-4 max-w-md mx-auto text-sm", children: "Every category is a world unto itself — crafted with intention, plated with artistry." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4",
              variants: stagger,
              initial: "hidden",
              whileInView: "show",
              viewport: { once: true },
              children: CATEGORIES.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "group relative rounded-2xl overflow-hidden border border-white/8 cursor-pointer",
                  style: { aspectRatio: "3/4" },
                  variants: fadeUp,
                  onHoverStart: () => setHoveredCat(cat.id),
                  onHoverEnd: () => setHoveredCat(null),
                  whileHover: { scale: 1.035, zIndex: 10 },
                  transition: {
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1]
                  },
                  "data-ocid": `home.category_card.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/menu", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: cat.image,
                        alt: cat.name,
                        className: "absolute inset-0 w-full h-full object-cover",
                        style: {
                          transform: hoveredCat === cat.id ? "scale(1.12)" : "scale(1)",
                          transition: "transform 0.55s ease"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-4 space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl block", children: cat.emoji }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display italic text-lg text-foreground leading-tight", children: cat.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.p,
                        {
                          className: "text-xs font-body text-muted-foreground leading-snug overflow-hidden",
                          animate: {
                            opacity: hoveredCat === cat.id ? 1 : 0,
                            height: hoveredCat === cat.id ? "auto" : 0
                          },
                          transition: { duration: 0.25 },
                          children: cat.description
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        className: "absolute inset-0 rounded-2xl pointer-events-none border-2",
                        animate: {
                          borderColor: hoveredCat === cat.id ? "oklch(0.68 0.18 65 / 0.4)" : "oklch(0.68 0.18 65 / 0)"
                        },
                        transition: { duration: 0.25 }
                      }
                    )
                  ] })
                },
                cat.id
              ))
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative py-28 overflow-hidden bg-card",
        "data-ocid": "home.chef_chat_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none",
              style: {
                background: "radial-gradient(ellipse at 28% 50%, oklch(0.68 0.18 65 / 0.055) 0%, transparent 55%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                variants: slideLeft,
                initial: "hidden",
                whileInView: "show",
                viewport: { once: true },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-white/8 rounded-3xl p-6 shadow-elevated", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5 pb-4 border-b border-white/8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full gradient-gold-accent flex items-center justify-center flex-shrink-0 shadow-gold-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-5 h-5 text-primary-foreground" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-body font-semibold text-sm", children: "Live Chef Chat" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.div,
                          {
                            className: "w-1.5 h-1.5 rounded-full",
                            style: { background: "oklch(0.62 0.18 145)" },
                            animate: { opacity: [1, 0.4, 1] },
                            transition: {
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground", children: "Chef online — avg. 2 min response" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChefChatPreview, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center gap-2 bg-muted/40 rounded-xl px-4 py-2.5 border border-white/8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-muted-foreground/55 flex-1", children: "Type your request..." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg gradient-gold-accent flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-3.5 h-3.5 text-primary-foreground" }) })
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                className: "space-y-6",
                variants: slideRight,
                initial: "hidden",
                whileInView: "show",
                viewport: { once: true },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body tracking-[0.3em] uppercase text-primary", children: "Direct Connection" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display italic text-4xl sm:text-5xl text-foreground leading-[1.15]", children: [
                    "Speak Directly",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "to the Chef" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body leading-relaxed text-sm", children: "Every order opens a private line between you and the kitchen. No middlemen, no guesswork. Ask for alterations, request secret menu items, share allergies, or simply say hello. Chef Alexandre responds personally." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: CHEF_BULLETS.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.li,
                    {
                      className: "flex items-center gap-3 text-sm font-body text-foreground/80",
                      initial: { opacity: 0, x: 18 },
                      whileInView: { opacity: 1, x: 0 },
                      transition: { delay: i * 0.1 + 0.3 },
                      viewport: { once: true },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" }),
                        item
                      ]
                    },
                    item
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/menu", "data-ocid": "home.order_now_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "lg",
                      className: "h-12 px-8 font-body tracking-[0.18em] uppercase gradient-gold-accent text-primary-foreground border-0 shadow-gold-glow hover:opacity-90 hover:scale-105 transition-all duration-300",
                      children: "Order & Chat Now"
                    }
                  ) }) })
                ]
              }
            )
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative py-32 overflow-hidden bg-background",
        "data-ocid": "home.final_cta_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none",
              style: {
                background: "radial-gradient(ellipse at 50% 50%, oklch(0.68 0.18 65 / 0.07) 0%, transparent 62%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-divider absolute top-0 inset-x-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-divider absolute bottom-0 inset-x-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "max-w-3xl mx-auto px-4 text-center space-y-8",
              variants: stagger,
              initial: "hidden",
              whileInView: "show",
              viewport: { once: true },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.p,
                  {
                    className: "text-xs font-body tracking-[0.3em] uppercase text-primary",
                    variants: fadeUp,
                    children: "Reserve Your Evening"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.h2,
                  {
                    className: "font-display italic text-5xl sm:text-6xl text-foreground leading-tight",
                    variants: fadeUp,
                    children: "Your Table Awaits"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.p,
                  {
                    className: "text-muted-foreground font-body text-base leading-relaxed",
                    variants: fadeUp,
                    children: "Every evening at youCallIT is a singular experience. Reserve your table and let us craft a night you'll talk about for years."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    className: "flex flex-col sm:flex-row items-center justify-center gap-4",
                    variants: fadeUp,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/reservations", "data-ocid": "home.final_reserve_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "lg",
                          className: "min-w-[220px] h-14 text-sm font-body tracking-[0.2em] uppercase gradient-gold-accent text-primary-foreground border-0 shadow-gold-glow hover:scale-105 hover:shadow-[0_0_30px_rgba(173,142,70,0.4)] transition-all duration-300",
                          children: "Make a Reservation"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/menu", "data-ocid": "home.final_menu_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "lg",
                          variant: "ghost",
                          className: "min-w-[180px] h-14 text-sm font-body tracking-[0.2em] uppercase text-foreground/65 hover:text-foreground hover:bg-white/5 transition-smooth",
                          children: "Browse Menu"
                        }
                      ) })
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    )
  ] });
}
export {
  HomePage as default
};
