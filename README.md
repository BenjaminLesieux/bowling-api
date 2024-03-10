# Bowling API

## Prerequisites
- You need to have `docker` available on your machine.

- You also need `node`.

- Have a `.env` file in the **root** of the project with the values (rename the .env.example project):
```sh
RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_AUTH_QUEUE=auth
RABBITMQ_MAIN_QUEUE=main
RABBITMQ_PAYMENT_QUEUE=payment
RABBITMQ_MAILER_QUEUE=mailer
DB_URL=""
JWT_SECRET=bowling
JWT_EXPIRATION=3600 # One hour
STRIPE_SK_KEY=""
STRIPE_PK_KEY=""
STRIPE_WEBHOOK_SECRET=""
GMAIL_USER=""
GMAIL_PASSWORD=""
```

**main** and **auth** also need `.env` files:
-   main:
```env
DB_MAIN_URL=postgresql://postgres:postgres@localhost:5434/main
```

- auth:
```env
DB_AUTH_URL=postgresql://postgres:postgres@localhost:5432/auth
```

You can also copy the `.env.example` files and rename them `.env`.

## Run the project

```bash
docker-compose up
```

Next, you have to init the databases. Start by running `pnpm install` in the root directory (if you don't have pnpm installed, install it with `npm install -g pnpm`).

Then, go to the `/apps/bowling-auth` directory, and run:
```sh
npx drizzle-kit push:pg
```

After that, head to `/apps/bowling-main` directory and run:
```sh
npx drizzle-kit push:pg
```

Your databases should be initialized.

## Fetch endpoints

This project comes with an integrated [swagger](https://swagger.io/) application. With it, you can try every endpoint of the application by going on http://localhost:3000/api. ***In this project, it is used as a alternative to postman.***

## Project architecture

We implemented this API as a microservices architecture in order to make it as scalable as possible. But microservices also grant a lot other advantages:
- **fault tolerant**: Except for the gateway, if one service is down, the application keeps running. Some services might not work as expected, but the users could still work with the application.
- **Adding functionnalities is easier**: Since they are not depending on each other, implementing new services does not require a lot of code modification.
- **More Logical metrics**: Watching different microservices makes more sense than watching a single service. Small services can provide metrics about themselves, making it easier to find the source of the problem.

Each service that require a database has its own instance of a postgreSQL database. They access their databases throught the `DataBase Provider`.

#### RPC

We choose to use an RPC protocol between our services in order to simplify communication and implentation of new services and features. Now, by simply passing a command, we can run functions from different services and get their results.

We implemented it with RabbitMQ, by using a callback queue system.

*Example :*
```ts
// Calling service
async getHello() {
  return await lastValueFrom<string>(this.client.send({ cmd: 'hello' }, ''));
}
```

```ts
// Called service
@MessagePattern({
  cmd: 'hello',
})
getHello(): string {
  return this.bowlingMainService.getHello();
}
```


#### Drizzle-ORM

[Drizzle-ORM](https://www.npmjs.com/package/drizzle-orm) is a tool allowing us to manage more easily our databases, by creating connections, data collection, tables creation... With simple functions and classes, defined in `apps/libs/shared/src/database`. It uses a schema file to define our tables and connections.

#### Payment handling

We used [stripe](https://www.npmjs.com/package/stripe) in order to handle payments. It is a package that simplify the implementation of payment services on the net.

The payment service is quite complex, and may evolve in the future. This is why we decided to create a whole service (`bowling-payment`) for it.

#### Mail sending

We used the [nodemailer](https://www.npmjs.com/package/nodemailer) package in order to send mail to users. We configured so it would use the email adress `super.cool.efrei@gmail.com`, the mail of our group team.

The mail service, known as `bowling-maier`, may implement more features in the future, which is why we created a whole service for it.

#### QR code generation

We used the [QRCode](https://www.npmjs.com/package/qrcode) package in order to generate the QR code of a session. It takes an url and return the information to compile the image in HTML.

There is no services for the QR code generation. Our team did not see how we will add more features to it, and this is why it is a small service inside the `bowling-main` service.

### Architecture Diagram
![architecture diagram](./Architecture.png)

## Services Explanations

All services are linked by our RabbitMQ server, which we used to implement RPC methods. 

#### Main

Since we are working on a bowling application, the goal of this service is to handle anything related to this bowling part:
- products,
- alleys,
- reservations,
- parks,

#### Auth

Since a bowling have customers, an authentification service is required. This service will handle every connection related activity.

#### Payment

A bowling needs to fund itself ! To do this, it will gather the payments of clients through the payment service. In order to create this service, we used [stripe](https://www.npmjs.com/package/stripe), a package simplifying the implementation of payment services on the net.

#### Email

When clients have paid, an invoice and order confirmation is send to them through email. This service uses an google cloud SMTP server.