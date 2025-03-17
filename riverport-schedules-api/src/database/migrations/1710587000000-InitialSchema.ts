import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710587000000 implements MigrationInterface {
  name = 'InitialSchema1710587000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type for schedule status
    await queryRunner.query(`
      CREATE TYPE "public"."schedule_status_enum" AS ENUM (
        'scheduled',
        'cancelled',
        'completed'
      )
    `);

    // Create routes table
    await queryRunner.query(`
      CREATE TABLE "routes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "name" character varying NOT NULL,
        "start_location" character varying NOT NULL,
        "end_location" character varying NOT NULL,
        "distance" decimal(10,2) NOT NULL,
        CONSTRAINT "pk_routes" PRIMARY KEY ("id")
      )
    `);

    // Create schedules table
    await queryRunner.query(`
      CREATE TABLE "schedules" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "route_id" uuid NOT NULL,
        "boat_id" character varying,
        "departure_time" TIMESTAMP WITH TIME ZONE NOT NULL,
        "arrival_time" TIMESTAMP WITH TIME ZONE NOT NULL,
        "status" "public"."schedule_status_enum" NOT NULL DEFAULT 'scheduled',
        CONSTRAINT "pk_schedules" PRIMARY KEY ("id"),
        CONSTRAINT "fk_schedules_route" FOREIGN KEY ("route_id")
          REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "idx_schedules_route_id" ON "schedules"("route_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_schedules_departure_time" ON "schedules"("departure_time")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "public"."idx_schedules_departure_time"`);
    await queryRunner.query(`DROP INDEX "public"."idx_schedules_route_id"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "schedules"`);
    await queryRunner.query(`DROP TABLE "routes"`);

    // Drop enum type
    await queryRunner.query(`DROP TYPE "public"."schedule_status_enum"`);
  }
} 