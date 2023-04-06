import { MulterOptions } from '@nestjs/common/interfaces/external/multer-options.interface';
import { diskStorage } from 'multer';

import { FileStorage } from './file-storage';

export function FileStorageOptions(resourceTag: string): MulterOptions {
    const fileStorage = new FileStorage(resourceTag);
    return {
        storage: fileStorage.storage,
        limits: fileStorage.limits,
        fileFilter: fileStorage.fileFilter,
    };
}