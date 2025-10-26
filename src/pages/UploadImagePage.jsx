import { useForm } from "react-hook-form";
import { FileInput, Checkbox, Button, Label, Spinner } from "flowbite-react";
import { useInsert, useList, getUrl } from "../hooks/database";
import { useAuth } from "../hooks/useAuth";

export function UploadImagePage() {
  const { register, handleSubmit, watch, reset } = useForm();
  const insert = useInsert("images");
  const { data, isLoading } = useList("images");
  const { user } = useAuth();
  const file = watch("file");

  if (!user) {
    return (
      <div>
        Please add your pocketbase URL and login to use Todo List Database
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  function upload(formData) {
    const file = formData.file;
    if (file && file.length > 0) {
      const { name, size } = file[0];
      insert.call({ name, size, file: file[0] }); // Put the file into the database
      reset();
    }
  }

  function createItem(item) {
    const { id, name, size, file } = item;
    const url = getUrl(item, file);
    return (
      <div key={id} className="flex gap-5">
        <div>{name}</div>
        <a href={url} target="_blank" className="w-96 break-all">
          {url}
        </a>
        <img className="h-40 border border-black shadow-xl" src={url} />
      </div>
    );
  }

  return (
    <div className="grid justify-center gap-4">
      <div className="my-3 text-center text-2xl font-medium">Upload Image</div>
      <form
        onSubmit={handleSubmit(upload)}
        className="flex flex-col justify-center gap-2"
      >
        {file && file[0] && (
          <div className="flex justify-center">
            <img
              className="h-40 border border-black shadow-xl"
              src={URL.createObjectURL(file[0])}
            />
          </div>
        )}
        <div className="flex gap-2">
          <FileInput type="file" {...register("file")} />
          <Button
            type="submit"
            isProcessing={insert.isLoading}
            disabled={insert.isLoading}
          >
            Upload
          </Button>
        </div>
      </form>
      <div>
        <div className="mt-6 text-center text-xl font-medium">
          Uploaded Files:
        </div>
        {data.map(createItem)}
      </div>
    </div>
  );
}
