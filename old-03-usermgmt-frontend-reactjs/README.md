# Dockerizing ReactJS Applications

## Step-1: Create Dockerfile
- This is going to be a multistage docker file. 
- Stage-1
    - We will download, install nodejs modules 
    - Create ReactJS production build
- Stage-2
    - We will download the nginx docker image
    - Copy the ReactJS production build folder content to nginx html folder.
    - Exposes nginx on port 80 (Container Port)
```
### STAGE 1: Build ReactJS Application ###
FROM node as build
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY . /usr/src/app
RUN npm run build

### STAGE 2: Copy ReactJS Build content to nginx html folder ###
FROM nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
```

## Step-2: Build Docker Image
- Build docker image
- Replace **stacksimplify** with your docker hub id when building the image locally on your desktop
```
docker build --no-cache -t stacksimplify/usermgmt-frontend:1.0.0 .
docker build --no-cache -t <your-docker-hub-id>/usermgmt-frontend:1.0.0 .
```

## Step-3: Run Docker Image
- Run docker image and test.
- http://localhost
- Replace **stacksimplify** with your docker hub id when running the image locally on your desktop

```
docker run --name frontend -d -p 80:80 --rm stacksimplify/usermgmt-frontend:1.0.0 
docker run --name frontend -d -p 80:80 --rm <your-docker-hub-id>/usermgmt-frontend:1.0.0 
```

## Step-4: Push Image to Docker Hub
- Replace **stacksimplify** with your docker hub id when pushing the docker image to your docker hub account. 
```
docker push stacksimplify/usermgmt-frontend:1.0.0
docker push <your-docker-hub-id>/usermgmt-frontend:1.0.0
```