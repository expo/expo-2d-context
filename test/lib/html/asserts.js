function same_value(x, y) {
    if (y !== y) {
        //NaN case
        return x !== x;
    }
    if (x === 0 && y === 0) {
        //Distinguish +0 and -0
        return 1/x === 1/y;
    }
    return x === y;
}

function TriggerObject(triggerCallback) {
  let trigger = (expr, message) => {
    if (expr != true) {
      triggerCallback(message)
    }
  }
  return {
    "trigger": trigger,
    "expect": (message, actual) => { return {
      "toBe": (expected) => {trigger(actual === expected, message)},
      "toContain": (expected) => {trigger(actual.includes(expected), message)},
      "toBeLessThan": (expected) => {trigger(actual < expected, message)},
      "toBeGreaterThan": (expected) => {trigger(actual > expected, message)},
    }
  }}
}


var webAssert = {
  "_assert": (t, expression, description) => 
  {
      t.expect(description, expression).toBe(true);
  },
  "assert_true": (t, actual, description) =>
  {
      t.expect(description, actual).toBe(true);
  },
  "assert_false": (t, actual, description) =>
  {
      t.expect(description, actual).toBe(false);
  },
  "assert_equals": (t, actual, expected, description) =>
  {
   /*
    * Test if two primitives are equal or two objects
    * are the same object
    */
    if (typeof actual != typeof expected) {
      throw new Error("expected equality but got conflicting types (" + typeof actual + " vs " + typeof expected + ")");
    }
    t.expect(description, same_value(actual, expected)).toBe(true);
  },
  "assert_not_equals": (t, actual, expected, description) =>
  {
   /*
    * Test if two primitives are unequal or two objects
    * are different objects
    */
      t.expect(description, !same_value(actual, expected)).toBe(true);
  },
  "assert_in_array": (t, actual, expected, description) =>
  {
      t.expect(description, expected).toContain(actual);
  },
  "assert_object_equals": (t, actual, expected, description) =>
  {
      //This needs to be improved a great deal
      function check_equal(actual, expected, stack)
      {
        stack.push(actual);
        var p;
        for (p in actual) {
          t.expect(description, expected.hasOwnProperty(p)).toBe(true);
          if (typeof actual[p] === "object" && actual[p] !== null) {
            if (stack.indexOf(actual[p]) === -1) {
              check_equal(actual[p], expected[p], stack);
            }
          } else {
            t.expect(description, same_value(actual[p], expected[p])).toBe(true);
          }
        }
        for (p in expected) {
        t.expect(description, actual.hasOwnProperty(p)).toBe(true);
        }
        stack.pop();
      }
      check_equal(actual, expected, []);
  },
  "assert_array_equals": (t, actual, expected, description) =>
  {

      t.expect(description, typeof actual === "object" && actual !== null && "length" in actual).toBe(true);
      t.expect(description, actual.length).toBe(expected.length);

      for (var i = 0; i < actual.length; i++) {
        t.expect(description, actual.hasOwnProperty(i)).toBe(expected.hasOwnProperty(i));
        t.expect(description, same_value(expected[i], actual[i])).toBe(true);
      }
  },
  "assert_array_approx_equals": (t, actual, expected, epsilon, description) => 
   {
    /*
     * Test if two primitive arrays are equal withing +/- epsilon
     */

      t.expect(description, actual.length).toBe(expected.length);

      for (var i = 0; i < actual.length; i++) {
          t.expect(description, actual.hasOwnProperty(i)).toBe(expected.hasOwnProperty(i));
          t.expect(description, typeof actual[i]).toBe("number");
          t.expect(description, Math.abs(actual[i] - expected[i]) <= epsilon).toBe(true);
      }
  },
  "assert_approx_equals": (t, actual, expected, epsilon, description) => 
   {
    /*
     * Test if two primitive numbers are equal withing +/- epsilon
     */
      t.expect(description, typeof actual).toBe("number");
      t.expect(description, Math.abs(actual - expected) <= epsilon).toBe(true);
  },
  "assert_less_than": (t, actual, expected, description) => 
   {
    /*
     * Test if a primitive number is less than another
     */
      t.expect(description, typeof actual).toBe("number");
      t.expect(description, actual).toBeLessThan(expected);
  },
  "assert_greater_than": (t, actual, expected, description) => 
   {
    /*
     * Test if a primitive number is greater than another
     */
      t.expect(description, typeof actual).toBe("number");
      t.expect(description, actual).toBeGreaterThan(expected);
  },
  "assert_between_exclusive": (t, actual, lower, upper, description) => 
   {
    /*
     * Test if a primitive number is between two others
     */
      t.expect(description, typeof actual).toBe("number");
      t.expect(description, actual).toBeGreaterThan(lower);
      t.expect(description, actual).toBeLessThan(upper);
  },
  "assert_less_than_equal": (t, actual, expected, description) => 
   {
    /*
     * Test if a primitive number is less than or equal to another
     */
      t.expect(description, typeof actual).toBe("number");
      t.expect(description, actual <= expected).toBe(true);
  },
  "assert_greater_than_equal": (t, actual, expected, description) => 
   {
    /*
     * Test if a primitive number is greater than or equal to another
     */
      t.expect(description, typeof actual).toBe("number");
      t.expect(description, actual >= expected).toBe(true);
  },
  "assert_between_inclusive": (t, actual, lower, upper, description) => 
   {
    /*
     * Test if a primitive number is between to two others or equal to either of them
     */
      t.expect(description, typeof actual).toBe("number");
      t.expect(description, actual >= lower && actual <= upper).toBe(true);
  },
  "assert_regexp_match": (t, actual, expected, description) => 
   {
    /*
     * Test if a string (actual) matches a regexp (expected)
     */
      t.expect(description, expected.test(actual)).toBe(true);
  },
  "assert_class_string": (t, object, class_string, description) => 
   {
      assert_equals(t, {}.toString.call(object), "[object " + class_string + "]",
                    description);
  },
  "assert_exists": (t, object, property_name, description) => 
   {
      t.expect(description, object.hasOwnProperty(property_name)).toBe(true);
  },
  "assert_own_property": (t, object, property_name, description) => 
   {
      t.expect(description, object.hasOwnProperty(property_name)).toBe(true);
  },
  "assert_not_exists": (t, object, property_name, description) => 
   {
      t.expect(description, !object.hasOwnProperty(property_name)).toBe(true);
  },
  "assert_inherits": (object, property_name, description) => 
   {
      t.expect(description, typeof object === "object" || typeof object === "function").toBe(true);
      t.expect(description, "hasOwnProperty" in object).toBe(true);
      t.expect(description, !object.hasOwnProperty(property_name)).toBe(true);
      t.expect(description, property_name in object).toBe(true);
  },
  "assert_idl_attribute": (object, property_name, description) => 
   {
      t.expect(description, typeof object === "object" || typeof object === "function").toBe(true);
      t.expect(description, "hasOwnProperty" in object).toBe(true);
      t.expect(description, !object.hasOwnProperty(property_name)).toBe(true);
      t.expect(description, property_name in object).toBe(true);
  },
  "assert_readonly": (t, object, property_name, description) => 
   {
      var result = false;
      var initial_value = object[property_name];
      try {
         //Note that this can have side effects in the case where
         //the property has PutForwards
         object[property_name] = initial_value + "a"; //XXX use some other value here?
         result = same_value(object[property_name], initial_value);
      } finally {
         object[property_name] = initial_value;
      }
      t.expect(description, result).toBe(true);
  },
  "assert_throws": (t, code, func, description) => 
   {
      if (!description) {
        description = func.toString()
      }
      try {
        func.call(this);
        t.expect(description, false).toBe(true);
      } catch (e) {
          description += " threw " + e
          t.expect(description, typeof e).toBe("object");
          t.expect(description, e !== null).toBe(true);
          if (code === null) {
              throw new Error('Test bug: need to pass exception to assert_throws()');
          }
          if (typeof code === "object") {
              t.expect(description, "name" in e && e.name == code.name).toBe(true);
              return;
          }
          var code_name_map = {}
          code_name_map["INDEX_SIZE_ERR"] = 'IndexSizeError';
          code_name_map["HIERARCHY_REQUEST_ERR"] = 'HierarchyRequestError';
          code_name_map["WRONG_DOCUMENT_ERR"] = 'WrongDocumentError';
          code_name_map["INVALID_CHARACTER_ERR"] = 'InvalidCharacterError';
          code_name_map["NO_MODIFICATION_ALLOWED_ERR"] = 'NoModificationAllowedError';
          code_name_map["NOT_FOUND_ERR"] = 'NotFoundError';
          code_name_map["NOT_SUPPORTED_ERR"] = 'NotSupportedError';
          code_name_map["INUSE_ATTRIBUTE_ERR"] = 'InUseAttributeError';
          code_name_map["INVALID_STATE_ERR"] = 'InvalidStateError';
          code_name_map["SYNTAX_ERR"] = 'SyntaxError';
          code_name_map["INVALID_MODIFICATION_ERR"] = 'InvalidModificationError';
          code_name_map["NAMESPACE_ERR"] = 'NamespaceError';
          code_name_map["INVALID_ACCESS_ERR"] = 'InvalidAccessError';
          code_name_map["TYPE_MISMATCH_ERR"] = 'TypeMismatchError';
          code_name_map["SECURITY_ERR"] = 'SecurityError';
          code_name_map["NETWORK_ERR"] = 'NetworkError';
          code_name_map["ABORT_ERR"] = 'AbortError';
          code_name_map["URL_MISMATCH_ERR"] = 'URLMismatchError';
          code_name_map["QUOTA_EXCEEDED_ERR"] = 'QuotaExceededError';
          code_name_map["TIMEOUT_ERR"] = 'TimeoutError';
          code_name_map["INVALID_NODE_TYPE_ERR"] = 'InvalidNodeTypeError';
          code_name_map["DATA_CLONE_ERR"] = 'DataCloneError';

          var name = code in code_name_map ? code_name_map[code] : code;
          var name_code_map = {
              'IndexSizeError': 1,
              'HierarchyRequestError': 3,
              'WrongDocumentError': 4,
              'InvalidCharacterError': 5,
              'NoModificationAllowedError': 7,
              'NotFoundError': 8,
              'NotSupportedError': 9,
              'InUseAttributeError': 10,
              'InvalidStateError': 11,
              'SyntaxError': 12,
              'InvalidModificationError': 13,
              'NamespaceError': 14,
              'InvalidAccessError': 15,
              'TypeMismatchError': 17,
              'SecurityError': 18,
              'NetworkError': 19,
              'AbortError': 20,
              'URLMismatchError': 21,
              'QuotaExceededError': 22,
              'TimeoutError': 23,
              'InvalidNodeTypeError': 24,
              'DataCloneError': 25,

              'EncodingError': 0,
              'NotReadableError': 0,
              'UnknownError': 0,
              'ConstraintError': 0,
              'DataError': 0,
              'TransactionInactiveError': 0,
              'ReadOnlyError': 0,
              'VersionError': 0,
              'OperationError': 0,
              'NotAllowedError': 0
          };

          if (!(name in name_code_map)) {
              throw new Error('Test bug: unrecognized DOMException code "' + code + '" passed to assert_throws()');
          }

          t.expect(description+", expected code "+name_code_map[name]+" but got "+e.code, e.code).toBe(name_code_map[name]);

      }
  },
  "assert_unreached": (t, description) => 
   {
       t.expect(description, false).toBe(true);
  },
  "assert_any": (t, assert_func, actual, expected_array) => 
   {
      var args = [].slice.call(arguments, 3);
      var errors = [];
      var passed = false;
      forEach(expected_array,
              function(expected)
              {
                  try {
                      assert_func.apply(this, [actual, expected].concat(args));
                      passed = true;
                  } catch (e) {
                      errors.push(e.message);
                  }
          });
      if (!passed) {
        t.expect(description, false).toBe(true);
      }
  }
}

function _valToString(val)
{
    if (val === undefined || val === null)
        return '[' + typeof(val) + ']';
    return val.toString() + '[' + typeof(val) + ']';
}

var canvasAssert = {
  "_assert": (t, cond, text) =>
  {
      webAssert.assert_true(t, !!cond, text);
  },

  "_assertSame": (t, a, b, text_a, text_b) =>
  {
      var msg = text_a + ' === ' + text_b + ' (got ' + _valToString(a) +
                ', expected ' + _valToString(b) + ')';
      webAssert.assert_equals(t, a, b, msg);
  },

  "_assertDifferent": (t, a, b, text_a, text_b) =>
  {
      var msg = text_a + ' !== ' + text_b + ' (got ' + _valToString(a) +
                ', expected not ' + _valToString(b) + ')';
      webAssert.assert_not_equals(t, a, b, msg);
  }
  ,

    "_getPixel": (ctx, x,y) =>
  {
      var imgdata = ctx.getImageData(x, y, 1, 1);
      return [ imgdata.data[0], imgdata.data[1], imgdata.data[2], imgdata.data[3] ];
  },

    "_assertPixel": (t, ctx, x,y, r,g,b,a, pos, colour) =>
  {
      var c = canvasAssert._getPixel(ctx, x,y);
      webAssert.assert_equals(t, c[0], r, 'Red channel of the pixel at (' + x + ', ' + y + '): expected ' + r + ' got ' + c[0]);
      webAssert.assert_equals(t, c[1], g, 'Green channel of the pixel at (' + x + ', ' + y + '): expected ' + g + ' got ' + c[1]);
      webAssert.assert_equals(t, c[2], b, 'Blue channel of the pixel at (' + x + ', ' + y + '): expected ' + b + ' got ' + c[2]);
      webAssert.assert_equals(t, c[3], a, 'Alpha channel of the pixel at (' + x + ', ' + y + '): expected ' + a + ' got ' + c[3]);
   },

    "_assertPixelApprox": (t, ctx, x,y, r,g,b,a, pos, colour, tolerance) =>
  {
      var c = canvasAssert._getPixel(ctx, x,y);
      webAssert.assert_approx_equals(t, c[0], r, tolerance, 'Red channel of the pixel at (' + x + ', ' + y + '): expected around ' + r + ' got ' + c[0]);
      webAssert.assert_approx_equals(t, c[1], g, tolerance, 'Green channel of the pixel at (' + x + ', ' + y + '): expected around ' + g + ' got ' + c[1]);
      webAssert.assert_approx_equals(t, c[2], b, tolerance, 'Blue channel of the pixel at (' + x + ', ' + y + '): expected around ' + b + ' got ' + c[2]);
      webAssert.assert_approx_equals(t, c[3], a, tolerance, 'Alpha channel of the pixel at (' + x + ', ' + y + '): expected around ' + a + ' got ' + c[3]);
  },

    "_assertGreen": (t, ctx, canvasWidth, canvasHeight) =>
  {
      var testColor = function(d, idx, expected) {
          webAssert.assert_equals(t, d[idx], expected, "d[" + idx + "]", String(expected));
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
}