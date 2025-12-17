import { z } from 'zod';
export const HintTagSchema = z.object({
    imageIndex: z.number().int().nonnegative(),
    type: z.enum([
        'single_select',
        'multi_select',
        'fill_in',
        'short_answer',
        'emi_single_select',
        'deck',
    ]),
    description: z.string(),
});
//# sourceMappingURL=hint.schema.js.map