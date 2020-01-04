# AWS ECR - Elastic Container Registry Integration

## Step-1: Introduction to ECR
-  For introduction slides refer the [presentation slides](/otherfiles/presentations/AWS-FargateECS-Masterclass-Course.pdf). 

## Step-2: ECR Terminology
 - Registry: An  ECR registry is provided to each AWS account; we can create image repositories in our registry and store images in them. 

- Repository: An ECR image repository contains our Docker images. 

- Repository policy: We can control access to our repositories and the images within them with repository policies. 

- Authorization token: Our Docker client must authenticate to Amazon ECR registries as an AWS user before it can push and pull images. The AWS CLI get-login command provides us with authentication credentials to pass to Docker. 

- Image: We can push and pull container images to our repositories. We can use these images locally on your development system, or we can use them in Amazon ECS task definitions. 

## Step-3: Pre-requisites
- On AWS Console
   - Create Authorization Token for admin user if not created
   - Create Account Alias if not created. 
- Install required CLI on the desktop where we build our docker images.
   - Install AWS CLI 
   - Install Docker CLI 

## Step-4: Create ECR Repository
- Create simple ECR repo via AWS Console.
- Make a note of the full repository name.

## Step-5: Create Docker Image locally
- Create docker image locally
- Update nginx index.html and keep creating multiple docker images
- This will be useful when we test Lifecycle policies

```
docker build -t 180789647333.dkr.ecr.ap-south-1.amazonaws.com/aws-ecr-nginx:1.0.0 . 
```

## Step-6: Create ECR Repository using AWS CLI & Push Docker Image
- Create ECR Repository using AWS CLI
- Push the docker image to ECR
```
aws ecr create-repository --repository-name aws-ecr-nginx --region us-east-1
aws ecr get-login --no-include-email --region us-east-1

Use "docker login" command from previous command output

docker push 180789647333.dkr.ecr.ap-south-1.amazonaws.com/aws-ecr-nginx:1.0.0
```

## Step-7: Image Scan 
 - Verify the vulnerabilities in **Repository -> Images** section


## Step-8: Using Amazon ECR Images with Amazon ECS
- Create Task Definition: aws-ecr-nginx
- Create Service: aws-ecr-nginx-v1
- Test it
