#!/bin/bash

pushd "${0%/*}"

./gentest.py \
    --testdir ./collateral/ \
    --imagedir ./collateral/assets/ \
    --templates ./templates/html.yaml \
    --libdir lib/html \
    --specfile specs/spec.yaml \
    --disabledfile specs/disabled.yaml \
    specs/tests2d.yaml

pushd collateral
ln -s -f ../../dist/bundle.js bundle.js
popd

popd