using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using QuickRectify.Config;
using QuickRectify.HttpException;
using QuickRectify.Migrations;
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
        public async Task<PagedResult<OrderDTO>> GetAllOrdersOfThisYearAsync(int page, int pageSize)
        {
            try
            {
                int currentYear = DateTime.Now.Year;

                // total de registros do ano atual
                int totalCount = await _dbContextConfig.Orders
                    .Where(o => o.Date.Year == currentYear)
                    .CountAsync();

                // registros da página atual
                List<Order> orders = await _dbContextConfig.Orders
                    .Where(o => o.Date.Year == currentYear)
                    .Include(o => o.Consumer)
                    .Include(o => o.Parts)
                    .OrderByDescending(o => o.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var orderDTOs = orders.Select(o => new OrderDTO(o)).ToList();

                return new PagedResult<OrderDTO>
                {
                    Items = orderDTOs,
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalCount = totalCount
                };
            }
            catch (Exception ex)
            {
                HttpExceptionHandler.HandleCommonExceptions(ex);
                return null;
            }
        }


        public async Task<List<OrderDTO>> GetAllOrdersOfDateAsync(DateFilterInput dateFilterInput)
        {

            if (dateFilterInput.Final == null) dateFilterInput.Final = DateTime.Now;

            try
            {
                if (dateFilterInput.Initial != null && (dateFilterInput.Initial > dateFilterInput.Final))
                {
                    throw new ArgumentException("Initial date cannot be greater than final date.");
                }

                Expression<Func<Order, bool>> filterWithOnlyFinalDate = o => o.Date <= dateFilterInput.Final;
                Expression<Func<Order, bool>> filterWithBothDates = o => o.Date >= dateFilterInput.Initial && o.Date <= dateFilterInput.Final;
                Expression<Func<Order, bool>> filter = (dateFilterInput.Initial != null) ? filterWithBothDates : filterWithOnlyFinalDate;

                List<Order> orders = await _dbContextConfig.Orders
                    .Where(filter)
                    .Include(o => o.Consumer)
                    .Include(o => o.Parts)
                    .OrderByDescending(o => o.Id)
                    .ToListAsync();

                List<OrderDTO> orderDTOs = orders.Select(o => new OrderDTO(o)).ToList();

                return orderDTOs;
            }
            catch (Exception ex)
            {
                HttpExceptionHandler.HandleCommonExceptions(ex);
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
                HttpExceptionHandler.HandleCommonExceptions(ex);
                return null;
            }
        }


        public async Task<Order> GetEngineBlockNumberImageByOrderIdAsync(int id)
        {
            try
            {
                return await _dbContextConfig.Orders.FirstOrDefaultAsync(o => o.Id == id);
            }
            catch (Exception ex)
            {
                HttpExceptionHandler.HandleCommonExceptions(ex);
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
                HttpExceptionHandler.HandleCommonExceptions(ex);
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
                HttpExceptionHandler.HandleCommonExceptions(ex);
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
            existingOrder.Parts = (await Task.WhenAll(orderInput.Parts.Select(async p => await p.ToPart()))).ToList();
            existingOrder.EngineBlockNumberImage = orderInput.ConvertBase64ToByteArray(orderInput.EngineBlockNumberImage);
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
                HttpExceptionHandler.HandleCommonExceptions(ex);
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

                List<Consumer> consumers = await _dbContextConfig.Consumers.ToListAsync();
                List<ConsumerDTO> consumerDTOs = consumers.Select(c => new ConsumerDTO(c)).ToList();

                consumerDTOs.Sort((consumer1, consumer2) => consumer1.Name.CompareTo(consumer2.Name));
                return consumerDTOs;

            }
            catch (Exception ex)
            {
                HttpExceptionHandler.HandleCommonExceptions(ex);
                return null;
            }

        }

        public async Task<ConsumerDTO> GetConsumerByIdAsync(int id)
        {
            try
            {
                Consumer consumer = await _dbContextConfig.Consumers.FirstOrDefaultAsync(c => c.Id == id);

                if (consumer != null)
                {
                    return new ConsumerDTO(consumer);
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw new HttpRequestException("Internal Server Error", ex, System.Net.HttpStatusCode.InternalServerError);
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
                HttpExceptionHandler.HandleCommonExceptions(ex);
                return 0;
            }
        }

        public async Task<bool> UpdateConsumerAsync(int id, ConsumerInput consumerInput)
        {
            try
            {

                Consumer existingConsumer = await _dbContextConfig.Consumers.FirstOrDefaultAsync(c => c.Id == id);

                await UpdateConsumerInformationAsync(existingConsumer, await consumerInput.ToConsumer());

                await _dbContextConfig.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                HttpExceptionHandler.HandleCommonExceptions(ex);
                return false;
            }
        }

        private async Task UpdateConsumerInformationAsync(Consumer existingConsumer, Consumer consumerInput)
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

        public async Task<bool> ConsumerIsUnique(int? consumerId, ConsumerInput consumerInput)
        {
            if (consumerId != null)
            {
                return await _dbContextConfig.Consumers.AnyAsync(c => c.Name == consumerInput.Name && c.Id != consumerId) ||
                    await _dbContextConfig.Consumers.AnyAsync(c => c.Document == consumerInput.Document && c.Id != consumerId);
            }

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
                HttpExceptionHandler.HandleCommonExceptions(ex);
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

        #region Balance

        public async Task<BalanceDTO> GetBalanceByIdAsync(int id)
        {
            try
            {
                Balance balance = await _dbContextConfig.Balances
                            .Include(b => b.Consumer)
                            .FirstOrDefaultAsync(o => o.Id == id);
                return new BalanceDTO(balance);
            }
            catch (Exception ex)
            {
                HttpExceptionHandler.HandleCommonExceptions(ex);
                return null;
            }
        }

        public async Task<List<BalanceDTO>> GetBalancesOfYearAsync(int year)
        {
            try
            {
                List<Balance> balances = await _dbContextConfig.Balances
                        .Where(b => b.Date.Year == year)
                        .Include(b => b.Consumer)
                        .OrderByDescending(o => o.Id)
                        .ToListAsync();

                List<BalanceDTO> balancesDTOs = balances.Select(b => new BalanceDTO(b)).ToList();
                return balancesDTOs;
            }
            catch (Exception ex)
            {
                HttpExceptionHandler.HandleCommonExceptions(ex);
                return null;
            }
        }

        public async Task<int> SaveBalanceAsyncAndReturnId(BalanceInput balanceInput)
        {
            await using var transaction = await _dbContextConfig.Database.BeginTransactionAsync();

            try
            {
                Balance balance = await balanceInput.ToBalance();

                _dbContextConfig.Balances.Add(balance);
                await _dbContextConfig.SaveChangesAsync();

                OrderInput orderInput = await CreateOrEditOrderInputForBalance(balance);

                int orderId = await SaveOrderAsyncAndReturnId(orderInput);

                if (orderId == 0)
                {
                    await transaction.RollbackAsync();
                    return 0;
                }

                balance.OrderId = orderId;
                await _dbContextConfig.SaveChangesAsync();

                await transaction.CommitAsync();

                return balance.Id;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                HttpExceptionHandler.HandleCommonExceptions(ex);
                return 0;
            }
        }

        public async Task<bool> UpdateBalanceAsync(BalanceInput balanceInput)
        {
            await using var transaction = await _dbContextConfig.Database.BeginTransactionAsync();

            try
            {
                Balance existingBalance = await _dbContextConfig.Balances
                    .FirstOrDefaultAsync(b => b.Id == balanceInput.Id);

                if (existingBalance == null)
                    return false;

                await UpdateBalanceInformationAsync(existingBalance,await balanceInput.ToBalance());

                OrderInput orderInput = await CreateOrEditOrderInputForBalance(existingBalance);

                if (existingBalance.OrderId.HasValue)
                {
                    await UpdateOrderAsync(existingBalance.OrderId.Value,orderInput);
                }
                else
                {
                    int orderId = await SaveOrderAsyncAndReturnId(orderInput);

                    if (orderId == 0)throw new Exception("Failed to create Order.");

                    existingBalance.OrderId = orderId;
                }

                await _dbContextConfig.SaveChangesAsync();

                await transaction.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                HttpExceptionHandler.HandleCommonExceptions(ex);
                return false;
            }
        }

        private async Task UpdateBalanceInformationAsync(Balance existingBalance, Balance balanceInput)
        {
            existingBalance.Date = balanceInput.Date;
            existingBalance.DateOfPayment = balanceInput.DateOfPayment;
            existingBalance.InitialOrder = balanceInput.InitialOrder;
            existingBalance.FinalOrder = balanceInput.FinalOrder;
            existingBalance.ExcludedOrders = balanceInput.ExcludedOrders;
            existingBalance.Description = balanceInput.Description;
            existingBalance.ConsumerId = balanceInput.ConsumerId;
            existingBalance.PriceTotal = balanceInput.PriceTotal;
            existingBalance.IsPaid = balanceInput.IsPaid;
        }

        private async Task<OrderInput> CreateOrEditOrderInputForBalance(Balance balance)
        {
            OrderInput orderInput = new OrderInput();
            orderInput.PriceSubTotal = balance.PriceTotal;
            orderInput.PriceTotal = balance.PriceTotal;
            orderInput.ConsumerId = balance.ConsumerId;

            PartInput partInput = new PartInput();
            partInput.Name = "Financeiro";
            partInput.Service = "Fechamento";
            partInput.Description = balance.ToStringBasic();
            partInput.Quantity = 1;
            partInput.PricePerQuantity = balance.PriceTotal;
            partInput.PriceTotal = balance.PriceTotal;
            partInput.IsPaid = balance.IsPaid;

            orderInput.Parts.Add(partInput);

            return orderInput;
        }

        public async Task<bool> UpdateBalanceToPaid(BalanceInput balanceInput)
        {
            await using var transaction =
                await _dbContextConfig.Database.BeginTransactionAsync();

            try
            {
                var existingBalance = await _dbContextConfig.Balances
                    .FirstOrDefaultAsync(b => b.Id == balanceInput.Id);

                if (existingBalance == null)
                    return false;

                if (!existingBalance.OrderId.HasValue)
                {
                    var orderInput =
                        await CreateOrEditOrderInputForBalance(existingBalance);

                    int orderId = await SaveOrderAsyncAndReturnId(orderInput);

                    if (orderId == 0)
                        throw new Exception("Failed to create Order.");

                    existingBalance.OrderId = orderId;
                    await _dbContextConfig.SaveChangesAsync();
                }

                int rows = await PayPartsByBalanceAsync(balanceInput);

                if (rows < 1)
                    return false;

                existingBalance.IsPaid = true;
                existingBalance.DateOfPayment = DateTime.Now;

                await _dbContextConfig.SaveChangesAsync();

                await transaction.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                HttpExceptionHandler.HandleCommonExceptions(ex);
                return false;
            }
        }

        public async Task<bool> UpdateSimpleBalanceToPaid(SimpleBalanceInput simpleBalanceInput)
        {
            try
            {
                int rows = await PayPartsByListAndConsumerIdAsync(simpleBalanceInput.OrderIds, simpleBalanceInput.ConsumerId);

                if (rows >= 1) return true;

                return false;
            }
            catch (Exception ex)
            {
                HttpExceptionHandler.HandleCommonExceptions(ex);
                return false;
            }
        }

        public async Task<List<OrderDTO>> GetBalanceOrders(int id)
        {
            Balance balance = await _dbContextConfig.Balances
                .Include(b => b.Consumer)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (balance == null)
                return new List<OrderDTO>();

            List<Order> orders = await _dbContextConfig.Orders
                .Where(o => o.Id >= balance.InitialOrder
                         && o.Id <= balance.FinalOrder
                         && o.ConsumerId == balance.ConsumerId)
                .Include(o => o.Consumer)
                .Include(o => o.Parts)
                .OrderByDescending(o => o.Id)
                .ToListAsync();

            var orderDTOs = orders.Select(o => new OrderDTO(o)).ToList();

            return orderDTOs;
        }

        public async Task<bool> BalanceExistsAsync(int id)
        {
            return await GetBalanceByIdAsync(id) != null;
        }

        #endregion

        public async Task<int> PayPartsByBalanceAsync(BalanceInput balanceInput)
        {
            try
            {
                var orderIds = await _dbContextConfig.Orders
                    .Where(o =>
                        o.Id >= balanceInput.InitialOrder &&
                        o.Id <= balanceInput.FinalOrder &&
                        o.ConsumerId == balanceInput.ConsumerId)
                    .Select(o => o.Id)
                    .ToListAsync();

                var balanceOrderId = await _dbContextConfig.Balances
                    .Where(b => b.Id == balanceInput.Id)
                    .Select(b => b.OrderId)
                    .FirstOrDefaultAsync();

                if (balanceOrderId != 0)
                {
                    orderIds.Add(balanceOrderId ?? throw new Exception("OrderId is null."));
                }

                return await _dbContextConfig.Parts
                    .Where(p => orderIds.Contains(p.OrderId))
                    .ExecuteUpdateAsync(p => p.SetProperty(x => x.IsPaid, true));
            }
            catch (Exception ex)
            {
                HttpExceptionHandler.HandleCommonExceptions(ex);
                return 0;
            }
        }

        public async Task<int> PayPartsByListAndConsumerIdAsync(List<int> orderIds, int consumerId)
        {
            try
            {
                if (orderIds == null || orderIds.Count == 0)
                    return 0;

                var orders = await _dbContextConfig.Orders
                        .Where(o => orderIds.Contains(o.Id) && o.ConsumerId == consumerId)
                        .Select(o => o.Id)
                        .ToListAsync();

                return await _dbContextConfig.Parts
                    .Where(p => orders.Contains(p.OrderId))
                    .ExecuteUpdateAsync(p => p.SetProperty(x => x.IsPaid, true));

            }
            catch (Exception ex)
            {
                HttpExceptionHandler.HandleCommonExceptions(ex);
                return 0;
            }
        }
    }

}

