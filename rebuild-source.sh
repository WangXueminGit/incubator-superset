#!/usr/bin/env bash

pip uninstall -y superset
cd /home/songyan.ho/shopee-lumos && git checkout . && git pull origin master
cd /home/songyan.ho/shopee-lumos/superset/assets && npm install && npm run build
cd /home/songyan.ho/shopee-lumos && python setup.py install