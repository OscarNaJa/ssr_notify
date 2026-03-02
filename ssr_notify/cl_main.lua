
sendAlert = function(data)
    if not data then return end
    SendNUIMessage({
        type = 'alert',
        info = data
    })
end

exports('sendAlert', sendAlert)

RegisterNetEvent('ssr_notify:client:sendAlert')
AddEventHandler('ssr_notify:client:sendAlert', function(data)
    sendAlert(data)
end)
