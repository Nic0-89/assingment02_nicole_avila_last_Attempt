FROM node:12
WORKDIR /usr/src/app
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]