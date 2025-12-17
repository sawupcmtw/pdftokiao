import { z } from 'zod';
export declare const HintTagSchema: z.ZodObject<{
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
}>;
export type HintTag = z.infer<typeof HintTagSchema>;
//# sourceMappingURL=hint.schema.d.ts.map