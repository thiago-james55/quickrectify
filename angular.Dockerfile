# Stage 1: Build Angular
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Stage 2: Serve with NGINX
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf

# Atenção: usar o nome correto do stage
COPY --from=build /app/dist/quickrectify /etc/nginx/html/quickrectify

EXPOSE 80
