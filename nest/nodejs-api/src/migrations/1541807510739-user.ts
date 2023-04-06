import { MigrationInterface, QueryRunner } from 'typeorm';

export class user1541807510739 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `first_name` varchar(255) NOT NULL, `last_name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `email_canonical` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `username_canonical` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `enabled` tinyint NOT NULL, `roles` json NOT NULL, `confirmation_token` varchar(255) NULL, `security_key` varchar(255) NOT NULL, `created_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_a9058edf7c8341240f794157d3` (`email_canonical`), UNIQUE INDEX `IDX_24a07b5f23384609620faa1c10` (`username_canonical`), UNIQUE INDEX `IDX_00ef65cb563e7c32768f478d49` (`confirmation_token`), PRIMARY KEY (`id`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP INDEX `IDX_00ef65cb563e7c32768f478d49` ON `users`');
        await queryRunner.query('DROP INDEX `IDX_24a07b5f23384609620faa1c10` ON `users`');
        await queryRunner.query('DROP INDEX `IDX_a9058edf7c8341240f794157d3` ON `users`');
        await queryRunner.query('DROP TABLE `users`');
    }

}
