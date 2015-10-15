# Ignition API Server

![io logo](http://i.imgur.com/G7Uwcoq.png)

This repo contains the public Ignition API Server. This is a work in progress.


### Requirements

* NodeJS
* RethinkDB

## Installing via Docker
	
	git clone https://ignition-dev@bitbucket.org/ignition-dev/api-server.git
	cd api-server
    mv ./v1/config-example.json ./v1/config.json
    docker build -t ignition-api .
    docker run ignition-api

# Manual Install
    git clone https://ignition-dev@bitbucket.org/ignition-dev/api-server.git
	cd api-server/v1
	mv config-example.json config.json
	npm install
	
# Initiate Datastore
    node v1/setup/initDatabases.js