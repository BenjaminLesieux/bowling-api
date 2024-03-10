# Bowling API Documentation

## Credentials on hosting server

You cannot set yourself a role with the gateway on your local server and must modify your role via pgAdmin instance on port 8080.

The credentials are super.cool.efrei@gmail.com and the password is "admin".
All the db credentials are the same as the ones in the .env file : postgres and postgres.

**BUT**, if you test using our hosted instance at http://bowling-api.live-efrei.fr/, you can use the following credentials:

credentials MANAGER:
"email": "manager@bowling.fr",
"password": "MyManager123",
credentials ADMIN
"email": "admin@bowling.fr",
"password": "MyAdmin123",

A swagger API is set to test the API endpoints. But you can also import the Postman project from the URL: http://bowling-api.live-efrei.fr/api-json

## Prerequisites

Before getting started with the Bowling API, ensure the following prerequisites are met:

- Docker is installed and available on your machine.
- A `.env` file is present at the root of the project with appropriate configurations. Rename the `.env.example` file provided with the necessary values.

```sh
# Example .env file
RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_AUTH_QUEUE=auth
RABBITMQ_MAIN_QUEUE=main
RABBITMQ_PAYMENT_QUEUE=payment
RABBITMQ_MAILER_QUEUE=mailer
BASE_URL=http://localhost:3000
DB_URL=postgresql://clt2ofc1q078xbhmx595k2d38:XraevqnudgyHLAlHjKjV8sk9@37.120.189.116:9009/clt2ofc1q078zbhmx0s5ed7pk
DB_PAYMENT_URL=postgresql://postgres:postgres@postgres-payment:5432/payment
DB_AUTH_URL=postgresql://postgres:postgres@postgres-auth:5432/auth
DB_MAIN_URL=postgresql://postgres:postgres@postgres-main:5432/main
JWT_SECRET=bowling
JWT_EXPIRATION=3600
STRIPE_SK_KEY="sk_test_51LYu0dLb9iIz9S9TwmrR6zCJ0p6mzH212l1c1R0XyIzyyLH5IXHD55Ks5lxo6gWKOPeeHNMmShDUcGr2mgEeQQ0R005kCmJAhe"
STRIPE_PK_KEY="pk_test_51LYu0dLb9iIz9S9TbE1XLYWgMi5bBWjVXXFg4L9NChWZbdTvZ8lW4riLGAJZmzPJfPseScf3YblaIaAY2z9DPWqt00zyd1LNQI"
STRIPE_WEBHOOK_SECRET="prout"
GMAIL_USER=super.cool.efrei@gmail.com
GMAIL_PASSWORD=gxth nyon nqct mess
GMAIL_REFRESH_TOKEN=1//04EQ-JxHqXnu2CgYIARAAGAQSNwF-L9IrErLBvdAbFJuAPShZ44-ZmITLEfGwHTJRtXedbYKWI_4-En-FroZCiQRTuXlyOjz3TW8
# Other configurations...
```

You also have to setup two other env files at the root of the apps/bowling-main & apps/bowling-auth folders with the following content:

```sh
# Example .env file
DB_URL=postgresql://postgres:postgres@localhost:<port>/<db-name>
# For main service the port is 5434 and the db-name is main
# For auth service the port is 5432 and the db-name is auth
```

- That you have your port `3000` is free. (If not, you can always change the docker compose)

## Getting Started

To launch the project, run the following command in your terminal:

```bash
docker-compose up --build
```

## Accessing Endpoints

The Bowling API includes an integrated [Swagger](https://swagger.io/) application, allowing you to explore and test every endpoint conveniently. Simply navigate to http://localhost:3000/api in your browser. Alternatively, for testing the Stripe integration, you can use our hosted version of the app at http://bowling-api.live-efrei.fr.

To test Stripe with a fake card (we are in sandbox) use 4242 4242 4242 (42/42) 424

## Project Architecture

_After much discussion and consideration, we found ourselves torn between two architectural approaches: microservices or domain-driven design with the hexagonal architecture.
Given the specific needs of our project, which is a bowling franchise spread across multiple locations in France, scalability emerged as a crucial factor in our decision-making process.
Given the potential for substantial traffic volumes, particularly during busy periods, we placed a high priority on a system that could effectively accommodate such demands.
Ultimately, we decided to adopt a microservice-based approach due to its reputation for scalability and adaptability.
By opting for microservices, we aim to build a system that can effectively manage traffic across all of our franchise locations._

The Bowling API is designed using a microservices architecture for scalability and maintainability. This architectural approach offers several advantages:

- **Fault Tolerance:** Services operate independently, ensuring that if one service fails, the application remains operational.
- **Ease of Adding Functionality:** New services can be implemented without extensive modifications to existing codebases.
- **Logical Metrics:** Monitoring individual microservices provides more granular insights into system performance.

Each service that requires a database has its dedicated instance of a PostgreSQL database, accessed via the DataBase Provider.

### RPC Communication

Communication between services is facilitated through an RPC protocol, enabling seamless interaction and the addition of new features. This is implemented using **RabbitMQ** and a callback queue system.

```typescript
// Example RPC Call
async getHello() {
  return await lastValueFrom<string>(this.client.send({ cmd: 'hello' }, ''));
}
```

### Drizzle-ORM

[Drizzle-ORM](https://www.npmjs.com/package/drizzle-orm) simplifies database management tasks, offering functionalities such as connection handling, schema creation, and data manipulation. It utilizes a schema file to define tables and connections.

### Payment Handling

Payment processing is managed using [Stripe](https://www.npmjs.com/package/stripe), offering a streamlined approach to integrating payment services into the application. The `bowling-payment` service is dedicated to handling payment-related tasks.

### Mail Sending

Email communication with users is facilitated by the `nodemailer` package, configured to use a designated email address (`super.cool.efrei@gmail.com`). The `bowling-mailer` service handles email-related functionalities.

### QR Code Generation

The `QRCode` package is utilized for generating session QR codes. This service is integrated directly within the `bowling-main` service, as it currently requires no additional features.

## Architecture Diagram

![Architecture Diagram](./Architecture.png)

## Service Descriptions

All services are interconnected via RabbitMQ, utilizing RPC methods for communication.

### Main Service

Responsible for managing bowling-related activities, including products, alleys, reservations, and parks.

### Authentication Service

Handles user authentication and related activities.

### Payment Service

Manages client payments using the Stripe integration.

### Email Service

Facilitates email communication with users, sending invoices and order confirmations. Utilizes a Google Cloud SMTP server for email delivery.
