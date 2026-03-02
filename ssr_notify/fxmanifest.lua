fx_version 'cerulean'
games { 'gta5', 'rdr3' }
lua54 'yes'
description 'Notification system for Fivem/RDR3' 
version '6.0.0'

client_script 'cl_main.lua'
server_script 'sv_main.lua'

ui_page 'src/index.html'

files {
    'src/*.*',
}

