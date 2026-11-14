#!/usr/bin/env bash
set -euo pipefail

release_dir="${1:?Usage: ec2-deploy.sh RELEASE_DIRECTORY}"
app_dir="/opt/spotifyx"
web_root="/var/www/spotifyx"
jar_name="spotifyX-1.0.0.jar"
jar_path="$app_dir/$jar_name"
previous_jar="$(mktemp /tmp/spotifyx-previous.XXXXXX.jar)"
had_previous=false

if [[ ! -s "$release_dir/$jar_name" || ! -s "$release_dir/frontend/index.html" ]]; then
  echo "Release bundle must contain the application JAR and frontend/index.html" >&2
  exit 1
fi

if [[ -f "$jar_path" ]]; then
  cp -p "$jar_path" "$previous_jar"
  had_previous=true
fi

rollback() {
  if [[ "$had_previous" == true ]]; then
    install -o spotifyx -g spotifyx -m 0644 "$previous_jar" "$jar_path"
    systemctl restart spotifyx || true
  else
    systemctl stop spotifyx || true
  fi
}

trap 'rm -f "$previous_jar"' EXIT
install -o spotifyx -g spotifyx -m 0644 "$release_dir/$jar_name" "$jar_path.new"
mv -f "$jar_path.new" "$jar_path"
if ! systemctl restart spotifyx; then
  echo "Could not restart SpotifyX; restoring previous JAR." >&2
  rollback
  exit 1
fi

healthy=false
for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error --max-time 2 \
    http://127.0.0.1:8080/api/v1/health >/dev/null; then
    healthy=true
    break
  fi
  sleep 2
done

if [[ "$healthy" != true ]]; then
  echo "New API release did not become healthy; restoring previous JAR." >&2
  rollback
  exit 1
fi

install -d -o spotifyx -g spotifyx "$web_root"
cp -a "$release_dir/frontend/." "$web_root/"
chmod -R a+rX "$web_root"
nginx -t
systemctl reload nginx

echo "SpotifyX deployment completed successfully."
