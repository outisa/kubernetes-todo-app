FROM node:alpine

WORKDIR app/backend

COPY . .

RUN npm ci

EXPOSE 3001

CMD ["npm", "start"]
