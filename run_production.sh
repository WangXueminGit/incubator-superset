#!/usr/bin/env bash

su - songyan.ho -c "superset worker" &
superset runserver