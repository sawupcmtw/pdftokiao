import { z } from 'zod';
import { type CallMetrics } from '../../core/ai/gemini-client.js';
import { type Card } from '../../core/schemas/index.js';
declare const DeckParserInputSchema: z.ZodObject<{
    pdf: z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>;
    pages: z.ZodUnion<[z.ZodTuple<[z.ZodNumber], null>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>;
    description: z.ZodString;
    crossId: z.ZodString;
    instruction: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    pdf: Buffer<ArrayBufferLike>;
    pages: [number, number] | [number];
    description: string;
    crossId: string;
    instruction?: string | undefined;
}, {
    pdf: Buffer<ArrayBufferLike>;
    pages: [number, number] | [number];
    description: string;
    crossId: string;
    instruction?: string | undefined;
}>;
export type DeckParserInput = z.infer<typeof DeckParserInputSchema>;
export interface DeckParserResult {
    cards: Card[];
    metrics: CallMetrics;
}
export declare function parseDeck(payload: DeckParserInput): Promise<DeckParserResult>;
export {};
//# sourceMappingURL=deck.task.d.ts.map