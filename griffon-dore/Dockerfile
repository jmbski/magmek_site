# STEP 1: Build
#FROM node:18.13-alpine AS build
#WORKDIR /src/app
#COPY package.json package-lock.json ./
#RUN npm install
#COPY . .
#RUN npm run build

# STEP 2: Run
FROM node:18.13-alpine
WORKDIR /src/app
COPY /dist ./dist
CMD ["node", "dist/griffon-dore/server/server.mjs"]
EXPOSE 4000