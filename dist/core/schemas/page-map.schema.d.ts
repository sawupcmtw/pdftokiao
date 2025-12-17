import { z } from 'zod';
export declare const PageItemSchema: z.ZodObject<{
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
}>;
export declare const PageMapSchema: z.ZodObject<{
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
}>;
export type PageItem = z.infer<typeof PageItemSchema>;
export type PageMap = z.infer<typeof PageMapSchema>;
//# sourceMappingURL=page-map.schema.d.ts.map