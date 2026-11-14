# GitHub Actions CI/CD to EC2

The workflow in `.github/workflows/ci-cd.yml` runs backend verification and frontend tests/builds on pull requests and pushes to `main`. A successful push to `main` also deploys the JAR and React static files to the EC2 instance using AWS Systems Manager (SSM), not SSH.

## One-time EC2 setup

The EC2 instance must already have:

- Amazon Linux 2023, Java 21, Nginx, AWS CLI, and the SSM Agent.
- An instance profile with `AmazonSSMManagedInstanceCore` and permission to read the release prefix from the private deployment S3 bucket.
- SSM connectivity to AWS (outbound HTTPS, or configured VPC endpoints).
- The `spotifyx` Linux user, `/opt/spotifyx`, `/var/www/spotifyx`, and the `spotifyx.service` systemd unit.
- Nginx serving `/var/www/spotifyx` and proxying `/api/` to `http://127.0.0.1:8080`.
- A reachable PostgreSQL database and valid settings in `/etc/spotifyx/spotifyx.env`.

The service environment file must define:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://<database-endpoint>:5432/<database-name>
SPRING_DATASOURCE_USERNAME=<database-user>
SPRING_DATASOURCE_PASSWORD=<database-password>
JWT_SECRET=<random-secret-at-least-32-bytes>
SPRING_CACHE_TYPE=simple
```

Keep this file private (`root:spotifyx`, mode `0640`). Set `SPRING_CACHE_TYPE=redis` only if a reachable Redis service is configured. The workflow never uploads database credentials or the JWT secret.

## AWS configuration

1. Create a private S3 bucket for deployment bundles. Enable bucket versioning and block public access.
2. Ensure the EC2 instance profile can `s3:GetObject` on `arn:aws:s3:::<bucket>/spotifyx/releases/*`.
3. Configure GitHub Actions OIDC in AWS IAM:
   - Add the GitHub OIDC provider `https://token.actions.githubusercontent.com` with audience `sts.amazonaws.com`.
   - Create a role trusted only for this repository's `production` GitHub environment. Use the subject `repo:vijayganesh-sde/SpotifyX:environment:production`.
   - Grant that role `s3:PutObject` on the release prefix and `ssm:SendCommand` for the `AWS-RunShellScript` document and this EC2 instance. Grant the SSM command-read actions needed to poll deployment status.
4. In GitHub, create a **production** environment and configure:
   - Secret `AWS_DEPLOY_ROLE_ARN`: the OIDC role ARN.
   - Variables `AWS_REGION`, `EC2_INSTANCE_ID`, and `DEPLOY_BUCKET`.
   - Optionally require a reviewer for production deployments in the environment's protection rules.

The EC2 instance must be online and managed by Systems Manager. The AWS role used by GitHub does not need EC2 SSH access, and the instance does not need inbound SSH open to GitHub-hosted runners.

## Deployment behavior

The workflow builds the React app with `/api` as its API base URL, packages it with the executable JAR, and uploads a release bundle to the private S3 bucket. It sends an SSM command to the configured instance. `deploy/ec2-deploy.sh` installs the JAR, restarts the systemd service, checks `/api/v1/health`, and restores the previous JAR if the health check fails. After the API is healthy, it copies the frontend files into Nginx's document root and reloads Nginx.

To deploy, merge/push to `main` after CI passes. A manual run is also available through **GitHub → Actions → CI/CD → Run workflow** on `main`.

Changing `JWT_SECRET` invalidates existing login tokens. Choose a stable secret and keep it only in the EC2 environment file or a secrets manager.
