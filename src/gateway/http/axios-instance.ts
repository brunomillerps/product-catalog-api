import axios, { AxiosInstance } from 'axios';
import IHttp from './http-client';

export class Http implements IHttp {
  public readonly instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL });
  }
}