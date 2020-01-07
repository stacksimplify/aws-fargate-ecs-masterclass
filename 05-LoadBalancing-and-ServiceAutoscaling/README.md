# Load Balancing

## Step-01: What are we going to learn?
- We are going to build two nginx containers whose application contexts are /app1 and /app2
- Create the ECS Task Definitions and Services for both applications by levaraging single Application Load balancer with URI based routing. 
- Implement Autoscaling for ECS Tasks. 

## Step-02: Pre-requisite - Create Docker Images required
### Build two container images with their context paths as /app1 and /app2.
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
### Run the docker images and test those containers locally  
- **App1:** http://localhost:81/app1
- **App2:** http://localhost:82/app2
```
docker run --name nginxapp1 -p 81:80 --rm -d stacksimplify/nginxapp1
docker run --name nginxapp2 -p 82:80 --rm -d stacksimplify/nginxapp2

docker run --name nginxapp1 -p 81:80 --rm -d <replace-with-your-docker-hub-id>/nginxapp1
docker run --name nginxapp2 -p 82:80 --rm -d <replace-with-your-docker-hub-id>/nginxapp2
```
### Stop the docker containers
```
docker ps
docker stop nginxapp1
docker stop nginxapp2
docker ps -a
```    
### Push these two containers to your Docker Hub Repository
```
docker images
docker push stacksimplify/nginxapp1
docker push stacksimplify/nginxapp2

docker push <replace-with-your-docker-hub-id>/nginxapp1
docker push <replace-with-your-docker-hub-id>/nginxapp2
docker push <replace-with-your-docker-hub-id>/nginxapp3
```

## Step-03: Create Application Load Balancer
- Create Application Load Balancer
    - **Name:** aws-ecs-nginx-lb
    - IP Address Type
    - Listener
    - Availability Zones
    - Load Balancer Security Group
    - Target Group
    - Register Targets

## Step-04: Create Task Definitions for both App1 and App2
- **App1 Task Definition:** aws-nginx-app1
    - **Launch Type:** Fargate
    - **Container Image:** stacksimplify/nginxapp1
- **App2 Task Definition:** aws-nginx-app2
    - **Launch Type:** EC2
    - **Container Image:** stacksimplify/nginxapp2
    

## Step-05: Create ECS Service for Nginx App1
### Create Service for App1
- **Service Name:** aws-nginx-app1-svc
- **Cluster:** fargate-demo
- Number of Tasks: 2
- Choose VPC & Create Security Group
- Select Application Load Balancer
    - Container to Load Balance
    - Target Group Name: ecs-nginx-app1-tg
    - Path Pattern: /app1*
    - Health Check Path: /app1/index.html
- Health check grace period: 147   - **Very Important setting**
- Test by accessing Load Balancer URL. 


## Step-06: Create ECS Service for Nginx App2 and leverage same load balancer
- We are going to leverage the same load balancer we used for App1 
- We are going to provide the App2 path pattern as /app2*
- We need to have the **EC2-Linux Lauch Type** cluster created and ready with atleast 1 EC2 instance for creating this service. 
    - **EC2 Linux Cluster Name:** ecs-ec2-demo (if not exists create one)

### Create Service for App2

- **Service Name:** aws-nginx-app2-svc
- **Cluster:** ecs-ec2-demo
- Number of Tasks: 2
- Choose VPC & Create Security Group
- Select Application Load Balancer
    - Container to Load Balance
    - Target Group Name: ecs-nginx-app2-tg
    - Path Pattern: /app2*
    - Health Check Path: /app2/index.html
- Health check grace period: 147   - **Very Important setting**
- Test by accessing Load Balancer URL. 

**Important Note:** In short, we will leverage using single Application load balancer for multiple Applications hosted on ECS with URI based routing.  

# Service Autoscaling

## Step-01: Autoscaling: Target Tracking Policy
- Update any of the existing service to add Autoscaling Policy
- **Service Name:** aws-nginx-app1-svc
    - Minimum Number of Tasks: 1
    - Desired Number of Tasks: 1
    - Maximum Number of Tasks: 3
    - Scaling Policy: Target Tracking
        - Policy Name: RequestCountPolicy
        - ECS Service Metric: ALBRequestCountPolicy
        - Target Value: 1000
        - Scale-out cooldown period: 60
        - Scale-in cooldown period: 60

## Step-02: Spin up AWS EC2 Instance, Install and use ApacheBench for generating load
- **North Virginia AMI ID:** Amazon Linux AMI 2018.03.0 (HVM), SSD Volume Type - ami-00eb20669e0990cb4
- **Asia pacific South Mumbai AMI ID:** Amazon Linux AMI 2018.03.0 (HVM), SSD Volume Type - ami-02913db388613c3e1
- Install the **ApacheBench (ab)** utility to make thousands of HTTP requests to your load balancer in a short period of time.
- **Scale-Out Activity**: Keep adding load till we see alarm in cloudwatch and new tasks (2 more containers) created and registered to load balancer
- **Scale-In Activity**: Stop the load now and wait for 5 to 10 minutes and 
```
sudo yum install -y httpd24-tools
ab -n 500000 -c 1000 http://EC2Contai-EcsElast-SMAKV74U23PH-96652279.us-east-1.elb.amazonaws.com/app1/index.html
ab -n 500000 -c 1000 http://<REPLACE-WITH-ALB-URL-IN-YOUR-ENVIRONMENT>/app1/index.html
```    

## Step-03: Autoscaling - Step Scaling Policy
 - We can even create step scaling policies if required.
 - More customizable using CloudWatch alarms 

## Step-04: Clean up resources
- Update service to 
    - Remove Autoscaling policy in service and disable autoscaling
    - Make number of tasks to zero
    - wait for 5 to 10 minutes and verify and ensure zero tasks (containers) running.
    - This way we dont end-up in accidental increase of our AWS bill during our learning process. 
- Delete Load Balancer (ALB) if we are not using it. 
- Delete the **ecs-ec2-demo** cluster which keeps charged based on EC2 Instances. 
- Delete the **ApacheBench EC2 Instance** created for generating the load to test autoscaling policies. 
