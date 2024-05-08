# Use official node image as the base image
FROM node:lts as build

COPY ./package.json /tmp/package.json
WORKDIR /tmp
RUN npm install
RUN mkdir -p /usr/local/app && cp -a /tmp/node_modules /usr/local/app/

WORKDIR /usr/local/app

# Add the source code from the app to the container
COPY . /usr/local/app/

# Generate the build of the application
RUN npm run build

# Stage 2: Serve app with nginx server
# Use official nginx image as the base image
FROM nginx:1.26

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/visionhub/browser /usr/share/nginx/html

# Copy the nginx conf that we created to the container
COPY ./nginx.conf  /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 443 6006 4200
