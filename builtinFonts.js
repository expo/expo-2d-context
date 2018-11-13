import { calibri } from './calibri';
import { timesnewroman } from './timesnewroman';
import { couriernew } from './couriernew';

// TODO: find fonts?
export var getBuiltinFonts = () => {return {
  "cursive" : null, 
  "fantasy" : null, 
  "monospace" : couriernew, 
  "serif" : timesnewroman,
  "sans-serif" : calibri,
  "Courier New" : couriernew,
  "Times New Roman" : timesnewroman,
  "Calibri" : calibri,
}};
