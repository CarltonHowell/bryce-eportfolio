import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Case studies shown in "Selected Work" (and unlisted stories such as the Trail Log). */
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      category: z.string(),
      order: z.number(),
      listed: z.boolean().default(true),
      tags: z.array(z.string()),
      cover: image(),
      coverAlt: z.string(),
      summary: z.string(),
      meta: z.array(z.object({ label: z.string(), value: z.string() })).length(4),
      intentionsLabel: z.string().default('(LEARNING INTENTIONS)'),
      intentions: z.array(z.string()),
      approach: z.array(z.object({ title: z.string(), body: z.string() })),
      part: z.object({
        label: z.string(),
        title: z.string(),
        body: z.string(),
        framing: z.array(z.object({ label: z.string(), body: z.string() })).default([]),
        stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
        gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      }),
    }),
});

export const collections = { work };
