#!/bin/bash
set -ex

if [ "$#" -ne 0 ]; then
    exec "$@"
elif [ "$LUMOS_ENV" = "local" ]; then
    superset worker &
    superset runserver -d
elif [ "$LUMOS_ENV" = "testing" ]; then
    superset worker &
    superset runserver -d
elif [ "$LUMOS_ENV" = "staging" ]; then
    gunicorn -w $((2 * $(getconf _NPROCESSORS_ONLN) + 1)) -k gevent --timeout 1800 -b 0.0.0.0:8088 --limit-request-line 0 --limit-request-field_size 0 superset:app
elif [ "$LUMOS_ENV" = "production" ]; then
    gunicorn -w $((2 * $(getconf _NPROCESSORS_ONLN) + 1)) -k gevent --timeout 1800 -b 0.0.0.0:8088 --limit-request-line 0 --limit-request-field_size 0 superset:app
else
    superset --help
fi
