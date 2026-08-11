#!/bin/bash
# VPS Docker Build Script

echo "=== DOCKER BUILD NO VPS ==="

# Login Docker Hub
docker login

# Build Frontend
echo "Building Frontend..."
cd /root/timesheet-sap-portal/frontend
docker build -t vladimirib/uxflow-sap-timesheet-frontend:latest .
docker push vladimirib/uxflow-sap-timesheet-frontend:latest

# Build Backend
echo "Building Backend..."
cd /root/timesheet-sap-portal/backend
docker build -t vladimirib/uxflow-sap-timesheet-backend:latest .
docker push vladimirib/uxflow-sap-timesheet-backend:latest

echo "=== BUILD COMPLETO ==="
echo "Frontend: vladimirib/uxflow-sap-timesheet-frontend:latest"
echo "Backend: vladimirib/uxflow-sap-timesheet-backend:latest"