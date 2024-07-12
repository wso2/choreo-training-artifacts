drop schema public cascade;
create schema public;

CREATE TABLE "room"(
    "number" INT NOT NULL,
    "type" INT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "room_number_index" ON
    "room"("number");
ALTER TABLE
    "room" ADD CONSTRAINT "room_number_primary" PRIMARY KEY("number");
CREATE TABLE "room_type"(
    "id" INT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "guest_capacity" INT NOT NULL,
    "price" INT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "room_type_name_index" ON
    "room_type"("name");
ALTER TABLE
    "room_type" ADD CONSTRAINT "room_type_id_primary" PRIMARY KEY("id");
CREATE TABLE "reservation"(
    "id" UUID NOT NULL,
    "room" INT NOT NULL,
    "checkin_date" DATE NOT NULL,
    "checkout_date" DATE NOT NULL,
    "user" VARCHAR(255) NOT NULL,
    "user_info" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "reservation_id_index" ON
    "reservation"("id");
CREATE INDEX "reservation_checkin_date_checkout_date_index" ON
    "reservation"("checkin_date", "checkout_date");
ALTER TABLE
    "reservation" ADD CONSTRAINT "reservation_id_primary" PRIMARY KEY("id");
CREATE TABLE "user"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "contact_number" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "user" ADD CONSTRAINT "user_id_primary" PRIMARY KEY("id");
ALTER TABLE
    "room" ADD CONSTRAINT "room_type_foreign" FOREIGN KEY("type") REFERENCES "room_type"("id");
ALTER TABLE
    "reservation" ADD CONSTRAINT "reservation_id_foreign" FOREIGN KEY("room") REFERENCES "room"("number");