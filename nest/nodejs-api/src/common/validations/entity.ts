import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { getRepository } from 'typeorm';

@ValidatorConstraint({async: true})
export class Entity implements ValidatorConstraintInterface {
    public async validate(value: any, args: ValidationArguments): Promise<boolean> {
        if (!value) {
            return true;
        }
        return await getRepository(args.constraints[0]).findOne({[args.constraints[1] || args.property]: value})
            .then(obj => !!obj);
    }

    public defaultMessage(args: ValidationArguments): string {
        return `$constraint0 with ${args.constraints[1] || args.property} $value doesn't exist`;
    }
}

export function IsEntity(entityClass: string, property?: string, validationOptions?: ValidationOptions): any {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: property ? [entityClass, property] : [entityClass],
            validator: Entity,
        });
    };
}
