FROM node:23.11.1-alpine3.22

WORKDIR /app

COPY package.json .

RUN npm install

COPY  . .

EXPOSE 3002

CMD ["npm", "run", "start"]