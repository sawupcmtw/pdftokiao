import { z } from 'zod';
export declare const WordTypeSchema: z.ZodEnum<["n", "n[C]", "n[U]", "adj", "v", "vi", "vt", "adv", "prep", "phrase", "conj", "aux", "int", "pron", "det", "art", "abbr"]>;
export declare const CardExplanationSchema: z.ZodObject<{
    translations: z.ZodArray<z.ZodString, "many">;
    sentences: z.ZodArray<z.ZodString, "many">;
    synonyms: z.ZodArray<z.ZodString, "many">;
    antonyms: z.ZodArray<z.ZodString, "many">;
    similars: z.ZodArray<z.ZodString, "many">;
    word_types: z.ZodArray<z.ZodEnum<["n", "n[C]", "n[U]", "adj", "v", "vi", "vt", "adv", "prep", "phrase", "conj", "aux", "int", "pron", "det", "art", "abbr"]>, "many">;
    notes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    translations: string[];
    sentences: string[];
    synonyms: string[];
    antonyms: string[];
    similars: string[];
    word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
    notes?: string[] | undefined;
}, {
    translations: string[];
    sentences: string[];
    synonyms: string[];
    antonyms: string[];
    similars: string[];
    word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
    notes?: string[] | undefined;
}>;
export declare const CardTextContentSchema: z.ZodObject<{
    explanations: z.ZodArray<z.ZodObject<{
        translations: z.ZodArray<z.ZodString, "many">;
        sentences: z.ZodArray<z.ZodString, "many">;
        synonyms: z.ZodArray<z.ZodString, "many">;
        antonyms: z.ZodArray<z.ZodString, "many">;
        similars: z.ZodArray<z.ZodString, "many">;
        word_types: z.ZodArray<z.ZodEnum<["n", "n[C]", "n[U]", "adj", "v", "vi", "vt", "adv", "prep", "phrase", "conj", "aux", "int", "pron", "det", "art", "abbr"]>, "many">;
        notes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        translations: string[];
        sentences: string[];
        synonyms: string[];
        antonyms: string[];
        similars: string[];
        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
        notes?: string[] | undefined;
    }, {
        translations: string[];
        sentences: string[];
        synonyms: string[];
        antonyms: string[];
        similars: string[];
        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
        notes?: string[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    explanations: {
        translations: string[];
        sentences: string[];
        synonyms: string[];
        antonyms: string[];
        similars: string[];
        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
        notes?: string[] | undefined;
    }[];
}, {
    explanations: {
        translations: string[];
        sentences: string[];
        synonyms: string[];
        antonyms: string[];
        similars: string[];
        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
        notes?: string[] | undefined;
    }[];
}>;
export declare const CardAttributesSchema: z.ZodObject<{
    word: z.ZodString;
    text_content: z.ZodObject<{
        explanations: z.ZodArray<z.ZodObject<{
            translations: z.ZodArray<z.ZodString, "many">;
            sentences: z.ZodArray<z.ZodString, "many">;
            synonyms: z.ZodArray<z.ZodString, "many">;
            antonyms: z.ZodArray<z.ZodString, "many">;
            similars: z.ZodArray<z.ZodString, "many">;
            word_types: z.ZodArray<z.ZodEnum<["n", "n[C]", "n[U]", "adj", "v", "vi", "vt", "adv", "prep", "phrase", "conj", "aux", "int", "pron", "det", "art", "abbr"]>, "many">;
            notes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            translations: string[];
            sentences: string[];
            synonyms: string[];
            antonyms: string[];
            similars: string[];
            word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
            notes?: string[] | undefined;
        }, {
            translations: string[];
            sentences: string[];
            synonyms: string[];
            antonyms: string[];
            similars: string[];
            word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
            notes?: string[] | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        explanations: {
            translations: string[];
            sentences: string[];
            synonyms: string[];
            antonyms: string[];
            similars: string[];
            word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
            notes?: string[] | undefined;
        }[];
    }, {
        explanations: {
            translations: string[];
            sentences: string[];
            synonyms: string[];
            antonyms: string[];
            similars: string[];
            word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
            notes?: string[] | undefined;
        }[];
    }>;
    tags: z.ZodArray<z.ZodString, "many">;
    word_root: z.ZodNullable<z.ZodString>;
    notes: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    notes: string[];
    word: string;
    text_content: {
        explanations: {
            translations: string[];
            sentences: string[];
            synonyms: string[];
            antonyms: string[];
            similars: string[];
            word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
            notes?: string[] | undefined;
        }[];
    };
    tags: string[];
    word_root: string | null;
}, {
    notes: string[];
    word: string;
    text_content: {
        explanations: {
            translations: string[];
            sentences: string[];
            synonyms: string[];
            antonyms: string[];
            similars: string[];
            word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
            notes?: string[] | undefined;
        }[];
    };
    tags: string[];
    word_root: string | null;
}>;
export declare const CardSchema: z.ZodObject<{
    attributes: z.ZodObject<{
        word: z.ZodString;
        text_content: z.ZodObject<{
            explanations: z.ZodArray<z.ZodObject<{
                translations: z.ZodArray<z.ZodString, "many">;
                sentences: z.ZodArray<z.ZodString, "many">;
                synonyms: z.ZodArray<z.ZodString, "many">;
                antonyms: z.ZodArray<z.ZodString, "many">;
                similars: z.ZodArray<z.ZodString, "many">;
                word_types: z.ZodArray<z.ZodEnum<["n", "n[C]", "n[U]", "adj", "v", "vi", "vt", "adv", "prep", "phrase", "conj", "aux", "int", "pron", "det", "art", "abbr"]>, "many">;
                notes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                translations: string[];
                sentences: string[];
                synonyms: string[];
                antonyms: string[];
                similars: string[];
                word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                notes?: string[] | undefined;
            }, {
                translations: string[];
                sentences: string[];
                synonyms: string[];
                antonyms: string[];
                similars: string[];
                word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                notes?: string[] | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            explanations: {
                translations: string[];
                sentences: string[];
                synonyms: string[];
                antonyms: string[];
                similars: string[];
                word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                notes?: string[] | undefined;
            }[];
        }, {
            explanations: {
                translations: string[];
                sentences: string[];
                synonyms: string[];
                antonyms: string[];
                similars: string[];
                word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                notes?: string[] | undefined;
            }[];
        }>;
        tags: z.ZodArray<z.ZodString, "many">;
        word_root: z.ZodNullable<z.ZodString>;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        notes: string[];
        word: string;
        text_content: {
            explanations: {
                translations: string[];
                sentences: string[];
                synonyms: string[];
                antonyms: string[];
                similars: string[];
                word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                notes?: string[] | undefined;
            }[];
        };
        tags: string[];
        word_root: string | null;
    }, {
        notes: string[];
        word: string;
        text_content: {
            explanations: {
                translations: string[];
                sentences: string[];
                synonyms: string[];
                antonyms: string[];
                similars: string[];
                word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                notes?: string[] | undefined;
            }[];
        };
        tags: string[];
        word_root: string | null;
    }>;
}, "strip", z.ZodTypeAny, {
    attributes: {
        notes: string[];
        word: string;
        text_content: {
            explanations: {
                translations: string[];
                sentences: string[];
                synonyms: string[];
                antonyms: string[];
                similars: string[];
                word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                notes?: string[] | undefined;
            }[];
        };
        tags: string[];
        word_root: string | null;
    };
}, {
    attributes: {
        notes: string[];
        word: string;
        text_content: {
            explanations: {
                translations: string[];
                sentences: string[];
                synonyms: string[];
                antonyms: string[];
                similars: string[];
                word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                notes?: string[] | undefined;
            }[];
        };
        tags: string[];
        word_root: string | null;
    };
}>;
export declare const DeckAttributesSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    position: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    description: string;
    name: string;
    position?: number | undefined;
}, {
    description: string;
    name: string;
    position?: number | undefined;
}>;
export declare const DeckSchema: z.ZodObject<{
    type: z.ZodLiteral<"deck">;
    attributes: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        position: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        name: string;
        position?: number | undefined;
    }, {
        description: string;
        name: string;
        position?: number | undefined;
    }>;
    cards: z.ZodArray<z.ZodObject<{
        attributes: z.ZodObject<{
            word: z.ZodString;
            text_content: z.ZodObject<{
                explanations: z.ZodArray<z.ZodObject<{
                    translations: z.ZodArray<z.ZodString, "many">;
                    sentences: z.ZodArray<z.ZodString, "many">;
                    synonyms: z.ZodArray<z.ZodString, "many">;
                    antonyms: z.ZodArray<z.ZodString, "many">;
                    similars: z.ZodArray<z.ZodString, "many">;
                    word_types: z.ZodArray<z.ZodEnum<["n", "n[C]", "n[U]", "adj", "v", "vi", "vt", "adv", "prep", "phrase", "conj", "aux", "int", "pron", "det", "art", "abbr"]>, "many">;
                    notes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                }, "strip", z.ZodTypeAny, {
                    translations: string[];
                    sentences: string[];
                    synonyms: string[];
                    antonyms: string[];
                    similars: string[];
                    word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                    notes?: string[] | undefined;
                }, {
                    translations: string[];
                    sentences: string[];
                    synonyms: string[];
                    antonyms: string[];
                    similars: string[];
                    word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                    notes?: string[] | undefined;
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                explanations: {
                    translations: string[];
                    sentences: string[];
                    synonyms: string[];
                    antonyms: string[];
                    similars: string[];
                    word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                    notes?: string[] | undefined;
                }[];
            }, {
                explanations: {
                    translations: string[];
                    sentences: string[];
                    synonyms: string[];
                    antonyms: string[];
                    similars: string[];
                    word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                    notes?: string[] | undefined;
                }[];
            }>;
            tags: z.ZodArray<z.ZodString, "many">;
            word_root: z.ZodNullable<z.ZodString>;
            notes: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            notes: string[];
            word: string;
            text_content: {
                explanations: {
                    translations: string[];
                    sentences: string[];
                    synonyms: string[];
                    antonyms: string[];
                    similars: string[];
                    word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                    notes?: string[] | undefined;
                }[];
            };
            tags: string[];
            word_root: string | null;
        }, {
            notes: string[];
            word: string;
            text_content: {
                explanations: {
                    translations: string[];
                    sentences: string[];
                    synonyms: string[];
                    antonyms: string[];
                    similars: string[];
                    word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                    notes?: string[] | undefined;
                }[];
            };
            tags: string[];
            word_root: string | null;
        }>;
    }, "strip", z.ZodTypeAny, {
        attributes: {
            notes: string[];
            word: string;
            text_content: {
                explanations: {
                    translations: string[];
                    sentences: string[];
                    synonyms: string[];
                    antonyms: string[];
                    similars: string[];
                    word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                    notes?: string[] | undefined;
                }[];
            };
            tags: string[];
            word_root: string | null;
        };
    }, {
        attributes: {
            notes: string[];
            word: string;
            text_content: {
                explanations: {
                    translations: string[];
                    sentences: string[];
                    synonyms: string[];
                    antonyms: string[];
                    similars: string[];
                    word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                    notes?: string[] | undefined;
                }[];
            };
            tags: string[];
            word_root: string | null;
        };
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    type: "deck";
    attributes: {
        description: string;
        name: string;
        position?: number | undefined;
    };
    cards: {
        attributes: {
            notes: string[];
            word: string;
            text_content: {
                explanations: {
                    translations: string[];
                    sentences: string[];
                    synonyms: string[];
                    antonyms: string[];
                    similars: string[];
                    word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                    notes?: string[] | undefined;
                }[];
            };
            tags: string[];
            word_root: string | null;
        };
    }[];
}, {
    type: "deck";
    attributes: {
        description: string;
        name: string;
        position?: number | undefined;
    };
    cards: {
        attributes: {
            notes: string[];
            word: string;
            text_content: {
                explanations: {
                    translations: string[];
                    sentences: string[];
                    synonyms: string[];
                    antonyms: string[];
                    similars: string[];
                    word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                    notes?: string[] | undefined;
                }[];
            };
            tags: string[];
            word_root: string | null;
        };
    }[];
}>;
export declare const DeckDataSchema: z.ZodObject<{
    data: z.ZodObject<{
        type: z.ZodLiteral<"deck">;
        attributes: z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            position: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            name: string;
            position?: number | undefined;
        }, {
            description: string;
            name: string;
            position?: number | undefined;
        }>;
        cards: z.ZodArray<z.ZodObject<{
            attributes: z.ZodObject<{
                word: z.ZodString;
                text_content: z.ZodObject<{
                    explanations: z.ZodArray<z.ZodObject<{
                        translations: z.ZodArray<z.ZodString, "many">;
                        sentences: z.ZodArray<z.ZodString, "many">;
                        synonyms: z.ZodArray<z.ZodString, "many">;
                        antonyms: z.ZodArray<z.ZodString, "many">;
                        similars: z.ZodArray<z.ZodString, "many">;
                        word_types: z.ZodArray<z.ZodEnum<["n", "n[C]", "n[U]", "adj", "v", "vi", "vt", "adv", "prep", "phrase", "conj", "aux", "int", "pron", "det", "art", "abbr"]>, "many">;
                        notes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    }, "strip", z.ZodTypeAny, {
                        translations: string[];
                        sentences: string[];
                        synonyms: string[];
                        antonyms: string[];
                        similars: string[];
                        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                        notes?: string[] | undefined;
                    }, {
                        translations: string[];
                        sentences: string[];
                        synonyms: string[];
                        antonyms: string[];
                        similars: string[];
                        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                        notes?: string[] | undefined;
                    }>, "many">;
                }, "strip", z.ZodTypeAny, {
                    explanations: {
                        translations: string[];
                        sentences: string[];
                        synonyms: string[];
                        antonyms: string[];
                        similars: string[];
                        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                        notes?: string[] | undefined;
                    }[];
                }, {
                    explanations: {
                        translations: string[];
                        sentences: string[];
                        synonyms: string[];
                        antonyms: string[];
                        similars: string[];
                        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                        notes?: string[] | undefined;
                    }[];
                }>;
                tags: z.ZodArray<z.ZodString, "many">;
                word_root: z.ZodNullable<z.ZodString>;
                notes: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                notes: string[];
                word: string;
                text_content: {
                    explanations: {
                        translations: string[];
                        sentences: string[];
                        synonyms: string[];
                        antonyms: string[];
                        similars: string[];
                        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                        notes?: string[] | undefined;
                    }[];
                };
                tags: string[];
                word_root: string | null;
            }, {
                notes: string[];
                word: string;
                text_content: {
                    explanations: {
                        translations: string[];
                        sentences: string[];
                        synonyms: string[];
                        antonyms: string[];
                        similars: string[];
                        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                        notes?: string[] | undefined;
                    }[];
                };
                tags: string[];
                word_root: string | null;
            }>;
        }, "strip", z.ZodTypeAny, {
            attributes: {
                notes: string[];
                word: string;
                text_content: {
                    explanations: {
                        translations: string[];
                        sentences: string[];
                        synonyms: string[];
                        antonyms: string[];
                        similars: string[];
                        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                        notes?: string[] | undefined;
                    }[];
                };
                tags: string[];
                word_root: string | null;
            };
        }, {
            attributes: {
                notes: string[];
                word: string;
                text_content: {
                    explanations: {
                        translations: string[];
                        sentences: string[];
                        synonyms: string[];
                        antonyms: string[];
                        similars: string[];
                        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                        notes?: string[] | undefined;
                    }[];
                };
                tags: string[];
                word_root: string | null;
            };
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "deck";
        attributes: {
            description: string;
            name: string;
            position?: number | undefined;
        };
        cards: {
            attributes: {
                notes: string[];
                word: string;
                text_content: {
                    explanations: {
                        translations: string[];
                        sentences: string[];
                        synonyms: string[];
                        antonyms: string[];
                        similars: string[];
                        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                        notes?: string[] | undefined;
                    }[];
                };
                tags: string[];
                word_root: string | null;
            };
        }[];
    }, {
        type: "deck";
        attributes: {
            description: string;
            name: string;
            position?: number | undefined;
        };
        cards: {
            attributes: {
                notes: string[];
                word: string;
                text_content: {
                    explanations: {
                        translations: string[];
                        sentences: string[];
                        synonyms: string[];
                        antonyms: string[];
                        similars: string[];
                        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                        notes?: string[] | undefined;
                    }[];
                };
                tags: string[];
                word_root: string | null;
            };
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        type: "deck";
        attributes: {
            description: string;
            name: string;
            position?: number | undefined;
        };
        cards: {
            attributes: {
                notes: string[];
                word: string;
                text_content: {
                    explanations: {
                        translations: string[];
                        sentences: string[];
                        synonyms: string[];
                        antonyms: string[];
                        similars: string[];
                        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                        notes?: string[] | undefined;
                    }[];
                };
                tags: string[];
                word_root: string | null;
            };
        }[];
    };
}, {
    data: {
        type: "deck";
        attributes: {
            description: string;
            name: string;
            position?: number | undefined;
        };
        cards: {
            attributes: {
                notes: string[];
                word: string;
                text_content: {
                    explanations: {
                        translations: string[];
                        sentences: string[];
                        synonyms: string[];
                        antonyms: string[];
                        similars: string[];
                        word_types: ("n" | "n[C]" | "n[U]" | "adj" | "v" | "vi" | "vt" | "adv" | "prep" | "phrase" | "conj" | "aux" | "int" | "pron" | "det" | "art" | "abbr")[];
                        notes?: string[] | undefined;
                    }[];
                };
                tags: string[];
                word_root: string | null;
            };
        }[];
    };
}>;
export type WordType = z.infer<typeof WordTypeSchema>;
export type CardExplanation = z.infer<typeof CardExplanationSchema>;
export type CardTextContent = z.infer<typeof CardTextContentSchema>;
export type CardAttributes = z.infer<typeof CardAttributesSchema>;
export type Card = z.infer<typeof CardSchema>;
export type DeckAttributes = z.infer<typeof DeckAttributesSchema>;
export type Deck = z.infer<typeof DeckSchema>;
export type DeckData = z.infer<typeof DeckDataSchema>;
//# sourceMappingURL=deck.schema.d.ts.map