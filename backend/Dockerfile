FROM node:alpine

WORKDIR app/backend

COPY . .

RUN npm ci && \
    mkdir files && \

EXPOSE 3001

CMD ["npm", "start"]
