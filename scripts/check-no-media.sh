#!/usr/bin/env bash
# Web edition must never carry manufacturer images, logos or a local offline bundle.
set -euo pipefail
bad="$(git ls-files | grep -Ei '\.(jpe?g|png|webp|gif|bmp|tiff?|avif)$|^offline\.html$|^assets/(photos|logos)/' || true)"
if [ -n "$bad" ]; then
  echo "Media files are not allowed on the web edition:" >&2
  echo "$bad" >&2
  exit 1
fi
echo "OK: no manufacturer images, logos or offline.html tracked."
