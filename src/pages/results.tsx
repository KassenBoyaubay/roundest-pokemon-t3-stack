import type { GetServerSideProps } from "next"
import Image from "next/image"
import { prisma } from "../server/db/client"
import type { AsyncReturnType } from "../utils/ts-bs"

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

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>

export const getStaticProps: GetServerSideProps = async () => {
    const pokemonOrdered = await getPokemonInOrder();
    return { props: { pokemon: pokemonOrdered }, revalidate: 60 }
}

const ResultsPage: React.FC<{ pokemon: PokemonQueryResult }> = (props) => {
    return <div className="flex flex-col items-center">
        <h1 className="text-2xl p-4">Results</h1>
        <div className="flex flex-col w-full max-w-2xl border">
            {props.pokemon.map((currentPokemon, index) => {
                return <PokemonListing pokemon={currentPokemon} key={index} />
            })}
        </div>
    </div>
}

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = (props) => {
    return <div className="flex border-b p-2 items-center">
        <Image width={64} height={64} src={props.pokemon.spriteUrl ?? ''} alt="pokemon" />
        <div className="capitalize">{props.pokemon.name}</div>
    </div>
}
export default ResultsPage;