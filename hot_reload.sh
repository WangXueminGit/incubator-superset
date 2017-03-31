#!/usr/bin/env bash

superset worker &
DEBUG_MODE=True superset runserver -d &
wait