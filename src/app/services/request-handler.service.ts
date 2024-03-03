import { resolve } from 'node:path';
import { Injectable } from '@angular/core';
import { Consumer } from './consumer.entity';
import { Part, DefaultPart } from './part.entity';
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
      return response;
    } catch (error) {
      this.handleError(error);
      throw error;
    };
  }

  //GET
  async getConsumers(): Promise<Consumer[]> {
    try {
      let consumers: Consumer[] = await this.getMethod(this.CONSUMERS_URL);
      return consumers;
    } catch (error) {
      this.handleError(error);
      throw error;
    };
  }

  //POST CONSUMER
  async postConsumer(consumer: Consumer): Promise<number> {
    try {
      const response = await this.postMethod(this.CONSUMERS_URL, consumer);
      return response.id;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  //PUT CONSUMER
  async putConsumer(consumer: Consumer): Promise<boolean> {
    try {
      const response = await this.putMethod(`${this.CONSUMERS_URL}/${consumer.id}`, consumer);
      if (response.status == 200) return true;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
    return false;
  }

  //GET - LIST OF ORDER OF THIS YEAR
  async getOrdersOfThisYear(): Promise<Order[]> {
    try {
      let orders: Order[] = await this.getMethod(this.ORDERS_URL);
      await this.convertSerializedDate(orders);
      return orders;
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
        const orders: Order[] = await this.postMethod(`${this.ORDERS_URL}/fromDate`, dateFilter);
        await this.convertSerializedDate(orders);
        return orders;
    } catch (error) {
        this.handleError(error);
        throw error;
    }
}

  //GET ORDER BY ID
  async getOrderById(orderId: number): Promise<Order> {
    try {
      let order: Order = await this.getMethod(`${this.ORDERS_URL}/${orderId}`);
      await this.convertSerializedDate(order);
      return order;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }


  async getDefaultParts(): Promise<DefaultPart[]> {
    try {
      const defaultParts: DefaultPart[] = await this.getMethod(this.DEFAULTPARTS_URL);
  
      if (defaultParts && defaultParts.length > 0) {

        defaultParts.sort((a, b) => {
          if (a.name && b.name) {
            return a.name.localeCompare(b.name);
          }
          return 0; 
        });
  

        defaultParts.forEach(e => {
          if (e.services && Array.isArray(e.services)) {
            e.services.sort();
          }
        });
      }
  
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
      const data = await response.json();
      return data;
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
      if (!response.ok) { this.handleError("Ordens nessa data não encontradas!"); return []; }
      const responseData = await response.json();
      return responseData;
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

  handleError(error: any) {
    this._toastService.showToastError(error);
  }

}

