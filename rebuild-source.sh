#!/usr/bin/env bash

pip uninstall -y superset
#systemctl stop superset
#systemctl stop superset-worker
cd /home/songyan.ho/shopee-superset && git checkout . && git pull origin master
cd /home/songyan.ho/shopee-superset/superset/assets && npm install && npm run build
cd /home/songyan.ho/shopee-superset && python setup.py install
cd /home/songyan.ho/shopee-superset && chmod +x ./rebuild-source.sh
#systemctl enable superset
#systemctl start superset
#systemctl enable superset-worker
#systemctl start superset-worker
/home/songyan.ho/shopee-superset/run_production.sh