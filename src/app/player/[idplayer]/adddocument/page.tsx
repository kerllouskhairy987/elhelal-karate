import { getPlayerById } from "@/db/getAllTraner";
import { Player, Image } from "@prisma/client";
import Form from "./_components/Form";
type PlayerWithImages = Player & {
  images: Image[];
};
export default async function page({
  params,
}: {
  params: Promise<{ idplayer: string }>;
}) {
  const { idplayer } = await params;
  const player = await getPlayerById(Number(idplayer));

  return (
    <main className="container mx-auto  Navbar-gap mt-26">
      <Form player={player as PlayerWithImages} playerId={idplayer} />
    </main>
  );
}
