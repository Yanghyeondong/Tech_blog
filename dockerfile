FROM ubuntu:22.04

WORKDIR /root

Run apt update -y && \
    apt upgrade -y && \
    apt install -y \
    git \
    curl

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash && \
	source ~/.bashrc

RUN nvm install 16.16.0 && \
	npm install -g yarn

RUN git clone https://github.com/Yanghyeondong/Tech_blog && \
	cd Tech_blog

RUN yarn install