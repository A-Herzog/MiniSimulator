cd ..
del MiniSimulator.exe
call neu.cmd build --release
cd desktop-app
"C:\Program Files (x86)\NSIS\makensis.exe" Launcher.nsi
move MiniSimulator.exe ..
cd ..
rmdir /S /Q dist