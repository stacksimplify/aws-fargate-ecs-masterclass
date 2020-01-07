# AWS ECS & Fargate - CI CD 


## Step-1: Create CodeCommit Repository
- Create git credentials
- Create Code Commit Repository
- git clone
- Copy Dockerfile, index.html
- Commit code and Push to CodeCommit Repo

## Step-2: Create buildspec.yml for CodeBuild
- Update the following in buildspec.yml file
   - Update **REPOSITORY_URI** value with your ECR Repository name 
   - Update the **Container Name** you have provided in Nginx Task Definition at **printf '[{"name":"aws-ecr-nginx"** in buildspec.yml
 
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
      - REPOSITORY_URI=180789647333.dkr.ecr.us-east-1.amazonaws.com/aws-ecr-nginx
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
      - printf '[{"name":"aws-ecr-nginx","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json
artifacts:
    files: imagedefinitions.json
```


## Step-3: Create CodePipeline
- Create CodePipeline
- Update the CodeBuild Role to have access to ECR to upload images built by codeBuild. 
- Test by accessing the static html page

## Step-4: Make changes to index.html file
- Make changes to index.html
- Commit the changes to local git repository and push to codeCommit Repository
- Monitor the codePipeline
- Test by accessing the static html page
```
git commit -am "V2 code"
git push
```





