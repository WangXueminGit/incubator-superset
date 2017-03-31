pip uninstall -y superset
systemctl stop superset
cd /home/songyan.ho/shopee-superset && git pull origin master
cd /home/songyan.ho/shopee-superset/superset/assets && npm install && npm run build
cd /home/songyan.ho/shopee-superset && python setup.py install

systemctl enable superset
systemctl start superset