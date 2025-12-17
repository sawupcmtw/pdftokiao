import { z } from 'zod';
export declare const QuestionGroupAttributesSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodString>;
    audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    text?: string | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
}, {
    text?: string | undefined;
    audio_urls?: string | null | undefined;
    image_url?: string | null | undefined;
}>;
export declare const QuestionGroupDataSchema: z.ZodObject<{
    type: z.ZodLiteral<"question_group">;
    attributes: z.ZodObject<{
        text: z.ZodOptional<z.ZodString>;
        audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        text?: string | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
    }, {
        text?: string | undefined;
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
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }>, "many">>;
    questions: z.ZodArray<z.ZodUnion<[z.ZodObject<{
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
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    type: "question_group";
    attributes: {
        text?: string | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
    };
    questions: ({
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
    } | {
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
    } | {
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
    } | {
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
    } | {
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
    })[];
    options?: {
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
    }[] | undefined;
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}, {
    type: "question_group";
    attributes: {
        text?: string | undefined;
        audio_urls?: string | null | undefined;
        image_url?: string | null | undefined;
    };
    questions: ({
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
    } | {
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
    } | {
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
    } | {
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
    } | {
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
    })[];
    options?: {
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
    }[] | undefined;
    explanation?: {
        attributes: {
            note?: string | null | undefined;
            translation?: string | null | undefined;
            vocabs_note?: string | null | undefined;
        };
    } | undefined;
}>;
export declare const QuestionGroupSchema: z.ZodObject<{
    data: z.ZodObject<{
        type: z.ZodLiteral<"question_group">;
        attributes: z.ZodObject<{
            text: z.ZodOptional<z.ZodString>;
            audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            text?: string | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        }, {
            text?: string | undefined;
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
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
        }>, "many">>;
        questions: z.ZodArray<z.ZodUnion<[z.ZodObject<{
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
        }>]>, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "question_group";
        attributes: {
            text?: string | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        questions: ({
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
        } | {
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
        } | {
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
        } | {
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
        } | {
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
        })[];
        options?: {
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
        }[] | undefined;
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }, {
        type: "question_group";
        attributes: {
            text?: string | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        questions: ({
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
        } | {
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
        } | {
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
        } | {
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
        } | {
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
        })[];
        options?: {
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
        }[] | undefined;
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        type: "question_group";
        attributes: {
            text?: string | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        questions: ({
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
        } | {
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
        } | {
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
        } | {
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
        } | {
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
        })[];
        options?: {
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
        }[] | undefined;
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    };
}, {
    data: {
        type: "question_group";
        attributes: {
            text?: string | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        questions: ({
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
        } | {
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
        } | {
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
        } | {
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
        } | {
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
        })[];
        options?: {
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
        }[] | undefined;
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    };
}>;
export type QuestionGroupAttributes = z.infer<typeof QuestionGroupAttributesSchema>;
export type QuestionGroupData = z.infer<typeof QuestionGroupDataSchema>;
export type QuestionGroup = z.infer<typeof QuestionGroupSchema>;
export declare const DeckOutputSchema: z.ZodObject<{
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
export type DeckOutput = z.infer<typeof DeckOutputSchema>;
export declare const OrchestratorOutputSchema: z.ZodArray<z.ZodUnion<[z.ZodObject<{
    data: z.ZodObject<{
        type: z.ZodLiteral<"question_group">;
        attributes: z.ZodObject<{
            text: z.ZodOptional<z.ZodString>;
            audio_urls: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            text?: string | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        }, {
            text?: string | undefined;
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
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
        }>, "many">>;
        questions: z.ZodArray<z.ZodUnion<[z.ZodObject<{
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
        }>]>, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "question_group";
        attributes: {
            text?: string | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        questions: ({
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
        } | {
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
        } | {
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
        } | {
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
        } | {
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
        })[];
        options?: {
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
        }[] | undefined;
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }, {
        type: "question_group";
        attributes: {
            text?: string | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        questions: ({
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
        } | {
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
        } | {
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
        } | {
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
        } | {
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
        })[];
        options?: {
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
        }[] | undefined;
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        type: "question_group";
        attributes: {
            text?: string | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        questions: ({
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
        } | {
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
        } | {
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
        } | {
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
        } | {
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
        })[];
        options?: {
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
        }[] | undefined;
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    };
}, {
    data: {
        type: "question_group";
        attributes: {
            text?: string | undefined;
            audio_urls?: string | null | undefined;
            image_url?: string | null | undefined;
        };
        questions: ({
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
        } | {
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
        } | {
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
        } | {
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
        } | {
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
        })[];
        options?: {
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
        }[] | undefined;
        explanation?: {
            attributes: {
                note?: string | null | undefined;
                translation?: string | null | undefined;
                vocabs_note?: string | null | undefined;
            };
        } | undefined;
    };
}>, z.ZodObject<{
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
}>]>, "many">;
export type OrchestratorOutput = z.infer<typeof OrchestratorOutputSchema>;
export interface AICallLog {
    goal: string;
    inputTokens: number;
    outputTokens: number;
    latencyMs: number;
    cacheHit: boolean;
    retries: number;
}
export interface PipelineMetrics {
    totalInputTokens: number;
    totalOutputTokens: number;
    totalLatencyMs: number;
    cacheHits: number;
    apiCalls: number;
    totalRetries: number;
}
export interface OrchestratorResult {
    output: OrchestratorOutput;
    metrics: PipelineMetrics;
    callLogs: AICallLog[];
    startTime: Date;
    endTime: Date;
}
//# sourceMappingURL=output.schema.d.ts.map