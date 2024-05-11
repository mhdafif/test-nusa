/* eslint-disable react-hooks/exhaustive-deps */
import { IPostsPayload } from "@/store/IPosts";
import usePostsStore from "@/store/Posts";
import { Close } from "@mui/icons-material";
import { Button, Modal, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

interface IProps {
  isOpen: boolean;
  type?: string;
  initialData?: IPostsPayload;
  onClose(): void;
}

const ModalPosts = (props: IProps) => {
  /*======================== Props ======================== */

  const { isOpen, type, initialData, onClose } = props;

  /*======================== Store ======================== */

  const { loading, addPosts, editPosts, deletePosts } = usePostsStore();

  /*======================== UseState ======================== */

  const [formValue, setFormValue] = useState<IPostsPayload>({
    id: undefined,
    userId: 1,
    title: "",
    body: "",
  });

  /*======================== Handler ======================== */

  const handleChange = (type: string, value: string) => {
    setFormValue({
      ...formValue,
      [type]: value,
    });
  };

  const handleSubmit = async () => {
    switch (type) {
      case "edit":
        {
          const resStatus = await editPosts(formValue);
          if (resStatus === 201) {
            handleClose();
          }
        }
        break;
      case "delete":
        {
          const resStatus = await deletePosts(formValue.id);
          if (resStatus === 200) {
            handleClose();
          }
        }
        break;

      default:
        {
          const resStatus = await addPosts(formValue);
          if (resStatus === 201) {
            handleClose();
          }
        }
        break;
    }
  };
  const handleClose = () => {
    setFormValue({
      id: undefined,
      userId: undefined,
      title: "",
      body: "",
    });
    onClose();
  };

  /*======================== UseEffect ======================== */

  useEffect(() => {
    if (initialData) {
      setFormValue(initialData);
    }
  }, [initialData]);

  /*======================== Return ======================== */

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div className="bg-white max-h-[90%] absolute rounded-10 px-6 pb-6 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[95vw] laptop:w-[90%] laptop:max-w-[540px] overflow-auto">
        <div className="flex justify-between items-center sticky bg-white pt-6 pb-2 top-0">
          <p className="font-semibold text-xl text-black40 capitalize">
            {type} post
          </p>

          <button aria-label="close" onClick={handleClose}>
            <Close />
          </button>
        </div>

        <div className="mt-2 grid gap-2">
          {type !== "delete" ? (
            <>
              <TextField
                label="Title"
                value={formValue.title}
                disabled={loading}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange("title", event.target.value);
                }}
              />
              <TextField
                label="Body"
                value={formValue.body}
                disabled={loading}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange("body", event.target.value);
                }}
              />
            </>
          ) : (
            <p>
              You are about to delete data with title {formValue?.title}. Are
              you sure?
            </p>
          )}

          <Button
            variant="contained"
            color={type === "delete" ? "error" : "primary"}
            className="w-40 ml-auto mt-3"
            disabled={loading || !formValue.body || !formValue.title}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPosts;
