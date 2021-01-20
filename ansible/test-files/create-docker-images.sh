#!/bin/bash -x

# creates the necessary docker images to run testrunner.sh locally

docker build --tag="vapory/cppjit-testrunner" docker-cppjit
docker build --tag="vapory/python-testrunner" docker-python
docker build --tag="vapory/go-testrunner" docker-go
