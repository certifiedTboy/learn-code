# --- Build Stage ---
FROM node:lts-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install   # install dev + prod

COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:lts-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --only=prod

COPY --from=build /app/dist ./dist

EXPOSE 9000
CMD ["npm", "run", "start:prod"]
