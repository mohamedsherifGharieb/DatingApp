using System;
using Humanizer;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class PaginatedResult<T>
{
    public PaginationMetadata Metadata { get; set; } = default!;

    public List<T> Items { get; set; } = [];


};
public class PaginationHelper
{
    public static async Task<PaginatedResult<T>> CreateAsync<T>(IQueryable<T> query, int PageSize
 , int PageNumber)
{
    var count = await query.CountAsync();
    var items = await query.Skip((PageNumber - 1) * PageSize).Take(PageSize).ToListAsync();


    return new PaginatedResult<T>
    {
        Metadata = new PaginationMetadata
        {
            CurrentPage = PageNumber,
            TotalPages = (int)Math.Ceiling(count / (double)PageSize),
            PageSize = PageSize,
            TotalCount = count
        },
        Items = items
    };
    
 }
    
}

public class PaginationMetadata
{
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }

    public int PageSize { get; set; }

    public int TotalCount { get; set; }


};

