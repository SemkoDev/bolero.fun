
FROM alpine:3.7

RUN apk --no-cache add libstdc++ curl ca-certificates openssl bash zip unzip nodejs git && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/master/sgerrand.rsa.pub && \
    apk --no-cache -X https://apkproxy.herokuapp.com/sgerrand/alpine-pkg-glibc add glibc glibc-bin

RUN rm /bin/sh && ln -s `which bash` /bin/sh
RUN curl -s "https://get.sdkman.io" | bash
RUN source "/root/.sdkman/bin/sdkman-init.sh" && sdk install java
ENV JAVA_HOME /root/.sdkman/candidates/java/current
ENV PATH ${PATH}:${JAVA_HOME}/bin


WORKDIR /app
COPY . /app
RUN npm install
RUN npm run web-build