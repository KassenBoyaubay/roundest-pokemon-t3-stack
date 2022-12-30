import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import { PokemonClient } from "pokenode-ts";

import { prisma } from "../../db/client"

export const pokemonRouter = router({
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const api = new PokemonClient();
            const pokemon = await api.getPokemonById(input.id);
            return { name: pokemon.name, sprites: pokemon.sprites };
        })
    ,
    castVote: publicProcedure
        .input(z.object({ votedForId: z.number(), votedAgainstId: z.number() }))
        .mutation(async ({ input }) => {
            const voteInDb = await prisma.vote.create({
                data: {
                    ...input
                }
            })
            return { success: true, vote: voteInDb };
        })
    ,
    populatePokemons: publicProcedure
        .mutation(async () => {
            const pokeApi = new PokemonClient();

            const allPokemon = await pokeApi.listPokemons(0, 493);

            const formattedPokemon = allPokemon.results.map((p, index) => ({
                id: index + 1,
                name: (p as { name: string }).name,
                spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
            }))

            const creation = await prisma.pokemon.createMany({
                data: formattedPokemon
            })
            return { success: true, pokemon: creation };
        })
});
