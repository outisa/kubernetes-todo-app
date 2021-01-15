FROM node:alpine

WORKDIR app/
COPY ./frontend/ ./frontend/
RUN cd frontend && npm ci && cd ..

COPY ./backend/ ./backend/

RUN cd backend && npm ci && \
    npm run build:ui && \
    rm -rf /app/frontend/node_modules/*
EXPOSE 3001

CMD ["npm", "start"]
