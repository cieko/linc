"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import generateSASToken, { containerName } from "@/lib/generateSASToken";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { BlobServiceClient } from "@azure/storage-blob";
import {
  // auth, 
  currentUser
} from "@clerk/nextjs/server";
import { randomUUID } from "crypto";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();

  // auth().protect(); <-- aliter

  if (!user) {
    throw new Error("User not authenticated");
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let imageUrl: string | undefined = undefined;

  if (!postInput) {
    throw new Error("post input is required")
  }

  // define user
  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || ""
  }

  // create post in database
  try {

    if (image.size > 0) {
      // 1. upload image if there is one - MS Blob Storage
      // 2. create post in database with image

      console.log("Uploading image to Azure Blob Storage...", image);

      const accountName = process.env.AZURE_STORAGE_NAME;

      const sasToken = await generateSASToken();

      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      // generate current timestamp
      const timestamp = new Date().getTime();
      const file_name = `${randomUUID()}_${timestamp}.png`;

      const blockBlobClient = containerClient.getBlockBlobClient(file_name);

      const imageBuffer = await image.arrayBuffer();
      const res = await blockBlobClient.uploadData(imageBuffer);
      imageUrl = res._response.request.url;

      console.log("File uploaded successfully!", imageUrl);

      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
        imageUrl,
      };

      await Post.create(body);
    } else {
      // 1. create post in database without image

      const body = {
        user: userDB,
        text: postInput,
      };

      await Post.create(body);
    }
  } catch (error: any) {
    throw new Error("Failed to create post", error)
  }

  // revalidate homepage path '/'
}