FROM node:17.4.0-alpine
COPY ./backend /tmp/backend
WORKDIR /tmp/backend
RUN npm install
CMD ["npm", "start"]