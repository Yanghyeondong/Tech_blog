FROM ubuntu:22.04

Run apt update -y && \
    apt upgrade -y && \
    apt install -y \
    git \
    curl

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

SHELL ["/bin/bash", "-c"]
RUN source ~/.nvm/nvm.sh && nvm install 16.16.0 && npm install -g yarn

WORKDIR /root

RUN git clone https://github.com/Yanghyeondong/Tech_blog