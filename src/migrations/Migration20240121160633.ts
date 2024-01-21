import { Migration } from '@mikro-orm/migrations';

export class Migration20240121160633 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "tour" ("id" uuid not null, "name" varchar(255) not null, "price" int not null, "start_date" date not null, "end_date" date not null, "travel_id" uuid null, constraint "tour_pkey" primary key ("id"));');
    this.addSql('alter table "tour" add constraint "tour_name_unique" unique ("name");');

    this.addSql('alter table "tour" add constraint "tour_travel_id_foreign" foreign key ("travel_id") references "travel" ("id") on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "tour" cascade;');
  }

}
