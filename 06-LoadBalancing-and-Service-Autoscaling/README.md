# Load Balancing and Service Autoscaling

## Step-1: Pre-requisite - Create Docker Images required
- **Build** two container images with their context paths as /app1 and /app2.
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
- **Run** the docker images and test those containers locally  
    - **App1:** http://localhost:81/app1
    - **App2:** http://localhost:82/app2
```
docker run --name nginxapp1 -p 81:80 --rm -d stacksimplify/nginxapp1
docker run --name nginxapp2 -p 82:80 --rm -d stacksimplify/nginxapp2

docker run --name nginxapp1 -p 81:80 --rm -d <replace-with-your-docker-hub-id>/nginxapp1
docker run --name nginxapp2 -p 82:80 --rm -d <replace-with-your-docker-hub-id>/nginxapp2
```
- **Stop** the docker containers
```
docker ps
docker stop nginxapp1
docker stop nginxapp2
docker ps -a
```    
- **Push** these two containers to your Docker Hub Repository
```
docker images
docker push stacksimplify/nginxapp1
docker push stacksimplify/nginxapp2

docker push <replace-with-your-docker-hub-id>/nginxapp1
docker push <replace-with-your-docker-hub-id>/nginxapp2
```


## Step-2: Create Application Load Balancer
- Create Application Load Balancer
    - Name: aws-ecs-nginx-lb
    - IP Address Type
    - Listener
    - Availability Zones
    - Load Balancer Security Group
    - Target Group
    - Register Targets

## Step-3: Create Task Definitions for both App1 and App2
- App1 Task Definition: aws-nginx-app1
- App2 Task Definition: aws-nginx-app2

## Step-4: Create ECS Service for Nginx App1
- Create Service
    - Service Name: aws-nginx-app1-svc
    - Number of Tasks: 2
    - Choose VPC & Create Security Group
    - Select Application Load Balancer
        - Container to Load Balance
        - Target Group Name: ecs-nginx-app1-tg
        - Path Pattern: /app1*
        - Health Check Path: /app1/index.html
    - Health check grace period: 147   - **Very Important setting**
- Test by accessing Load Balancer URL. 


## Step-5: Create ECS Service for Nginx App1 and leverage same load balancer
- We are going to leverage the same load balancer we used for App1 
- We are going to provide the App2 path pattern as /app2*
- Create Service
    - Service Name: aws-nginx-app2-svc
    - Number of Tasks: 2
    - Choose VPC & Create Security Group
    - Select Application Load Balancer
        - Container to Load Balance
        - Target Group Name: ecs-nginx-app2-tg
        - Path Pattern: /app2*
        - Health Check Path: /app2/index.html
    - Health check grace period: 147   - **Very Important setting**
- Test by accessing Load Balancer URL. 


