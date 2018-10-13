#!/bin/bash

LIBDIR=../
TESTDIR=$LIBDIR/test

pushd "${0%/*}"

mkdir -p collateral/assets/conformanceImages
$TESTDIR/gentest.py \
    --testdir ./collateral \
    --imagedir ../collateral/assets/conformanceImages \
    --templates ./templates/expo.yaml \
    --libdir ./lib/expo \
    --specfile $TESTDIR/specs/spec.yaml \
    --disabledfile $TESTDIR/specs/disabled.yaml \
    $TESTDIR/specs/tests2d.yaml

popd