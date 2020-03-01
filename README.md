# README

rafikiTwist is a Ruby on Rails application which utilizes the React Javascript framework. It is designed to work with docker-compose to facilitate a convenient development environment, and is currently even used in a production environment to help save costs by running on a single machine. Docker is the only required dependency to run the app on your machine. Everything else will be installed within the containers when running docker-compose up --build. The purpose of the application is to easily store and discover and organize your favorite recipes.

## Install

`docker-compose build`

`docker-compose run web rake db:create`

`docker-compose run db bash`

`su postgres`

`cd /var/lib/postgresql/data/`

`initdb`

`pg_ctl -D /var/lib/postgresql/data -l logfile start`

`psql`

`create user deploy;`

`ALTER USER deploy WITH SUPERUSER;`

`alter user deploy with password 'YourPassword';`

`create database recipes_development;`

`\q`

`exit`

`exit`

`docker-compose up`

`docker cp seed.sql {db_container}:/tmp/`

`psql recipes_development < /tmp/seed.sql`

update the pg_hba.conf to allow deploy user access to all databases from all hosts using a password

`# IPv4 local connections:`
`host    all             deploy          all                     password`

## Deployment

https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html might need to reboot machine for docker daemon to run

https://docs.docker.com/compose/install/ and click on the Linux tab

The production docker-compose file expects a sister directory to the app directory where the letsencrypt directory will live, housing everything needed to establish SSL connections.

In production, the Rails app, nginx, and database run in separate containers on the same machine. This is simply to save money. If the app were ever to generate revenue, I'd utilize RDS to host the database. I'd also move the app to ECS to allow for easy scaling if the site ever started getting more traffic.
