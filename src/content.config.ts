import { defineCollection } from "astro:content";
import { badgers as dataBadgers } from "./data/badger";
import { rhBadgers as dataRhBadgers } from "./data/rhBadger";
import { z } from "zod";

const websiteSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
});

const sessionSchema = z.object({
  title: z.string(),
  abstract: z.string().optional(),
  tags: z.array(z.string()).optional(),
  lang: z.array(z.string()).optional(),
});

const contactsSchema = z.object({
  twitter: z.string().optional(),
  mail: z.string().optional(),
});

const speakerSchema = z.object({
  since: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid date format (expected YYYY-MM-DD)",
  }),
  name: z.string(),
  bio: z.string(),
  picture: z.string().optional(),
  websites: z.array(websiteSchema).optional(),
  location: z.string().optional(),
  sessions: z.array(sessionSchema),
  cities: z.array(z.string()),
  contacts: contactsSchema,
});

export type Speaker = z.infer<typeof speakerSchema>;

export const badgers = defineCollection({
  loader: () =>
    Promise.resolve(dataBadgers.speakers.map((d) => ({ id: d.name, ...d }))),
  schema: speakerSchema,
});

export const rhBadgers = defineCollection({
  loader: () =>
    Promise.resolve(dataRhBadgers.speakers.map((d) => ({ id: d.name, ...d }))),
  schema: speakerSchema,
});

export const collections = { badgers, rhBadgers };
