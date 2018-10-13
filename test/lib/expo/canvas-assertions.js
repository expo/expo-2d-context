import {assert_true, assert_equals, assert_not_equals, assert_approx_equals} from './web-platform-assertions';

export function _valToString(val)
{
    if (val === undefined || val === null)
        return '[' + typeof(val) + ']';
    return val.toString() + '[' + typeof(val) + ']';
}

export function _assert(t, cond, text)
{
    assert_true(t, !!cond, text);
}

export function _assertSame(t, a, b, text_a, text_b)
{
    var msg = text_a + ' === ' + text_b + ' (got ' + _valToString(a) +
              ', expected ' + _valToString(b) + ')';
    assert_equals(t, a, b, msg);
}

export function _assertDifferent(t, a, b, text_a, text_b)
{
    var msg = text_a + ' !== ' + text_b + ' (got ' + _valToString(a) +
              ', expected not ' + _valToString(b) + ')';
    assert_not_equals(t, a, b, msg);
}


export function _getPixel(ctx, x,y)
{
    var imgdata = ctx.getImageData(x, y, 1, 1);
    return [ imgdata.data[0], imgdata.data[1], imgdata.data[2], imgdata.data[3] ];
}

export function _assertPixel(t, ctx, x,y, r,g,b,a, pos, colour)
{
    var c = _getPixel(ctx, x,y);
    assert_equals(t, c[0], r, 'Red channel of the pixel at (' + x + ', ' + y + ')');
    assert_equals(t, c[1], g, 'Green channel of the pixel at (' + x + ', ' + y + ')');
    assert_equals(t, c[2], b, 'Blue channel of the pixel at (' + x + ', ' + y + ')');
    assert_equals(t, c[3], a, 'Alpha channel of the pixel at (' + x + ', ' + y + ')');
}

export function _assertPixelApprox(t, ctx, x,y, r,g,b,a, pos, colour, tolerance)
{
    var c = _getPixel(ctx, x,y);
    assert_approx_equals(t, c[0], r, tolerance, 'Red channel of the pixel at (' + x + ', ' + y + ')');
    assert_approx_equals(t, c[1], g, tolerance, 'Green channel of the pixel at (' + x + ', ' + y + ')');
    assert_approx_equals(t, c[2], b, tolerance, 'Blue channel of the pixel at (' + x + ', ' + y + ')');
    assert_approx_equals(t, c[3], a, tolerance, 'Alpha channel of the pixel at (' + x + ', ' + y + ')');
}

export function _assertGreen(t, ctx, canvasWidth, canvasHeight)
{
    var testColor = function(d, idx, expected) {
        assert_equals(t, d[idx], expected, "d[" + idx + "]", String(expected));
    };
    var imagedata = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    var w = imagedata.width, h = imagedata.height, d = imagedata.data;
    for (var i = 0; i < h; ++i) {
        for (var j = 0; j < w; ++j) {
            testColor(d, 4 * (w * i + j) + 0, 0);
            testColor(d, 4 * (w * i + j) + 1, 255);
            testColor(d, 4 * (w * i + j) + 2, 0);
            testColor(d, 4 * (w * i + j) + 3, 255);
        }
    }
}
