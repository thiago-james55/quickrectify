import { Injectable } from '@angular/core';
import { Consumer } from './consumer.entity';
import { OrderPart, Part } from './part.entity';
import { Order } from './order.entity';

@Injectable({
  providedIn: 'root'
})
export class RequestHandlerService {

  //Mock
  parts: Part[] = [
    { name: "Biela", services: ["Banho", "Completa", "Só Ferro", "Só Bucha", "Montar Pistão"] },
    { name: "Bloco", services: ["Banho", "Abrir", "Encamisar", "Plainar", "Soldar", "Mandrilhar", "Trocar Bucha"] },
    { name: "Cabeçote", services: ["Banho", "Plainar", "Soldar", "Mandrilhar", "Completo", "Regular"] },
    { name: "Virabrequim", services: ["Banho", "Retificar", "Encher Lateral", "Polir"] },
    { name: "Volante", services: ["Banho", "Retificar", "Virar Gremalheira"] },
    { name: "Solda", services: ["Solda Ferro", "Solda Aluminio", "Solda Cart"] },
    { name: "Outros", services: ["Outros"] },
  ];

  constructor() { }

  //GET CONSUMER
  getConsumerById(consumerId: number): Consumer {
    return this.getConsumers().filter(c => c.id === consumerId)[0];
  }

  //GET
  getConsumers(): Consumer[] {
    return this.generateMockConsumers();
  }

  //POST CONSUMER
  postConsumer(consumer: Consumer): Consumer {
    return consumer;
  }

  //PUT CONSUMER
  putConsumer(consumer: Consumer): Consumer {
    return consumer;
  }

  //GET - LIST OF ORDER
  getOrders(): Order[] {
    return this.generateMockOrders();
  }

  getOrderById(orderId: number): Order {
    return this.getOrders().filter(o => o.id === orderId)[0];
  }

  //GET - ENUM OF BACKEND
  getDefaultParts(): Part[] {

    this.parts.sort((a, b) => a.name.localeCompare(b.name));

    this.parts.forEach(e => {
      e.services.sort();
    });

    return this.parts;
  }

  //POST ORDER
  postOrder(order: Order): Order {
    return order;
  }

  
  //PUT ORDER
  putOrder(order: Order): Order {
    return order;
  }


  //MOCK

  generateMockConsumers(): Consumer[] {
    const consumers: Consumer[] = [];

    for (let i = 0; i < 100; i++) {
      consumers.push(
        {
          id: i,
          name: `Consumer ${i}`,
          document: "1234567",
          address: "Rua Random",
          phone1: "9-9875-4321"
        }
      )
    }

    return consumers;
  }

  generateMockOrders(): Order[] {

    let orders: Order[] = [];

    const consumers: Consumer[] = this.getConsumers();

    const defaultParts = this.getDefaultParts();

    for (let i = 1; i <= 50; i++) {
      const consumerIndex = Math.floor(Math.random() * consumers.length);
      const consumer = consumers[consumerIndex];

      const numberOfOrderParts = Math.floor(Math.random() * 5) + 1; // Random number of order parts (1 to 5)

      const orderParts: OrderPart[] = [];
      for (let j = 0; j < numberOfOrderParts; j++) {
        const partIndex = Math.floor(Math.random() * defaultParts.length);
        const selectedPart = defaultParts[partIndex];
        const serviceIndex = Math.floor(Math.random() * selectedPart.services.length);
        const selectedService = selectedPart.services[serviceIndex];

        const orderPart: OrderPart = {
          name: selectedPart.name,
          service: selectedService,
          description: `Description for ${selectedPart.name} - ${selectedService}`,
          quantity: Math.floor(Math.random() * 3) + 1, // Random quantity (1 to 3)
          pricePerQuantity: 50, // Random price per quantity (10 to 60)
          priceTotal: 0, // To be calculated later
        };

        if (orderPart.quantity && orderPart.pricePerQuantity) {
          orderPart.priceTotal = orderPart.quantity * orderPart.pricePerQuantity;
        }
        orderParts.push(orderPart);
      }

      const order: Order = {
        id: i,
        date: new Date(),
        consumer: consumer,
        orderParts: orderParts,
        discountPercent: 0,
        discountCash: 0,
        priceSubTotal: 0,
        priceTotal: 0,
      };

      order.priceSubTotal = orderParts.reduce((total, part) => total + part.priceTotal!, 0);
      order.priceTotal = order.priceSubTotal - order.discountCash! - (order.priceSubTotal * order.discountPercent!) / 100;

      orders.push(order);
    }

    return orders;
  }


}
