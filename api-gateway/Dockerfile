FROM node:23.11.1-alpine3.22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3010
CMD ["node", "dist/main"]
