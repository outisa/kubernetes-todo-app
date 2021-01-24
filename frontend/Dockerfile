FROM node:alpine

WORKDIR app/frontend
COPY . .

RUN npm ci && \
    npm run build && \
    npm install -g serve && \ 
    rm -rf /app/frontend/node_modules/*

EXPOSE 5000

CMD serve -s build
