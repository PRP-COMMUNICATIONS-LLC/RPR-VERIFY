# STAGE 1: Build dependencies
FROM python:3.11-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc build-essential
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# STAGE 2: Runtime environment
FROM python:3.11-slim
WORKDIR /app

# Install system-level OCR and Graphics dependencies
# Updated for Debian 13 Trixie compatibility
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libgl1 \
    libglx-mesa0 \
    libglib2.0-0 \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Copy binaries and app code
COPY --from=builder /install /usr/local
COPY . .

# Initialize state directories
RUN mkdir -p uploads generated_reports

EXPOSE 5001

# Healthcheck for the Singapore Engine Dashboard
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python3 -c "import requests; requests.get('http://localhost:5001/api/health')" || exit 1

CMD ["gunicorn", "-c", "gunicorn_config.py", "app:app"]
