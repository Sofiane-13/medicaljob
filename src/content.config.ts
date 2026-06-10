import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(75, 'Titre trop long pour le SEO (max 75 chars)'),
    description: z
      .string()
      .min(110, 'Meta description trop courte (min 110 chars)')
      .max(175, 'Meta description trop longue (max 175 chars)'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().default('MedicalJob'),
    tags: z.array(z.string()).default([]),
    /** Cluster SEO */
    cluster: z
      .enum(['statut', 'remuneration', 'pratique', 'sectoriel', 'general'])
      .default('general'),
    /** Mot-clé principal ciblé */
    targetKeyword: z.string().optional(),
    /** Article épinglé en haut du blog */
    featured: z.boolean().default(false),
    /** Temps de lecture estimé */
    readingTime: z.string().optional(),
  }),
});

export const collections = { blog };
