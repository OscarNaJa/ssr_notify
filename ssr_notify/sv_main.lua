sendAlert = function(source, data)
    if not data then return end
    if source == -1 then return end
    TriggerClientEvent('vule:sendAlert', source, data)
end

exports('sendAlert', sendAlert)