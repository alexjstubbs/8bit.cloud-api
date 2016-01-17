# Ignition API Server

![io logo](http://i.imgur.com/G7Uwcoq.png)

![Docker Repository on Quay](https://quay.io/repository/ignitionio/api-server/status "Docker ")

----

This repository contains the public Ignition API Server codebase.

Using this application, you can host your own ignition client API server or contribute to the project to help improve the online aspect of the ignitionOS and ignition Client. 

*This is currently a work in progress. Feel free to experiment but there is no stable API version as of yet.*


### Requirements

* [NodeJS (4.0 or higher)](https://nodejs.org)
* [RethinkDB](http://rethinkdb.com/)

#### Optional
* [IGDB API Key](https://www.igdb.com/api/request) (note: moving to micorservice)

## Installing via Docker
	
	git clone https://ignition-dev@bitbucket.org/ignition-dev/api-server.git
	cd api-server
    mv ./v1/config-example.json ./v1/config.json
    docker build -t ignition-api-server .
    docker run ignition-api-server

## Manual Install
    git clone https://ignition-dev@bitbucket.org/ignition-dev/api-server.git
	cd api-server/v1
	mv config-example.json config.json
	npm install
	node server
	
## Configuration

You will need to rename `config-example.json` in your API version root directory to `config.json`. See install commands above.

In this file you will need to set up your server settings for RethinkDB as well as a default user for use on the ignition server. This user has no special privledges but is auto-added to all new users friends list as well as the main contact for areas within the connected clients UI.

Your Settings file will look like this:

	{
		"address"  : "localhost",  
		"port"	   : "32770",     
		"secret"   : "secretKey", 
		"username" : "Admin",
		"password" : "password@123",
		"email"    : "admin@myserver.com",
		"useIGDB"  : true,
		"IGDBUrl"  : "https://www.igdb.com/api/v1",
		"IGDBKey"  : "d9u12300idk01-2139d-s9"
	} 

| Option  |  Example | Purpose  |   
|---|---|---|
| address  |  localhost |  RethinkDB server IP  |   
| port | 32770  | RethinkDB Port Number  |   
| secret  | mysecret  | A string used to compute hash for sessions and JSON web tokens.   |   
| username  | Admin  |  A default admin username account for Ignition Server |   
|  password |  password@123 | Set a password for default ignition user account  |   
| useIGDB  | true  | If true, IDDB.com will be used as the remote games API.  |   
|  IGDBUrl | https://www.igdb.com/api/v1  | The URL to the versioning URL of the IGDB REST API |   
| IGDBKey  | d9u12300idk01-2139d-s9  | Your personal API key generated on IGDB.com  |   

After configuration, you will want to initiate the default databases and tables in the next step.
## Initiate Default Datastore (soon to be deprecated)
    node v1/init/init.js

----
Copyright &copy; 2015 Alexander Stubbs and Ignition.io. All Rights Reserved. 

[Apache License 2.0 (Apache-2.0)](https://tldrlegal.com/license/apache-license-2.0-%28apache-2.0%29#summary)