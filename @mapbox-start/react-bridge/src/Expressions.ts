import { flatten, isUndefined } from "lodash";

export type TColor = string | number[];
export type TCollator = any;
export type TInterpolation = any[];
export type TFormatted = any[];
export type TArg<T = any> = T | Expr<T>;

export type Expr<TReturn = any> = any[] | TReturn[];

const expr = <TReturn>(name: string, ...args: any[]) => {
  const ret = [];

  ret.push(name);

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (isUndefined(arg)) {
      continue;
    }
    ret.push(arg);
  }

  return ret as Expr<TReturn>;
};

export const Ex = {
  /*************************************** Types ********************************************/
  array<T = any>(value: TArg<T>, type?: "string" | "number" | "boolean") {
    if (type) {
      return expr<T[]>("array", type, value);
    }
    return expr<T[]>("array", value);
  },

  boolean(value: TArg, ...fallbacks: TArg[]) {
    return expr<boolean>("boolean", value, ...fallbacks);
  },

  collator({
    caseSensitive,
    diacriticSensitive,
    locale,
  }: {
    caseSensitive?: boolean;
    diacriticSensitive?: boolean;
    locale?: string;
  } = {}) {
    return expr<TCollator>("collator", {
      ...(caseSensitive && { "case-sensitive": caseSensitive }),
      ...(diacriticSensitive && { "diacritic-sensitive": diacriticSensitive }),
      ...(locale && { locale: locale }),
    });
  },

  format(...formats: Array<[string, { "font-scale": number; "text-font": Array<string>; "text-color": string }]>) {
    return expr<TFormatted>("format", ...flatten(formats));
  },

  image(value: TArg) {
    return expr<string>("image", value);
  },

  literal<T extends any[] | object>(arg: TArg<T>) {
    return expr<T>("literal", arg);
  },

  number(value: TArg, ...fallbacks: TArg[]) {
    return expr<number>("number", value, ...fallbacks);
  },

  numberFormat(
    input: number,
    options: { locale: string; currency: string; "min-fraction-digits": number; "max-fraction-digits": number },
  ) {
    return expr<string>("number-format", input, options);
  },

  object(value: TArg, ...fallbacks: TArg[]) {
    return expr<object>("object", value, ...fallbacks);
  },

  string(value: TArg, ...fallbacks: TArg[]) {
    return expr<string>("string", value, ...fallbacks);
  },

  toBoolean(value: TArg) {
    return expr<boolean>("to-boolean", value);
  },

  toColor(value: TArg, ...fallbacks: TArg[]) {
    return expr<TColor>("to-color", value, ...fallbacks);
  },

  toNumber(value: TArg, ...fallbacks: TArg[]) {
    return expr<number>("to-number", value, ...fallbacks);
  },

  toString(value: TArg) {
    return expr<string>("to-string", value);
  },

  typeof(value: TArg) {
    return expr<string>("typeof", value);
  },
  /*************************************** Feature data ********************************************/

  accumulated<T = any>() {
    return expr<T>("accumulated");
  },

  featureState<T = any>(name: string) {
    return expr<T>("feature-state", name);
  },

  geometryType() {
    return expr<string | "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon">(
      "geometry-type",
    );
  },

  id<T = string | number>() {
    return expr<T>("id");
  },

  lineProgress() {
    return expr<number>("line-progress");
  },

  properties() {
    return expr<object>("properties");
  },
  /*************************************** Lookup ********************************************/

  at<T = any>(idx: TArg<number>, arr: TArg<T[]>) {
    return expr<T>("at", idx, arr);
  },

  get<TObject extends object = any, TKey extends keyof TObject = keyof TObject>(name: TArg<TKey>, obj?: TArg<TObject>) {
    return expr<TObject[TKey]>("get", name, obj);
  },

  has<TObject extends object = any, TKey extends keyof TObject = keyof TObject>(name: TArg<TKey>, obj?: TArg<TObject>) {
    return expr<boolean>("has", name, obj);
  },

  in(keyword: boolean | string | number, input: TArg<string | string[] | boolean[] | number[]>) {
    return expr<boolean>("in", keyword, input);
  },

  indexOf(keyword: boolean | string | number, input: TArg<string | string[] | boolean[] | number[]>, index?: number) {
    return expr<number>("index-of", keyword, input, index);
  },

  length(target: TArg<string> | TArg<any[]> | TArg) {
    return expr<number>("length", target);
  },

  slice<T = any>(input: TArg<string> | TArg<T[]>, start: number, end?: number) {
    return expr<T[] | string>("slice", input, start, end);
  },

  /*************************************** Decision ********************************************/

  not(bool: TArg<boolean>) {
    return expr<boolean>("!", bool);
  },

  neq(a: TArg, b: TArg, collator?: TCollator) {
    return expr<boolean>("!=", a, b, collator);
  },

  lt(a: TArg, b: TArg, collator?: TCollator) {
    return expr<boolean>("<", a, b, collator);
  },

  lte(a: TArg, b: TArg, collator?: TCollator) {
    return expr<boolean>("<=", a, b, collator);
  },

  eq<T = any>(a: TArg<T>, b: TArg<T>, collator?: TCollator) {
    return expr<boolean>("==", a, b, collator);
  },

  gt(a: TArg, b: TArg, collator?: TCollator) {
    return expr<boolean>(">", a, b, collator);
  },

  gte(a: TArg, b: TArg, collator?: TCollator) {
    return expr<boolean>(">=", a, b, collator);
  },

  all(arg: TArg<boolean>, arg1: TArg<boolean>, ...args: TArg<boolean>[]) {
    return expr<boolean>("all", arg, arg1, ...args);
  },

  any(arg: TArg<boolean>, arg1: TArg<boolean>, ...args: TArg<boolean>[]) {
    return expr<boolean>("any", arg, arg1, ...args);
  },

  case<T>(defaultOutput: T, ...cases: Array<[TArg<boolean>, TArg<T>]>) {
    return expr<T>("case", ...flatten(cases), defaultOutput);
  },

  coalesce<T>(...outputs: TArg<T>[]) {
    return expr<T>("coalesce", ...outputs);
  },

  match<TInput extends string | number, TOutput>(
    input: TArg<TInput>,
    defaultOutput: TOutput,
    ...labels: Array<[TArg<TInput | TInput[]>, TArg<TOutput>]>
  ) {
    return expr<TOutput>("match", input, ...flatten(labels), defaultOutput);
  },

  within(object: TArg<object>) {
    return expr<boolean>("within", object);
  },

  /*************************************** Ramps, scales, curves ********************************************/

  /**
   *
   * @param interpolation  ["linear"] | ["exponential", base] | ["cubic-bezier", x1, y1, x2, y2],
   * @param input number
   * @param stops [stop_input_1: number, stop_output_1: OutputType]
   */
  interpolate<TOutput = number | TColor>(
    interpolation: TArg<TInterpolation>,
    input: TArg<number>,
    ...stops: Array<[TArg<number>, TOutput]>
  ) {
    return expr<TOutput>("interpolate", interpolation, input, ...flatten(stops));
  },

  step<TOutput = number | TColor>(
    input: TArg<number>,
    defaultOutput: TOutput,
    ...stops: Array<[TArg<number>, TOutput]>
  ) {
    return expr<TOutput>("step", input, defaultOutput, ...flatten(stops));
  },

  interpolateHcl(interpolation: TInterpolation, input: TArg<number>, ...stops: Array<[TArg<number>, TColor]>) {
    return expr<TColor>("interpolate-hcl", interpolation, input, ...flatten(stops));
  },

  interpolateLab(interpolation: TInterpolation, input: TArg<number>, ...stops: Array<[TArg<number>, TColor]>) {
    return expr<TColor>("interpolate-lab", interpolation, input, ...flatten(stops));
  },

  /*************************************** Variable binding ********************************************/

  let<T>(exps: Array<[TArg<string>, TArg]>, out: TArg) {
    return expr<T>("let", ...flatten(exps), out);
  },

  var<T>(name: string) {
    return expr<T>("var", name);
  },

  /*************************************** String ********************************************/

  concat(arg1: TArg, arg2: TArg, ...args: TArg[]) {
    return expr<string>("concat", arg1, arg2, ...args);
  },

  downCase(arg: TArg<string>) {
    return expr<string>("downcase", arg);
  },

  upCase(arg: TArg<string>) {
    return expr<string>("upcase", arg);
  },

  isSupportedScript(arg: TArg<string>) {
    return expr<boolean>("is-supported-script", arg);
  },

  resolvedLocale(arg: TArg<TCollator>) {
    return expr<string>("resolved-locale", arg);
  },

  /*************************************** Color ********************************************/

  rgb(r: TArg<number>, g: TArg<number>, b: TArg<number>) {
    return expr<TColor>("rgb", r, g, b);
  },

  rgba(r: TArg<number>, g: TArg<number>, b: TArg<number>, a: TArg<number>) {
    return expr<TColor>("rgba", r, g, b, a);
  },

  toRgba(color: TArg<TColor>) {
    return expr<[number, number, number, number]>("to-rgba", color);
  },

  /*************************************** Math ********************************************/

  sum(a: TArg<number>, b: TArg<number>, ...args: TArg<number>[]) {
    return expr<number>("+", a, b, ...args);
  },

  subtract(a: TArg<number>, b: TArg<number>) {
    return expr<number>("-", a, b);
  },

  product(a: TArg<number>, b: TArg<number>, ...args: TArg<number>[]) {
    return expr<number>("*", a, b, ...args);
  },

  divide(a: TArg<number>, b: TArg<number>) {
    return expr<number>("/", a, b);
  },

  mod(a: TArg<number>, b: TArg<number>) {
    return expr<number>("%", a, b);
  },

  power(a: TArg<number>, b: TArg<number>) {
    return expr<number>("^", a, b);
  },

  abs(v: TArg<number>) {
    return expr<number>("abs", v);
  },

  acos(v: TArg<number>) {
    return expr<number>("acos", v);
  },

  cos(v: TArg<number>) {
    return expr<number>("cos", v);
  },

  asin(v: TArg<number>) {
    return expr<number>("asin", v);
  },

  sin(v: TArg<number>) {
    return expr<number>("sin", v);
  },

  atan(v: TArg<number>) {
    return expr<number>("atan", v);
  },

  tan(v: TArg<number>) {
    return expr<number>("tan", v);
  },

  ceil(v: TArg<number>) {
    return expr<number>("ceil", v);
  },

  sqrt(v: TArg<number>) {
    return expr<number>("sqrt", v);
  },

  e() {
    return expr<number>("e");
  },

  floor(v: TArg<number>) {
    return expr<number>("floor", v);
  },

  round(v: TArg<number>) {
    return expr<number>("round", v);
  },

  ln(v: TArg<number>) {
    return expr<number>("ln", v);
  },

  ln2() {
    return expr<number>("ln2");
  },

  log10(v: TArg<number>) {
    return expr<number>("log10", v);
  },

  log2(v: TArg<number>) {
    return expr<number>("log2", v);
  },

  max(a: TArg<number>, b: TArg<number>, ...args: TArg<number>[]) {
    return expr<number>("max", a, b, ...args);
  },

  min(a: TArg<number>, b: TArg<number>, ...args: TArg<number>[]) {
    return expr<number>("min", a, b, ...args);
  },

  pi() {
    return expr<number>("pi");
  },

  linear() {
    return expr<TInterpolation>("linear");
  },

  exponential(base: number) {
    return expr<TInterpolation>("linear", base);
  },

  cubicBezier(x1: number, y1: number, x2: number, y2: number) {
    return expr<TInterpolation>("cubic-bezier", x1, y1, x2, y2);
  },

  /*************************************** Zoom ********************************************/

  zoom() {
    return expr<number>("zoom");
  },

  /*************************************** Heatmap ********************************************/

  heatmapDensity() {
    return expr<number>("heatmap-density");
  },
};
