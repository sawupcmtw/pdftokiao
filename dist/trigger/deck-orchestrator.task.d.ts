import { z } from 'zod';
import type { Deck } from '../core/schemas/index.js';
declare const DeckOrchestratorInputSchema: z.ZodObject<{
    pdfPath: z.ZodString;
    pages: z.ZodUnion<[z.ZodTuple<[z.ZodNumber], null>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>;
    deckName: z.ZodString;
    deckDescription: z.ZodOptional<z.ZodString>;
    instruction: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    pages: [number, number] | [number];
    pdfPath: string;
    deckName: string;
    instruction?: string | undefined;
    deckDescription?: string | undefined;
}, {
    pages: [number, number] | [number];
    pdfPath: string;
    deckName: string;
    instruction?: string | undefined;
    deckDescription?: string | undefined;
}>;
export type DeckOrchestratorInput = z.infer<typeof DeckOrchestratorInputSchema>;
export interface DeckOutput {
    data: Deck;
}
export declare function orchestrateDeck(payload: DeckOrchestratorInput): Promise<DeckOutput>;
export {};
//# sourceMappingURL=deck-orchestrator.task.d.ts.map