import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

function getErrorMessage(error: HttpErrorResponse): string {
  if (!navigator.onLine) return 'Sem conexão com a internet. Verifique sua rede.';

  const serverMessage: string | undefined = error.error?.message ?? error.error?.error;
  if (serverMessage) return serverMessage;

  switch (error.status) {
    case 0:    return 'Não foi possível conectar ao servidor.';
    case 400:  return 'Requisição inválida. Verifique os dados informados.';
    case 401:  return 'Sessão expirada. Faça login novamente.';
    case 403:  return 'Você não tem permissão para realizar esta ação.';
    case 404:  return 'Recurso não encontrado.';
    case 409:  return 'Conflito: este recurso já existe.';
    case 422:  return 'Dados inválidos. Corrija os campos e tente novamente.';
    case 429:  return 'Muitas requisições. Aguarde um momento e tente novamente.';
    case 500:  return 'Erro interno do servidor. Tente novamente mais tarde.';
    case 503:  return 'Serviço temporariamente indisponível.';
    default:   return `Erro inesperado (${error.status}). Tente novamente.`;
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = getErrorMessage(error);
      snackBar.open(message, 'Fechar', {
        duration: 5000,
        panelClass: ['snack-error'],
      });
      return throwError(() => error);
    })
  );
};
