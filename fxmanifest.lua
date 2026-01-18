fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'you'
description '17mov Phone Dispatch App -> lb-tablet AddDispatch'
version '1.0.0'

shared_scripts {
  '@ox_lib/init.lua',
  'locales/local.lua',
  'configs/config.lua',
}

client_scripts {
  'client/main.lua',
}

server_scripts {
  '@ox_lib/init.lua',
  'configs/config.lua',
  'server/main.lua',
}

-- WICHTIG: bei dir ist es build, nicht dist
ui_page 'web/build/index.html'

files {
  'web/build/index.html',
  'web/build/**/*'
}