FROM node:16.15.1-alpine

COPY . /tmp/app
WORKDIR /tmp/app
RUN npm install
RUN npm run build
CMD ["node", "build"]
