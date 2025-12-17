import { z } from 'zod';
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
]);
export const CardExplanationSchema = z.object({
    translations: z.array(z.string()),
    sentences: z.array(z.string()),
    synonyms: z.array(z.string()),
    antonyms: z.array(z.string()),
    similars: z.array(z.string()),
    word_types: z.array(WordTypeSchema),
    notes: z.array(z.string()).optional(),
});
export const CardTextContentSchema = z.object({
    explanations: z.array(CardExplanationSchema),
});
export const CardAttributesSchema = z.object({
    word: z.string(),
    text_content: CardTextContentSchema,
    tags: z.array(z.string()),
    word_root: z.string().nullable(),
    notes: z.array(z.string()),
});
export const CardSchema = z.object({
    attributes: CardAttributesSchema,
});
export const DeckAttributesSchema = z.object({
    name: z.string(),
    description: z.string(),
    position: z.number().int().positive().optional(),
});
export const DeckSchema = z.object({
    type: z.literal('deck'),
    attributes: DeckAttributesSchema,
    cards: z.array(CardSchema),
});
export const DeckDataSchema = z.object({
    data: DeckSchema,
});
//# sourceMappingURL=deck.schema.js.map