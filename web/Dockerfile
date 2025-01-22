FROM node:16-alpine AS build

# 设置工作目录
WORKDIR /web

# 安装依赖工具
RUN apk add --no-cache git

# 复制 package.json 文件
COPY package.json ./

# 安装项目依赖
RUN yarn install

# 复制其他文件
COPY . .

# 构建项目
RUN yarn build

# 使用 Nginx 作为静态服务器
FROM nginx:stable-alpine

# 将构建产物复制到 Nginx 的静态文件目录
COPY --from=build /web/dist /usr/share/nginx/html

# 修改 Nginx 配置文件以支持 SPA 路由
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 启用 gzip 压缩
RUN sed -i '/^http {/a \
    gzip on;\n\
    gzip_static on;' /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
