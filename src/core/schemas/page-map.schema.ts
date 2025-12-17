import { z } from 'zod'

/**
 * Schema for individual items included in a page
 */
export const PageItemSchema = z.object({
  /** Type of the item found on the page */
  type: z.string(),

  /** Optional description of the item */
  description: z.string().optional(),

  /** Optional cross-reference ID for items spanning multiple pages */
  crossId: z.string().optional(),
})

/**
 * Schema for PageMap - describes what content is included on each page
 */
export const PageMapSchema = z.object({
  /** Page number */
  page: z.number().int().positive(),

  /** Array of items included on this page */
  included: z.array(PageItemSchema),
})

export type PageItem = z.infer<typeof PageItemSchema>
export type PageMap = z.infer<typeof PageMapSchema>
