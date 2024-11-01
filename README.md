# Parcial 3
Despliegue automatico de una aplicacion contenerizada en AWS por usando Terraform
## Instrucciones
1. Cree un archivo con extension `.tf`, por ejemplo `main.tf`
2. Inserte en el archivo el siguiente codigo
```
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.74.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "web_sg" {
  name        = "web-sg"
  description = "Allow HTTP traffic"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web_instance" {
  ami             = "ami-0866a3c8686eaeeba" # Ubuntu Server 24.04 LTS AMI for us-east-1
  instance_type   = "t2.micro"
  security_groups = [aws_security_group.web_sg.name]

  user_data = <<-EOF
        #!/bin/bash
        sudo apt-get update
        sudo apt-get install ca-certificates curl -y
        sudo install -m 0755 -d /etc/apt/keyrings
        sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
        sudo chmod a+r /etc/apt/keyrings/docker.asc

        echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update
        sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
        echo "Hello, World!" > /home/ubuntu/hello.txt

        git clone https://github.com/brysma1/parcial3.git /home/ubuntu/app

        cd /home/ubuntu/app
        sudo docker compose up --build -d
        EOF

  tags = {
    Name = "docker-app-instance"
  }
}
```
3. Asegurese de que tiene instalada la CLI de Terraform, de lo contrario instalela siguiendo las instrucciones [aqui](https://developer.hashicorp.com/terraform/install).
4. Asegurese de que tiene sus credenciales de AWS en el archivo `~/.aws/credentials`.
5. Ejecute el comando `terraform init` para inicializar Terraform e instalar los plugins necesarios.
6. Si desea observar la configuracion de la infraestructura sin realizar el despliegue, puede ejecutar el comando `terraform plan`
7. Para realizar el despliegue ejecute el comando `terraform apply`, e ingrese `yes`.

La aplicacion se puede encuentra en la direccion publica del servidor, visible desde interfaz grafica de la consola de aws o por medio del comando `terraform show`, y se accede por medio de HTTP.
Para destruir la infraestructura basta con ejecutar `terraform destroy`, y confirme ingresando `yes`.
