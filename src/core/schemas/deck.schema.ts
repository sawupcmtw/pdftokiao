import { z } from 'zod'

/**
 * Valid word types for vocabulary cards
 * Based on IMPORT_API.md specification
 */
export const WordTypeSchema = z.enum([
  'n',
  'n[C]',
  'n[U]',
  'adj',
  'v',
  'vi',
  'vt',
  'adv',
  'prep',
  'phrase',
  'conj',
  'aux',
  'int',
  'pron',
  'det',
  'art',
  'abbr',
])

/**
 * Schema for a single explanation entry within a card
 * Contains translations, example sentences, synonyms, etc.
 */
export const CardExplanationSchema = z.object({
  /** Translations/definitions of the word */
  translations: z.array(z.string()),

  /** Example sentences using the word */
  sentences: z.array(z.string()),

  /** Synonyms */
  synonyms: z.array(z.string()),

  /** Antonyms */
  antonyms: z.array(z.string()),

  /** Similar words */
  similars: z.array(z.string()),

  /** Word types (parts of speech) */
  word_types: z.array(WordTypeSchema),

  /** Additional notes for this explanation */
  notes: z.array(z.string()).optional(),
})

/**
 * Schema for card text content containing multiple explanations
 */
export const CardTextContentSchema = z.object({
  /** Array of explanations (one word can have multiple meanings) */
  explanations: z.array(CardExplanationSchema),
})

/**
 * Schema for card attributes
 */
export const CardAttributesSchema = z.object({
  /** The vocabulary word */
  word: z.string(),

  /** Text content with explanations */
  text_content: CardTextContentSchema,

  /** Tags for categorization */
  tags: z.array(z.string()),

  /** Word root/etymology */
  word_root: z.string().nullable(),

  /** Additional notes */
  notes: z.array(z.string()),
})

/**
 * Schema for a single vocabulary card
 */
export const CardSchema = z.object({
  attributes: CardAttributesSchema,
})

/**
 * Schema for Deck attributes
 */
export const DeckAttributesSchema = z.object({
  /** Name of the deck */
  name: z.string(),

  /** Description of the deck */
  description: z.string(),

  /** Import key (UUID format recommended) */
  import_key: z.string().min(1),

  /** Last review time (null for new decks) */
  last_review_time: z.string().nullable().optional(),

  /** IDs of removed cards */
  removed_card_ids: z.array(z.number()).optional(),

  /** Reference deck ID */
  ref_deck_id: z.number().nullable().optional(),

  /** Whether this deck is referenced */
  is_referenced: z.boolean().optional(),

  /** Discarded timestamp */
  discarded_at: z.string().nullable().optional(),

  /** IDs of starred cards */
  starred_card_ids: z.array(z.number()).optional(),

  /** Familiarity level */
  familiarity: z.number().nullable().optional(),

  /** Whether previewable */
  previewable: z.boolean().optional(),

  /** Study due date */
  study_due_on: z.string().nullable().optional(),

  /** Position in the material */
  position: z.number().int().positive().optional(),

  /** Count of mastered cards */
  mastered_cards_count: z.number().int().nonnegative().optional(),

  /** Whether this is the default deck */
  is_default: z.boolean().optional(),
})

/**
 * Schema for the complete Deck output
 * Matches the Kiao import API format for deck type
 */
export const DeckSchema = z.object({
  /** Type identifier */
  type: z.literal('deck'),

  /** Deck attributes */
  attributes: DeckAttributesSchema,

  /** Array of vocabulary cards */
  cards: z.array(CardSchema),
})

/**
 * Schema for Deck data wrapper (matches import API structure)
 */
export const DeckDataSchema = z.object({
  data: DeckSchema,
})

// Export inferred types
export type WordType = z.infer<typeof WordTypeSchema>
export type CardExplanation = z.infer<typeof CardExplanationSchema>
export type CardTextContent = z.infer<typeof CardTextContentSchema>
export type CardAttributes = z.infer<typeof CardAttributesSchema>
export type Card = z.infer<typeof CardSchema>
export type DeckAttributes = z.infer<typeof DeckAttributesSchema>
export type Deck = z.infer<typeof DeckSchema>
export type DeckData = z.infer<typeof DeckDataSchema>
