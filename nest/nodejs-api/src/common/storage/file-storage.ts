import { S3 } from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { diskStorage } from 'multer';
import * as  mime from 'mime-types';
import * as crypto from 'crypto';

import { config } from '../config';
import { resources } from './resources';
import { ApiException, ErrorCodes } from '../errors';

export class FileStorage {
    private resource;
    public storage;
    public limits;
    public fileFilter;

    constructor(resourceTag: string) {
        this.resource = resources[resourceTag];

        if (this.resource === undefined) {
            throw new Error('Invalid resource tag');
        }

        this.storage = this.getStorage();
        this.limits = this.getLimits();
        this.fileFilter = (req, file, cb) => this.filter(req, file, cb);
    }

    public filter(request, file, cb) {
        let accept = true;
        let error: ApiException;

        if (this.resource.extensions) {
            accept = this.resource.extensions.includes(mime.extension(file.mimetype));
        }

        error = accept ? null : new ApiException(ErrorCodes.INVALID_FILE);

        cb(error, accept);
    }

    public generateUrl(value: string): string {
        switch (config.app.storageSystem) {
            case 'local':
                return `${config.app.serverHost}/${this.resource.destinationFolder}${value}`;
            case 'aws_s3':
                return `https://${config.awsS3.bucket}.s3.${config.awsS3.region}.amazonaws.com/${this.resource.destinationFolder}${value}`;
            default:
                return value;
        }
    }

    private getStorage() {
        switch (config.app.storageSystem) {
            case 'local':
                return diskStorage({
                    destination: config.app.localUploadFolder,
                    filename: (req, file, cb) => this.generateFilename(req, file, cb),
                });
            case 'aws_s3':
                return multerS3({
                    s3: new S3(),
                    bucket: config.awsS3.bucket,
                    acl: this.resource.publicAccess ? 'public-read' : 'private',
                    key: (req, file, cb) => this.generateFilename(req, file, cb),
                });
        }
    }

    private generateFilename(request, file, cb) {
        crypto.randomBytes(16, (err, raw) => {
            if (err) {
                cb(err, undefined);
            }

            const prefix = this.resource.destinationFolder ? this.resource.destinationFolder : '';
            const filename = `${raw.toString('hex')}.${mime.extension(file.mimetype)}`;
            file.basename = filename;
            cb(undefined, prefix + filename);
        });
    }

    private getLimits() {
        return {
            fileSize: this.resource.maxsize,
        };
    }
}