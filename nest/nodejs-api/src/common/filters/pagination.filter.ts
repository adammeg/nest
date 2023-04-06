import { ApiModelProperty } from '@nestjs/swagger';

export class PaginationFilter {
  @ApiModelProperty({default: 0})
  private _start: number = 0;

  @ApiModelProperty({default: 10})
  private _limit: number = 10;

  @ApiModelProperty({default: 'ASC'})
  public order: 'ASC' | 'DESC' = 'ASC';

  set start(value: any) {
    this._start = parseInt(value, 10);
  }

  get start() {
    return parseInt(this._start as any, 10);
  }

  set limit(value: any) {
    this._limit = parseInt(value, 10);
  }

  get limit() {
    return parseInt(this._limit as any, 10);
  }
}