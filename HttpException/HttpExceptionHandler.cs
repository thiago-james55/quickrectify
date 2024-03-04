using Microsoft.EntityFrameworkCore;
using System.Net;

namespace QuickRectify.HttpException
{
    public static class HttpExceptionHandler
    {
        public static HttpRequestException HandleCommonExceptions(Exception ex)
        {
            if (ex is DbUpdateException dbUpdateException)
            {
                return new HttpRequestException("Database error", dbUpdateException, HttpStatusCode.InternalServerError);
            }
            else
            {
                return new HttpRequestException("Internal Server Error", ex, HttpStatusCode.InternalServerError);
            }
        }

        public static HttpRequestException ThrowCustomHttpException(string? message, Exception? inner, HttpStatusCode? statusCode)
        {
            return new HttpRequestException(message, inner, statusCode);
        }
    }
}
