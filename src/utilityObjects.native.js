import DOMException from 'domexception';
import { Asset as _Asset } from 'expo-asset';
export const Asset = _Asset;

export class ImageData {
  constructor() {
    let dataArray;
    let width;
    let height;

    /* eslint-disable prefer-rest-params */
    if (arguments[0] instanceof Uint8ClampedArray) {
      dataArray = arguments[0];
      width = arguments[1];
      height = arguments[2];
      if (dataArray.length < 4) {
        throw new DOMException('Bad data array size', 'InvalidStateError');
      }
      if (dataArray.length < width * height * 4) {
        throw new DOMException('Bad data array size', 'IndexSizeError');
      }
    } else if (isFinite(arguments[0])) {
      width = arguments[0] || 0;
      height = arguments[1] || 0;
      dataArray = new Uint8ClampedArray(width * height * 4);
    } else {
      throw new TypeError('Bad array type');
    }

    if (!isFinite(width) || width <= 0 || !isFinite(height) || height <= 0) {
      throw new DOMException('Bad dimensions', 'IndexSizeError');
    }

    Object.defineProperty(this, 'data', {
      get: () => {
        return dataArray;
      },
      set: (val) => {}, // Must be silently read-only
    });
    Object.defineProperty(this, 'width', {
      get: () => {
        return width;
      },
      set: (val) => {}, // Must be silently read-only
    });
    Object.defineProperty(this, 'height', {
      get: () => {
        return height;
      },
      set: (val) => {}, // Must be silently read-only
    });
  }
}
