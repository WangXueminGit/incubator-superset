pip uninstall -y superset
cd /home/songyan.ho/shopee-superset/superset/assets && npm install && npm run build
cd /home/songyan.ho/shopee-superset && python setup.py install

superset runserver