-- ตัวอย่างการใช้งาน export notify จาก resource อื่น
-- วางไฟล์นี้ไว้ใน resource ที่ต้องการเรียกใช้งาน และแก้ชื่อ event ให้ตรงกับระบบของคุณ

local function notifySuccess()
    exports['ssr_notify']:sendAlert({
        title = 'สำเร็จ',
        msg = 'บันทึกข้อมูลเรียบร้อยแล้ว',
        type = 'success'
    })
end

local function notifyError()
    exports['ssr_notify']:sendAlert({
        title = 'ผิดพลาด',
        msg = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
        type = 'error'
    })
end

local function notifyWarning()
    exports['ssr_notify']:sendAlert({
        title = 'คำเตือน',
        msg = 'กรุณาตรวจสอบข้อมูลอีกครั้ง',
        type = 'warning'
    })
end

local function notifyInfo()
    exports['ssr_notify']:sendAlert({
        title = 'แจ้งเตือน',
        msg = 'ระบบพร้อมใช้งาน',
        type = 'info'
    })
end

-- ตัวอย่างคำสั่งทดสอบในเกม
RegisterCommand('testnotify', function(_, args)
    local mode = (args[1] or 'info'):lower()

    if mode == 'success' then
        notifySuccess()
    elseif mode == 'error' then
        notifyError()
    elseif mode == 'warning' then
        notifyWarning()
    else
        notifyInfo()
    end
end, false)
