using System;

namespace API.Errors;

public class ApiException(int statusCode , string Message , string? details )
{
    public int StatusCode { get; set; } = statusCode;
    public string Message { get; set; } = Message;
    public string? Details { get; set; } = details;     


}
