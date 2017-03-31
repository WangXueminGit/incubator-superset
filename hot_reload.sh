#!/usr/bin/env bash

DEBUG_MODE=True superset runserver -d &
su - songyan.ho
superset worker