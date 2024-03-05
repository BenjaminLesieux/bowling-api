export const AUTH_MICROSERVICE = 'AUTH';
export const MAIN_MICROSERVICE = 'MAIN';
export const PAYMENT_MICROSERVICE = 'PAYMENT';
export const MAILER_MICROSERVICE = 'MAILER';

export type DbMicroservice = typeof AUTH_MICROSERVICE | typeof MAIN_MICROSERVICE | typeof PAYMENT_MICROSERVICE;
