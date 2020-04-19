# Base image
FROM nginx

# Install dependencies
RUN apt-get update -qq && apt-get -y install apache2-utils

# TSL cert dependencies
RUN apt-get -y install wget --fix-missing
RUN wget https://dl.eff.org/certbot-auto
RUN mv certbot-auto /usr/local/bin/certbot-auto
RUN chown root /usr/local/bin/certbot-auto
RUN chmod 0755 /usr/local/bin/certbot-auto

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
