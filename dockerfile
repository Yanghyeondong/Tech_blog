FROM ubuntu:22.04

WORKDIR /blog

RUN apt update -y && \
    apt upgrade -y && \
    apt install -y \
    git \
    curl

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

SHELL ["/bin/bash", "-c"]
RUN source ~/.nvm/nvm.sh && nvm install 18.0.0 && npm install -g yarn