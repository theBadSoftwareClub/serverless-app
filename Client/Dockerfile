FROM node:16.13.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
VOLUME /usr/src/app/src
COPY package.json /usr/src/app
RUN npm install
#WORKDIR /node_modules
RUN ls
COPY . /usr/src/app
