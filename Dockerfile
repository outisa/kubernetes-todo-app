FROM node:alpine

WORKDIR app/backend
COPY ./frontend/ ../frontend/
RUN cd ../frontend && npm ci && cd ../backend

COPY ./backend/ .

RUN npm ci && \
    npm run build:ui && \
    mkdir files && \
    rm -rf /app/frontend/node_modules/*

EXPOSE 3001

CMD ["npm", "start"]
