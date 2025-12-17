import { z } from 'zod';
export declare const AudioUrlsSchema: z.ZodString;
export declare const ExplanationSchema: z.ZodObject<{
    attributes: z.ZodObject<{
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
    }>;
}, "strip", z.ZodTypeAny, {
    attributes: {
        note?: string | null | undefined;
        translation?: string | null | undefined;
        vocabs_note?: string | null | undefined;
    };
}, {
    attributes: {
        note?: string | null | undefined;
        translation?: string | null | undefined;
        vocabs_note?: string | null | undefined;
    };
}>;
export declare const OptionAttributesSchema: z.ZodObject<{
    symbol: z.ZodString;
    text: z.ZodString;
    latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    text: string;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
}, {
    symbol: string;
    text: string;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
}>;
export declare const OptionSchema: z.ZodObject<{
    attributes: z.ZodObject<{
        symbol: z.ZodString;
        text: z.ZodString;
        latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        text: string;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
    }, {
        symbol: string;
        text: string;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
    }>;
    explanation: z.ZodOptional<z.ZodObject<{
        attributes: z.ZodObject<{
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
        }>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    attributes: {
        symbol: string;
        text: string;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}, {
    attributes: {
        symbol: string;
        text: string;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}>;
export declare const BaseQuestionAttributesSchema: z.ZodObject<{
    position: z.ZodNumber;
    text: z.ZodString;
    latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
    custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    blank_identifier: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    text: string;
    position: number;
    answer: string[][];
    custom?: string | null | undefined;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
    blank_identifier?: string | undefined;
}, {
    text: string;
    position: number;
    answer: string[][];
    custom?: string | null | undefined;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
    blank_identifier?: string | undefined;
}>;
export declare const SingleSelectQuestionAttributesSchema: z.ZodObject<{
    position: z.ZodNumber;
    text: z.ZodString;
    latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
    custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    blank_identifier: z.ZodOptional<z.ZodString>;
} & {
    assessment_form: z.ZodLiteral<"single_select">;
}, "strip", z.ZodTypeAny, {
    text: string;
    position: number;
    answer: string[][];
    assessment_form: "single_select";
    custom?: string | null | undefined;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
    blank_identifier?: string | undefined;
}, {
    text: string;
    position: number;
    answer: string[][];
    assessment_form: "single_select";
    custom?: string | null | undefined;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
    blank_identifier?: string | undefined;
}>;
export declare const MultiSelectQuestionAttributesSchema: z.ZodObject<{
    position: z.ZodNumber;
    text: z.ZodString;
    latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
    custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    blank_identifier: z.ZodOptional<z.ZodString>;
} & {
    assessment_form: z.ZodLiteral<"multi_select">;
}, "strip", z.ZodTypeAny, {
    text: string;
    position: number;
    answer: string[][];
    assessment_form: "multi_select";
    custom?: string | null | undefined;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
    blank_identifier?: string | undefined;
}, {
    text: string;
    position: number;
    answer: string[][];
    assessment_form: "multi_select";
    custom?: string | null | undefined;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
    blank_identifier?: string | undefined;
}>;
export declare const FillInQuestionAttributesSchema: z.ZodObject<{
    position: z.ZodNumber;
    text: z.ZodString;
    latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
    custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    blank_identifier: z.ZodOptional<z.ZodString>;
} & {
    assessment_form: z.ZodLiteral<"fill_in">;
}, "strip", z.ZodTypeAny, {
    text: string;
    position: number;
    answer: string[][];
    assessment_form: "fill_in";
    custom?: string | null | undefined;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
    blank_identifier?: string | undefined;
}, {
    text: string;
    position: number;
    answer: string[][];
    assessment_form: "fill_in";
    custom?: string | null | undefined;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
    blank_identifier?: string | undefined;
}>;
export declare const ShortAnswerQuestionAttributesSchema: z.ZodObject<{
    position: z.ZodNumber;
    text: z.ZodString;
    latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
    custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    blank_identifier: z.ZodOptional<z.ZodString>;
} & {
    assessment_form: z.ZodLiteral<"short_answer">;
}, "strip", z.ZodTypeAny, {
    text: string;
    position: number;
    answer: string[][];
    assessment_form: "short_answer";
    custom?: string | null | undefined;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
    blank_identifier?: string | undefined;
}, {
    text: string;
    position: number;
    answer: string[][];
    assessment_form: "short_answer";
    custom?: string | null | undefined;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
    blank_identifier?: string | undefined;
}>;
export declare const EMISingleSelectQuestionAttributesSchema: z.ZodObject<{
    position: z.ZodNumber;
    text: z.ZodString;
    latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
    custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    blank_identifier: z.ZodOptional<z.ZodString>;
} & {
    assessment_form: z.ZodLiteral<"emi_single_select">;
}, "strip", z.ZodTypeAny, {
    text: string;
    position: number;
    answer: string[][];
    assessment_form: "emi_single_select";
    custom?: string | null | undefined;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
    blank_identifier?: string | undefined;
}, {
    text: string;
    position: number;
    answer: string[][];
    assessment_form: "emi_single_select";
    custom?: string | null | undefined;
    latex?: string | null | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
    blank_identifier?: string | undefined;
}>;
export declare const SingleSelectQuestionSchema: z.ZodObject<{
    attributes: z.ZodObject<{
        position: z.ZodNumber;
        text: z.ZodString;
        latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
        custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        blank_identifier: z.ZodOptional<z.ZodString>;
    } & {
        assessment_form: z.ZodLiteral<"single_select">;
    }, "strip", z.ZodTypeAny, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }>;
    explanation: z.ZodOptional<z.ZodObject<{
        attributes: z.ZodObject<{
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
        }>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }>>;
    options: z.ZodArray<z.ZodObject<{
        attributes: z.ZodObject<{
            symbol: z.ZodString;
            text: z.ZodString;
            latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        }, {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        }>;
        explanation: z.ZodOptional<z.ZodObject<{
            attributes: z.ZodObject<{
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
            }>;
        }, "strip", z.ZodTypeAny, {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        }, {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        }>>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }, {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    options: {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }[];
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}, {
    options: {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }[];
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}>;
export declare const MultiSelectQuestionSchema: z.ZodObject<{
    attributes: z.ZodObject<{
        position: z.ZodNumber;
        text: z.ZodString;
        latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
        custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        blank_identifier: z.ZodOptional<z.ZodString>;
    } & {
        assessment_form: z.ZodLiteral<"multi_select">;
    }, "strip", z.ZodTypeAny, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "multi_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "multi_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }>;
    explanation: z.ZodOptional<z.ZodObject<{
        attributes: z.ZodObject<{
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
        }>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }>>;
    options: z.ZodArray<z.ZodObject<{
        attributes: z.ZodObject<{
            symbol: z.ZodString;
            text: z.ZodString;
            latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        }, {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        }>;
        explanation: z.ZodOptional<z.ZodObject<{
            attributes: z.ZodObject<{
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
            }>;
        }, "strip", z.ZodTypeAny, {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        }, {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        }>>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }, {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    options: {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }[];
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "multi_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}, {
    options: {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }[];
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "multi_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}>;
export declare const FillInQuestionSchema: z.ZodObject<{
    attributes: z.ZodObject<{
        position: z.ZodNumber;
        text: z.ZodString;
        latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
        custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        blank_identifier: z.ZodOptional<z.ZodString>;
    } & {
        assessment_form: z.ZodLiteral<"fill_in">;
    }, "strip", z.ZodTypeAny, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "fill_in";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "fill_in";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }>;
    explanation: z.ZodOptional<z.ZodObject<{
        attributes: z.ZodObject<{
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
        }>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "fill_in";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}, {
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "fill_in";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}>;
export declare const ShortAnswerQuestionSchema: z.ZodObject<{
    attributes: z.ZodObject<{
        position: z.ZodNumber;
        text: z.ZodString;
        latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
        custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        blank_identifier: z.ZodOptional<z.ZodString>;
    } & {
        assessment_form: z.ZodLiteral<"short_answer">;
    }, "strip", z.ZodTypeAny, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "short_answer";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "short_answer";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }>;
    explanation: z.ZodOptional<z.ZodObject<{
        attributes: z.ZodObject<{
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
        }>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "short_answer";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}, {
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "short_answer";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}>;
export declare const EMISingleSelectQuestionSchema: z.ZodObject<{
    attributes: z.ZodObject<{
        position: z.ZodNumber;
        text: z.ZodString;
        latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
        custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        blank_identifier: z.ZodOptional<z.ZodString>;
    } & {
        assessment_form: z.ZodLiteral<"emi_single_select">;
    }, "strip", z.ZodTypeAny, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "emi_single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "emi_single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }>;
    explanation: z.ZodOptional<z.ZodObject<{
        attributes: z.ZodObject<{
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
        }>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "emi_single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}, {
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "emi_single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}>;
export declare const QuestionSchema: z.ZodUnion<[z.ZodObject<{
    attributes: z.ZodObject<{
        position: z.ZodNumber;
        text: z.ZodString;
        latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
        custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        blank_identifier: z.ZodOptional<z.ZodString>;
    } & {
        assessment_form: z.ZodLiteral<"single_select">;
    }, "strip", z.ZodTypeAny, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }>;
    explanation: z.ZodOptional<z.ZodObject<{
        attributes: z.ZodObject<{
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
        }>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }>>;
    options: z.ZodArray<z.ZodObject<{
        attributes: z.ZodObject<{
            symbol: z.ZodString;
            text: z.ZodString;
            latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        }, {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        }>;
        explanation: z.ZodOptional<z.ZodObject<{
            attributes: z.ZodObject<{
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
            }>;
        }, "strip", z.ZodTypeAny, {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        }, {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        }>>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }, {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    options: {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }[];
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}, {
    options: {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }[];
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}>, z.ZodObject<{
    attributes: z.ZodObject<{
        position: z.ZodNumber;
        text: z.ZodString;
        latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
        custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        blank_identifier: z.ZodOptional<z.ZodString>;
    } & {
        assessment_form: z.ZodLiteral<"multi_select">;
    }, "strip", z.ZodTypeAny, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "multi_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "multi_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }>;
    explanation: z.ZodOptional<z.ZodObject<{
        attributes: z.ZodObject<{
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
        }>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }>>;
    options: z.ZodArray<z.ZodObject<{
        attributes: z.ZodObject<{
            symbol: z.ZodString;
            text: z.ZodString;
            latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        }, {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        }>;
        explanation: z.ZodOptional<z.ZodObject<{
            attributes: z.ZodObject<{
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
            }>;
        }, "strip", z.ZodTypeAny, {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        }, {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        }>>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }, {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    options: {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }[];
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "multi_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}, {
    options: {
        attributes: {
            symbol: string;
            text: string;
            latex?: string | null | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }[];
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "multi_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}>, z.ZodObject<{
    attributes: z.ZodObject<{
        position: z.ZodNumber;
        text: z.ZodString;
        latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
        custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        blank_identifier: z.ZodOptional<z.ZodString>;
    } & {
        assessment_form: z.ZodLiteral<"fill_in">;
    }, "strip", z.ZodTypeAny, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "fill_in";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "fill_in";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }>;
    explanation: z.ZodOptional<z.ZodObject<{
        attributes: z.ZodObject<{
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
        }>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "fill_in";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}, {
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "fill_in";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}>, z.ZodObject<{
    attributes: z.ZodObject<{
        position: z.ZodNumber;
        text: z.ZodString;
        latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
        custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        blank_identifier: z.ZodOptional<z.ZodString>;
    } & {
        assessment_form: z.ZodLiteral<"short_answer">;
    }, "strip", z.ZodTypeAny, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "short_answer";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "short_answer";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }>;
    explanation: z.ZodOptional<z.ZodObject<{
        attributes: z.ZodObject<{
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
        }>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "short_answer";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}, {
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "short_answer";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}>, z.ZodObject<{
    attributes: z.ZodObject<{
        position: z.ZodNumber;
        text: z.ZodString;
        latex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        answer: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
        custom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        blank_identifier: z.ZodOptional<z.ZodString>;
    } & {
        assessment_form: z.ZodLiteral<"emi_single_select">;
    }, "strip", z.ZodTypeAny, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "emi_single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }, {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "emi_single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    }>;
    explanation: z.ZodOptional<z.ZodObject<{
        attributes: z.ZodObject<{
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
        }>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }, {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "emi_single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}, {
    attributes: {
        text: string;
        position: number;
        answer: string[][];
        assessment_form: "emi_single_select";
        custom?: string | null | undefined;
        latex?: string | null | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
        blank_identifier?: string | undefined;
    };
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}>]>;
export type AudioUrls = z.infer<typeof AudioUrlsSchema>;
export type Explanation = z.infer<typeof ExplanationSchema>;
export type OptionAttributes = z.infer<typeof OptionAttributesSchema>;
export type Option = z.infer<typeof OptionSchema>;
export type BaseQuestionAttributes = z.infer<typeof BaseQuestionAttributesSchema>;
export type SingleSelectQuestionAttributes = z.infer<typeof SingleSelectQuestionAttributesSchema>;
export type MultiSelectQuestionAttributes = z.infer<typeof MultiSelectQuestionAttributesSchema>;
export type FillInQuestionAttributes = z.infer<typeof FillInQuestionAttributesSchema>;
export type ShortAnswerQuestionAttributes = z.infer<typeof ShortAnswerQuestionAttributesSchema>;
export type EMISingleSelectQuestionAttributes = z.infer<typeof EMISingleSelectQuestionAttributesSchema>;
export type SingleSelectQuestion = z.infer<typeof SingleSelectQuestionSchema>;
export type MultiSelectQuestion = z.infer<typeof MultiSelectQuestionSchema>;
export type FillInQuestion = z.infer<typeof FillInQuestionSchema>;
export type ShortAnswerQuestion = z.infer<typeof ShortAnswerQuestionSchema>;
export type EMISingleSelectQuestion = z.infer<typeof EMISingleSelectQuestionSchema>;
export type Question = z.infer<typeof QuestionSchema>;
//# sourceMappingURL=question.schema.d.ts.map