FROM python:2.7.13

MAINTAINER Xiao Hanyu <hanyu.xiao@shopeemobile.com>

# Add a normal user
RUN useradd --user-group --create-home --shell /bin/bash work

# Configure environment
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    HOME=/home/work

RUN apt-get update -y

# Install some dependencies
# http://airbnb.io/superset/installation.html#os-dependencies
RUN apt-get update -y && apt-get install -y build-essential libssl-dev \
    libffi-dev python-dev python-pip libsasl2-dev libldap2-dev \
    libsasl2-modules

RUN apt-get install -y vim less postgresql-client redis-tools

# Install nodejs for custom build
# http://airbnb.io/superset/installation.html#making-your-own-build
# https://nodejs.org/en/download/package-manager/
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -; \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list; \
    apt-get update; \
    apt-get install -y yarn

RUN mkdir $HOME/lumos-superset

WORKDIR $HOME/lumos-superset

COPY ./install-reqs.txt ./dev-reqs.txt ./dev-reqs-for-docs.txt ./

RUN pip install --upgrade setuptools pip
RUN pip install -r install-reqs.txt && pip install -r dev-reqs.txt \
    && pip install -r dev-reqs-for-docs.txt

ENV PATH=/home/work/lumos-superset/superset/bin:$PATH \
    PYTHONPATH=.:$PYTHONPATH

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
RUN ln -s usr/local/bin/docker-entrypoint.sh /entrypoint.sh # backwards compat

COPY ./superset ./superset
RUN chown -R work:work $HOME

USER work

RUN cd superset/assets && yarn
RUN cd superset/assets && npm run build

HEALTHCHECK CMD ["curl", "-f", "http://localhost:8088/health"]

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 8088
