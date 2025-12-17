import { z } from 'zod';
import { type CallMetrics } from '../../core/ai/gemini-client.js';
import { type MultiSelectQuestion } from '../../core/schemas/index.js';
declare const MultiSelectParserInputSchema: z.ZodObject<{
    pdf: z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>;
    pages: z.ZodUnion<[z.ZodTuple<[z.ZodNumber], null>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>;
    description: z.ZodString;
    crossId: z.ZodString;
    position: z.ZodNumber;
    instruction: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    pdf: Buffer<ArrayBufferLike>;
    pages: [number, number] | [number];
    description: string;
    crossId: string;
    position: number;
    instruction?: string | undefined;
}, {
    pdf: Buffer<ArrayBufferLike>;
    pages: [number, number] | [number];
    description: string;
    crossId: string;
    position: number;
    instruction?: string | undefined;
}>;
export type MultiSelectParserInput = z.infer<typeof MultiSelectParserInputSchema>;
export interface MultiSelectParserResult {
    question: MultiSelectQuestion;
    metrics: CallMetrics;
}
export declare function parseMultiSelect(payload: MultiSelectParserInput): Promise<MultiSelectParserResult>;
export {};
//# sourceMappingURL=multi-select.task.d.ts.map