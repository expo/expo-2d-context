#!/bin/bash

pushd "${0%/*}"

mkdir -p collateral/html
./gentest.py \
    --testdir ./collateral/html \
    --imagedir ./collateral/html/assets/ \
    --templates ./templates/html.yaml \
    --libdir lib/html \
    --specfile specs/spec.yaml \
    --disabledfile specs/disabled.yaml \
    specs/tests2d.yaml

pushd collateral/html
ln -s -f ../../../dist/bundle.js bundle.js
popd

popd