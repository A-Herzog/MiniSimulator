cd ..
del MiniSimulator.exe
del MiniSimulator_Linux_MacOS.zip
call neu.cmd build --release
cd desktop-app
"C:\Program Files (x86)\NSIS\makensis.exe" Launcher.nsi
move MiniSimulator.exe ..
cd ..
move .\dist\MiniSimulator-release.zip MiniSimulator_Linux_MacOS.zip
rmdir /S /Q dist
cd desktop-app