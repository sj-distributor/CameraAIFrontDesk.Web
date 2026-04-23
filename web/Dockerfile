FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install --force && npm run build

FROM nginx:stable-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html/dist

RUN echo "#!/bin/sh" > /init.sh && \
    echo "nginx -g 'daemon off;'" >> /init.sh && \
    chmod +x /init.sh

CMD ["/init.sh"]
