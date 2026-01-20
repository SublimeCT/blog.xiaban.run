import { defineCollection, z } from "astro:content";

/**
 * 文章内容集合配置
 * @returns {import("astro:content").SchemaContext}
 */
const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
/**
 * 规范说明集合配置
 * @returns {import("astro:content").SchemaContext}
 */
const specCollection = defineCollection({
	schema: z.object({}),
});
/**
 * 内容集合映射
 * @type {Record<string, ReturnType<typeof defineCollection>>}
 */
export const collections: Record<
	string,
	ReturnType<typeof defineCollection>
> = {
	posts: postsCollection,
	spec: specCollection,
};
