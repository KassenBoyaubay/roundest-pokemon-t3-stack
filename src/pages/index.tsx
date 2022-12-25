import { type NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { getOptionsForVote } from "../utils/getRandomPokemon";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.pokemon.getById.useQuery({ id: first });
  const secondPokemon = trpc.pokemon.getById.useQuery({ id: second });

  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  if (!firstPokemon.data || !secondPokemon.data) return null;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center m-2">Which Pokemon is Rounder?</div>
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="w-64 h-64 flex flex-col">
          <Image width={96} height={96} className="w-full" src={firstPokemon.data?.sprites.front_default ?? ''} alt="first pokemon" />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {firstPokemon.data?.name}
          </div>
        </div>
        <div className="p-8">Vs</div>
        <div className="w-64 h-64 flex flex-col">
          <Image width={96} height={96} className="w-full" src={secondPokemon.data?.sprites.front_default ?? ''} alt="second pokemon" />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {secondPokemon.data?.name}
          </div>
        </div>
      </div>
      <p className="text-2xl text-white">
        {hello.data ? hello.data.greeting : "Loading tRPC query..."}
      </p>
    </div>
  );
};

export default Home;
