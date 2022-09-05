import { v4 as uuidV4 } from 'uuid';

export class Client<T> {

  id: string;
  props: T;

  constructor(props: T, id?: string) {

    this.props = props;
    this.id = id === undefined ? uuidV4() : id;
  }
}