import { Migration } from '@mikro-orm/migrations';

export class Migration20240120161554 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "travel_mood" ("id" uuid not null, "culture" int not null default 0, "history" int not null default 0, "nature" int not null default 0, "party" int not null default 0, "relax" int not null default 0, constraint "travel_mood_pkey" primary key ("id"));');

    this.addSql('create table "travel" ("id" uuid not null, "is_public" boolean not null default false, "slug" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) not null, "days" int not null, "mood_id" uuid null, constraint "travel_pkey" primary key ("id"));');
    this.addSql('alter table "travel" add constraint "travel_name_unique" unique ("name");');
    this.addSql('alter table "travel" add constraint "travel_mood_id_unique" unique ("mood_id");');

    this.addSql('alter table "travel" add constraint "travel_mood_id_foreign" foreign key ("mood_id") references "travel_mood" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "travel" drop constraint "travel_mood_id_foreign";');

    this.addSql('drop table if exists "travel_mood" cascade;');

    this.addSql('drop table if exists "travel" cascade;');
  }

}
