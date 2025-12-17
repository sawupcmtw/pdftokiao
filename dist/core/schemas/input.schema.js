import { z } from 'zod';
export const ParseInputSchema = z.object({
    pdf: z.instanceof(Buffer),
    pages: z
        .tuple([z.number().int().positive()])
        .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),
    hints: z.array(z.instanceof(Buffer)),
    instruction: z.string().optional(),
});
//# sourceMappingURL=input.schema.js.map