# --- STAGE 1: BUILDER ---
# This stage installs all Python packages and downloads the Playwright browser executable.
FROM python:3.11-slim AS builder

# Install build dependencies (CRITICAL: build-essential for greenlet compilation)
# FIX: Corrected multi-line RUN syntax. The backslash must be the last character on the line.
RUN apt-get update && apt-get install -y \
 	build-essential \
 	wget \
 	gnupg \
 	ca-certificates \
 	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies and download the browser binary
COPY requirements.txt .
# FIX: Corrected multi-line RUN syntax for playwright install.
RUN pip install --no-cache-dir -r requirements.txt \
 	&& playwright install chromium

# --- STAGE 2: RUNNER ---
# This stage creates the final, minimal image by only copying necessary files.
FROM python:3.11-slim AS runner

# NOTE: We must still install the necessary OS runtime dependencies for Chromium to run.
# FIX: Corrected multi-line RUN syntax.
RUN apt-get update && apt-get install -y \
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

# Copy EXECUTABLES (CRITICAL FIX: Fixes "gunicorn: executable file not found")
# Gunicorn, pip, and playwright executables are stored here.
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Copy Python packages from the builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/

# Copy the Playwright browser executables from the builder's cache path
COPY --from=builder /root/.cache/ms-playwright/ /root/.cache/ms-playwright/

# Copy application code
COPY . .

# Expose port (Cloud Run default)
EXPOSE 8080

# Set environment variables
ENV FLASK_APP=flask_app.py
ENV PYTHONUNBUFFERED=1

# Tell Playwright where to find its browsers (optional but good practice)
ENV PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright/

# Run Flask app using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "flask_app:app"]
