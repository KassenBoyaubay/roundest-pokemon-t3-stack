import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import { PokemonClient } from "pokenode-ts";

import { prisma } from "../../db/client"
import { TRPCError } from "@trpc/server";

export const pokemonRouter = router({
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const pokemon = await prisma.pokemon.findFirst({ where: { id: input.id } })
            if (!pokemon) throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'pokemon doesn\'t exist',
            })
            return pokemon;
        })
    ,
    castVote: publicProcedure
        .input(z.object({ votedFor: z.number(), votedAgainst: z.number() }))
        .mutation(async ({ input }) => {
            const voteInDb = await prisma.vote.create({
                data: {
                    votedAgainstId: input.votedAgainst,
                    votedForId: input.votedFor
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
