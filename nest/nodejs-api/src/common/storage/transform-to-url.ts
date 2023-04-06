import { diskStorage } from 'multer';

import { FileStorage } from './file-storage';

export function transformToUrl(resourceTag: string, value: string): string {
    if (!value) return;

    const fileStorage = new FileStorage(resourceTag);

    return fileStorage.generateUrl(value);
}