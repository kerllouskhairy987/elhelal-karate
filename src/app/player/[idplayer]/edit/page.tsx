import { getAllTraner, getPlayerById } from "@/db/getAllTraner";
import Form from "../../add/_components/Form";
import { Player } from "@prisma/client";

export default async function page({
  params,
}: {
  params: Promise<{ idplayer: string }>;
}) {
  const { idplayer } = await params;
  const traners = await getAllTraner();
  const player = await getPlayerById(Number(idplayer));

  return (
    <main className="container mx-auto  Navbar-gap mt-26">
      <Form trainers={traners} player={player as Player} />
    </main>
  );
}
