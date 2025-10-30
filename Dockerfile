# Use a lightweight Node.js image (e.g., Node 20 on Alpine Linux)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker's build cache
COPY package*.json ./

# Install only production dependencies
# This is crucial for keeping the image small and avoiding dev tools
RUN npm ci --only=production

# Copy the rest of the application code
# This includes addon.js, utils/api-wrapper.js, etc.
COPY . .

# IMPORTANT: Copy the .env file now. 
# While we usually exclude it, we need it for the TMDB_API_KEY.
# NOTE: Ensure your .env only contains the TMDB key and not highly sensitive keys.
COPY .env /./.env

# The port your application listens on (default is 7000)
# This is informational and not strictly needed when using 'host' network mode
EXPOSE 7000

# Command to run the application when the container starts
CMD [ "npm", "start" ]