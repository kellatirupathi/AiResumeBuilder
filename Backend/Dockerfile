# # Use the same Node.js version as your local machine
# FROM node:20-bullseye

# # Set working directory
# WORKDIR /app

# # Copy only package.json and package-lock.json first (for better caching)
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Now copy the rest of the application files
# COPY . .

# # Expose port
# EXPOSE 5001

# # Start the server
# CMD ["node", "src/index.js"]




# File: Backend/Dockerfile

# Use the same Node.js version as your local machine
FROM node:20-bullseye

# Install puppeteer dependencies for Debian/Ubuntu
RUN apt-get update && apt-get install -y \
    wget \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    # Install chromium
    chromium \
    # Clean up
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Tell Puppeteer to skip downloading Chrome. We'll use the one from apt.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy only package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Now copy the rest of the application files
COPY . .

# Expose port
EXPOSE 5001

# Start the server
CMD ["node", "src/index.js"]
