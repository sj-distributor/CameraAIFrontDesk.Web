FROM node:18-alpine AS node

FROM nginx:stable-alpine

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

COPY ./ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN apk add --no-cache git && \
    npm install --force && npm run build

COPY --from=build /web/build /usr/share/nginx/html

RUN  sed -i '12a error_page 404 /index.html;' /etc/nginx/conf.d/default.conf
    
RUN sed -i '/^http {/a \
        gzip on;\n\
        gzip_static on;' /etc/nginx/nginx.conf
    
EXPOSE 80
    
CMD ["nginx", "-g", "daemon off;"]