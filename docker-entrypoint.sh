#!/bin/bash
set -ex

if [ "$#" -ne 0 ]; then
    exec "$@"
elif [ "$LUMOS_ENV" = "local" ]; then
    superset runserver -d
elif [ "$LUMOS_ENV" = "testing" ]; then
    superset runserver -d
elif [ "$LUMOS_ENV" = "staging" ]; then
    superset runserver -a 0.0.0.0 -w $((2 * $(getconf _NPROCESSORS_ONLN) + 1))
elif [ "$LUMOS_ENV" = "production" ]; then
    superset runserver -a 0.0.0.0 -w $((2 * $(getconf _NPROCESSORS_ONLN) + 1))
else
    superset --help
fi
