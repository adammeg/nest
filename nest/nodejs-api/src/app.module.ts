import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from 'common/config';
import { CommonModule } from 'common/common.module';
import { UserModule } from 'user/user.module';
import { NoteModule } from './note/note.module';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot(config.typeOrm),
        CommonModule,
        UserModule,
        NoteModule,
    ],
})
export class AppModule {
}
