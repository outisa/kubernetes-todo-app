FROM ubuntu:latest

WORKDIR /mydir
COPY ./getArticle.sh ./getArticle.sh
RUN apt-get update && apt-get install -y curl && \
    chmod u+x getArticle.sh


CMD ./getArticle.sh