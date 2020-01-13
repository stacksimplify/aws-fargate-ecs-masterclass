# Microservices Deployment on AWS Fargate & ECS Clusters

# Module - 1: Introduction & Pre-requisites
## Step-1: What are we going to learn in this section?
- We are going to deploy two microservices.
    - User Management Service
    - Notification Service

### Usecase Description
- User Management **Create User API**  will call Notification service **Send Notification API** to send an email to user when we create a user. 

### Architecture Diagram about our Buildout
-  For introduction slides refer the [presentation slides](/otherfiles/presentations/AWS-FargateECS-Masterclass-Course.pdf). 

### List of Docker Images used in this section
| Application Name                 | Docker Image Name                          |
| ------------------------------- | --------------------------------------------- |
| User Management Microservice | stacksimplify/usermanagement-microservice:1.0.0 |
| Notifications Microservice | stacksimplify/notifications-microservice:1.0.0 |

## Step-2: Pre-requisite -1: Create AWS RDS Database
- Create a RDS MySQL Database
- **Chose a Database Creation Method**
    - Standard Create
- **Select Engine**
    - Engine Options: MySQL
- **Template**
    - Only enable options eligible for RDS Free Usage Tier: Free tier
- **Settings**
    - DB Instance Identifier: microservicesdb
    - Master Username: dbadmin
    - Master Password: **Choose the password as you like and make a note of it**
    - Confirm Password: **Choose the password as you like and make a note of it**
- **DB Instance Size**
    - leave defaults
- **Storage**    
    - Uncheck Enable storage autoscaling for safety purpose as this is test db.
    - rest all leave to defaults
- **Connectivity**
    - VPC: ecs-vpc
    - Subnet Group: Create new DB subnet group    
    - Publicly Accessible: Yes (For troubleshooting purposes - Not required in real cases)
    - VPC Security Group
        - Create new VPC Secutiry Group: check
        - Name of VPC Security Group: microservices-rds-db-sg
    - Availability Zone: ap-south-1a
    - Database Port: 3306 (leave default)       
- **Database Authentication**
    - Leave defaults
- **Additional Configuration**
    - Database Options
        - Initial Database Name: usermgmt
    - Backup
        - Uncheck
    - rest all default        

- **Environment Variables**
- Gather the following details from RDS MySQL database to provide them as environment variables in our ECS Task Definition
```
AWS_RDS_HOSTNAME=<gather db endpoint information from Connectivity & security --> Endpoint & port section>
AWS_RDS_HOSTNAME=microservicesdb.cxojydmxwly6.us-east-1.rds.amazonaws.com
AWS_RDS_PORT=3306
AWS_RDS_DB_NAME=usermgmt
AWS_RDS_USERNAME=dbadmin
AWS_RDS_PASSWORD=*****
```

## Step-3: Pre-requisite-2: Create Simple Email Service - SES SMTP Credentials
### SMTP Credentials
- SMTP Settings --> Create My SMTP Credentials
- **IAM User Name:** append the default generated name with microservice or something so we have a reference of this IAM user created for our ECS Microservice deployment
- Download the credentials and update the same for below environment variables which you are going to provide in container definition section of Task Definition. 
```
AWS_MAIL_SERVER_HOST=email-smtp.us-east-1.amazonaws.com
AWS_MAIL_SERVER_USERNAME=
AWS_MAIL_SERVER_PASSWORD=
AWS_MAIL_SERVER_FROM_ADDRESS= use-a-valid-email@gmail.com 
```
- **Important Note:** Environment variable AWS_MAIL_SERVER_FROM_ADDRESS value should be a **valid** email address and also verified in SES. 

### Verfiy Email Addresses to which notifications we need to send.
- We need two email addresses for testing Notification Service.  
-  **Email Addresses**
    - Verify a New Email Address
    - Email Address Verification Request will be sent to that address, click on link to verify your email. 
    - From Address: stacksimplify@gmail.com (replace with your ids during verification)
    - To Address: dkalyanreddy@gmail.com (replace with your ids during verification)
- **Important Note:** We need to ensure all the emails (FromAddress email) and (ToAddress emails) to be verified here. 
    - Reference Link: https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html    

## Step-4: Pre-requisite-3: Create Application Load Balancer & DNS Register it in Route53
- **Create Application Load Balancer**
    - Name: microservices-alb
    - Availability Zones: ecs-vpc:  us-east-1a, us-east-1b
    - Security Group: microservices-sg-alb (Inbound: Port 80)
    - Target Group: temp-tg-micro (Rest all defaults)
- **DNS register the LB URL** with a custom domain name something like "services.stacksimplify.com" in Route53. 
    - Gather the DNS Name of "microservices-alb"
    - Create a Record set in Hosted Zone
        - Record Set Name: services.stacksimplify.com
        - Alias: Yes
        - Alias Name: microservices-alb url

# Module - 2: Deploy Notification Microservice
## Step-1: Notification Microservice - Create Task Definition
- **Configure Task Definition**
    - Task Definition Name: notification-microservice-td
    - Task Role: ecsTaskExecutionRole
    - Network Mode: awsvpc
    - Task Execution Role: ecsTaskExecutionRole
    - Task Memory: 2GB
    - Task CPU: 1 vCPU
- **Configure Container Definition**    
    - Container Name: notification-microservice
    - Image: stacksimplify/notifications-microservice:1.0.0
    - Container Port: 8096
    - Environment Variables
        - AWS_MAIL_SERVER_HOST=email-smtp.us-east-1.amazonaws.com
        - AWS_MAIL_SERVER_USERNAME=*****
        - AWS_MAIL_SERVER_PASSWORD=*****
        - AWS_MAIL_SERVER_FROM_ADDRESS=stacksimplify@gmail.com

## Step-2: Notification Microservice - Create Service
- **Configure Service**
    - Launch Type: Fargate
    - Task Definition:
        - Family: notification-microservice-td
        - Version: 1(latest) 
    - Service Name: svc-notification-microservice
    - Number of Tasks: 1
- **Configure Network**
    - VPC: ecs-vpc
    - Subnets: us-east-1a, us-east-1b
    - Security Groups: ecs-microservices-inbound 
        - Allow traffic from ALB security group or anywhere
        - Inbound Port 8095 and 8096 (for both notification & usermanagement service)
        - Notification Service uses Port 8096
        - User Management Service uses port 8095
    - AutoAssign Public IP: Enabled                
    - Health Check Grace Period: 147
    - **Load Balancing**
        - Load Balancer Type: Application Load Balancer
        - Load Balancer Name: microservices-alb        
        - Container to Load Balance: notification-microservice : 8096  **Click Add to Load Balancer **
        - Target Group Name: tg-notification-microservice
        - Path Pattern: /notification*
        - Evaluation Order: 1
        - Health Check path: /notification/health-status
- **Important Note:** Disable Service Discovery for now

## Step-3: Notification Microservice - Verify the deployment and access the service. 
- Verify tasks are in **RUNNING** state in Service
- Verify ALB - Target Groups section, Registered Tagets status to confirm if health checks are succeeding. If healthy, you shoud see
    - Status: Healthy
    - Description: This target is currently passing target group's health checks.
- **Troubleshooting Tip**
    - If we get **Request Timed out** as status, cross check ECS security group assigned to **svc-notificaiton-microservice** whether port 8096 is open for inbound traffic. 
- Verify using Load Balancer URL or DNS registered URL
```
http://services.stacksimplify.com/notification/health-status
```


# Module - 3: Deploy User Management Microservice
## Step-1: User Management Service - Create Task Definition
- **Configure Task Definition**
    - Task Definition Name: usermgmt-microservice-td1
    - Task Role: ecsTaskExecutionRole
    - Network Mode: awsvpc
    - Task Execution Role: ecsTaskExecutionRole
    - Task Memory: 2GB
    - Task CPU: 1 vCPU
- **Configure Container Definition**
    - Container Name: usermanagement-microservice
    - Image: stacksimplify/usermanagement-microservice:1.0.0
    - Container Port: 8095
    - **Environment Variables**
        - AWS_RDS_HOSTNAME=microservicesdb.cxojydmxwly6.us-east-1.rds.amazonaws.com
        - AWS_RDS_PORT=3306
        - AWS_RDS_DB_NAME=usermgmt
        - AWS_RDS_USERNAME=dbadmin
        - AWS_RDS_PASSWORD=*****
        - NOTIFICATION_SERVICE_HOST=services.stacksimplify.com [or] ALB DNS Name
        - NOTIFICATION_SERVICE_PORT=80

## Step-2: Allow Connections from ECS to RDS DB
- Identify the ECS security group which we are going to use for User Management Service
- Update the RDS Database security group inbound rules to allow connectivity for port 3306 from ECS Usermanagement security group.

## Step-3: User Management Service - Create Service
- **Configure Service**
    - Launch Type: Fargate
    - Task Definition:
        - Family: usermgmt-microservice-td1
        - Version: 1(latest) 
    - Service Name: svc-usermgmt-microservice
    - Number of Tasks: 1
- **Configure Network**
    - VPC: ecs-vpc
    - Subnets: us-east-1a, us-east-1b
    - Security Groups: ecs-microservices-inbound (already configured during notification service)
        - Allow traffic from ALB security group or anywhere
        - Inbound Port 8095 and 8096 (for both notification & usermanagement service)
    - AutoAssign Public IP: Enabled                
    - Health Check Grace Period: 147
    - **Load Balancing**
        - Load Balancer Type: Application Load Balancer
        - Load Balancer Name: microservices-alb        
        - Container to Load Balance: usermgmt-microservice : 8095  **Click Add to Load Balancer **
        - Target Group Name: tg-usermgmt-microservice
        - Path Pattern: /usermgmt*
        - Evaluation Order: 1
        - Health Check path: /usermgmt/health-status
- **Important Note:** Disable Service Discovery for now


## Step-4: User Management Microservice - Verify the deployment and access the service. 
- Verify tasks are in **RUNNING** state in Service
- Verify ALB - Target Groups section, Registered Tagets status to confirm if health checks are succeeding. If healthy, you shoud see
    - Status: Healthy
    - Description: This target is currently passing target group's health checks.
- **Troubleshooting Tip**
    - If we get **Request Timed out** as status, cross check ECS security group assigned to **svc-notificaiton-microservice** whether port 8096 is open for inbound traffic. 
- Verify using Load Balancer URL or DNS registered URL
```
http://services.stacksimplify.com/usermgmt/health-status
```
# Module - 4: Test both Microservices using Postman
## Step-1: Import postman project to Postman client on our desktop. 
- Import postman project
- Add environment url 
    - http://services.stacksimplify.com (**Replace with your ALB DNS registered url on your environment**)

## Step-2: Test both Microservices using Postman
### Notification Service
- Send Notification
    - Verify you have got email to the specified email address. 
- Health Status
### User Management Service
- **Create User**
    - Verify the email id to confirm account creation email received.
- **List User**   
    - Verify if newly created user got listed. 

## Drawbacks of this setup
- User management service calling notification service via internet using ALB.
- Both services present in same VPC, same network and sitting next to each other and for communication going over the internet
- How to fix this?
- **Microservices - Service Discovery** concept will be the solution for the same and in our next section we will see how to implement that on **AWS Fargate and ECS**. 