import { z } from 'zod';
import type { OrchestratorResult } from '../core/schemas/index.js';
declare const OrchestratorInputSchema: z.ZodObject<{
    pdfPath: z.ZodString;
    pages: z.ZodUnion<[z.ZodTuple<[z.ZodNumber], null>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>;
    hintPaths: z.ZodArray<z.ZodString, "many">;
    instruction: z.ZodOptional<z.ZodString>;
    supplementaryPdfs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        scope: z.ZodAny;
        filename: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        filename: string;
        scope?: any;
    }, {
        path: string;
        filename: string;
        scope?: any;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    pages: [number, number] | [number];
    pdfPath: string;
    hintPaths: string[];
    instruction?: string | undefined;
    supplementaryPdfs?: {
        path: string;
        filename: string;
        scope?: any;
    }[] | undefined;
}, {
    pages: [number, number] | [number];
    pdfPath: string;
    hintPaths: string[];
    instruction?: string | undefined;
    supplementaryPdfs?: {
        path: string;
        filename: string;
        scope?: any;
    }[] | undefined;
}>;
export type OrchestratorInput = z.infer<typeof OrchestratorInputSchema>;
export declare function orchestrate(payload: OrchestratorInput): Promise<OrchestratorResult>;
export {};
//# sourceMappingURL=orchestrator.task.d.ts.map