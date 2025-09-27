using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class PresenceHub(PresenceTracker presenceTracker) : Hub
{
    public override async Task OnConnectedAsync()
    {
        await presenceTracker
        .UserConnected(GetUserId()
        , Context.ConnectionId);
        await Clients.Others
        .SendAsync("UserOnline", GetUserId());

        var currentUser = await presenceTracker.GetOnlineUsers();
        await Clients.Caller.SendAsync("GetOnlineUsers", currentUser);
    }
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await presenceTracker
    .UserDiconnected(GetUserId()
    , Context.ConnectionId);

        await Clients.Others
       .SendAsync("UserOffline", GetUserId());
        var currentUser = await presenceTracker.GetOnlineUsers();

        await Clients.Caller.SendAsync("GetOnlineUsers", currentUser);

        await base.OnDisconnectedAsync(exception);
    }
    public string GetUserId()
    {
        return Context.User?.GetMemberId() ??
        throw new HubException("Cannot get Member Id");
    }

}
