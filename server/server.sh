until node server/index.js; do
    echo "Proxy server crashed with exit code $?.  Respawning.." >&2
    sleep 1
done