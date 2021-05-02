# Base image
FROM nginx:1.17.6-alpine 
RUN apk add inotify-tools certbot openssl bash certbot-nginx

# establish where Nginx should look for files
ENV RAILS_ROOT /recipes

# Set our working directory inside the image
WORKDIR $RAILS_ROOT

# create log directory
RUN mkdir log

# copy over static assets
COPY public public/

# Copy Nginx config template
COPY server/nginx.conf /tmp/docker.nginx

# substitute variable references in the Nginx config template for real values from the environment
# put the final config in its place
RUN envsubst '$RAILS_ROOT' < /tmp/docker.nginx > /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 443

# Use the "exec" form of CMD so Nginx shuts down gracefully on SIGTERM (i.e. `docker stop`)
CMD [ "nginx", "-g", "daemon off;" ]
