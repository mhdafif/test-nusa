import ModalPosts from "@/components/ModalPosts";
import usePosts from "@/hooks/usePosts";
import usePostsStore from "@/store/Posts";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Card, Fab, IconButton, Skeleton, Typography } from "@mui/material";

export default function Home() {
  /*======================== Props ======================== */

  const {
    modal,
    handleAddPost,
    handleEditPost,
    handleDeletePost,
    handleClose,
  } = usePosts();

  /*======================== Store ======================== */

  const { data, loading } = usePostsStore();

  /*======================== Return ======================== */

  return (
    <div className="max-w-screen-desktop py-3 mx-auto relative">
      <div className="grid justify-center gap-3 grid-cols-2 laptop:grid-cols-2">
        {data.length > 0 &&
          data.map((post, index) => (
            <Card data-testid="card-item" key={index} sx={{ padding: 2 }}>
              <div className="flex justify-between gap-5">
                <Typography variant="h5">{post.title}</Typography>
                <div className="flex gap-1">
                  <IconButton
                    aria-label={`edit-${index}`}
                    className="w-10 h-10"
                    color="warning"
                    onClick={() => handleEditPost(post)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    aria-label={`delete-${index}`}
                    className="w-10 h-10"
                    color="error"
                    onClick={() => handleDeletePost(post)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>
              <Typography variant="body1">{post.body}</Typography>
            </Card>
          ))}
        {loading &&
          new Array(8)
            .fill("")
            .map((item, index) => (
              <Skeleton
                data-testid="skeleton"
                key={item + index}
                variant="rectangular"
                height={120}
              />
            ))}
      </div>

      {!loading && (
        <Fab
          className="sticky bottom-6 left-full mr-6"
          color="primary"
          aria-label="add"
          onClick={handleAddPost}
        >
          <Add />
        </Fab>
      )}

      {modal.isOpen && <ModalPosts {...modal} onClose={handleClose} />}
    </div>
  );
}
