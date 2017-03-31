#!/usr/bin/env bash

superset runserver &
su - songyan.ho -c "superset worker" &