import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const citySchema = z.object({
  name: z.string(),
  ville_img: z.string(),
  lat: z.number(),
  lng: z.number(),
  number: z.number(),
});

export type City = z.infer<typeof citySchema>;

const cities = defineCollection({
  loader: async () => {
    const { cities } = await import("./data/cities");
    const { speakers } = await import("./data/bagger");
    return cities
      .sort((c1, c2) => c1.name.localeCompare(c2.name))
      .map((city) => ({
        ...city,
        id: city.name.toLowerCase().replace(/\s+/g, "-"),
        number: speakers.filter((s) => s.location === city.name).length,
      }))
      .filter((c) => c.number > 0);
  },
  schema: citySchema,
});

const speakerSchema = z.object({
  name: z.string(),
  bio: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  picture: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url().optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  mastodon: z.string().optional(),
  sessions: z
    .array(
      z.object({
        title: z.string(),
        abstract: z.string().optional(),
        lang: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .optional(),
});
const speakers = defineCollection({
  schema: speakerSchema,
  loader: async () => {
    const { speakers } = await import("./data/bagger");
    return speakers
      .map((s) => ({ ...s, id: s.name.toLowerCase().replace(/\s+/g, "-") }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
});

export type Speaker = z.infer<typeof speakerSchema>;
export const collections = { cities, speakers };
