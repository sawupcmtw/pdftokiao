import { z } from 'zod';
import { type CallMetrics } from '../../core/ai/gemini-client.js';
import { type SingleSelectQuestion } from '../../core/schemas/index.js';
declare const SingleSelectParserInputSchema: z.ZodObject<{
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
export type SingleSelectParserInput = z.infer<typeof SingleSelectParserInputSchema>;
export interface SingleSelectParserResult {
    question: SingleSelectQuestion;
    metrics: CallMetrics;
}
export declare function parseSingleSelect(payload: SingleSelectParserInput): Promise<SingleSelectParserResult>;
export {};
//# sourceMappingURL=single-select.task.d.ts.map