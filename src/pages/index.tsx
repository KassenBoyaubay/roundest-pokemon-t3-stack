import { type NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import Layout from "../../components/layout";
import { getOptionsForVote } from "../utils/getRandomPokemon";

import { type RouterOutputs, trpc } from "../utils/trpc";

const btn = "bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-white-500 hover:border-transparent rounded";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.pokemon.getById.useQuery({ id: first });
  const secondPokemon = trpc.pokemon.getById.useQuery({ id: second });

  const hello = trpc.example.hello.useQuery({ text: "from tRPC. It is working." });

  const voteMutation = trpc.pokemon.castVote.useMutation();

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected: number) => {
    // todo: fire mutation to persist changes
    if (selected == first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    updateIds(getOptionsForVote());
  }

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data

  return (
    <Layout>
      {dataLoaded &&
        (
          <div className="p-8 flex justify-between items-center max-w-2xl">
            <PokemonListing pokemon={firstPokemon.data} vote={() => voteForRoundest(first)} />
            <div className="p-8">Vs</div>
            <PokemonListing pokemon={secondPokemon.data} vote={() => voteForRoundest(second)} />
          </div>
        )}
      {!dataLoaded && (<Image width={192} height={192} src="/rings.svg" alt="loading" />)}
      <p className="text-2xl text-white">
        {hello.data ? hello.data.greeting : "Loading tRPC query..."}
      </p>
    </Layout>
  );
};

type PokemonFromServer = RouterOutputs["pokemon"]["getById"];

const PokemonListing: React.FC<{ pokemon: PokemonFromServer, vote: () => void }> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <Image width={256} height={256} src={props.pokemon.spriteUrl ?? ''} alt="first pokemon" />
      <div className="text-xl text-center capitalize mb-4">
        {props.pokemon.name}
      </div>
      <button className={btn} onClick={() => props.vote()}>Rounder</button>
    </div>
  )
}

export default Home;
