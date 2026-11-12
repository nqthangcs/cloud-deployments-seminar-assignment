# Use the official Python image from the Docker Hub
FROM python:3.11-slim

WORKDIR /app

# Create a non-root user for security
RUN addgroup --system app && \
    adduser --system --ingroup app app

COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Copy application code
COPY --chown=app:app app/ /app/

# Switch to non-root user
USER app

CMD ["sh", "-c", "exec gunicorn --workers 1 --bind 0.0.0.0:${FLASK_PORT:?FLASK_PORT environment variable must be set} app:app"]
