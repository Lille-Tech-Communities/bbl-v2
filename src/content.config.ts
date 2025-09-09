import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { speakers as speakersData } from "./data/bagger";
import { cities as citiesData } from "./data/cities";

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
    return citiesData
      .sort((c1, c2) => c1.name.localeCompare(c2.name))
      .map((city) => ({
        ...city,
        id: city.name.toLowerCase().replace(/\s+/g, "-"),
        number: speakersData.filter((s) => s.location === city.name).length,
      }))
      .filter((c) => c.number > 0);
  },
  schema: citySchema,
});

const speakerSchema = z.object({
  name: z.string(),
  bio: z.string(),
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
        abstract: z.string(),
        lang: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .optional(),
});

const speakers = defineCollection({
  schema: speakerSchema,
  loader: async () => {
    return speakersData
      .map((s) => ({ ...s, id: s.name.toLowerCase().replace(/\s+/g, "-") }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
});

export type Speaker = z.infer<typeof speakerSchema>;
export const collections = { cities, speakers };
