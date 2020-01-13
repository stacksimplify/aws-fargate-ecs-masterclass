# Microservices - Service Discovery

## Step-1: What are we going to learn?
- We are going to enable the service discovery for Notificaiton Microservice.
- User Management Microservice will call Notification Service using AWS Cloud Map Namespace. 
- In that way calls from User Management Microservice to Notificaiton Microservice will be internal to VPC. 
-  For introduction slides refer the [presentation slides](/otherfiles/presentations/AWS-FargateECS-Masterclass-Course.pdf). 

## Step-2: AWS CloudMap - Create Namespace
- Introduction to AWS CloudMap
- Create a namespace in AWS Cloud Map to just go through the console and delete it. 
-  For introduction slides refer the [presentation slides](/otherfiles/presentations/AWS-FargateECS-Masterclass-Course.pdf). 

## Step-3: Notification Microservice - Create Service with Service Discovery enabled
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

## Step-4: User Management Microservice - Update Task Definition 
- Update User Management Microservice Task definition, respective container definition environment variables of Notificaiton service host and port. 
- **Configure Container Definition**
    - **Environment Variables**
        - NOTIFICATION_SERVICE_HOST=notification-service.microservices.local
        - NOTIFICATION_SERVICE_PORT=8096

## Step-5: User Management Microservice - Update Service
- Update the User Management Microservice ECS Service **svc-usermgmt-microservice** with new updated version of task defintion.

## Step-6: Test User Management Microservices using Postman
### User Management Service
- **Create User**
    - Verify the email id to confirm account creation email received.
- **List User**   
    - Verify if newly created user got listed. 

## Step-7: Increase Number of Tasks to 4 in Notification Microservice ECS Service.
- Increase Number of Tasks to 4 in Notification Microservice ECS Service.
    - ECS Service Name: svc-notification-microservice-Service-Discovery
- Verify in AWS Cloud Map about the newly registered Service Instances for Notification Microservice. 

## Step-8: Additional Observations
- Now the request from User Management Microservice to Notification Microservice is local to VPC and not via internet or using any private internal load balancer.
- In this approach we really dont see Elastic load balancing.
- One service will call other service with service name and those service names are DNS registered in private DNS hosted zone with record set.
- **Example:** If we have 3 notification service containers 
    - 3 private IP addresses we will have for those 3 containers
    - 3 recordsets (A Records) will be created in Route53 with name "notification.microservices.local"
- This is achieved using **Route53 Multivalue Routing Policy**. 
- **Conclusion:**  
    - In short, Service load balancing happens using Route53 multivalue routing policy. 
    - Its not a substitute for Elastic Load balancing but it will do the job for RESTful API's which are stateless.
    - In addition, with **Service Discovery** there is no special proxy like load balancer in between two microservices, so no additional network hop which means very good performance improvement using Service Discovery. 
- For additional reference about **Route53 Multivalue Routing Policy** refer below link.
- **Documentation Reference:** https://aws.amazon.com/premiumsupport/knowledge-center/multivalue-versus-simple-policies/

## Step-9: Clean Up Resources
- Update the following ECS services **Number Of Tasks** to 0
    - svc-usermgmt-microservice
    - svc-notification-microservice
    - svc-notification-microservice-Service-Discovery
