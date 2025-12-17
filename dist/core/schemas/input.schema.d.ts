import { z } from 'zod';
export declare const ParseInputSchema: z.ZodObject<{
    pdf: z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>;
    pages: z.ZodUnion<[z.ZodTuple<[z.ZodNumber], null>, z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>]>;
    hints: z.ZodArray<z.ZodType<Buffer<ArrayBufferLike>, z.ZodTypeDef, Buffer<ArrayBufferLike>>, "many">;
    instruction: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    pdf: Buffer<ArrayBufferLike>;
    pages: [number, number] | [number];
    hints: Buffer<ArrayBufferLike>[];
    instruction?: string | undefined;
}, {
    pdf: Buffer<ArrayBufferLike>;
    pages: [number, number] | [number];
    hints: Buffer<ArrayBufferLike>[];
    instruction?: string | undefined;
}>;
export type ParseInput = z.infer<typeof ParseInputSchema>;
//# sourceMappingURL=input.schema.d.ts.map