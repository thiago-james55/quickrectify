import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Consumer } from './consumer.entity';
import { DefaultPart } from './part.entity';
import { Order } from './order.entity';
import { ToastService } from './toast.service';
import { Balance } from './balance.entity';
import { firstValueFrom } from 'rxjs';
import { SimpleBalance } from './simple-balance.entity';

@Injectable({
  providedIn: 'root'
})
export class RequestHandlerService {

  private readonly SERVER = "http://host.docker.internal:5000";
  //private readonly SERVER = "http://localhost:5000"; //USE VSTUDIO LAUNCH "HTTP"
  private readonly CONSUMERS_URL = `${this.SERVER}/Consumers`;
  private readonly ORDERS_URL = `${this.SERVER}/Orders`;
  private readonly BALANCE_URL = `${this.SERVER}/Balances`;
  private readonly CHART_URL = `${this.SERVER}/Chart`;
  public readonly ORDER_ENGINEBLOCKNUMBERIMAGE_URL = `${this.ORDERS_URL}/EngineBlockNumberImage`;
  private readonly DEFAULTPARTS_URL = `${this.SERVER}/DefaultParts`;

  private readonly dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };

  constructor(
    private http: HttpClient,
    private _toastService: ToastService
  ) { }

  // ========================
  // CONSUMERS
  // ========================

  async getConsumerById(consumerId: number): Promise<Consumer> {
    try {
      return await firstValueFrom(
        this.http.get<Consumer>(`${this.CONSUMERS_URL}/${consumerId}`)
      );
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getConsumers(): Promise<Consumer[]> {
    try {
      const consumers = await firstValueFrom(
        this.http.get<Consumer[]>(this.CONSUMERS_URL)
      );

      if (!consumers.length) throw new Error("Clientes não encontrados!");
      return consumers;

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async postConsumer(consumer: Consumer): Promise<number> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ id: number }>(this.CONSUMERS_URL, consumer)
      );
      return res.id;
    } catch (error: any) {
      if (error.status === 400) {
        this.handleError("Cliente já cadastrado!");
      }
      throw error;
    }
  }

  async putConsumer(consumer: Consumer): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.put(`${this.CONSUMERS_URL}/${consumer.id}`, consumer)
      );
      return true;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // ========================
  // ORDERS
  // ========================

  async getOrdersOfThisYear(page = 1, pageSize = 100): Promise<PagedResult<Order>> {
    try {
      const url = `${this.ORDERS_URL}?page=${page}&pageSize=${pageSize}`;

      const response = await firstValueFrom(
        this.http.get<PagedResult<Order>>(url)
      );

      await this.convertSerializedDateOfOrder(response.items);
      return response;

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getOrdersFromDate(initial: Date, final: Date): Promise<Order[]> {
    try {
      const response = await firstValueFrom(
        this.http.post<Order[]>(`${this.ORDERS_URL}/fromDate`, {
          initial: initial.toISOString(),
          final: final.toISOString()
        })
      );

      await this.convertSerializedDateOfOrder(response);
      return response;

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getOrderById(orderId: number): Promise<Order> {
    try {
      const order = await firstValueFrom(
        this.http.get<Order>(`${this.ORDERS_URL}/${orderId}`)
      );

      await this.convertSerializedDateOfOrder(order);
      return order;

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getOrderEngineBlockNumberImageById(orderId: number): Promise<string> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ engineBlockNumberImage: string }>(
          `${this.ORDER_ENGINEBLOCKNUMBERIMAGE_URL}/${orderId}`
        )
      );

      return res.engineBlockNumberImage;

    } catch (error) {
      this.handleError("Imagem não encontrada!");
      throw error;
    }
  }

  async getDefaultParts(): Promise<DefaultPart[]> {
    try {
      return await firstValueFrom(
        this.http.get<DefaultPart[]>(this.DEFAULTPARTS_URL)
      );
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async postOrder(order: Order): Promise<number> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ id: number }>(this.ORDERS_URL, order)
      );
      return res.id;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async putOrder(order: Order): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.put(`${this.ORDERS_URL}/${order.id}`, order)
      );
      return true;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // ========================
  // BALANCE
  // ========================

  async getBalanceById(id: number): Promise<Balance> {
    const balance = await firstValueFrom(
      this.http.get<Balance>(`${this.BALANCE_URL}/${id}`)
    );

    await this.convertSerializedDateOfBalance(balance);
    return balance;
  }

  async getBalancesByYear(year?: number): Promise<Balance[]> {
    const balances =  await firstValueFrom(
      this.http.get<Balance[]>(`${this.BALANCE_URL}/fromYear/${year}`)
    );

    await this.convertSerializedDateOfBalance(balances);
    return balances;
  }

  async postBalance(balance: Balance): Promise<number> {
    const res = await firstValueFrom(
      this.http.post<{ id: number }>(this.BALANCE_URL, balance)
    );
    return res.id;
  }

  async putBalance(balance: Balance): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.http.put<boolean>(this.BALANCE_URL, balance)
      );
      return result;
    } catch {
      return false;
    }
  }

  async getBalanceOrders(id: number): Promise<Order[]> {
    try {
      const orders = await firstValueFrom(
        this.http.get<Order[]>(`${this.BALANCE_URL}/orders/${id}`));
      await this.convertSerializedDateOfOrder(orders);
      return orders;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async setPaidAllOrdersOfTheFilter(simpleBalance: SimpleBalance): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.http.put<boolean>(`${this.BALANCE_URL}/simplePaid`, simpleBalance)
      );
      return result;
    } catch {
      return false;
    }
  }

  async setPaidBalance(balance: Balance): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.http.put<boolean>(`${this.BALANCE_URL}/paid`, balance)
      );
      return result;
    } catch {
      return false;
    }
  }

  // ========================
  // CHART
  // ========================

  async getCharts(): Promise<any> {
  return await firstValueFrom(
    this.http.get(`${this.CHART_URL}`)
  );
}

  // ========================
  // UTILS
  // ========================

  formatDate(date: Date): string {
    const brasilia = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    return new Intl.DateTimeFormat('pt-BR', this.dateOptions).format(brasilia);
  }

  async convertSerializedDateOfOrder(data: Order[] | Order | undefined): Promise<void> {
    if (!data) return;

    const adjust = (o: Order) => { if (o.date) o.date = new Date(o.date); };

    if (Array.isArray(data)) data.forEach(adjust);
    else adjust(data);
  }

  async convertSerializedDateOfBalance(data: Balance[] | Balance | undefined): Promise<void> {
    if (!data) return;

    const adjust = (b: Balance) => {
      if (b.date) b.date = new Date(b.date);
      if (b.dateOfPayment)  b.dateOfPayment = new Date(b.dateOfPayment) ;
    };

    if (Array.isArray(data)) data.forEach(adjust);
    else adjust(data);
  }

  handleError(error: any) {
    if (error?.status === 0) {
      this._toastService.showToastError("Erro ao conectar com servidor");
      return;
    }

    if (error?.error?.message) {
      this._toastService.showToastError(error.error.message);
      return;
    }
  }

}



export interface PagedResult<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  haveNextPage: boolean;
}