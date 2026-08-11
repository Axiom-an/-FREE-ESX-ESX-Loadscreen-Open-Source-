fx_version 'cerulean'
game 'gta5'

author 'P'
description 'Paradise Custom Loading Screen'
version '1.0.0'

lua54 'yes'

loadscreen 'html/index.html'
loadscreen_cursor 'yes'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js',
    'config.js',
    'html/img/*',
    'html/mp3/*'
}

escrow_ignore {
    'config.js'
}
