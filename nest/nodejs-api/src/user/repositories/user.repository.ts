import { PaginationFilter } from 'common/filters';
import { EntityRepository, Repository } from 'typeorm';

import { User } from '../models';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    /**
     * Find users with filter query builder
     * 
     * @param {PaginationFilter} filter 
     * @returns {Promise<User[]>}
     */
    public findUsersWithFilterQueryBuilder(filter: PaginationFilter): Promise<User[]> {
        const queryBuilder = this.createQueryBuilder('u');

        const users = queryBuilder
            .orderBy('u.createdDate', filter.order)
            .offset(filter.start)
            .limit(filter.limit)
            .getMany()
            
        return users;
    }
}
