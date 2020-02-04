# Microservices Canary Deployments using AWS AppMesh

## Step-1: What are we going to learn? What are Canary Deployments?
- We are going to deploy V2 version of Notification Service.
- We will split the traffic with 50% each between V1 and V2 version of notification service and test. 
- Monitor the X-Ray console.

## Step-2: Notification Microservice - V2 version Deployment
### 2.1: Create a Virtual Node in AppMesh for V2 Version
- **Virtual Node:**
    - Virtual Node Name:notification-vnode-appv2
    - Service Discovery Method: DNS
    - DNS Hostname: notification-service-appv2.microservices.local
    - Backend: Nothing
    - Health Status: Nothing
    - Listener Port: 8096 Protocol: HTTP
    - Health Check: Disabled

### 2.2: Update Task Definition with V2 version of Notification Microservice Docker Image
- **Docker Image Name:** stacksimplify/notifications-microservice:2.0.0

### 2.3: Update AppMesh settings in Task Definition 
- Remove Envoy container and add it again
- Envoy 
    - Service Integration
        - Virtual Node Name: notification-vnode-appv2
    - Proxy Congigurations
        - Egress ignored Ports: 587 **VERY IMPORTANT for MYSQL COMMUNICATION**
    - ENVOY_LOG_LEVEL: trace
    - ENABLE_ENVOY_XRAY_TRACING: 1

### 2.4: Create ECS Service for V2 Notification Microservice
## Step-1: Notification Microservice - Create Service with Service Discovery enabled
- **Configure Service**
    - Launch Type: Fargate
    - Task Definition:
        - Family: notification-microservice-td
        - Version: (latest) 
    - Service Name: notification-service-appv2
    - Number of Tasks: 1
- **Configure Network**
    - VPC: ecs-vpc
    - Subnets: us-east-1a, us-east-1b
    - Security Groups: ecs-notificaiton-microservice-ServiceDiscovery-Inbound 
    - AutoAssign Public IP: Enabled        
    - **Load Balancing**
        - Load Balancer Type: None
        - **Important Note:** As we are using Service Discovery DNS name for Notification Service, this service doesnt need load balancing via ALB. 
    - **Service Discovery**
        - Enable service discovery integration: Checked
        - Namespace: create new private name space 
        - Namespace Name: microservices.local
        - Configure service discovery service: Create new service discovery service
        - Service discovery name: notification-service-appv2
        - Enable ECS task health propagation: checked
        - Rest all defaults
- Verify in AWS Cloud Map about the newly created Namespace, Service and registered Service Instance for Notification Microservice. 

## Step-3: AppMesh - Create Virtual Router
- Name: notification-vrouter
- Listerner: 8096 Protocol: HTTP
- **Edit Router to add Routes**
    - Route Name:
    - Route Type: http
    - Route Priority: 
    - Targets: 
        - notification-vnode: Weight 50%
        - notification-vnode-appv2: Weight 50%

## Step-4: AppMesh - Update Virtual Service
- Change the "notification-service.microservices.local" virtual service from Virtual Node to Virtual Router. 

## Step-5: Testing Canary Deployment
- Access the Notification Info API via User Management API.
- Verify the X-Ray console.
```
http://<ALB-URL>/usermgmt/notification-service-info
```