# Microservices Canary Deployments using AWS AppMesh

## Step-1: What are we going to learn? What are Canary Deployments?
- We are going to deploy V2 version of Notification Service.
- We will split the traffic with 50% each between V1 and V2 version of notification service and test. 
- Monitor the X-Ray console.

## Step-2: Create a Virtual Node in AppMesh for V2 Version of Notification Service
- **Virtual Node:**
    - Virtual Node Name:notification-vnode-appv2
    - Service Discovery Method: DNS
    - DNS Hostname: notification-service-appv2.stacksimplify-dev.com
    - Backend: Nothing
    - Health Status: Nothing
    - Listener Port: 8096 Protocol: HTTP
    - Health Check: Disabled

## Step-3: Update Task Definition Notification Microservice to support V2 version of Application
### 3.1: Discuss about Notification Microservice V2 Version
- Updated some static text in notificaiton info service which will be accessed from User Management Microservice. 
- Review those changes on Spring STS IDE
- Verify the docker image for V2 notification **stacksimplify/notifications-microservice:2.0.0** on Docker Hub. 
- We are good to proceed with implementation after above checks. 

### 3.2: Update Docker Image
- **Docker Image Name:** stacksimplify/notifications-microservice:2.0.0

### 3.3: Update AppMesh settings in Task Definition 
- Remove Envoy container and add it again
- **Service Integration**
    - Enable App Mesh Integration: Checked
    - Service Integration
        - Virtual Node Name: notification-vnode-appv2
- **Envoy Container Special Settings**
    - ENVOY_LOG_LEVEL: trace
    - ENABLE_ENVOY_XRAY_TRACING: 1
- **Proxy Congigurations**
    - Egress ignored Ports: 587 **VERY IMPORTANT for SES COMMUNICATION**

## Step-4: Create ECS Service for V2 Notification Microservice
- **Configure Service**
    - Launch Type: Fargate
    - Task Definition:
        - Family: notification-microservice-td
        - Version: (latest) 
    - Service Name: appmesh-notification-appv2
    - Number of Tasks: 1
- **Configure Network**
    - VPC: ecs-vpc
    - Subnets: ap-south-1a, ap-south-1b
    - Security Groups: appmesh-ecs-inbound 
        - Inbound Ports 8096, 8095    
    - AutoAssign Public IP: Enabled        
- **Load Balancing**
    - Load Balancer Type: None
    - **Important Note:** As we are using Service Discovery DNS name for Notification Service, this service doesnt need load balancing via ALB. 
- **Service Discovery**
    - Enable service discovery integration: Checked
    - Namespace: create new private name space 
    - Namespace Name: stacksimplify-dev.com
    - Configure service discovery service: Create new service discovery service
    - Service discovery name: notification-service-appv2
    - Enable ECS task health propagation: checked
    - Rest all defaults
- Verify in AWS Cloud Map about the newly created Namespace, Service and registered Service Instance for Notification Microservice. 

## Step-5: AppMesh - Create Virtual Router
- Name: notification-vrouter
- Listerner: 8096 Protocol: HTTP
- **Edit Router to add Routes**
    - Route Name:
    - Route Type: http
    - Route Priority: 
    - Targets: 
        - notification-vnode: Weight 50%
        - notification-vnode-appv2: Weight 50%

## Step-6: AppMesh - Update Virtual Service
- Change the "notification-service.stacksimplify-dev.com" virtual service from Virtual Node to Virtual Router. 

## Step-7: Testing Canary Deployment
- Access the Notification Info API via User Management API.
- Verify the X-Ray console.
```
http://<ALB-URL>/usermgmt/notification-service-info
```

## Step-8: Clean Up Resources for cost saving
- Update ECS Services (Notification, User Management) **Number of Tasks** to 0
- Stop RDS Database. 
- If we really dont need these resources (RDS & ALB), you can even delete the RDS database and ALB. 