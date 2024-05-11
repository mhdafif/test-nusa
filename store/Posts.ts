import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IDataPosts, IPostsPayload, IPostsStore } from "./IPosts";

const initialState: IDataPosts = {
  loading: false,
  data: [],
};
const base_url =
  process.env.BASE_URL || "https://jsonplaceholder.typicode.com";

const usePostsStore = create<IPostsStore>()(
  devtools((set, get) => ({
    ...initialState,
    loadPosts: async () => {
      set({ loading: true });
      try {
        const response = await fetch(base_url + "/posts");
        const data = await response.json();
        set({
          data,
        });
      } finally {
        set({ loading: false });
      }
    },
    addPosts: async (payload: IPostsPayload) => {
      set({ loading: true });
      try {
        const response = await fetch(base_url + "/posts", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        const newPost = await response.json();
        const status = await response.status;
        const temp = get().data || [];
        set({
          data: [newPost, ...temp],
        });
        return status;
      } finally {
        set({ loading: false });
      }
    },
    editPosts: async (payload: IPostsPayload) => {
      set({ loading: true });
      try {
        const response = await fetch(base_url + "/posts/" + payload.id, {
          method: "PUT",
          body: JSON.stringify(payload),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        const updatedPost = await response.json();
        const status = await response.status;
        const temp = get().data || [];
        set({
          data: temp.map((post) =>
            post.id === payload.id ? updatedPost : post
          ),
        });
        return status;
      } finally {
        set({ loading: false });
      }
    },
    deletePosts: async (id: number) => {
      set({ loading: true });
      try {
        const response = await fetch(base_url + "/posts/" + id, {
          method: "DELETE",
        });
        const status = await response.status;
        const temp = get().data || [];
        set({
          data: temp.filter((post) => post.id !== id),
        });
        return status;
      } finally {
        set({ loading: false });
      }
    },
  }))
);

export default usePostsStore;
