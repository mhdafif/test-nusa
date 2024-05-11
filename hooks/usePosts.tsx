/* eslint-disable react-hooks/exhaustive-deps */
import { IPostsPayload } from "@/store/IPosts";
import usePostsStore from "@/store/Posts";
import { useEffect, useState } from "react";

interface IModal {
  isOpen: boolean;
  type?: string;
  initialData?: IPostsPayload;
}

const usePosts = () => {
  /*======================== Store ======================== */

  const { data, loadPosts } = usePostsStore();

  /*======================== UseState ======================== */

  const [modal, setModal] = useState<IModal>({
    isOpen: false,
    type: "",
    initialData: undefined,
  });

  /*======================== Handler ======================== */

  const handleAddPost = () => {
    setModal({
      isOpen: true,
      type: "add",
      initialData: undefined,
    });
  };
  const handleEditPost = (post: IPostsPayload) => {
    setModal({
      isOpen: true,
      type: "edit",
      initialData: post,
    });
  };

  const handleDeletePost = (post: IPostsPayload) => {
    setModal({
      isOpen: true,
      type: "delete",
      initialData: post,
    });
  };

  const handleClose = () => {
    setModal({
      isOpen: false,
      type: "",
      initialData: undefined,
    });
  };

  /*======================== UseEffect ======================== */

  useEffect(() => {
    if (data.length < 1) {
      loadPosts();
    }
  }, []);

  /*======================== Return ======================== */

  return {
    modal,
    handleAddPost,
    handleEditPost,
    handleDeletePost,
    handleClose,
  };
};

export default usePosts;
