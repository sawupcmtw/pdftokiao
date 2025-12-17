import { z } from 'zod';
import { type CallMetrics } from '../../core/ai/gemini-client.js';
import { type EMISingleSelectQuestion, type Option, type Explanation } from '../../core/schemas/index.js';
declare const EMISingleSelectParserInputSchema: z.ZodObject<{
    pdf: z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>;
    pages: z.ZodUnion<[z.ZodTuple<[z.ZodNumber], null>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>;
    description: z.ZodString;
    crossId: z.ZodString;
    startPosition: z.ZodNumber;
    instruction: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    pdf: Buffer<ArrayBufferLike>;
    pages: [number, number] | [number];
    description: string;
    crossId: string;
    startPosition: number;
    instruction?: string | undefined;
}, {
    pdf: Buffer<ArrayBufferLike>;
    pages: [number, number] | [number];
    description: string;
    crossId: string;
    startPosition: number;
    instruction?: string | undefined;
}>;
export type EMISingleSelectParserInput = z.infer<typeof EMISingleSelectParserInputSchema>;
export interface EMISingleSelectParserResult {
    groupText: string | null;
    groupOptions: Option[];
    groupExplanation: Explanation | undefined;
    questions: EMISingleSelectQuestion[];
    metrics: CallMetrics;
}
export declare function parseEMISingleSelect(payload: EMISingleSelectParserInput): Promise<EMISingleSelectParserResult>;
export {};
//# sourceMappingURL=emi-single-select.task.d.ts.map