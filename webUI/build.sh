#!/bin/bash
pushd webUI
cnpm install
ng build --prod --no-extract-license

node dealIndex.build
popd
