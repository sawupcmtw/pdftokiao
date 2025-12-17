import { z } from 'zod';
import { type CallMetrics } from '../../core/ai/gemini-client.js';
import { type FillInQuestion } from '../../core/schemas/index.js';
declare const FillInParserInputSchema: z.ZodObject<{
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
export type FillInParserInput = z.infer<typeof FillInParserInputSchema>;
export interface FillInParserResult {
    question: FillInQuestion;
    metrics: CallMetrics;
}
export declare function parseFillIn(payload: FillInParserInput): Promise<FillInParserResult>;
export {};
//# sourceMappingURL=fill-in.task.d.ts.map