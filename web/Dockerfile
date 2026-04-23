FROM node:20-alpine AS build

WORKDIR /web

COPY . .

RUN npm ci && \
    npm run build

FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

RUN apk add --no-cache npm && npm install -g @import-meta-env/cli

COPY --from=build /web/dist .
COPY .env.example .

RUN sed -i '12a error_page 404 /index.html;' /etc/nginx/conf.d/default.conf && \
    sed -i '/^http {/a \
    gzip on;\n\
    gzip_static on;' /etc/nginx/nginx.conf

RUN echo "#!/bin/sh" >> start.sh &&\
    echo "set -e" >> start.sh &&\
    echo "gzip -kf index.html" >> start.sh &&\
    echo "nginx -g 'daemon off;'" >> start.sh &&\
    chmod +x start.sh

EXPOSE 80

CMD ["sh", "start.sh"]
