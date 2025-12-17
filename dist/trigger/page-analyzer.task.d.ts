import { z } from 'zod';
import { type CallMetrics } from '../core/ai/gemini-client.js';
declare const PageAnalyzerInputSchema: z.ZodObject<{
    pdf: z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>;
    pages: z.ZodUnion<[z.ZodTuple<[z.ZodNumber], null>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>;
    hintTags: z.ZodArray<z.ZodObject<{
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
    pdf: Buffer<ArrayBufferLike>;
    pages: [number, number] | [number];
    hintTags: {
        type: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select" | "deck";
        imageIndex: number;
        description: string;
    }[];
}, {
    pdf: Buffer<ArrayBufferLike>;
    pages: [number, number] | [number];
    hintTags: {
        type: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select" | "deck";
        imageIndex: number;
        description: string;
    }[];
}>;
export type PageAnalyzerInput = z.infer<typeof PageAnalyzerInputSchema>;
declare const PageAnalyzerOutputSchema: z.ZodObject<{
    pageMaps: z.ZodArray<z.ZodObject<{
        page: z.ZodNumber;
        included: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            crossId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            description?: string | undefined;
            crossId?: string | undefined;
        }, {
            type: string;
            description?: string | undefined;
            crossId?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        page: number;
        included: {
            type: string;
            description?: string | undefined;
            crossId?: string | undefined;
        }[];
    }, {
        page: number;
        included: {
            type: string;
            description?: string | undefined;
            crossId?: string | undefined;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    pageMaps: {
        page: number;
        included: {
            type: string;
            description?: string | undefined;
            crossId?: string | undefined;
        }[];
    }[];
}, {
    pageMaps: {
        page: number;
        included: {
            type: string;
            description?: string | undefined;
            crossId?: string | undefined;
        }[];
    }[];
}>;
export type PageAnalyzerOutput = z.infer<typeof PageAnalyzerOutputSchema>;
export interface PageAnalyzerResult {
    output: PageAnalyzerOutput;
    metrics: CallMetrics;
}
export declare function analyzePages(payload: PageAnalyzerInput): Promise<PageAnalyzerResult>;
export {};
//# sourceMappingURL=page-analyzer.task.d.ts.map