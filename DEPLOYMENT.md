# GitHub Actions CI and manual EC2 deployment

The workflow in `.github/workflows/ci-cd.yml` runs backend verification and frontend tests/builds on pull requests and pushes to `main`. It creates a `spotifyx-release` artifact containing the application JAR, frontend files, and deployment script. It does not connect to AWS or deploy automatically. No AWS credentials, OIDC provider, S3 bucket, or SSM configuration are needed for GitHub Actions.

## EC2 requirements

The EC2 instance must already have:

- Amazon Linux 2023, Java 21, Nginx, `curl`, and `tar`.
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

Keep this file private (`root:spotifyx`, mode `0640`). Set `SPRING_CACHE_TYPE=redis` only if a reachable Redis service is configured. The release artifact contains application files only, not database credentials or the JWT secret.

## Manually deploy a successful build

1. In GitHub, open **Actions → CI**, select a successful run for the commit to deploy, and download the `spotifyx-release` artifact. GitHub downloads it as a ZIP file.
2. Extract the ZIP locally. It contains `spotifyx-release.tar.gz`.
3. Copy the archive to the EC2 instance (replace the hostname and key path):

   ```sh
   scp -i /path/to/ec2-key.pem spotifyx-release.tar.gz ec2-user@<EC2-public-DNS>:/tmp/
   ```

4. Connect to EC2 and run the deployment script:

   ```sh
   ssh -i /path/to/ec2-key.pem ec2-user@<EC2-public-DNS>
   mkdir -p /tmp/spotifyx-release
   tar -xzf /tmp/spotifyx-release.tar.gz -C /tmp/spotifyx-release
   sudo bash /tmp/spotifyx-release/ec2-deploy.sh /tmp/spotifyx-release
   ```

   The script installs the JAR, restarts the service, checks `/api/v1/health`, and restores the previous JAR if the health check fails. Once the API is healthy, it installs the frontend files and reloads Nginx.

Use an SSH key stored securely on your machine, and restrict the EC2 security group's SSH rule to your current IP. The workflow artifact is retained for seven days; download it before it expires.

Changing `JWT_SECRET` invalidates existing login tokens. Choose a stable secret and keep it only in the EC2 environment file or a secrets manager.
