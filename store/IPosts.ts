interface IPosts {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface IPostsPayload {
  userId?: number;
  id?: number;
  title: string;
  body: string;
}

export interface IDataPosts {
  loading: boolean;
  data: IPosts[];
}

export interface IPostsStore extends IDataPosts {
  loadPosts(): void;
  addPosts(payload: IPostsPayload): Promise<number>;
  editPosts(payload: IPostsPayload): Promise<number>;
  deletePosts(id?: number): Promise<number>;
}