import { z } from 'zod';
export const PageItemSchema = z.object({
    type: z.string(),
    description: z.string().optional(),
    crossId: z.string().optional(),
});
export const PageMapSchema = z.object({
    page: z.number().int().positive(),
    included: z.array(PageItemSchema),
});
//# sourceMappingURL=page-map.schema.js.map