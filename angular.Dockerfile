FROM node:latest as node

WORKDIR /app

# Copy the Angular application source files
COPY . .

# Install dependencies and build the application
RUN npm install
RUN npm run build --prod

# Stage 2: Serve the Angular application using NGINX
FROM nginx:alpine

# Copy NGINX configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built Angular files from the previous stage
COPY --from=node /app/dist/quick-rect /etc/nginx/html

# Expose port 80
EXPOSE 80