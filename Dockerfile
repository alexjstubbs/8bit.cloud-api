# x86 Enviorment for Ignition API
#TODO: Allow for versioning of API in dockerfile

FROM coreos:latest
MAINTAINER Alex Stubbs "alex@alexstubbs.com"

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get -qq update
RUN apt-get install -y nodejs npm

RUN update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10

COPY ./src /src

RUN cd /src/v1; npm install

EXPOSE 9091

WORKDIR /src/v1

CMD ["nodejs", "server.js"]
