import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import { PokemonClient } from "pokenode-ts";

export const pokemonRouter = router({
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const api = new PokemonClient();
            const pokemon = await api.getPokemonById(input.id);
            return { name: pokemon.name, sprites: pokemon.sprites };
        })
});
