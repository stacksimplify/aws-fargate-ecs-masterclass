# AWS ECR - Elastic Container Registry Integration

## Step-1: Understand Terminology
- Registry
- Authorization Token
- Repository
- Repository Policy
- Image

## Step-2: Pre-requisites
- On AWS Console
   - Create Authorization Token for admin user if not created
   - Create Account Alias if not created. 
- Install required CLI on the desktop where we build our docker images.
   - Install AWS CLI 
   - Install Docker CLI 

## Step-3: Create ECR Repository
- Create simple ECR repo via AWS Console.

## Step-4: Create Docker Image locally
- Create docker image locally
- Update nginx index.html and keep creating multiple docker images
- This will be useful when we test Lifecycle policies

```
docker build -t 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev1 . 

Update index.html to V2
docker build -t 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev2 . 

Update index.html to V3
docker build -t 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev3 . 

Update index.html to V4
docker build -t 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev4 . 
```

## Step-5: Create ECR Repository & Push Docker Image

```
aws ecr create-repository --repository-name aws-ecr-nginx --region us-east-1

aws ecr get-login --no-include-email --region us-east-1

Use "docker login" command from previous command output

docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev1
docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev2
docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev3
docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev4
```

## Step-6: Image Tag Mutability
 - Edit repository to enable Image Tag mutability
 - We can even enable during repository creation
```
Update index.html to V5
docker build -t 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev4 . 
docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev4

Update index.html to V6
docker build -t 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev4 . 
docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev4
Error Messsage: tag invalid: The image tag 'dev4' already exists in the 'aws-ecr-nginx' repository and cannot be overwritten because the repository is immutable
```

## Step-7: Image Scan 
 - Verify the vulnerabilities in **Repository -> Images** section


## Step-8: Retagging an Image on ECR
- Use the batch-get-image command to get the image manifest for the image to retag and write it to an environment variable
- Use the --image-tag option of the put-image command to put the image manifest to Amazon ECR with a new tag. 
- We are going to changge the tag name from **latest** to **4.0.0**

```
aws ecr describe-images --repository-name aws-ecr-nginx

aws ecr batch-get-image --repository-name aws-ecr-nginx --image-ids imageTag=dev4 --query 'images[].imageManifest' --output text

MANIFEST=$(aws ecr batch-get-image --repository-name aws-ecr-nginx --image-ids imageTag=dev4 --query 'images[].imageManifest' --output text)

aws ecr put-image --repository-name aws-ecr-nginx --image-tag devnew1 --image-manifest "$MANIFEST"

aws ecr describe-images --repository-name aws-ecr-nginx
```

## Step-9: Lifecycle Policies
- Primarily used for cleaning up old images from ECR Repository.
- Lifecycle Policy Preview - Create Test Rules
- Lifecycle Policy
- Core Item-1 is Rule Priority
   - Rules evaluated from lowest to highest
- Core Item-2 is Match Criteria 
   - Since Image Pushed
   - Image Count more than 
- Important Note-1: 
- Important Note-2: 

## Step-10: Using Amazon ECR Images with Amazon ECS
- Create Task Definition: aws-ecr-nginx
- Create Service: aws-ecr-nginx-v1
- Test it

## Step-11: Events & EventBridge
- Event for a Completed Image Push
- Event for a Completed Image Scan
- Event for an Image Deletion
```
Update index.html to V7
docker build -t 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev7 . 
docker push 180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx:dev7
Verify email
```

