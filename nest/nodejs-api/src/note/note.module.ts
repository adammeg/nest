import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoteController } from './controllers';
import { Note } from './models';
import { NoteRepository } from './repositories';
import { NoteService } from './services';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Note, NoteRepository]),
    ],
    controllers: [
        NoteController,
    ],
    providers: [
        NoteService,
    ],
})
export class NoteModule {
}
