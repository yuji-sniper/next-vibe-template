terraform {
  required_version = "1.14.4"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.30.0"
    }
  }
  backend "s3" {
    bucket       = "next-vibe-template-tfstate"
    key          = "terraform.tfstate"
    region       = "ap-northeast-1"
    use_lockfile = true
  }
}

provider "aws" {
  region = "ap-northeast-1"
}
