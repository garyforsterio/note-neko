#!/bin/bash
set -e
docker build --platform linux/amd64 -t asia-northeast1-docker.pkg.dev/life-tracker-459800/nextjs-repo/note-neko:latest .
docker push asia-northeast1-docker.pkg.dev/life-tracker-459800/nextjs-repo/note-neko:latest
