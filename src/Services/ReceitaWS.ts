import axios from "axios";
import HttpError from "../Helpers/HttpError";

export type CNPJResponse = {
    status: "OK";
    ultima_atualizacao: string;
    cnpj: string;
    tipo: string;
    porte: string;
    nome: string;
    fantasia: string;
    abertura: string;
    atividade_principal: Array<{
        code: string;
        text: string;
    }>;
    atividades_secundarias: Array<{
        code: string;
        text: string;
    }>;
    natureza_juridica: string;
    logradouro: string;
    numero: string;
    complemento: string;
    cep: string;
    bairro: string;
    municipio: string;
    uf: string;
    email: string;
    telefone: string;
    efr: string;
    situacao: string;
    data_situacao: string;
    motivo_situacao: string;
    situacao_especial: string;
    data_situacao_especial: string;
    capital_social: string;
    qsa: Array<{
        nome: string;
        qual: string;
        pais_origem: string;
        nome_rep_legal: string;
        qual_rep_legal: string;
    }>;
    simples: {
        optante: boolean;
        data_opcao: string;
        data_exclusao: string;
        ultima_atualizacao: string;
    };
    simei: {
        optante: boolean;
        data_opcao: string;
        data_exclusao: string;
        ultima_atualizacao: string;
    };
    billing: {
        free: boolean;
        database: boolean;
    };
};

export type CNPJErrorResponse = {
    status: "ERROR";
    message: string;
};

export async function getCNPJData(cnpj: string) {
    try {
        const { data } = await axios.get<CNPJResponse | CNPJErrorResponse>(
            `https://www.receitaws.com.br/v1/cnpj/${cnpj}`
        );

        if (data.status === "ERROR") {
            throw new Error(data.message);
        }
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 429) {
                throw HttpError.TooManyRequests("Muitas requisições, tente novamente mais tarde");
            }
        }
        throw err;
    }
}
