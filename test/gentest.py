#!/usr/bin/python 
#
# Lovingly butchered out of the Web Platform Test Suite at:
# https://github.com/w3c/web-platform-tests/
#
# The original source generated HTML/canvas/DOM versions of the 2d context
# tests. This version is adapted to generate a jasmine-based test suite for
# expo-canvas-2d.
#
# TODO: usage instructions
#

from __future__ import print_function

import re
import codecs
import time
import os
import shutil
import sys
import argparse
import shutil
import fnmatch

try:
    import cairocffi as cairo
except ImportError:
    import cairo

try:
    import syck as yaml # compatible and lots faster
except ImportError:
    import yaml

def indent(str, indentation):
    return "\n".join(map(lambda x: indentation+x, str.split("\n")))

def simpleEscapeJS(str):
    return str.replace('\\', '\\\\').replace('"', '\\"')

def escapeJS(str):
    str = simpleEscapeJS(str)
    str = re.sub(r'\[(\w+)\]', r'[\\""+(\1)+"\\"]', str) # kind of an ugly hack, for nicer failure-message output
    return str

def genTestUtils(SPECFILE, DISABLEDFILE, TEMPLATESFILE, TESTSFILES, TESTOUTPUTDIR, IMAGEOUTPUTDIR, LIBDIR):

    def expand_nonfinite(method, argstr, tail):
        """
        >>> print expand_nonfinite('f', '<0 a>, <0 b>', ';')
        f(a, 0);
        f(0, b);
        f(a, b);
        >>> print expand_nonfinite('f', '<0 a>, <0 b c>, <0 d>', ';')
        f(a, 0, 0);
        f(0, b, 0);
        f(0, c, 0);
        f(0, 0, d);
        f(a, b, 0);
        f(a, b, d);
        f(a, 0, d);
        f(0, b, d);
        """
        # argstr is "<valid-1 invalid1-1 invalid2-1 ...>, ..." (where usually
        # 'invalid' is Infinity/-Infinity/NaN)
        args = []
        for arg in argstr.split(', '):
            a = re.match('<(.*)>', arg).group(1)
            args.append(a.split(' '))
        calls = []
        # Start with the valid argument list
        call = [ args[j][0] for j in range(len(args)) ]
        # For each argument alone, try setting it to all its invalid values:
        for i in range(len(args)):
            for a in args[i][1:]:
                c2 = call[:]
                c2[i] = a
                calls.append(c2)
        # For all combinations of >= 2 arguments, try setting them to their
        # first invalid values. (Don't do all invalid values, because the
        # number of combinations explodes.)
        def f(c, start, depth):
            for i in range(start, len(args)):
                if len(args[i]) > 1:
                    a = args[i][1]
                    c2 = c[:]
                    c2[i] = a
                    if depth > 0: calls.append(c2)
                    f(c2, i+1, depth+1)
        f(call, 0, 0)

        return '\n'.join('%s(%s)%s' % (method, ', '.join(c), tail) for c in calls)

    templates = {}
    with open(TEMPLATESFILE, "r") as f:
        templates = yaml.load(f.read())
    for k,v in templates.items():
        templates[k] = v.replace("{","{{").replace("}","}}")
        templates[k] = re.sub(r"%([A-Za-z0-9\-_]+)%", r"{\g<1>}", templates[k])

    spec_assertions = []
    for s in yaml.load(open(SPECFILE, "r").read())['assertions']:
        if 'meta' in s:
            eval(compile(s['meta'], '<meta spec assertion>', 'exec'), {}, {'assertions':spec_assertions})
        else:
            spec_assertions.append(s)

    disabled_tests = {}
    for t in yaml.load(open(DISABLEDFILE, "r").read())['DISABLED']:
        test_name = t.keys()[0]
        disable_reason = t[test_name][0]
        disabled_tests[test_name] = disable_reason

    tests = []
    for t in sum([ yaml.load(open(f, "r").read()) for f in TESTSFILES], []):
        if 'DISABLED' in t:
            continue
        if 'meta' in t:
            eval(compile(t['meta'], '<meta test>', 'exec'), {}, {'tests':tests})
        else:
            tests.append(t)

    spec_ids = {}
    for t in spec_assertions: spec_ids[t['id']] = True
    spec_refs = {}

    def make_flat_image(filename, w, h, r,g,b,a):
        if os.path.exists('%s/%s' % (IMAGEOUTPUTDIR, filename)):
            return filename
        surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, w, h)
        cr = cairo.Context(surface)
        cr.set_source_rgba(r, g, b, a)
        cr.rectangle(0, 0, w, h)
        cr.fill()
        surface.write_to_png('%s/%s' % (IMAGEOUTPUTDIR, filename))
        return filename

    # Ensure the test output directories exist
    testdirs = [TESTOUTPUTDIR, IMAGEOUTPUTDIR]
    for d in testdirs:
        try: os.mkdir(d)
        except: pass # ignore if it already exists

    used_images = {}

    def expand_test_code(code):
        code = re.sub(r'@nonfinite ([^(]+)\(([^)]+)\)(.*)', lambda m: expand_nonfinite(m.group(1), m.group(2), m.group(3)), code) # must come before '@assert throws'

        code = re.sub(r'@assert pixel (\d+,\d+) == (\d+,\d+,\d+,\d+);',
                r'ctx.flush()\ncanvasAssert._assertPixel(t, ctx, \1, \2, "\1", "\2");',
                code)

        code = re.sub(r'@assert pixel (\d+,\d+) ==~ (\d+,\d+,\d+,\d+);',
                r'ctx.flush()\ncanvasAssert._assertPixelApprox(t, ctx, \1, \2, "\1", "\2", 2);',
                code)

        code = re.sub(r'@assert pixel (\d+,\d+) ==~ (\d+,\d+,\d+,\d+) \+/- (\d+);',
                r'ctx.flush()\ncanvasAssert._assertPixelApprox(t, ctx, \1, \2, "\1", "\2", \3);',
                code)

        code = re.sub(r'@assert throws (\S+_ERR) (.*);',
                r'ctx.flush()\nwebAssert.assert_throws(t, "\1", function() { \2; });',
                code)

        code = re.sub(r'@assert throws (\S+Error) (.*);',
                r'ctx.flush()\nwebAssert.assert_throws(t, new \1(), function() { \2; });',
                code)

        code = re.sub(r'@assert (.*) === (.*);',
                lambda m: 'ctx.flush()\ncanvasAssert._assertSame(t, %s, %s, "%s", "%s");'
                    % (m.group(1), m.group(2), escapeJS(m.group(1)), escapeJS(m.group(2)))
                , code)

        code = re.sub(r'@assert (.*) !== (.*);',
                lambda m: 'ctx.flush()\ncanvasAssert._assertDifferent(t, %s, %s, "%s", "%s");'
                    % (m.group(1), m.group(2), escapeJS(m.group(1)), escapeJS(m.group(2)))
                , code)

        code = re.sub(r'@assert (.*) =~ (.*);',
                lambda m: 'ctx.flush()\nwebAssert.assert_regexp_match(t, %s, %s);'
                    % (m.group(1), m.group(2))
                , code)

        code = re.sub(r'@assert (.*);',
                lambda m: 'ctx.flush()\nwebAssert._assert(t, %s, "%s");'
                    % (m.group(1), escapeJS(m.group(1)))
                , code)

        code = re.sub(r' @moz-todo', '', code)

        code = re.sub(r'@moz-UniversalBrowserRead;',
                ""
                , code)

        code = re.sub(r'_assertGreen\s*\(',
                'ctx.flush()\ncanvasAssert._assertGreen(t,', code)

        # Initialize fonts for every canvas object that uses fillText()/strokeText()
        fontRefs = re.findall(r"([a-zA-Z0-9_]+)\.(strokeText|fillText|font)\s*[\(=]", code)
        fontRefObjs = set()
        for ref in fontRefs:
            fontRefObjs.add(ref[0])
        for obj in fontRefObjs:
            code = "await "+obj+".initializeText();\n" + code;

        assert('@' not in code)

        return code

    def replace_dom_code(code):
        imgRefs = set()
        refToAsset = {}
        pattern = re.compile(r'''document\.getElementById\(['"]([a-zA-Z0-9_\-.]+)['"]\)''')
        for match in re.finditer(pattern, code):
            imgRefs.add(match.group(1));
        for idx, ref in enumerate(imgRefs):
            refName = "_AssetRef%d" % idx
            code = ("let %s = await getAsset('%s')\n" % (refName, ref)) + code;
            refToAsset[ref] = refName
        code = re.sub(pattern, lambda m: '%s' % refToAsset[m.group(1)], code)

        totalContexts = [1]
        def nextContext():
            totalContexts[0] += 1
            return "allContexts[%d]" % (totalContexts[0] - 1)

        # TODO: somehow capture sets to the canvas width and height
        code = re.sub(r'''document\.createElement\(['"]canvas['"]\)''',
                        lambda m: nextContext(), code)

        code = re.sub(r"canvas\.toDataURL\(\)", "", code)

        code = re.sub(r"Arial", "Calibri", code)

        code = re.sub(r"step_timeout\(t\.step_func_done\(function \(\)", "", code)
        code = re.sub(r"deferTest\(\);?", "", code)

        return (code, totalContexts[0])

    def comment_out(code):
        return "\n".join(["// "+line for line in code.split("\n")])

    test_code = {}
    generated_images = set()

    for i in range(len(tests)):
        test = tests[i]

        name = test['name']

        if name in test_code:
            print("WARNING: Test %s is defined twice" % name)

        for ref in test.get('testing', []):
            if ref not in spec_ids:
                print("WARNING: Test %s uses nonexistent spec point %s" % (name, ref))
            spec_refs.setdefault(ref, []).append(name)

        if not test.get('testing', []):
            print("WARNING: Test %s doesn't refer to any spec points" % name)

        if test.get('expected', '') == 'green' and re.search(r'@assert pixel .* 0,0,0,0;', test['code']):
            print("WARNING: Probable incorrect pixel test in %s" % name)

        if "manual" in test:
            print("WARNING: Test %s requires manual result inspection" % name)

        code = test['code']
        code = expand_test_code(code)
        code, totalContexts = replace_dom_code(code)

        if 'expected' in test and test['expected'] is not None:
            expected = test['expected']
            expected_img = None
            if expected == 'green':
                expected_img = make_flat_image('green-100x50.png', 100, 50, 0,1,0,1)
            elif expected == 'clear':
                expected_img = make_flat_image('clear-100x50.png', 100, 50, 0,0,0,0)
            else:
                if ';' in expected:
                    print("Found semicolon in %s" % name)
                expected = re.sub(r'^size (\d+) (\d+)',
                    r'surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, \1, \2)\ncr = cairo.Context(surface)',
                                  expected)

                if name.endswith("-manual"):
                    png_name = name[:-len("-manual")]
                else:
                    png_name = name
                expected += "\nsurface.write_to_png('%s/%s.png')\n" % (IMAGEOUTPUTDIR, png_name)
                eval(compile(expected, '<test %s>' % test['name'], 'exec'), {}, {'cairo':cairo})
            if expected_img:
                generated_images.add(expected_img)
                # TODO: comparison code?
                pass

        # canvas = test.get('canvas', 'width="100" height="50"')
        height = 50
        width = 100
        if "canvas" in test:
            result = re.search(r"width:\s*([0-9]+)(px)?",test["canvas"])
            if result is not None:
                width = result.group(1)
            result = re.search(r"height:\s*([0-9]+)(px)?",test["canvas"])
            if result is not None:
                height = result.group(1)

        scripts = ''
        if 'scripts' in test:
            print("Tests with independent scripts not supported!! Skipping generation of " + name)
            continue
        if 'script_variants' in test:
            print("Tests with independent scripts not supported!! Skipping generation of " + name)
            continue

        images = ''
        for img in test.get('images', []):
            imgId = img.split('/')[-1]
            if '/' not in img:
                used_images[img] = 1
                img = '../images/%s' % img
            images += '<img src="%s" id="%s" class="resource">\n' % (img,imgId)
            # TODO: wrap as assets
        images = images.replace("../images/", "/images/")

        fonts = ''
        for fnt in test.get('fonts', []):
            fonts += '@font-face {\n  font-family: %s;\n  src: url("/fonts/%s.ttf");\n}\n' % (fnt, fnt)
            # TODO: what do we do about this??

        desc = test.get('desc', '')
        escaped_desc = simpleEscapeJS(desc)

        test_code[name] = templates["test"].format(**{
            "id": i,
            "name": name,
            "description": "%s (%s)" % (name, escaped_desc) if desc != "" else name,
            "init": "",
            "totalContexts": str(totalContexts),
            "body": indent(code, "      "),
            "height": height,
            "width": width
        })


    categorized_tests = {}
    for name, test in test_code.items():
        category = name.split(".")[1]
        category_tests = categorized_tests.setdefault(category, {})
        category_tests[name] = test

    index = []
    for category, tests in categorized_tests.items():
        test_filename = re.sub(r"\s","",templates["filenames"]).format(**{
                "name": "2d." + category
        })
        index.append((test_filename, category, len(tests)))
        with open(os.path.join(TESTOUTPUTDIR, test_filename), "w") as f:
            tests_concat = []

            for name, test in tests.items():
                test_disabled = name in disabled_tests
                if not test_disabled:
                    # Look for heirarchical matches
                    for key in disabled_tests.keys():
                        if fnmatch.fnmatch(name, key):
                            test_disabled = True
                            reason = disabled_tests[key]
                            break
                else:
                    reason = disabled_tests[name]
                if test_disabled:
                    test = templates["disabled"].format(**{
                        "reason": reason,
                        "body": test
                    })
                tests_concat.append(test)

            tests_concat = "\n".join(tests_concat)

            spec = templates["spec"].format(**{
                "name": "2d." + category,
                "tests": tests_concat 
            })

            f.write(spec);
            print("Generated %d tests for %s" % (len(tests), "2d." + category))

    if "index" in templates:
        index_filename = re.sub(r"\s","",templates["filenames"]).format(**{
                    "name": "index"
        })
        with open(os.path.join(TESTOUTPUTDIR, index_filename), "w") as f:
            index_list = "\n".join(map(lambda test: templates["index_item"].format(**{
                "filename": test[0],
                "name": test[1],
                "count": test[2]
            }), index))
            f.write(templates["index"].format(**{
                "indexlist": index_list,
            }))


    with open(os.path.join(TESTOUTPUTDIR, "assets.js"), "w") as f:
        asset_list = []
        asset_list += generated_images
        for asset in os.listdir(os.path.join(LIBDIR, "assets")):
            if asset.endswith(".png") or asset.endswith(".gif"):
                asset_list.append(asset)
                shutil.copyfile(os.path.join(LIBDIR, "assets", asset), os.path.join(IMAGEOUTPUTDIR, asset))

        asset_list = ", ".join(map(lambda img: templates["asset_definition"].format(**{
                "asset_filename": img
            }), asset_list))

        f.write(templates["assets"].format(**{
            "assetlist": asset_list,
        }))


    for libfile in os.listdir(LIBDIR):
        if libfile == "assets":
            continue
        shutil.copyfile(os.path.join(LIBDIR, libfile), os.path.join(TESTOUTPUTDIR, libfile))        



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate conformance test code')
    parser.add_argument("--testdir-out", type=str, default="./tests")
    parser.add_argument("--imagedir-out", type=str, default="./assets")
    parser.add_argument("--libdir-out", type=str, default="./lib")
    parser.add_argument("--templates", type=str, default="templates.yaml")
    parser.add_argument("--specfile", type=str)
    parser.add_argument("--disabledfile", type=str)
    parser.add_argument("testfiles", type=str, nargs="+")
    args = parser.parse_args()
    genTestUtils(
        args.specfile,
        args.disabledfile,
        args.templates,
        args.testfiles,
        args.testdir_out,
        args.imagedir_out,
        args.libdir_out
    )