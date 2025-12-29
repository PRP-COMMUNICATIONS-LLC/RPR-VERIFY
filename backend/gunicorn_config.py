import multiprocessing
import os

# Network Settings
bind = "0.0.0.0:5001"

# Performance Tuning
# OCR is CPU-bound; 4 workers provide balance for Mac Studio and Cloud Run
workers = int(os.getenv("GUNICORN_WORKERS", "4"))
threads = 2
timeout = 120  # Essential for Gemini Vision + OCR latency

# Stability Fix
# Prevents container 'frozen' states by using shared memory for worker heartbeats
worker_tmp_dir = "/dev/shm"

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Graceful shutdown
graceful_timeout = 30
keepalive = 5
