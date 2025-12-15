# --- STAGE 1: BUILDER ---
# This stage installs all Python packages and downloads the Playwright browser executable.
FROM python:3.11-slim-bookworm AS builder

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1

# Install minimal build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        libffi-dev \
        libssl-dev \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies and download the browser binary
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    playwright install chromium

# --- STAGE 2: RUNNER ---
# This stage creates the final, minimal image by only copying necessary files.
FROM python:3.11-slim-bookworm AS runner

ENV PYTHONUNBUFFERED=1 \
    PORT=8080 \
    FLASK_APP=flask_app.py \
    PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright/

# Install runtime-only libraries (for Chromium and PostgreSQL)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq5 \
        ca-certificates \
        fonts-liberation \
        fonts-unifont \
        libasound2 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libatspi2.0-0 \
        libcups2 \
        libdbus-1-3 \
        libdrm2 \
        libgbm1 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libwayland-client0 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxkbcommon0 \
        libxrandr2 \
        xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy EXECUTABLES (Gunicorn, pip, playwright executables)
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Copy Python packages from the builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/

# Copy the Playwright browser executables from the builder's cache path
COPY --from=builder /root/.cache/ms-playwright/ /root/.cache/ms-playwright/

# Copy application code
COPY . .

# Expose port (Cloud Run default)
EXPOSE 8080

# Run Flask app using Gunicorn (respects PORT env var)
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8080} flask_app:app"]
