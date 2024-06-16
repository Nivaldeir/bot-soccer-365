FROM node:latest

WORKDIR /usr/app

COPY packeger*.json ./

RUN npm install

COPY . .

CMD ["node","run", "dev"]