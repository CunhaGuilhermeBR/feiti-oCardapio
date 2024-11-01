# STAGE 1: Build
FROM node:20.10.0-alpine AS builder

# Set the user to node
USER node

# Create app directory with user node
RUN mkdir -p /home/node/app

# Set working directory
WORKDIR /home/node/app

# Copy both package.json AND lock file
COPY --chown=node app ./app
COPY --chown=node package.json ./
COPY --chown=node yarn.lock ./
COPY --chown=node prisma ./prisma/

# Install dependencies
RUN yarn

# Bundle app source code
COPY --chown=node . .

# Build app
RUN yarn build

# STAGE 2: Deploy
FROM node:20.10.0-alpine AS deploy

# Set to a non-root built-in user `node`
USER node

# Define argument for the container port
ARG CE_PORT

# Set working directory
WORKDIR /home/node/app

# Copy only the necessary files from the builder stage
COPY --from=builder --chown=node /home/node/app/app ./app
COPY --from=builder --chown=node /home/node/app/build ./build
COPY --from=builder --chown=node /home/node/app/package.json ./
COPY --from=builder --chown=node /home/node/app/yarn.lock ./
COPY --from=builder --chown=node /home/node/app/prisma ./prisma

# Install only production dependencies
RUN yarn install --prod

# Expose the container port specified in the argument
EXPOSE $CE_PORT

# Define the command to run the application
CMD [ "node", "." ]
