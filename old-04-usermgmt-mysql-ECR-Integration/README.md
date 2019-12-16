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

Use "docker login" command from previous command output

docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql

```

## Image Tag Mutability
 - Edit repository to enable Image Tag mutability
 - We can do this even during repository creation


## Image Scan 
 - Verify the vulnerabilities in **Repository -> Images** section


## Retagging an Image on ECR
- Use the batch-get-image command to get the image manifest for the image to retag and write it to an environment variable
- Use the --image-tag option of the put-image command to put the image manifest to Amazon ECR with a new tag. 
- We are going to changge the tag name from **latest** to **4.0.0**

```
aws ecr describe-images --repository-name aws-ecr-usermgmt-restapi-mysql

aws ecr batch-get-image --repository-name aws-ecr-usermgmt-restapi-mysql --image-ids imageTag=latest --query 'images[].imageManifest' --output text

MANIFEST=$(aws ecr batch-get-image --repository-name aws-ecr-usermgmt-restapi-mysql --image-ids imageTag=latest --query 'images[].imageManifest' --output text)

aws ecr put-image --repository-name aws-ecr-usermgmt-restapi-mysql --image-tag 4.0.0 --image-manifest "$MANIFEST"

aws ecr describe-images --repository-name aws-ecr-usermgmt-restapi-mysql

mvn clean package

docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql
```

## Lifecycle Policies
 - 
 - Lifecycle Policy Preview - Create Test Rules
 - Lifecycle Policy
 - Core Item-1 is Rule Priority
    - Rules evaluated from lowest to highest
 - Core Item-2 is Match Criteria 
    - Since Image Pushed
    - Image Count more than 
    
```
docker tag 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql:latest 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql:prod

docker tag 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql:latest 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql:prod1

docker tag 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql:latest 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql:prod2

docker tag 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql:latest 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql:prod3

docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql:prod
docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql:prod1
docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql:prod2
docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-usermgmt-restapi-mysql:prod3


```
## Tags





## Events & EventBridge

## Using Amazon ECR Images with Amazon ECS

## Delete Repository
```
aws ecr delete-repository --repository-name aws-ecr-usermgmt-restapi-mysql --region us-east-1 --force
```