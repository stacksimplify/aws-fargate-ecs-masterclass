# Microservices with AWS AppMesh

## Step-1: Create Load Balancer

## Step-2: Create two services
- Service-1: appmesh-svc-usermgmt-microservice
- Service-2: appmesh-svc-notification-microservice


## ---------------------------------------------------
## Step-1: Notification Microservice - Create Service with Service Discovery enabled
- **Configure Service**
    - Launch Type: Fargate
    - Task Definition:
        - Family: notification-microservice-td
        - Version: 1(latest) 
    - Service Name: svc-notification-microservice-Service-Discovery
    - Number of Tasks: 1
- **Configure Network**
    - VPC: ecs-vpc
    - Subnets: us-east-1a, us-east-1b
    - Security Groups: ecs-notificaiton-microservice-ServiceDiscovery-Inbound 
        - Allow traffic from UserManagement Service security (ecs-microservice-inboud) group or anywhere
        - Inbound Port 8096 (for both notification service)
        - Notification Service uses Port 8096
    - AutoAssign Public IP: Enabled        
    - **Load Balancing**
        - Load Balancer Type: None
        - **Important Note:** As we are using Service Discovery DNS name for Notification Service, this service doesnt need load balancing via ALB. 
    - **Service Discovery**
        - Enable service discovery integration: Checked
        - Namespace: create new private name space 
        - Namespace Name: microservices.local
        - Configure service discovery service: Create new service discovery service
        - Service discovery name: notification-service
        - Enable ECS task health propagation: checked
        - Rest all defaults
- Verify in AWS Cloud Map about the newly created Namespace, Service and registered Service Instance for Notification Microservice. 