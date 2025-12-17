import { z } from 'zod';
export declare const SupplementaryScopeTypeSchema: z.ZodEnum<["all", "pages", "type", "questions"]>;
export type SupplementaryScopeType = z.infer<typeof SupplementaryScopeTypeSchema>;
export declare const SupplementaryScopeSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"all">;
}, "strip", z.ZodTypeAny, {
    type: "all";
}, {
    type: "all";
}>, z.ZodObject<{
    type: z.ZodLiteral<"pages">;
    startPage: z.ZodNumber;
    endPage: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "pages";
    startPage: number;
    endPage: number;
}, {
    type: "pages";
    startPage: number;
    endPage: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"type">;
    questionType: z.ZodEnum<["single_select", "multi_select", "fill_in", "short_answer", "emi_single_select"]>;
}, "strip", z.ZodTypeAny, {
    type: "type";
    questionType: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select";
}, {
    type: "type";
    questionType: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select";
}>, z.ZodObject<{
    type: z.ZodLiteral<"questions">;
    questionNumbers: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    type: "questions";
    questionNumbers: number[];
}, {
    type: "questions";
    questionNumbers: number[];
}>]>;
export type SupplementaryScope = z.infer<typeof SupplementaryScopeSchema>;
export declare const SupplementaryPdfSchema: z.ZodObject<{
    path: z.ZodString;
    scope: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"all">;
    }, "strip", z.ZodTypeAny, {
        type: "all";
    }, {
        type: "all";
    }>, z.ZodObject<{
        type: z.ZodLiteral<"pages">;
        startPage: z.ZodNumber;
        endPage: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "pages";
        startPage: number;
        endPage: number;
    }, {
        type: "pages";
        startPage: number;
        endPage: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"type">;
        questionType: z.ZodEnum<["single_select", "multi_select", "fill_in", "short_answer", "emi_single_select"]>;
    }, "strip", z.ZodTypeAny, {
        type: "type";
        questionType: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select";
    }, {
        type: "type";
        questionType: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select";
    }>, z.ZodObject<{
        type: z.ZodLiteral<"questions">;
        questionNumbers: z.ZodArray<z.ZodNumber, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "questions";
        questionNumbers: number[];
    }, {
        type: "questions";
        questionNumbers: number[];
    }>]>;
    filename: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    scope: {
        type: "all";
    } | {
        type: "pages";
        startPage: number;
        endPage: number;
    } | {
        type: "type";
        questionType: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select";
    } | {
        type: "questions";
        questionNumbers: number[];
    };
    filename: string;
}, {
    path: string;
    scope: {
        type: "all";
    } | {
        type: "pages";
        startPage: number;
        endPage: number;
    } | {
        type: "type";
        questionType: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select";
    } | {
        type: "questions";
        questionNumbers: number[];
    };
    filename: string;
}>;
export type SupplementaryPdf = z.infer<typeof SupplementaryPdfSchema>;
export declare const ExtractedAnswerSchema: z.ZodObject<{
    questionNumber: z.ZodNumber;
    answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
    explanation: z.ZodOptional<z.ZodObject<{
        note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        translation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vocabs_note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        note?: string | null | undefined;
        translation?: string | null | undefined;
        vocabs_note?: string | null | undefined;
    }, {
        note?: string | null | undefined;
        translation?: string | null | undefined;
        vocabs_note?: string | null | undefined;
    }>>;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
}, "strip", z.ZodTypeAny, {
    answer: string[][];
    questionNumber: number;
    confidence: "high" | "medium" | "low";
    explanation?: {
        note?: string | null | undefined;
        translation?: string | null | undefined;
        vocabs_note?: string | null | undefined;
    } | undefined;
}, {
    answer: string[][];
    questionNumber: number;
    confidence: "high" | "medium" | "low";
    explanation?: {
        note?: string | null | undefined;
        translation?: string | null | undefined;
        vocabs_note?: string | null | undefined;
    } | undefined;
}>;
export type ExtractedAnswer = z.infer<typeof ExtractedAnswerSchema>;
export declare const SupplementaryExtractionResultSchema: z.ZodObject<{
    sourcePdf: z.ZodString;
    scope: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"all">;
    }, "strip", z.ZodTypeAny, {
        type: "all";
    }, {
        type: "all";
    }>, z.ZodObject<{
        type: z.ZodLiteral<"pages">;
        startPage: z.ZodNumber;
        endPage: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "pages";
        startPage: number;
        endPage: number;
    }, {
        type: "pages";
        startPage: number;
        endPage: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"type">;
        questionType: z.ZodEnum<["single_select", "multi_select", "fill_in", "short_answer", "emi_single_select"]>;
    }, "strip", z.ZodTypeAny, {
        type: "type";
        questionType: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select";
    }, {
        type: "type";
        questionType: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select";
    }>, z.ZodObject<{
        type: z.ZodLiteral<"questions">;
        questionNumbers: z.ZodArray<z.ZodNumber, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "questions";
        questionNumbers: number[];
    }, {
        type: "questions";
        questionNumbers: number[];
    }>]>;
    answers: z.ZodArray<z.ZodObject<{
        questionNumber: z.ZodNumber;
        answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
        explanation: z.ZodOptional<z.ZodObject<{
            note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            translation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            vocabs_note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        }, {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        }>>;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
    }, "strip", z.ZodTypeAny, {
        answer: string[][];
        questionNumber: number;
        confidence: "high" | "medium" | "low";
        explanation?: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        } | undefined;
    }, {
        answer: string[][];
        questionNumber: number;
        confidence: "high" | "medium" | "low";
        explanation?: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        } | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    scope: {
        type: "all";
    } | {
        type: "pages";
        startPage: number;
        endPage: number;
    } | {
        type: "type";
        questionType: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select";
    } | {
        type: "questions";
        questionNumbers: number[];
    };
    sourcePdf: string;
    answers: {
        answer: string[][];
        questionNumber: number;
        confidence: "high" | "medium" | "low";
        explanation?: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        } | undefined;
    }[];
}, {
    scope: {
        type: "all";
    } | {
        type: "pages";
        startPage: number;
        endPage: number;
    } | {
        type: "type";
        questionType: "single_select" | "multi_select" | "fill_in" | "short_answer" | "emi_single_select";
    } | {
        type: "questions";
        questionNumbers: number[];
    };
    sourcePdf: string;
    answers: {
        answer: string[][];
        questionNumber: number;
        confidence: "high" | "medium" | "low";
        explanation?: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        } | undefined;
    }[];
}>;
export type SupplementaryExtractionResult = z.infer<typeof SupplementaryExtractionResultSchema>;
//# sourceMappingURL=supplementary.schema.d.ts.map