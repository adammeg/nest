import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { getRepository } from 'typeorm';

@ValidatorConstraint({async: true})
export class Unique implements ValidatorConstraintInterface {
    public async validate(value: any, args: ValidationArguments): Promise<boolean> {
        if (!value) {
            return true;
        }

        return await getRepository(this.extractEntityClass(args)).findOne({[args.property]: value})
            .then(obj => {
                return !obj || (!!args.object[`id`] && args.object[`id`] === obj[`id`]);
            });
    }

    public defaultMessage(args: ValidationArguments): string {
        return `${this.extractEntityClass(args)} with ${args.property} $value is already existing`;
    }

    private extractEntityClass(args: ValidationArguments): string {
        let entityClass = args.constraints[0] || args.targetName;

        if (entityClass.substr(-3).toLowerCase() === 'dto') {
            entityClass = entityClass.slice(0, -3);
        }

        return entityClass;
    }
}

export function IsUnique(entityClass?: string, validationOptions?: ValidationOptions): any {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: entityClass ? [entityClass] : [],
            validator: Unique,
        });
    };
}
