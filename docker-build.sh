#!/usr/bin/env bash

set -ex

docker build -t shopee/lumos-web -f Dockerfile .
