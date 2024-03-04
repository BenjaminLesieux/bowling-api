# Bowling API

## Prerequisites
- You need to have `docker` available on your machine.

- Have a `.env` file in the **root** of the project with the values:
```sh
RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_AUTH_QUEUE=auth
RABBITMQ_MAIN_QUEUE=main
DB_URL=""
JWT_SECRET=bowling
JWT_EXPIRATION=3600
STRIPE_SK_KEY=""
STRIPE_PK_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

- Free `3000` port

## Run the project

```bash
docker-compose up
```

## Project architecture

![architecture diagram](./Architecture.png)

## Services Explanations

All services are linked by our RabbitMQ server, which we used to implement RPC methods. 

### Main

Since we are working on a bowling application, the goal of this service is to handle anything related to this bowling part:
- products,
- alleys,
- reservations,
- parks,

### Auth

Since a bowling have customers, an authentification service is required. This service will handle every connection related activity.

### Payment

A bowling needs to fund itself ! To do this, it will gather the payments of clients through the payment service. In order to create this service, we used [stripe](https://www.npmjs.com/package/stripe), a package simplifying the implementation of payment services on the net.

### Email

When clients have paid, an invoice and order confirmation is send to them through email. This service uses an google cloud SMTP server.