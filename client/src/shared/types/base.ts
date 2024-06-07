export interface IBaseUpdate {
  id: number;
}

export type UnknownObj = { [key: string]: any };

export type Modify<T, R> = Omit<T, keyof R> & R;

export type TResponseWithPagiSimple<T> = {
  data: T;
  pagi: { totalItems: number };
};
