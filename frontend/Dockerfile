# Stage 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install --production=false

# Copy the rest of the frontend code
COPY frontend/ .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the build output from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration
COPY infrastructure/nginx/config.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]