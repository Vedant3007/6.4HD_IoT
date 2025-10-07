IoT Scalability Project – Node.js & MongoDB (Dockerized Deployment)

Overview:
This project demonstrates a scalable IoT data management system using Node.js, Express, and MongoDB Atlas, packaged within a Dockerized architecture for consistent deployment.
The implementation reflects modern practices in IoT scalability research, focusing on modular microservices and cloud-ready containerization.

Repository Structure (File/Folder	Description):
1. server.js - Main entry point. Configures and runs the Express server, connects to MongoDB, and sets up the API routes.
2. routes/api.js	- Contains RESTful API endpoints for sending and retrieving IoT sensor data.
3. models/sample.js -	Defines the MongoDB schema using Mongoose, representing IoT device data entries.
4. Dockerfile -	Describes how to build the Node.js application image, ensuring consistency across environments.
5. docker-compose.yml -	Orchestrates multi-container deployment, connecting the API service and MongoDB in one setup.

Setup Instructions -

-> Start all services using Docker Compose:
docker-compose up --build

-> Access the running API:
Base URL: http://localhost:5000

-> Example endpoints:
- POST /api/data – Store IoT sensor data
- GET /api/data – Retrieve stored records

Technical Highlights:
- Uses Express for lightweight and scalable API design.
- Integrates MongoDB Atlas for cloud-based data storage.
- Employs Docker Compose to simplify deployment and ensure modular scalability.
- Designed to extend easily with analytics or visualization services.

Purpose - 
This project showcases the application of state-of-the-art scalable IoT architecture, emphasizing cloud connectivity, container-based deployment, and efficient data management — essential for large-scale IoT ecosystems.
