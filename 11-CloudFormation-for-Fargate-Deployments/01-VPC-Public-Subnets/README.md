# Cloud Formation Templates for Deploying Fargate Tasks in a VPC on a Public Subnet.

## Step-00: Template Categories
- We are going to divide templates in to two categories
- **Network Stack (Parent Stack)**
    - Create VPC
    - Create ECS Cluster & ECS Roles
    - Create Load Balancer (ALB)
    - Create Outputs
- **Faragte Service Stack**
    - Create Input Parameters
    - Create Task Definition
    - Create Load Balancer Target Group & Load Balancer Rule
    - Create ECS Service

## Step-01: Create Network Stack
- We are going to build the network stack in a incremental manner.     
    - 01-01-Fargate-NetworkStack-CreateVPC.yml
    - 01-02-Fargate-NetworkStack-Create-ECSCluster-ECSRoles.yml
    - 01-03-Fargate-NetworkStack-Create-SecurityGroups-LoadBalancers.yml
    - 01-04-Fargate-NetworkStack-Create-Outputs.yml

## Step-02: Create Service Stack
- We are going to build the network stack in a incremental manner.     
    - 02-01-Fargate-ServiceStack-Create-InputParameters.yml
    - 02-02-Fargate-ServiceStack-Create-TaskDefinition.yml
    - 02-03-Fargate-ServiceStack-Create-ALB-TargetGroup-and-LoadBalancerRule.yml
    - 02-04-Fargate-ServiceStack-Create-ECSService.yml
