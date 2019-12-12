# AWS ECR - Elastic Container Registry Integration

## Terminology
- Registry
- Authorization Token
- Repository
- Repository Policy
- Image

## Pre-requisites
- On AWS Console
   - Create Authorization Token for admin user if not created
   - Create Account Alias if not created. 
- Install required CLI on the desktop where we build our docker images.
   - Install AWS CLI 
   - Install Docker CLI 

## Create ECR Repository
- Create simple ECR repo via AWS Console. 

## Create Docker Image locally
 -  Update pom.xml with ECR repository name
```
<repository>180789647333.dkr.ecr.us-east-1.amazonaws.com/${project.name}</repository>
```

## Create ECR Repository & Push Docker Image

```
aws ecr create-repository --repository-name aws-ecr-usermgmt-restapi-mysql --region us-east-1

aws ecr get-login --no-include-email --region us-east-1

docker login

docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql

```
## Image Tag Mutability


## Tags

## Retagging an Image on ECR

## Lifecycle Policies



## Image Scan 

## Events & EventBridge

## Using Amazon ECR Images with Amazon ECS

## Delete Repository
```
aws ecr delete-repository --repository-name aws-ecr-usermgmt-restapi-mysql --region us-east-1 --force
```