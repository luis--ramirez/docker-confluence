FROM ubuntu:16.04

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get autoclean && \
    apt-get clean && \
    apt-get autoremove -y

COPY ./confluence /opt/atlassian/confluence

EXPOSE 8090 8000

VOLUME ["/opt/atlassian/confluence", "/var/atlassian/application-data/confluence"]

RUN groupadd confluence && \
    useradd -g confluence confluence

CMD chown -R confluence:confluence /opt/atlassian/confluence /var/atlassian/application-data/confluence && \
    ./opt/atlassian/confluence/bin/start-confluence.sh -fg
