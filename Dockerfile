FROM ubuntu:20.04
RUN apt-get update && apt-get -y install build-essential && mkdir –p /app
COPY . /app/
WORKDIR /app/
CMD make
