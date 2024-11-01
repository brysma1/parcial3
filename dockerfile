# Use Node.js as the base image
FROM node:18

# Set working directory in the container
WORKDIR /app
RUN mkdir -p /app/data

# Copy package.json and install dependencies if they exist
COPY package*.json ./
RUN npm install || true  # Will skip if no package.json is found

# Copy the rest of the application code
COPY ./server.js .
COPY ./database.js .
COPY ./index.html .

# Expose the port the app runs on
EXPOSE 3000

# Default command to run the application
CMD ["node", "server.js"]

