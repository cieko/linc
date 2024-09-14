
import { Post } from "@/mongodb/models/post";
import { SignedIn } from "@clerk/nextjs";
import connectDB from "@/mongodb/db";

import UserInformation from "@/components/live/home/UserInformation";
import PostForm from "@/components/live/home/PostForm";
import Widget from "@/components/live/home/Widget";
import PostFeed from "@/components/live/home/PostFeed";

export const revalidate = 0;

export default async function Home() {
  await connectDB();
  // const posts = await Post.getAllPosts()

  return (
    <article className="max-w-6xl mx-auto grid grid-cols-8  mt-5 sm:px-5">
      <section className="hidden md:inline md:col-span-2">
        <UserInformation posts={[]} />
      </section>

      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">
        <SignedIn>
          <PostForm />
        </SignedIn>
        <PostFeed posts={[]} />
      </section>

      <section className="hidden xl:inline justify-center col-span-2 ml-5">
        <Widget />
      </section>
    </article>
  );
}
