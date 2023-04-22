# Use an official node runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Set environment variable for production
ENV NODE_ENV=production

# Expose the port that the application will listen on
EXPOSE 3001

# Start the application
CMD [ "npm", "run", "preview" ]
