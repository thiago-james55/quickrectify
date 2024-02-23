using Microsoft.EntityFrameworkCore;
using QuickRectify.Config;
using QuickRectify.Models;
using QuickRectify.Models.DTO;
using QuickRectify.Models.Input;
using System.Linq.Expressions;

namespace QuickRectify.Service
{
    public class RequestService
    {
        private readonly DbContextConfig _dbContextConfig;

        public RequestService(DbContextConfig dbContextConfig) 
        {
            _dbContextConfig = dbContextConfig;
        }

        #region Order
        public async Task<List<OrderDTO>> GetAllOrdersOfThisYearAsync()
        {
            try
            {
                int currentYear = DateTime.Now.Year;

                List<Order> orders = await _dbContextConfig.Orders
                    .Where(o => o.Date.Year == currentYear)
                    .Include(o => o.Consumer)
                    .Include(o => o.Parts)
                    .ToListAsync();

                List<OrderDTO> orderDTOs = orders.Select(o => new OrderDTO(o)).ToList();

                return orderDTOs;
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return null;
            }
        }

        public async Task<List<OrderDTO>> GetAllOrdersOfDateAsync(DateFilterInput dateFilterInput)
        {

            if (dateFilterInput.Final == null) dateFilterInput.Final = DateTime.UtcNow;
            
            try
            {
                if (dateFilterInput.Initial != null && (dateFilterInput.Initial > dateFilterInput.Final))
                {
                    throw new ArgumentException("Initial date cannot be greater than final date.");
                }

                Expression<Func<Order, bool>> filterWithOnlyFinalDate = o => o.Date <= dateFilterInput.Final;
                Expression<Func<Order, bool>> filterWithBothDates = o => o.Date >= dateFilterInput.Initial && o.Date <= dateFilterInput.Final;
                Expression<Func<Order, bool>> filter = (dateFilterInput.Initial != null) ? filterWithBothDates : filterWithOnlyFinalDate;

                List <Order> orders = await _dbContextConfig.Orders
                    .Where(filter)
                    .Include(o => o.Consumer)
                    .Include(o => o.Parts)
                    .ToListAsync();

                List<OrderDTO> orderDTOs = orders.Select(o => new OrderDTO(o)).ToList();

                return orderDTOs;
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return null;
            }
        }



        public async Task<OrderDTO> GetOrderByIdAsync(int id)
        {
            try
            {
            Order order = await _dbContextConfig.Orders
                        .Include(o => o.Consumer)
                        .Include(o => o.Parts)
                        .FirstOrDefaultAsync(o => o.Id == id);
            return new OrderDTO(order);

            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return null;
            }
        }


        public async Task<int> SaveOrderAsyncAndReturnId(OrderInput orderInput)
        {
            Order order = await orderInput.ToOrder();

            try
            {
                _dbContextConfig.Orders.Add(order);

                await _dbContextConfig.SaveChangesAsync();

                return order.Id;
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return 0;
            }
        }


        public async Task<bool> UpdateOrderAsync(int id, OrderInput orderInput)
        {
            try
            {
                Order existingOrder = await _dbContextConfig.Orders
                                        .Include(o => o.Parts)
                                        .FirstOrDefaultAsync(o => o.Id == id);


                await UpdateOrderInformation(existingOrder, orderInput);
                await _dbContextConfig.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return false;
            }
        }

        private async Task UpdateOrderInformation(Order existingOrder, OrderInput orderInput)
        {
            existingOrder.DiscountPercent = orderInput.DiscountPercent;
            existingOrder.DiscountCash = orderInput.DiscountCash;
            existingOrder.PriceSubTotal = orderInput.PriceSubTotal;
            existingOrder.PriceTotal = orderInput.PriceTotal;
            existingOrder.ConsumerId = orderInput.ConsumerId;
            existingOrder.Parts = orderInput.Parts.Select(p => p.ToPart()).ToList();
        }


        public async Task<bool> OrderExistsAsync(int id)
        {
            return await GetOrderByIdAsync(id) != null;
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            try
            {
                Order orderToDelete = await _dbContextConfig.Orders.SingleOrDefaultAsync(o => o.Id == id);

                if (orderToDelete != null)
                {
                    _dbContextConfig.Orders.Remove(orderToDelete);
                    await _dbContextConfig.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return false;
            }

            return false;

        }

        #endregion

        #region Consumer

        public async Task<List<ConsumerDTO>> GetAllConsumersAsync()
        {
            try
            {
                List<Consumer> consumers =  await _dbContextConfig.Consumers.ToListAsync();
                List<ConsumerDTO> consumerDTOs = consumers.Select(c => new ConsumerDTO(c)).ToList();
                return consumerDTOs;

            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return null;
            }

        }

        public async Task<ConsumerDTO> GetConsumerByIdAsync(int id)
        {
            try
            {
                Consumer consumer = await _dbContextConfig.Consumers.FirstOrDefaultAsync(c => c.Id == id);
                return new ConsumerDTO(consumer);
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return null;
            }
        }

        public async Task<int> SaveConsumerAsync(ConsumerInput consumerInput)
        {
            Consumer consumer = await consumerInput.ToConsumer();
            try
            {
                _dbContextConfig.Consumers.Add(consumer);

                await _dbContextConfig.SaveChangesAsync();

                return consumer.Id;
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return 0;
            }
        }

        public async Task<bool> UpdateConsumerAsync(int id, ConsumerInput consumerInput)
        {
            try
            {

                Consumer existingConsumer = await _dbContextConfig.Consumers.FirstOrDefaultAsync(c => c.Id == id);

                await UpdateConsumerInformationAsync(existingConsumer, consumerInput);

                await _dbContextConfig.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return false;
            }
        }

        private async Task UpdateConsumerInformationAsync(Consumer existingConsumer, ConsumerInput consumerInput)
        {
            existingConsumer.Name = consumerInput.Name;
            existingConsumer.Document = consumerInput.Document;
            existingConsumer.Address = consumerInput.Address;
            existingConsumer.Phone1 = consumerInput.Phone1;
            existingConsumer.Phone2 = consumerInput.Phone2;
            existingConsumer.Phone3 = consumerInput.Phone3;
        }

        public async Task<bool> ConsumerExistsAsync(int id)
        {
            return await GetConsumerByIdAsync(id) != null;
        }

        public async Task<bool> ConsumerIsUnique(ConsumerInput consumerInput)
        {
            return !await _dbContextConfig.Consumers
                .AnyAsync(c => c.Name == consumerInput.Name || c.Document == consumerInput.Document);

        }

        public async Task<bool> DeleteConsumerAsync(int id)
        {
            try
            {

                Consumer consumerToDelete = await _dbContextConfig.Consumers.SingleOrDefaultAsync(c => c.Id == id);

                if (consumerToDelete != null)
                {
                    _dbContextConfig.Consumers.Remove(consumerToDelete);
                    await _dbContextConfig.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception ex) 
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return false;
            }

            return false;

        }

        public async Task<bool> ConsumerHaveOrdersAsync(int consumerId)
        {
            return await _dbContextConfig.Orders
                .AnyAsync(o => o.ConsumerId == consumerId);
        }



        #endregion

    }

}

