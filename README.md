Shopee Lumos - Data Visualization Platform
==========================================

Environment Setup (First time)
------------------------------
### OS-level library dependencies
1. Ubuntu

		sudo apt-get install build-essential libssl-dev libffi-dev python-dev python-pip libsasl2-dev libldap2-dev

1. Fedora/Centos (Current Kafka00 OS)

		sudo yum upgrade python-setuptools
		sudo yum install gcc libffi-devel python-devel python-pip python-wheel openssl-devel libsasl2-devel openldap-devel

1. macOs

		brew install pkg-config libffi openssl pythonenv LDFLAGS="-L$(brew --prefix openssl)/lib" CFLAGS="-I$(brew --prefix openssl)/include" 		pip install cryptography

1. Windows

		# install pip first from
		C:\> pip install cryptography

		# You may also have to create C:\Temp
		C:\> md C:\Temp

### Python’s setup tools and pip
Install and update pip and setup tools by running
		
		pip install --upgrade setuptools pip
		
### Install required Python module
Check the **Changes made to Lumos(Airbnb Superset)** to install exlucded modules manually
		
### Manual build for local machine (Test environment)

		# Used to install new modules based on package.json
		# and compile assets with Webpack
		cd $SUPERSET_HOME/superset/assets
		npm install
		npm run build
		
		# Install superset as package and can be accessed using CLI
		cd $SUPERSET_HOME
		python setup.py install

### Start lumos in debug mode
		
		DEBUG_MODE=True superset runserver -d
		
### Manage Lumos Data Model

Lumos/Superset uses Flask-appbuilder and SQLAlchemy with their support to ORM. In order to modify the model, add/remove field in `/superset/models/core.py`. To update the database table structure, run the following code(Thanks to Flask-Migrate):

        superset db migrate # do simple migration to check database changes
        # Review the python file generated in /superset/migrations/versions/
        # Add/remove lines that applicable
        superset db upgrade # Make changes to database
        
        # To undo changes, run
        # superset db downgrade
		
### Start lumos in production server
1. Logged in as admin

		# rebuild_source.sh pulls latest git from private github repository
		# in future sshd should be used rather than pull from private github
		cd /home/songyan.ho/shopee-lumos/
		./rebuild_source.sh
		
1. Logged in as normal user

		# start Lumos and its celery thread(32 workers by default)
		su - songyan.ho
		superset runserver & superset worker
		

Changes made to Lumos(Airbnb Superset)
--------------------------------------
1. Superset
	1. Several bugs has been fixed and submitted to airbnb/superset
	2. Several modifications has been committed to shopee-lumos based on requirements
		1. setup.py
			1. Flask-appbuilder v1.8.1
				- The default check & install by setup.py has been disabled due to its outdated code. The modification and bug fix is not published yet but available in [Flask-appbuilder github repo](https://github.com/dpgaspar/Flask-AppBuilder)
				- The main fix required is `Flask-AppBuilder/flask_appbuilder/security/views.py:531`
				- A manual installation is required in environment
						
						git clone https://github.com/dpgaspar/Flask-AppBuilder.git
						cd ~/Flask-AppBuilder
						pip uninstall pyhive -y
						python setup.py install
						
				- It should be enabled once Flask-appbuilder release next version and only if it is compatible with Superset
				
			2. PyHive v0.2.1
				- The default check & install by setup.py has been disabled due to its outdated code.
				- The TCLIService is outdated and not compatible with Superset v0.17.1
				- The quickfix version is uploaded to **shopee-data/PyHive** repository
				- A manual installation is required in environment
						
						cd ~/PyHive
						pip uninstall pyhive -y
						python setup.py install
			
		


Superset V0.17.1
================

[![Build Status](https://travis-ci.org/airbnb/superset.svg?branch=master)](https://travis-ci.org/airbnb/superset)
[![PyPI version](https://badge.fury.io/py/superset.svg)](https://badge.fury.io/py/superset)
[![Coverage Status](https://coveralls.io/repos/airbnb/superset/badge.svg?branch=master&service=github)](https://coveralls.io/github/airbnb/superset?branch=master)
[![JS Test Coverage](https://codeclimate.com/github/airbnb/superset/badges/coverage.svg)](https://codeclimate.com/github/airbnb/superset/coverage)
[![Code Health](https://landscape.io/github/airbnb/superset/master/landscape.svg?style=flat)](https://landscape.io/github/airbnb/superset/master)
[![Code Climate](https://codeclimate.com/github/airbnb/superset/badges/gpa.svg)](https://codeclimate.com/github/airbnb/superset)
[![PyPI](https://img.shields.io/pypi/pyversions/superset.svg?maxAge=2592000)](https://pypi.python.org/pypi/superset)
[![Requirements Status](https://requires.io/github/airbnb/superset/requirements.svg?branch=master)](https://requires.io/github/airbnb/superset/requirements/?branch=master)
[![Join the chat at https://gitter.im/airbnb/superset](https://badges.gitter.im/airbnb/superset.svg)](https://gitter.im/airbnb/superset?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Documentation](https://img.shields.io/badge/docs-airbnb.io-blue.svg)](http://airbnb.io/superset/)
[![dependencies Status](https://david-dm.org/airbnb/superset/status.svg?path=superset/assets)](https://david-dm.org/airbnb/superset?path=superset/assets)

<img
  src="https://cloud.githubusercontent.com/assets/130878/20946612/49a8a25c-bbc0-11e6-8314-10bef902af51.png"
  alt="Superset"
  width="500"
/>

**Superset** is a data exploration platform designed to be visual, intuitive
and interactive.

[this project used to be named **Caravel**, and **Panoramix** in the past]


Screenshots & Gifs
------------------

**View Dashboards**
![superset-dashboard](https://cloud.githubusercontent.com/assets/130878/20371438/a703a2a0-ac19-11e6-80c4-00a47c2eb644.gif)

<br/>
**View/Edit a Slice**
![superset-explore-slice](https://cloud.githubusercontent.com/assets/130878/20372732/410392f4-ac22-11e6-9c6d-3ef512e81212.gif)

<br/>
**Query and Visualize with SQL Lab**
![superset-sql-lab-visualization](https://cloud.githubusercontent.com/assets/130878/20372911/7c3b3358-ac23-11e6-8f24-923ef1b35715.gif)

<br/>
![superset-dashboard-misc](https://cloud.githubusercontent.com/assets/130878/20234704/0f40778c-a835-11e6-9556-983a62ea061b.png)

![superset-edit-table](https://cloud.githubusercontent.com/assets/130878/20234705/0f415c88-a835-11e6-8b03-f7c35d56dd7d.png)

![superset-query-search](https://cloud.githubusercontent.com/assets/130878/20234706/0f430a10-a835-11e6-8a0d-8b26cc2e6bbd.png)

Superset
---------
Superset's main goal is to make it easy to slice, dice and visualize data.
It empowers users to perform **analytics at the speed of thought**.

Superset provides:
* A quick way to intuitively visualize datasets by allowing users to create
    and share interactive dashboards
* A rich set of visualizations to analyze your data, as well as a flexible
    way to extend the capabilities
* An extensible, high granularity security model allowing intricate rules
    on who can access which features, and integration with major
    authentication providers (database, OpenID, LDAP, OAuth & REMOTE_USER
    through Flask AppBuiler)
* A simple semantic layer, allowing to control how data sources are
    displayed in the UI, by defining which fields should show up in
    which dropdown and which aggregation and function (metrics) are
    made available to the user
* Deep integration with Druid allows for Superset to stay blazing fast while
    slicing and dicing large, realtime datasets
* Fast loading dashboards with configurable caching


Database Support
----------------

Superset was originally designed on top of Druid.io, but quickly broadened
its scope to support other databases through the use of SQLAlchemy, a Python
ORM that is compatible with
[most common databases](http://docs.sqlalchemy.org/en/rel_1_0/core/engines.html).


What is Druid?
-------------
From their website at http://druid.io

*Druid is an open-source analytics data store designed for
business intelligence (OLAP) queries on event data. Druid provides low
latency (real-time) data ingestion, flexible data exploration,
and fast data aggregation. Existing Druid deployments have scaled to
trillions of events and petabytes of data. Druid is best used to
power analytic dashboards and applications.*


Installation & Configuration
----------------------------

[See in the documentation](http://airbnb.io/superset/installation.html)


More screenshots
----------------

![superset-security-menu](https://cloud.githubusercontent.com/assets/130878/20234707/0f565886-a835-11e6-9277-b4f5f4aa2fcc.png)

![superset-slice-bubble](https://cloud.githubusercontent.com/assets/130878/20234708/0f57f3d0-a835-11e6-8268-fcefe8f868c8.png)

![superset-slice-map](https://cloud.githubusercontent.com/assets/130878/20234709/0f5a5a44-a835-11e6-987a-1b6f8ac9922b.png)

![superset-slice-multiline](https://cloud.githubusercontent.com/assets/130878/20234710/0f632d68-a835-11e6-98d1-542dcb618193.png)

![superset-slice-sankey](https://cloud.githubusercontent.com/assets/130878/20234711/0f639136-a835-11e6-8721-fe5e48dab8e7.png)

![superset-slice-view](https://cloud.githubusercontent.com/assets/130878/20234712/0f63c4c6-a835-11e6-8595-6091a6428fa9.png)

![superset-sql-lab-2](https://cloud.githubusercontent.com/assets/130878/20234713/0f67b856-a835-11e6-9d50-7a52168f66fd.png)

![superset-sql-lab](https://cloud.githubusercontent.com/assets/130878/20234714/0f68f45a-a835-11e6-9467-f47ad0af7e79.png)


Resources
-------------
* [Superset Google Group](https://groups.google.com/forum/#!forum/airbnb_superset)
* [Gitter (live chat) Channel](https://gitter.im/airbnb/superset)
* [Docker image](https://hub.docker.com/r/amancevice/superset/) (community contributed)
* [Slides from Strata (March 2016)](https://drive.google.com/open?id=0B5PVE0gzO81oOVJkdF9aNkJMSmM)


Tip of the Hat
--------------

Superset would not be possible without these great frameworks / libs

* Flask App Builder - Allowing us to focus on building the app quickly while
getting the foundation for free
* The Flask ecosystem - Simply amazing. So much Plug, easy play.
* NVD3 - One of the best charting libraries out there
* Much more, check out the `install_requires` section in the [setup.py](https://github.com/airbnb/superset/blob/master/setup.py) file!


Contributing
------------

Interested in contributing? Casual hacking? Check out  [Contributing.MD](https://github.com/airbnb/superset/blob/master/CONTRIBUTING.md)
