

import { Response } from 'express';

function responseProvider(res: Response, data: any, message: string, code: number): Response {
    return res.status(code).json({ message, data });
}

interface ResponseObject {
    status: 'success' | 'failure';
    code: number;
    message: string;
    data: any;
}

function provideResponse(status: 'success' | 'failure', code: number, message: string, data: any): ResponseObject {
    return {
        status: status,
        code: code,
        message: message,
        data: data
    };
}

  
  
  
  
  module.exports={
    responseProvider,
    provideResponse,
  }