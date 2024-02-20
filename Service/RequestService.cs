using Microsoft.EntityFrameworkCore;
using QuickRectify.Config;
using QuickRectify.Models;
using QuickRectify.Models.DTO;

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
        public async Task<List<OrderDTO>> GetAllOrdersAsync()
        {
            try
            {
                List<Order> orders = await _dbContextConfig.Orders.Include(o => o.Consumer).Include(o => o.Parts).ToListAsync();

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


        public async Task<OrderDTO> SaveOrderAsync(OrderInput orderInput)
        {
            Order order = await orderInput.ToOrder();

            try
            {
                _dbContextConfig.Orders.Add(order);

                await _dbContextConfig.SaveChangesAsync();

                order = await _dbContextConfig.Orders
                        .Include(o => o.Consumer)
                        .Include(o => o.Parts)
                        .SingleOrDefaultAsync(o => o.Id == order.Id);

                return new OrderDTO(order);
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return null;
            }
        }
               

        public async Task<OrderDTO> EditOrderAsync(Order order)
        {
            try
            {
                _dbContextConfig.Orders.Update(order);

                await _dbContextConfig.SaveChangesAsync();

                return new OrderDTO(order);
            } catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return null;
            }
        }
              

        #endregion

        #region Consumer

        public async Task<List<Consumer>> GetAllConsumersAsync()
        {
            try
            {
                return await _dbContextConfig.Consumers.ToListAsync();

            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return null;
            }

        }

        public async Task<Consumer> GetConsumerByIdAsync(int id)
        {
            try
            {
                return await _dbContextConfig.Consumers.FirstOrDefaultAsync(c => c.Id == id);
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return null;
            }
        }

        public async Task<Consumer> SaveConsumerAsync(Consumer consumer)
        {
            try
            {
                _dbContextConfig.Consumers.Add(consumer);

                await _dbContextConfig.SaveChangesAsync();

                return consumer;
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return null;
            }
        }

        public async Task<Consumer> EditConsumerAsync(Consumer consumer)
        {
            try
            {
                _dbContextConfig.Consumers.Update(consumer);

                await _dbContextConfig.SaveChangesAsync();

                return consumer;
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync(ex.ToString());
                return null;
            }
        }

        #endregion

    }

}

