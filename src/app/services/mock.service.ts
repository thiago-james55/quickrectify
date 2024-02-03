import { Consumer, getConsumers } from "./consumer.entity";
import { Order } from "./order.entity";
import { getParts, OrderPart } from "./part.entity";

export const consumers: Consumer[] = getConsumers();

export const orders: Order[] = [];

export function generateMockOrders(): Order[] {
  const numberOfOrders = 50;
  const allParts = getParts();

  for (let i = 1; i <= numberOfOrders; i++) {
    const consumerIndex = Math.floor(Math.random() * consumers.length);
    const consumer = consumers[consumerIndex];

    const numberOfOrderParts = Math.floor(Math.random() * 5) + 1; // Random number of order parts (1 to 5)

    const orderParts: OrderPart[] = [];
    for (let j = 0; j < numberOfOrderParts; j++) {
      const partIndex = Math.floor(Math.random() * allParts.length);
      const selectedPart = allParts[partIndex];
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
      discountPercent:0, // Random discount percent (0 to 10)
      discountCash: 0, // Random discount cash (0 to 50)
      priceSubTotal: 0, // To be calculated later
      priceTotal: 0, // To be calculated later
    };

    order.priceSubTotal = orderParts.reduce((total, part) => total + part.priceTotal!, 0);
    order.priceTotal = order.priceSubTotal - order.discountCash! - (order.priceSubTotal * order.discountPercent!) / 100;

    orders.push(order);
  }

  return orders;
}

