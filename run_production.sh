#!/usr/bin/env bash

export C_FORCE_ROOT=True
su - songyan.ho -c "superset worker" &
superset runserver &
wait