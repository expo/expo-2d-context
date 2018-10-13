const DOMException = require("domexception");

export function _assert(t, expression, description)
{
    return assert_true(t, expression, description);
}

export function assert_true(t, actual, description)
{
    t.expect(actual).toBe(true);
}

export function assert_false(t, actual, description)
{
    t.expect(actual).toBe(false);
}

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

export function assert_equals(t, actual, expected, description)
{
 /*
  * Test if two primitives are equal or two objects
  * are the same object
  */
  if (typeof actual != typeof expected) {
    throw new Error("expected equality but got conflicting types (" + typeof actual + " vs " + typeof expected + ")");
  }
  t.expect(same_value(actual, expected)).toBe(true);
}

export function assert_not_equals(t, actual, expected, description)
{
 /*
  * Test if two primitives are unequal or two objects
  * are different objects
  */
    t.expect(!same_value(actual, expected)).toBe(true);
}

export function assert_in_array(t, actual, expected, description)
{
    t.expect(expected).toContain(actual);
}

export function assert_object_equals(t, actual, expected, description)
{
    //This needs to be improved a great deal
    function check_equal(actual, expected, stack)
    {
      stack.push(actual);
      var p;
      for (p in actual) {
        t.expect(expected.hasOwnProperty(p)).toBe(true);
        if (typeof actual[p] === "object" && actual[p] !== null) {
          if (stack.indexOf(actual[p]) === -1) {
            check_equal(actual[p], expected[p], stack);
          }
        } else {
          t.expect(same_value(actual[p], expected[p])).toBe(true);
        }
      }
      for (p in expected) {
      t.expect(actual.hasOwnProperty(p)).toBe(true);
      }
      stack.pop();
    }
    check_equal(actual, expected, []);
}

export function assert_array_equals(t, actual, expected, description)
{

    t.expect(typeof actual === "object" && actual !== null && "length" in actual).toBe(true);
    t.expect(actual.length).toBe(expected.length);

    for (var i = 0; i < actual.length; i++) {
      t.expect(actual.hasOwnProperty(i)).toBe(expected.hasOwnProperty(i));
      t.expect(same_value(expected[i], actual[i])).toBe(true);
    }
}

export function assert_array_approx_equals(t, actual, expected, epsilon, description)
{
  /*
   * Test if two primitive arrays are equal withing +/- epsilon
   */

    t.expect(actual.length).toBe(expected.length);

    for (var i = 0; i < actual.length; i++) {
        t.expect(actual.hasOwnProperty(i)).toBe(expected.hasOwnProperty(i));
        t.expect(typeof actual[i]).toBe("number");
        t.expect(Math.abs(actual[i] - expected[i]) <= epsilon).toBe(true);
    }
}

export function assert_approx_equals(t, actual, expected, epsilon, description)
{
  /*
   * Test if two primitive numbers are equal withing +/- epsilon
   */
    t.expect(typeof actual).toBe("number");
    t.expect(Math.abs(actual - expected) <= epsilon).toBe(true);
}

export function assert_less_than(t, actual, expected, description)
{
  /*
   * Test if a primitive number is less than another
   */
    t.expect(typeof actual).toBe("number");
    t.expect(actual).toBeLessThan(expected);
}

export function assert_greater_than(t, actual, expected, description)
{
  /*
   * Test if a primitive number is greater than another
   */
    t.expect(typeof actual).toBe("number");
    t.expect(actual).toBeGreaterThan(expected);
}

export function assert_between_exclusive(t, actual, lower, upper, description)
{
  /*
   * Test if a primitive number is between two others
   */
    t.expect(typeof actual).toBe("number");
    t.expect(actual).toBeGreaterThan(lower);
    t.expect(actual).toBeLessThan(upper);
}

export function assert_less_than_equal(t, actual, expected, description)
{
  /*
   * Test if a primitive number is less than or equal to another
   */
    t.expect(typeof actual).toBe("number");
    t.expect(actual <= expected).toBe(true);
}

export function assert_greater_than_equal(t, actual, expected, description)
{
  /*
   * Test if a primitive number is greater than or equal to another
   */
    t.expect(typeof actual).toBe("number");
    t.expect(actual >= expected).toBe(true);
}

export function assert_between_inclusive(t, actual, lower, upper, description)
{
  /*
   * Test if a primitive number is between to two others or equal to either of them
   */
    t.expect(typeof actual).toBe("number");
    t.expect(actual >= lower && actual <= upper).toBe(true);
}

export function assert_regexp_match(t, actual, expected, description) {
  /*
   * Test if a string (actual) matches a regexp (expected)
   */
    t.expect(expected.test(actual)).toBe(true);
}

export function assert_class_string(t, object, class_string, description) {
    assert_equals(t, {}.toString.call(object), "[object " + class_string + "]",
                  description);
}

export function assert_exists(t, object, property_name, description) {
    t.expect(object.hasOwnProperty(property_name)).toBe(true);
}

export function assert_own_property(t, object, property_name, description) {
    t.expect(object.hasOwnProperty(property_name)).toBe(true);
}

export function assert_not_exists(t, object, property_name, description)
{
    t.expect(!object.hasOwnProperty(property_name)).toBe(true);
}

export function assert_inherits(object, property_name, description) {
    t.expect(typeof object === "object" || typeof object === "function").toBe(true);
    t.expect("hasOwnProperty" in object).toBe(true);
    t.expect(!object.hasOwnProperty(property_name)).toBe(true);
    t.expect(property_name in object).toBe(true);
}

export function assert_idl_attribute(object, property_name, description) {
    t.expect(typeof object === "object" || typeof object === "function").toBe(true);
    t.expect("hasOwnProperty" in object).toBe(true);
    t.expect(!object.hasOwnProperty(property_name)).toBe(true);
    t.expect(property_name in object).toBe(true);
}

export function assert_readonly(t, object, property_name, description)
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
    t.expect(result).toBe(true);
}

export function assert_throws(t, code, func, description)
{
    try {
      func.call(this);
      t.expect(false).toBe(true);
    } catch (e) {
        t.expect(typeof e).toBe("object");
        t.expect(e !== null).toBe(true);

        if (code === null) {
            throw new Error('Test bug: need to pass exception to assert_throws()');
        }
        if (typeof code === "object") {
            t.expect("name" in e && e.name == code.name).toBe(true);
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

        var required_props = { code: name_code_map[name] };

        if (required_props.code === 0 ||
           ("name" in e &&
            e.name !== e.name.toUpperCase() &&
            e.name !== "DOMException")) {
            // New style exception: also test the name property.
            required_props.name = name;
        }

        //We'd like to test that e instanceof the appropriate interface,
        //but we can't, because we don't know what window it was created
        //in.  It might be an instanceof the appropriate interface on some
        //unknown other window.  TODO: Work around this somehow?

        for (var prop in required_props) {
            t.expect(prop in e && e[prop] == required_props[prop]).toBe(true);
        }
    }
}

export function assert_unreached(t, description) {
     t.expect(false).toBe(true);
}

export function assert_any(t, assert_func, actual, expected_array)
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
      t.expect(false).toBe(true);
    }
}
