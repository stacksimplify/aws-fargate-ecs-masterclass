# Microservices deployment with AWS AppMesh & leverage AWS X-Ray for Distributed Tracing

## Step-1: What are we going to learn? 
- We are going to deploy Microservices with AWS AppMesh
- We are going to test microservices communication using AppMesh (Envoy Proxy)
- We are going to understand how we are going to communicate with external services like RDS Database, SES Service when AppMesh in place (Egress Traffic handling with ECS and AppMesh)
- We are going to learn how the **Distributed Tracing using AWS X-Ray** can be enabled out of the box when AWS App Mesh is in action without making any code changes to application.


## Step-2: User Management Microservice - Create Service with Service Discovery enabled
- **Configure Service**
    - Launch Type: Fargate
    - Task Definition:
        - Family: usermanagement-microservice-td
        - Version: 1(latest) 
    - Service Name: svc-usermanagement-microservice-Service-Discovery
    - Number of Tasks: 1
- **Configure Network**
    - VPC: ecs-vpc
    - Subnets: ap-south-1a, ap-south-1b
    - Security Groups: ecs-usermanagement-microservice-ServiceDiscovery-Inbound 
        - Inbound Port 8095     
    - AutoAssign Public IP: Enabled        
    - **Load Balancing**
        - Load Balancer Type: None
        - **Important Note:** As we are using Service Discovery DNS name for Notification Service, this service doesnt need load balancing via ALB. 
    - **Service Discovery**
        - Enable service discovery integration: Checked
        - Namespace: create new private name space 
        - Namespace Name: microservices.local
        - Configure service discovery service: Create new service discovery service
        - Service discovery name: usermanagement-service
        - Enable ECS task health propagation: checked
        - Rest all defaults
- Verify in AWS Cloud Map about the newly created Namespace, Service and registered Service Instance for User Management Microservice. 


## Step-3: AWS App Mesh: Create Mesh
- Create Mesh
    - Name: microservices-mesh
    - **Egress filter:** Allow External Traffic
- **Microservices Service Discovery Names**
    - **User Management Service:** usermgmt-service.microservices.local
    - **Notification Service:** notification-service.microservices.local

## Step-4: Notification Microservice - Create Virtual Node & Virtual Service
- **Virtual Node:**
    - Virtual Node Name:notification-vnode
    - Service Discovery Method: DNS
    - DNS Hostname: notification-service.microservices.local
    - Backend: Nothing
    - Health Status: Nothing
    - Listener Port: 8096 Protocol: HTTP
    - Health Check: Disabled
- **Virtual Service:**    
    - Virtul Service Name: notification-service.microservices.local
    - Provider: Virtual Node
    - Virtual Node: notification-vnode

## Step-5: User Management Microservice - Create Virtual Node & Virtual Service
- **Virtual Node:**
    - Virtual Node Name:usermgmt-vnode
    - Service Discovery Method: DNS
    - DNS Hostname: usermgmt-service.microservices.local
    - Backend: Nothing
    - Health Status: Nothing
    - Listener Port: 8095 Protocol: HTTP
    - Health Check: Disabled
- **Virtual Service:**    
    - Virtul Service Name: usermgmt-service.microservices.local
    - Provider: Virtual Node
    - Virtual Node: usermgmt-vnode

## Step-6: Update backend for Virtual Node: usermgmt-vnode
- Service Backends: notification-service.microservices.local


## Step-7: IAM Changes - Provide access for ecsTaskExecutionRole
- **Role Name:** ecsTaskExecutionRole
- Navigate to IAM and update this role by attaching below listed policy
    - **Policy Name:** AWSXRayDaemonWriteAccess

## Step-8: Task Definition Update: Notification Microservice
- **X-Ray Container**
    - Container Name: xray-daemon
    - Image: amazon/aws-xray-daemon:1
    - Port Mappings: 2000 Protocol: UDP
    - Log Configuration: Enabled
- **Service Integration**
    - Enable App Mesh Integration: Checked
- **Envoy Container Special Settings**
    - ENVOY_LOG_LEVEL: trace
    - ENABLE_ENVOY_XRAY_TRACING: 1
- **Proxy Congigurations**
    - Egress ignored Ports: 587 **VERY IMPORTANT for SES COMMUNICATION**
    - **Reference-1:** https://github.com/aws/aws-app-mesh-roadmap/issues/62
    - **Reference-2:** https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ProxyConfiguration.html

## Step-9: Task Definition Update: User Management Microservice
- **X-Ray Container**
    - Container Name: xray-daemon
    - Image: amazon/aws-xray-daemon:1
    - Port Mappings: 2000 Protocol: UDP
    - Log Configuration: Enabled
- **Service Integration**
    - Enable App Mesh Integration: Checked
- **Envoy Container Special Settings**
    - ENVOY_LOG_LEVEL: trace
    - ENABLE_ENVOY_XRAY_TRACING: 1
- **Proxy Congigurations**
    - Egress ignored Ports: 3306 **VERY IMPORTANT for MYSQL COMMUNICATION**
    - **Reference-1:** https://github.com/aws/aws-app-mesh-roadmap/issues/62
    - **Reference-2:** https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ProxyConfiguration.html

## Step-10: Update User Management Service with new Task Definition version
- Service Name: svc-usermanagement-microservice-Service-Discovery

## Step-11: Update Notification Service with new Task Definition version
- Service Name: svc-notification-microservice-Service-Discovery

## Step-12: Testing using Postman
- List Users
- Delete User
- Create User
- Notification Info Service
