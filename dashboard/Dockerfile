# Step 1: Build the Next.js app
FROM node:23.11.1-alpine3.22 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Step 2: Run with a lightweight Node server
FROM node:23.11.1-alpine3.22

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
