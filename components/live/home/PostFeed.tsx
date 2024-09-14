import { IPostDocument } from "@/mongodb/models/post";
import Post from "./Post";

async function PostFeed({ posts }: { posts: IPostDocument[] }) {
  return (
    <div className="space-y-2 pb-20">
      {posts ? posts?.map((post, index) => (
        <Post key={index} post={post} />
      )) : null}
    </div>
  );
}

export default PostFeed;