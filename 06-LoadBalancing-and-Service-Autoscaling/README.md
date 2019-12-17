# Load Balancing and Service Autoscaling

## Step-1: Pre-requisite - Create Docker Images required
- Build two container images with their context paths as /app1 and /app2.
    - nginxapp1 - /app1
    - nginxapp2 - /app2
```
cd Application-1
docker build -t stacksimplify/nginxapp1 .
docker build -t <replace-with-your-docker-hub-id>/nginxapp1 .

cd ../Application-2
docker build -t stacksimplify/nginxapp2 .
docker build -t <replace-with-your-docker-hub-id>/nginxapp2 .
```    
- Run the docker images and test those containers locally  
    - **App1:** http://localhost:81/app1
    - **App2:** http://localhost:82/app2
```
docker run --name nginxapp1 -p 81:80 --rm -d stacksimplify/nginxapp1
docker run --name nginxapp2 -p 82:80 --rm -d stacksimplify/nginxapp2
```
- Stop the docker containers
```
docker ps
docker stop nginxapp1
docker stop nginxapp2
docker ps -a
```    
- Push these two containers to your Docker Hub Repository
```
docker images
docker push stacksimplify/nginxapp1
docker push stacksimplify/nginxapp2
```




## Step-: Create Application Load Balancer
- Create Application Load Balancer
- As part of that create a temporary 
