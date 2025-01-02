# Microservice Architecture with Kafka and NestJS

This project demonstrates a microservice-based architecture using **NestJS** with **Apache Kafka** as the messaging broker. It consists of the following services:

1. **User Service**: Handles user-related operations.
2. **Task Service**: Manages tasks and their lifecycle.
3. **Token Service**: Responsible for authentication and token management.
4. **Gateway Service**: Acts as an API gateway, orchestrating requests and interactions between services.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (>= 16.x)
- **Docker** and **Docker Compose**
- **Kafka** (or use the Docker setup provided)

---

## Architecture Overview

Each service is implemented as an independent NestJS application. They communicate asynchronously via Kafka topics. The Gateway Service acts as the single entry point for client requests, forwarding them to the appropriate microservice.

### Communication Flow

1. **Client Request** → Gateway Service
2. **Gateway Service** → Kafka Broker (publish to a topic)
3. **Kafka Broker** → Target Microservice (consume topic and process the message)

### Kafka Topics

| Topic Name         | Description                                |
|--------------------|--------------------------------------------|
| `user.events`      | User-related events (e.g., creation, update) |
| `task.events`      | Task-related events (e.g., creation, status updates) |
| `auth.tokens`      | Authentication and token-related messages |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Set Up Environment Variables

Each service requires specific environment variables. Copy the `.env.example` file from each service directory and rename it to `.env`.

```bash
cp ./services/user/.env.example ./services/user/.env
cp ./services/task/.env.example ./services/task/.env
cp ./services/token/.env.example ./services/token/.env
cp ./services/gateway/.env.example ./services/gateway/.env
```

Edit the `.env` files to match your environment configuration.

### 3. Start the Services

Use Docker Compose to build and start all services, including Kafka.

```bash
docker-compose up --build
```

This will start:
- Kafka broker
- Zookeeper
- All microservices

### 4. Access the Services

- **Gateway Service**: Available at [http://localhost:3000](http://localhost:3000)
- Kafka UI (if included in the setup): Available at [http://localhost:8080](http://localhost:8080)

---

## Directory Structure

```
.
├── services
│   ├── gateway    # Gateway service
│   ├── user       # User microservice
│   ├── task       # Task microservice
│   ├── token      # Token microservice
├── kafka          # Kafka Docker setup
└── docker-compose.yml
```

---

## Service Details

### User Service
- Handles CRUD operations for users.
- Publishes events to `user.events`.

### Task Service
- Manages tasks, including creation and status updates.
- Publishes and consumes `task.events`.

### Token Service
- Issues and validates authentication tokens.
- Communicates via `auth.tokens` topic.

### Gateway Service
- Exposes REST and WebSocket endpoints for client interactions.
- Orchestrates calls to other microservices.

---

## Testing

Run unit tests for each service individually:

```bash
cd services/<service-name>
npm run test
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/<name>`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/<name>`).
5. Open a Pull Request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For any questions or support, please contact [m3hr4nus@gmail.com].

