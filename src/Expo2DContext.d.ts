import { Asset as _Asset } from 'expo-asset';

export interface ImageData {
  data: Uint8ClampedArray;
  height: number;
  width: number;
}

export interface TextMetrics {
  width: number;
}

export type LineCap = "butt" | "round" | "square";
export type LineJoin = "bevel" | "round" | "miter";
export type TextAlign = "left" | "right" | "center" | "start" | "end";
export type TextBaseline = "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";
export type GLColor = [number, number, number, number];

export function cssToGlColor(cssStr: string): GLColor;

export interface CanvasGradient {
  gradient: "linear" | "radial";
  stops: Array<[GLColor, number]>;
  addColorStop(offset: number, color: string): void;
}

export type Asset = typeof Image | _Asset;

export class CanvasPattern {
  constructor(asset: Asset, repetition: string);
}

export interface Expo2dContextOptions {
  maxGradStops: number;
  renderWithOffscreenBuffer: boolean;
  fastFillTesselation: boolean;
}

export default class Expo2DContext {
  private _initDrawingState: unknown;
  private _updateStrokeExtruderState: unknown
  private _getInvMvMatrix: unknown;
  private _updateMatrixUniforms: unknown;
  private _updateClippingRegion: unknown
  private _getTextAlignmentOffset: unknown;
  private _getTextBaselineOffset: unknown;
  private _prepareText: unknown;
  private _drawText: unknown;
  private _pathTriangles: unknown;
  private _ensureStartPath: unknown;
  private _drawStenciled: unknown;
  private _getTransformedPt: unknown;
  private _styleSetter: unknown;
  private _styleGetter: unknown;
  private _cloneStyle: unknown;
  private _applyStyle: unknown;
  private _createGradient: unknown;
  private _cloneGradient: unknown;
  private _assetFromContext: unknown;
  private _setShaderProgram: unknown;
  private _applyCompositingState: unknown;
  private _drawOffscreenBuffer: unknown;
  private _initOffscreenBuffer: unknown;
  createImageData(): ImageData
  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
  putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
  drawImage(): void;
  measureText(text: string): TextMetrics;
  initializeText(): Promise<void>;
  fillText(text: string, x: number, y: number, maxWidth: number): void;
  strokeText(text: string, x: number, y: number, maxWidth: number): void;
  clearRect(x: number, y: number, w: number, h: number): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  strokeRect(x: number, y: number, w: number, h: number): void;
  beginPath(): void;
  closePath(): void;
  isPointInPath(x: number, y: number): boolean;
  clip(): void;
  fill(): void;
  stroke(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
  rect(x: number, y: number, w: number, h: number): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) : void;
  save(): void;
  restore(): void;
  scale(x: number, y: number): void;
  rotate(angle: number): void;
  translate(x: number, y: number) 
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number) : void;
  set globalAlpha(val: number)
  get globalAlpha(): number; 
  set shadowColor(val: string)
  get shadowColor(): string; 
  set shadowBlur(val: number)
  get shadowBlur(): number; 
  set shadowOffsetX(val: number)
  get shadowOffsetX(): number 
  set shadowOffsetY(val: number)
  get shadowOffsetY(): number; 
  set globalCompositeOperation(val: string)
  get globalCompositeOperation(): string;
  set lineWidth(val: number)
  get lineWidth(): number; 
  set lineCap(val: LineCap)
  get lineCap(): LineCap; 
  set lineJoin(val: LineJoin)
  get lineJoin(): LineJoin; 
  set miterLimit(val: number)
  get miterLimit(): number; 
  setLineDash(segments: number[]): number[];
  getLineDash() : number[];
  set lineDashOffset(val: number)
  get lineDashOffset(): number; 
  set strokeStyle(val: string | CanvasGradient | CanvasPattern)
  get strokeStyle() : string | CanvasGradient | CanvasPattern;
  set fillStyle(val: string | CanvasGradient | CanvasPattern)
  get fillStyle() :string | CanvasGradient | CanvasPattern;
  set font(val: string)
  get font(): string; 
  set textAlign(val: TextAlign)
  get textAlign(): TextAlign; 
  set textBaseline(val: TextBaseline)
  get textBaseline() : TextBaseline;
  createLinearGradient(x0: number, y0: number, x1: number, y1: number) : CanvasGradient;
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) : CanvasGradient
  createPattern(asset: Asset, repeat: string) : CanvasPattern;
  get width(): number;
  set width(val: number)
  get height(): number;
  set height(val: number)
  constructor(gl: number, options: Expo2dContextOptions)
  flush(): void;
}
  