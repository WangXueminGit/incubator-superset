# Initialize Shopee Superset

### Environment Setup

For Ubuntu or Debian environment

	sudo apt-get install build-essential libssl-dev libffi-dev python-dev python-pip libsasl2-dev libldap2-dev

For OSX

	brew install pkg-config libffi openssl python
	env LDFLAGS="-L$(brew --prefix openssl)/lib" CFLAGS="-I$(brew --prefix openssl)/include" 	pip install cryptography

For Windows

	pip install cryptography
	md C:\Temp

### Installation of VirtualENV (Optional)



### Upgrade Python Setuptools and PIP

	pip install --upgrade setuptools pip
	

### Build superset

	# Install superset from PIP
	# pip install superset
	
	# Build from source
	# assuming $SUPERSET_HOME as the root of the repo
	cd $SUPERSET_HOME/superset/assets
	npm install
	npm run build
	cd $SUPERSET_HOME
	python setup.py install
	
	# Create an admin user (you will be prompted to set username, first and last name before setting a password)
	fabmanager create-admin --app superset
	
	# Initialize the database
	superset db upgrade
	
	# Load some data to play with
	superset load_examples
	
	# Create default roles and permissions
	superset init
	
	# Start the web server on port 8088, use -p to bind to another port
	superset runserver
	
	# To start a development web server, use the -d switch
	# superset runserver -d
