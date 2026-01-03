# --- STAGE 1: BUILDER ---
FROM python:3.12-slim-bookworm AS builder

ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential ca-certificates && rm -rf /var/lib/apt/lists/*

# Install Python packages and download browser binaries
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    playwright install chromium

# --- STAGE 2: RUNNER ---
FROM python:3.12-slim-bookworm AS runner

ENV PYTHONUNBUFFERED=1 PORT=8080 \
    PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright/
WORKDIR /app

# Install only the runtime libraries required for Chromium and Postgres
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 libgbm1 libasound2 libatk-bridge2.0-0 libgtk-3-0 \
    libpq5 ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Transfer executables and packages from builder stage
COPY --from=builder /usr/local/bin/ /usr/local/bin/
COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=builder /root/.cache/ms-playwright/ /root/.cache/ms-playwright/

# Copy application source code
COPY . .

EXPOSE 8080
# Run using Gunicorn with SINGLE WORKER to prevent memory racing
# WEB_CONCURRENCY=1 ensures only 1 worker spawns, preventing OOM during boot
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 1 --threads 1 flask_app:app"]
