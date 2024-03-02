CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid DEFAULT gen_random_uuid(),
	"email" varchar(255),
	"password" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
