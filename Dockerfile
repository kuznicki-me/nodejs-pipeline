FROM node:8

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt update

RUN apt install poppler-utils -y

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
