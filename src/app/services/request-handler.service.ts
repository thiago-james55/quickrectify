import { Injectable } from '@angular/core';
import { Consumer } from './consumer.entity';
import { DefaultPart } from './part.entity';
import { Order } from './order.entity';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class RequestHandlerService {

  private readonly SERVER = "http://localhost:5000";
  private readonly CONSUMERS_URL = `${this.SERVER}/Consumers`;
  private readonly ORDERS_URL = `${this.SERVER}/Orders`;
  private readonly DEFAULTPARTS_URL = `${this.SERVER}/DefaultParts`;

  private readonly dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };


  constructor(private _toastService: ToastService) { }

  //GET CONSUMER
  async getConsumerById(consumerId: number): Promise<Consumer> {
    try {
      const response = await this.getMethod(`${this.CONSUMERS_URL}/${consumerId}`);
      if (response) return response;
      else throw new Error(`Cliente com o ID ${consumerId} não encontrado!`);
    } catch (error) {
      this.handleError(error);
      throw error;
    };
  }

  //GET
  async getConsumers(): Promise<Consumer[]> {
    try {
      let consumers: Consumer[] = await this.getMethod(this.CONSUMERS_URL);
      if (consumers && consumers.length > 0) return consumers;
      else if (consumers.length <= 0) throw new Error("Clientes não encontrados!");
      return [];
    } catch (error) {
      this.handleError(error);
      throw error;
    };
  }

  //POST CONSUMER
  async postConsumer(consumer: Consumer): Promise<number> {
    try {
      const response = await this.postMethod(this.CONSUMERS_URL, consumer);
      if (response && response.id) return response.id;
      if (response.status == 400) throw new Error("Cliente com esse nome ou documento ja cadastrado!");
    } catch (error) {
      this.handleError(error);
      throw error;
    }
    return 0;
  }

  //PUT CONSUMER
  async putConsumer(consumer: Consumer): Promise<boolean> {
    try {
      const response = await this.putMethod(`${this.CONSUMERS_URL}/${consumer.id}`, consumer);
      if (response.ok) return true;
      if (response.status == 400) this.handleError("Cliente com esse nome ou documento ja cadastrado!");
    } catch (error) {
      this.handleError(error);
      throw error;
    }
    return false;
  }

  //GET - LIST OF ORDER OF THIS YEAR
  async getOrdersOfThisYear(): Promise<Order[]> {
    try {
      const response = await this.getMethod(this.ORDERS_URL);

      if (response) {
        const orders: Order[] = response;
        await this.convertSerializedDate(orders);
        return orders;
      } else {
        throw new Error("Ordens desse ano não encontradas!");
      }
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  

  //GET - LIST OF ORDER FROM DATE
  async getOrdersFromDate(filterByInitialDate: Date, filterByFinalDate: Date): Promise<Order[]> {

    const dateFilter = {
      initial: filterByInitialDate.toISOString(),
      final: filterByFinalDate.toISOString()
    };

    try {

      const response = await this.postMethod(`${this.ORDERS_URL}/fromDate`, dateFilter);

      if (response) {
        let orders: Order[] = response;
        await this.convertSerializedDate(orders);
        return orders;
      } else throw new Error("Ordens nessa data não encontradas!");

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  //GET ORDER BY ID
  async getOrderById(orderId: number): Promise<Order> {
    try {
      const response = await this.getMethod(`${this.ORDERS_URL}/${orderId}`);

      if (response) {
        let order: Order = response;
        await this.convertSerializedDate(order);
        return order;
      }

      throw new Error("Ordem com essa id não encontradas");

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }


  async getDefaultParts(): Promise<DefaultPart[]> {
    try {
      const defaultParts: DefaultPart[] = await this.getMethod(this.DEFAULTPARTS_URL);
      return defaultParts;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async postOrder(order: Order): Promise<number> {
    try {
      const response = await this.postMethod(this.ORDERS_URL, order);
      return response.id;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }


  async putOrder(order: Order): Promise<boolean> {
    try {
      const response = await this.putMethod(`${this.ORDERS_URL}/${order.id}`, order);
      if (response.ok) return true;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
    return false;
  }



  formatDate(date: Date): string {
    // Assuming date is in UTC and you want to convert it to Brasília time
    const brasiliaTime = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

    return new Intl.DateTimeFormat('pt-BR', this.dateOptions).format(brasiliaTime);
  }


  async convertSerializedDate(orders: Order[] | Order | undefined): Promise<void> {
    if (!orders) return;

    if (Array.isArray(orders)) {
      await Promise.all(orders.map(async (o) => {
        if (o.date) {
          o.date = new Date(o.date);
          o.date.setHours(o.date.getHours() - 3); // GMT
        }
      }));
      return;
    } else if (orders.date) {
      orders.date = new Date(orders.date);
      orders.date.setHours(orders.date.getHours() - 3); // GMT
    }
  }

  async getMethod(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else this.handleError(response);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async postMethod(url: string, data: any): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok){
        const responseData = await response.json();
        return responseData;
      }
      return response;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async putMethod(url: string, data: any): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response;
      return responseData;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteMethod(url: string): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async handleError(error: any) {


    if (error.message && error.message == "NetworkError when attempting to fetch resource.") {
      this._toastService.showToastError("Erro ao Contatar Servidor!");
      return;
    }

    if (error) {
      this._toastService.showToastError(error);
      return;
    }

  }

}

