import { type NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { getOptionsForVote } from "../utils/getRandomPokemon";

import { trpc } from "../utils/trpc";

const btn = "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.pokemon.getById.useQuery({ id: first });
  const secondPokemon = trpc.pokemon.getById.useQuery({ id: second });

  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  if (!firstPokemon.data || !secondPokemon.data) return null;

  const voteForRoundest = (selected: number) => {
    // todo: fire mutation to persist changes

    updateIds(getOptionsForVote());
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center m-2">Which Pokemon is Rounder?</div>
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="w-64 h-64 flex flex-col items-center">
          <Image width={96} height={96} className="w-full" src={firstPokemon.data?.sprites.front_default ?? ''} alt="first pokemon" />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {firstPokemon.data?.name}
          </div>
          <button className={btn} onClick={() => voteForRoundest(first)}>Rounder</button>
        </div>
        <div className="p-8">Vs</div>
        <div className="w-64 h-64 flex flex-col items-center">
          <Image width={96} height={96} className="w-full" src={secondPokemon.data?.sprites.front_default ?? ''} alt="second pokemon" />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {secondPokemon.data?.name}
          </div>
          <button className={btn} onClick={() => voteForRoundest(second)}>Rounder</button>
        </div>
      </div>
      <p className="text-2xl text-white">
        {hello.data ? hello.data.greeting : "Loading tRPC query..."}
      </p>
    </div>
  );
};

export default Home;
