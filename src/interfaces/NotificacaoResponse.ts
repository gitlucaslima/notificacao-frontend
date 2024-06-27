import { v4 as uuidv4 } from 'uuid';

export interface NotificacaoResponse {
    id: string; // Utilizando string para o UUID
    assunto: string;
    client: string; // Utilizando string para o UUID
    destinatarioUsername: string;
    remetenteUsername: string;
    descricao: string;
    createdAt: string; // Pode ajustar o tipo conforme o formato de data retornado pela API
    updateAt: string; // Pode ajustar o tipo conforme o formato de data retornado pela API
    emailEnviado: boolean;
}