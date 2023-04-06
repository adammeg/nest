import { fixtureCreator } from 'typeorm-fixtures';
import * as faker from 'faker';

import { User } from 'user/models';

export const createUsersFixture = fixtureCreator<User>(User, (entity, index) => {
    const gender = faker.random.number(1);
    const enabled = faker.random.boolean();
    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName(gender);
    const email = faker.internet.email(firstName, lastName);
    const userName = faker.internet.userName(firstName, lastName);

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.username = userName;
    user.plainPassword = '12345678';
    user.enabled = enabled;
    user.roles.push(User.ROLE_AUTHOR);
    user.hashPassword();

    return { ...user, ...entity };
});
