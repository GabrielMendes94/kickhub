import { z } from "zod";

export const baterPontoSchema = z.object({
    date: z.string().min(1, "Informe a data."),
    time: z.string().min(1, "Informe o horário."),
    location: z.string().min(2, "Informe o local."),
    notes: z.string().max(200, "No máximo 200 caracteres.").optional(),
});

export type BaterPontoFormData = z.infer<typeof baterPontoSchema>;

export const baterPontoDefaultValues: BaterPontoFormData = {
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toISOString().slice(11, 16),
    location: "Escritório",
    notes: "",
};

export const corrigirPontoSchema = z.object({
    recordId: z.string().min(1, "Selecione um registro."),
    newDate: z.string().min(1, "Informe a nova data."),
    newTime: z.string().min(1, "Informe o novo horário."),
    reason: z.string().min(10, "Explique o motivo."),
});

export type CorrigirPontoFormData = z.infer<typeof corrigirPontoSchema>;

export const corrigirPontoDefaultValues: CorrigirPontoFormData = {
    recordId: "",
    newDate: new Date().toISOString().slice(0, 10),
    newTime: new Date().toISOString().slice(11, 16),
    reason: "",
};
