until npm start; do
    echo "Proxy server crashed with exit code $?.  Respawning.." >&2
    sleep 1
done