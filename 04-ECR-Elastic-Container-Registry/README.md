# AWS ECR - Elastic Container Registry Integration

## Step-1: Introduction to ECR
-  For introduction slides refer the [presentation slides](/otherfiles/presentations/AWS-FargateECS-Masterclass-Course.pdf). 

## Step-2: ECR Terminology
 - **Registry:** An  ECR registry is provided to each AWS account; we can create image repositories in our registry and store images in them. 
- **Repository:** An ECR image repository contains our Docker images. 
- **Repository policy:** We can control access to our repositories and the images within them with repository policies. 
- **Authorization token:** Our Docker client must authenticate to Amazon ECR registries as an AWS user before it can push and pull images. The AWS CLI get-login command provides us with authentication credentials to pass to Docker. 
- **Image:** We can push and pull container images to our repositories. We can use these images locally on your development system, or we can use them in Amazon ECS task definitions. 

## Step-3: Pre-requisites
- Install required CLI on the desktop where we build our docker images.
- **Install AWS CLI V1.x**
   - Documentation Reference: https://aws.amazon.com/cli/
```
Mac & Linux
Requires Python 2.6.5 or higher.
pip install awscli
```   
- **Install AWS CLI V2.x**
   - Documentation Reference: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
```
Mac OS (for all users)
$ curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
$ sudo installer -pkg AWSCLIV2.pkg -target /
$ which aws
/usr/local/bin/aws 
$ aws --version
aws-cli/2.0.6 Python/3.7.4 Darwin/18.7.0 botocore/2.0.0
```   

- **Install Docker CLI** 
   - Docker Desktop for MAC: https://docs.docker.com/docker-for-mac/install/
   - Docker Desktop for Windows: https://docs.docker.com/docker-for-windows/install/
   - Docker on Linux: https://docs.docker.com/install/linux/docker-ce/centos/

- **On AWS Console**
   - Create Authorization Token for admin user if not created
- **Configure AWS CLI with Authorization Token**
```
aws configure
AWS Access Key ID: ****
AWS Secret Access Key: ****
Default Region Name: ap-south-1
```   

## Step-4: Create ECR Repository
- Create simple ECR repo via AWS Console 
- Repository Name: aws-ecr-nginx
- Explore ECR console. 
- **Create ECR Repository using AWS CLI**
```
aws ecr create-repository --repository-name aws-ecr-nginx --region ap-south-1
aws ecr create-repository --repository-name <your-repo-name> --region <your-region>
```

## Step-5: Create Docker Image locally
- Navigate to folder **04-ECR-Elastic-Container-Registry** from course github content download. 
- Create docker image locally
- Review or Update nginx index.html 

```
docker build -t 180789647333.dkr.ecr.ap-south-1.amazonaws.com/aws-ecr-nginx:1.0.0 . 
docker run --name aws-ecr-nginx -p 80:80 --rm -d 180789647333.dkr.ecr.ap-south-1.amazonaws.com/aws-ecr-nginx:1.0.0
```

## Step-6: Push Docker Image to AWS ECR
- Push the docker image to ECR
- **AWS CLI Version 1.x**
```
AWS CLI Version 1.x
aws ecr get-login --no-include-email --region <your-region>
aws ecr get-login --no-include-email --region ap-south-1
Use "docker login" command from previous command output
docker push 180789647333.dkr.ecr.ap-south-1.amazonaws.com/aws-ecr-nginx:1.0.0
```
- **AWS CLI Version 2.x**
```
AWS CLI Version 2.x
aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <your-ecr-repo-url>

aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 180789647333.dkr.ecr.ap-south-1.amazonaws.com/aws-ecr-nginx

docker push 180789647333.dkr.ecr.ap-south-1.amazonaws.com/aws-ecr-nginx:1.0.0
```


## Step-7: Using ECR Image with Amazon ECS
- Create Task Definition: aws-ecr-nginx
   - Container Image: 180789647333.dkr.ecr.ap-south-1.amazonaws.com/aws-ecr-nginx:1.0.0
- Create Service: aws-ecr-nginx-svc
- Test it
