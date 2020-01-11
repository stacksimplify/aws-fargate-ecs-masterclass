# Continuous Integration and Continuous Delivery 

## Step-01: Introduction to CI CD
-  For introduction slides refer the [presentation slides](/otherfiles/presentations/AWS-FargateECS-Masterclass-Course.pdf). 

## Step-02: Pre-requisite Step - Create Staging and production services in ECS
- **Create ECS Task Definition**
  - Name: ecs-cicd-nginx 
  - Container Name: ecs-cicd-nginx  
  - **Important Note: Make a note of this container name, this should be same as we give in our buildspec.yml for container name**
  - Image: stacksimplify/nginxapp2:latest
- **Create Staging ECS Service**
  - Name: staging-ecs-cicd-nginx-svc
  - Number of Tasks: 1
- **Create Production ECS Service**
  - Name: prod-ecs-cicd-nginx-svc
  - Number of Tasks: 1  


## Step-03: Create CodeCommit Repository
- Create Code Commit Repository with name as **ecs-cicd-nginx**
- Create git credentials from IAM Service and make a note of those credentials.
- Clone the git repository from Code Commit to local repository
```
git clone https://git-codecommit.ap-south-1.amazonaws.com/v1/repos/ecs-cicd-nginx
```
- Copy below listed two files from course section **06-CICD-ContinuousIntegration-ContinuousDelivery** to local repository
  - Dockerfile 
  - index.html  
- Commit code and Push to CodeCommit Repo
```
git status
git add .
git commit -am "1-Added Dockerfile and index.html"
git push
git status
```
- Verify the same on CodeCommit Repository in AWS Management console.

## Step-04: Create buildspec.yml for CodeBuild
- Create a new repository in Elastic Container Registry (ECR) with name as **ecs-cicd-nginx** and make a note of ECR Repository full name. 
- Create **buildspec.yml** file in local desktop folder **ecs-cicd-nginx**
- Update **buildspec.yml** file
   - Update **REPOSITORY_URI** value with complete ECR Repository name 
   - Update the **Container Name** at **printf '[{"name":"ecs-cicd-nginx"** in buildspec.yml
   - **Important Note:** In ECS Task Definition also when we are creating it, please ensure we give the container name as **ecs-cicd-nginx**

### buildspec.yml

```
version: 0.2

phases:
  install:
    runtime-versions:
      docker: 18       
  pre_build:
    commands:
      - echo Logging in to Amazon ECR.....
      - aws --version
      - $(aws ecr get-login --region $AWS_DEFAULT_REGION --no-include-email)
      - REPOSITORY_URI=180789647333.dkr.ecr.ap-south-1.amazonaws.com/ecs-cicd-nginx
      - IMAGE_TAG=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $REPOSITORY_URI:$IMAGE_TAG .
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - echo Writing image definitions file...
      - printf '[{"name":"ecs-cicd-nginx","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json
artifacts:
    files: imagedefinitions.json
```
-  Push the updated code to codeCommit Repository.

```
git status
git add .
git commit -am "2-Added buildspec.yml"
git push
git status
```


## Step-05: Create CodePipeline
- Create CodePipeline
- Update the CodeBuild Role to have access to ECR to upload images built by codeBuild. 
  - Policy Name: AmazonEC2ContainerRegistryFullAccess
- Test by accessing the static html page

## Step-06: Make changes to index.html file
- Make changes to index.html (Update as V2)
- Commit the changes to local git repository and push to codeCommit Repository
- Monitor the codePipeline
- Test by accessing the static html page
```
git status
git commit -am "V2 Deployment"
git push
```

## Step-07: Create Manual Approval stage in CodePipeline
- Create SNS Topic and confirm the email subsciption for sending notificaitons.
- Edit Pipeline and Create **Manual Approval Stage**


## Step-08: Create Deploy to Prod ECS Service stage in CodePipeline
- Edit the pipeline and create **Deploy to prod ECS Service**



