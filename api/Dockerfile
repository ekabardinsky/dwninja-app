FROM node:13

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

COPY ./ ./

ENV TMP_DIR=/usr/src/app/tmp
RUN mkdir -p $TMP_DIR

ENTRYPOINT node index.js