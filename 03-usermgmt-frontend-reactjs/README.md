# Dockerizing ReactJS Applications

## Dockerfile

```
### STAGE 1: Build ###
FROM node as build
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY . /usr/src/app
RUN npm run build

### STAGE 2: Production Environment ###
FROM nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
```

## Build Image

```
docker build --no-cache -t stacksimplify/usermgmt-frontend:1.0.0 .
```

## Run Image
```
docker run --name frontend -d -p 80:80 --rm stacksimplify/usermgmt-frontend:1.0.0 
```

## Push Image to Docker Hub
```
docker push stacksimplify/usermgmt-frontend:1.0.0
```