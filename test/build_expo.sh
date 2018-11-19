#!/bin/bash

LIBDIR=../
TESTDIR=$LIBDIR/test

pushd "${0%/*}"

mkdir -p collateral/expo
mkdir -p collateral/expo/assets
$TESTDIR/gentest.py \
    --testdir ./collateral/expo \
    --imagedir ./collateral/expo/assets/ \
    --templates ./templates/expo.yaml \
    --libdir ./lib/expo \
    --specfile $TESTDIR/specs/spec.yaml \
    --disabledfile $TESTDIR/specs/disabled.yaml \
    $TESTDIR/specs/tests2d.yaml

popd