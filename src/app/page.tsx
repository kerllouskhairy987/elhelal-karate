import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Post } from "@prisma/client";

export default async function Home() {
  const posts = await prisma.post.findMany();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <ModeToggle />
      <Button>Btn From ShanCn UI</Button>

      <div className="flex bg-red-500 gap-10">
        <h1>Posts</h1>
        <ul className="flex gap-10">
          {posts.map((post: Post) => (
            <div key={post.id}>
              <li>{post.id}</li>
              <li>{post.title}</li>
              <li>{post.content ? post.content : "No Content"}</li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
