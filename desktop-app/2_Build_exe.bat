cd ..
del MiniSimulator.exe

call neu.cmd build --release --embed-resources

move .\dist\MiniSimulator\MiniSimulator-win_x64.exe MiniSimulator.exe
rmdir /S /Q dist
cd desktop-app