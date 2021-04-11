FROM jhuopensource/semesterly-base:latest

RUN mkdir /code
WORKDIR /code

# Just adding basics
# ADD ./requirements.txt /code/
# ADD ./package.json /code/

# Add everything
ADD . /code/


# Nginx moved out
# COPY ./build/semesterly-nginx.conf /etc/nginx/sites-available/
# RUN rm /etc/nginx/sites-enabled/*
# RUN ln -s /etc/nginx/sites-available/semesterly-nginx.conf /etc/nginx/sites-enabled
# RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Use environment based config
COPY ./build/local_settings.py /code/semesterly/local_settings.py

# Add parser script
COPY ./build/run_parser.sh /code/run_parser.sh

RUN pip install -r /code/requirements.txt
# This is needed on newer ubuntu
RUN pip install psycopg2-binary

RUN npm install
RUN npm run build

# set up cron job -- https://stackoverflow.com/questions/37458287/how-to-run-a-cron-job-inside-a-docker-container
RUN apt-get update && apt-get -y install cron

# Copy analytics-cron file to the cron directory
COPY /analytics/cron/analytics-cron /etc/cron.d/analytics-cron

# Give execution rights on the cron job
#RUN chmod 0644 /code/code/analytics/cron/analytics-cron
RUN chmod 0644 /etc/cron.d/analytics-cron

# Apply cron job
#RUN crontab /analytics/cron/analytics-cron
RUN crontab /etc/cron.d/analytics-cron

# Create the log file to be able to run tail
RUN touch /code/analytics/cron/cron.log
#RUN touch /var/log/cron.log

# Run the command on container startup
CMD cron && tail -f /code/analytics/cron/cron.log
#CMD cron && tail -f /var/log/cron.log