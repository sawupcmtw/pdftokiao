import { z } from 'zod';
import { type CallMetrics } from '../core/ai/gemini-client.js';
declare const HintTaggerInputSchema: z.ZodObject<{
    hints: z.ZodArray<z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>, "many">;
}, "strip", z.ZodTypeAny, {
    hints: Buffer<ArrayBufferLike>[];
}, {
    hints: Buffer<ArrayBufferLike>[];
}>;
export type HintTaggerInput = z.infer<typeof HintTaggerInputSchema>;
declare const HintTaggerOutputSchema: z.ZodObject<{
    tags: z.ZodArray<z.ZodObject<{
        imageIndex: z.ZodNumber;
        type: z.ZodEnum<["single_select", "multi_select", "fill_in", "short_answer", "emi_single_select", "deck"]>;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select" | "deck";
        imageIndex: number;
        description: string;
    }, {
        type: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select" | "deck";
        imageIndex: number;
        description: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    tags: {
        type: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select" | "deck";
        imageIndex: number;
        description: string;
    }[];
}, {
    tags: {
        type: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select" | "deck";
        imageIndex: number;
        description: string;
    }[];
}>;
export type HintTaggerOutput = z.infer<typeof HintTaggerOutputSchema>;
export interface HintTaggerResult {
    output: HintTaggerOutput;
    metrics: CallMetrics[];
}
export declare function tagHints(payload: HintTaggerInput): Promise<HintTaggerResult>;
export {};
//# sourceMappingURL=hint-tagger.task.d.ts.map