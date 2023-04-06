import { MigrationInterface, QueryRunner } from 'typeorm';

export class note1541812648974 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `notes` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `body` text NOT NULL, `shared` tinyint NOT NULL, `created_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `author_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query('ALTER TABLE `notes` ADD CONSTRAINT `FK_35b89a50cb9203dccff44136519` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`)');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `notes` DROP FOREIGN KEY `FK_35b89a50cb9203dccff44136519`');
        await queryRunner.query('DROP TABLE `notes`');
    }

}
