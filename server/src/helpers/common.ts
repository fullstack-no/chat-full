import { Response } from "express";
import { STATUS_CODES } from "node:http";

// common
export function sendErrorResponse(res: Response, status: number, error?: any) {
  return res.status(status).json({
    error: status,
    message: STATUS_CODES[status],
    data: error?.message ?? error,
  });
}

export function sendBadRequestResponse(res: Response, error: any) {
  return sendErrorResponse(res, 400, error?.errors ?? error);
}
export function sendServerErrorResponse(res: Response, error: any) {
  return sendErrorResponse(res, 500, error);
}
export function sendTwoManyRequests(res: Response) {
  return sendErrorResponse(res, 429);
}
