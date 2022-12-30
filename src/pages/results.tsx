import type { GetServerSideProps } from "next"
import Image from "next/image"
import { prisma } from "../server/db/client"
import type { AsyncReturnType } from "../utils/ts-bs"

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>

const getPokemonInOrder = async () => {
    return await prisma.pokemon.findMany({
        orderBy: {
            VoteFor: {
                _count: "desc"
            }
        },
        select: {
            id: true,
            name: true,
            spriteUrl: true,
            _count: {
                select: {
                    VoteFor: true,
                    VoteAgainst: true
                }
            }
        }
    })
}

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
    const { VoteFor, VoteAgainst } = pokemon._count;
    if (VoteFor + VoteAgainst === 0) {
        return 0;
    }
    return (VoteFor / (VoteFor + VoteAgainst)) * 100;
}

export const getStaticProps: GetServerSideProps = async () => {
    const pokemonOrdered = await getPokemonInOrder();
    return { props: { pokemon: pokemonOrdered }, revalidate: 60 }
}

const ResultsPage: React.FC<{ pokemon: PokemonQueryResult }> = (props) => {
    return <div className="flex flex-col items-center">
        <h1 className="text-2xl p-4">Results</h1>
        <div className="flex flex-col w-full max-w-2xl border">
            {props.pokemon.sort((a, b) => generateCountPercent(b) - generateCountPercent(a)).map((currentPokemon, index) => {
                return <PokemonListing pokemon={currentPokemon} key={index} />
            })}
        </div>
    </div>
}

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({ pokemon }) => {
    return <div className="flex border-b p-2 items-center justify-between">
        <div className="flex items-center">
            <Image width={64} height={64} src={pokemon.spriteUrl ?? ''} alt="pokemon" />
            <div className="capitalize">{pokemon.name}</div>
        </div>
        <div className="pr-4">{generateCountPercent(pokemon).toFixed(2) + "%"}</div>
    </div>
}
export default ResultsPage;