export interface NotificacaoRequest {
    assunto: string;
    clientId: string; // Aqui pode ser string ou UUID, dependendo de como você deseja lidar com o UUID em Angular
    destinatarioUsername: string;
    remetenteUsername: string;
    descricao: string;
}