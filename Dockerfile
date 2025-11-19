# syntax=docker/dockerfile:1.5
# Dev: usar ng serve en contenedor (puerto 4200) cacheando dependencias
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --silent
COPY . .
EXPOSE 4200
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]
