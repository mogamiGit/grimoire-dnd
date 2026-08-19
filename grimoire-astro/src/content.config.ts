import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // D&D character fields
        tags: z.array(z.string()).min(1).optional(),
        publish: z.boolean().optional(),
        date: z.coerce.date().optional(),
        class: z.string().optional(),
        race: z.string().optional(),
        sex: z.enum(['femenino', 'masculino']).optional(),
        status: z.string().optional(),
        alignment: z.string().optional(),
        nickname: z.string().optional(),
        personality: z
          .object({
            flexible_stubborn: z.number().nullable().optional(),
            cowardly_reckless: z.number().nullable().optional(),
            dull_cunning: z.number().nullable().optional(),
            clumsy_sharp: z.number().nullable().optional(),
            inept_acrobatic: z.number().nullable().optional(),
            sensible_lunatic: z.number().nullable().optional(),
          })
          .optional(),
        origin: z.string().optional(),
        ideals: z.string().optional(),
        bonds: z.string().optional(),
        flaws: z.string().optional(),
        strengths: z.array(z.string()).optional(),
        weaknesses: z.array(z.string()).optional(),
        // Obituary fields (status: muerto)
        death_date: z.coerce.date().optional(),
        death_cause: z.string().optional(),
        death_location: z.string().optional(),
        epitaph: z.string().optional(),
        // Missing poster fields (status: desaparecido)
        disappearance_date: z.coerce.date().optional(),
        disappearance_location: z.string().optional(),
        reward: z.string().optional(),
        last_seen_wearing: z.string().optional(),
        // Diary fields
        description: z.string().optional(),
        location: z.string().optional(),
        campaign_day: z.number().optional(),
        aliases: z.array(z.string()).optional(),
      }),
    }),
  }),
};
