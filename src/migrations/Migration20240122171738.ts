import { Migration } from '@mikro-orm/migrations';

export class Migration20240122171738 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "travel" add column "image" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "travel" drop column "image";');
  }

}
