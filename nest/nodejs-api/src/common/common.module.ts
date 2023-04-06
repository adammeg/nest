import { Global, Module } from '@nestjs/common';

import { Logger, MailerService, ValidatorService } from './services';

@Global()
@Module({
    providers: [
        Logger,
        MailerService,
        ValidatorService,
    ],
    exports: [
        Logger,
        MailerService,
        ValidatorService,
    ],
})
export class CommonModule {
}
