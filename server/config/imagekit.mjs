import fs from "fs";
import ImageKit from "imagekit";

const uploadOnImageKit = async (localFilePath) => {
  if (!localFilePath) {
    return { error: "No file path provided" };
  }

  if (!fs.existsSync(localFilePath)) {
    return { error: "File not found" };
  }

  try {
    const imagekit = new ImageKit({
      publicKey: "public_Q4pHmPHXyK6MsGMcZkfKNZPSuNM=",
      privateKey: "private_wHqUi6dEdk0iXg9mlZqsqoU8+FA=",
      urlEndpoint: "https://ik.imagekit.io/7iqy97dse",
    });

    const fileName = localFilePath.split("/").pop();

    const data = fs.readFileSync(localFilePath);

    // Convert imagekit.upload to a Promise
    const uploadPromise = new Promise((resolve, reject) => {
      imagekit.upload(
        { file: data, fileName: fileName },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.url);
          }
        }
      );
    });

    const uploadResult = await uploadPromise;
    console.log(uploadResult);
    return uploadResult;
  } catch (err) {
    try {
      await fs.promises.unlink(localFilePath);
    } catch (unlinkError) {
      console.error("Error deleting local file:", unlinkError);
    }

    return {
      error: "Internal error during image upload",
      details: err.message,
    };
  }
};

export default uploadOnImageKit;