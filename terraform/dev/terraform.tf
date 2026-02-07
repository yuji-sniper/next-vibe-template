terraform {
  required_version = "1.14.4"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.30.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }
  }
  backend "s3" {
    bucket       = "next-vibe-template-dev-tfstate"
    key          = "terraform.tfstate"
    region       = "ap-northeast-1"
    use_lockfile = true
  }
}

provider "aws" {
  region = "ap-northeast-1"
}
