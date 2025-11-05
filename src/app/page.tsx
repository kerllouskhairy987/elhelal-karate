import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";

export default async function Home() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <ModeToggle />
      <Button>Btn From ShanCn UI</Button>

      <div className="flex bg-red-500 gap-10">
        <h1>Posts</h1>
        <ul className="flex gap-10">
          {[1, 2,3].map((post) => (
            <div key={post}>
              <li>{post}</li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
