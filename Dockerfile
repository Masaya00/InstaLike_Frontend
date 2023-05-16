FROM node:19
RUN mkdir /frontend
WORKDIR /frontend
RUN npm install -g npm@latest && npm install create-next-app
