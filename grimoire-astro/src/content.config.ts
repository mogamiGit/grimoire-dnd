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
        clase: z.string().optional(),
        raza: z.string().optional(),
        estado: z.string().optional(),
        alineamiento: z.string().optional(),
        nickname: z.string().optional(),
        personalidad: z
          .object({
            flexible_adoquin: z.number().nullable().optional(),
            miedica_temerario: z.number().nullable().optional(),
            desaborido_ladino: z.number().nullable().optional(),
            discapacidades_avispado: z.number().nullable().optional(),
            negado_acrobatico: z.number().nullable().optional(),
            sensato_lunatico: z.number().nullable().optional(),
          })
          .optional(),
        origen: z.string().optional(),
        ideales: z.string().optional(),
        lazos: z.string().optional(),
        defectos: z.string().optional(),
        puntos_fuertes: z.array(z.string()).optional(),
        puntos_debiles: z.array(z.string()).optional(),
        // Diary fields
        description: z.string().optional(),
        location: z.string().optional(),
        campaign_day: z.number().optional(),
        aliases: z.array(z.string()).optional(),
      }),
    }),
  }),
};
