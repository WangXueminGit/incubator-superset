#!/bin/bash
set -e

if [ "$#" -ne 0 ]; then
    exec "$@"
elif [ "$LUMOS_ENV" = "dev" ]; then
    superset runserver -d
elif [ "$LUMOS_ENV" = "production" ]; then
    superset runserver -a 0.0.0.0
else
    superset --help
fi
