import { PaginationFilter } from 'common/filters';
import { User } from 'user/models';

export class NotesFilter extends PaginationFilter {
  public user: User;
}