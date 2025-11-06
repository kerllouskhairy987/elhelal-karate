import React from "react";
import { getAllTraner } from "@/db/getAllTraner";
import Form from "./_components/Form";

const page = async () => {
  const traners = await getAllTraner();
  console.log(traners);

  return (
    <main className="container mx-auto  Navbar-gap mt-6">
      <Form trainers={traners} />
    </main>
  );
};

export default page;
