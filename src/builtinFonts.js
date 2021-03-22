import { calibri } from './calibri';
import { couriernew } from './couriernew';
import { timesnewroman } from './timesnewroman';

// TODO: find fonts?
export function getBuiltinFonts() {
  return {
    cursive: null,
    fantasy: null,
    monospace: couriernew,
    serif: timesnewroman,
    'sans-serif': calibri,
    'Courier New': couriernew,
    'Times New Roman': timesnewroman,
    Calibri: calibri,
  };
}
