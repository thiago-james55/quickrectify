FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod 

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/quick-rect /usr/share/nginx/html

EXPOSE 80