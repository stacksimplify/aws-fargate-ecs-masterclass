# Service Discovery

## What are we going to learn?

## Step-1: AWS CloudMap - Create Namespace

## Step-2: Notification Microservice - Create Service

## Step-3: User Management Microservice - Update Task Definition 

## Step-4: User Management Microservice - Create Service

## Step-5: Test "Create User" Service

## Observation
- In this approach we really dont see Elastic load balancing.
- One service will call other service with service name and those service names are DNS registered in private DNS hosted zone with record set.
- Example: If we have 3 notification service containers 
    - 3 private IP addresses we will have for those 3 containers
    - 3 recordsets (A Records) will be created in Route53 with name "notification.myservices"
- This is achieved using **Route53 Multivalue Routing Policy**. 
- **Conclusion:**  In short, Service load balancing happens using Route53 multivalue routing policy. Its not as effective or substitute as Elastic Load balancing but it will do the job for RESTful API's which are stateless.
- For additional reference about **Route53 Multivalue Routing Policy** refer below link.
- Documentation Reference: https://aws.amazon.com/premiumsupport/knowledge-center/multivalue-versus-simple-policies/