FROM node:16

# create app dir
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g sequelize-cli
RUN npm install -g mysql2
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3030
CMD ["/bin/bash", "-c", "sequelize db:migrate;node index.js"]