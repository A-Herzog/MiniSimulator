# How to build a desktop app of # G/G/c/K+G simulator

# G/G/c/K+G simulator can be used as a web service.
To use the calculator just go to

**[a-herzog.github.io/MiniSimulator](https://a-herzog.github.io/MiniSimulator/)**

But G/G/c/K+G simulator can also be built to a exe file. Neutralinojs is used for building the standalone app.
Follow these steps to build the stand alone app:

1. Install [NSIS](nsis.sourceforge.net/)
2. Install Neutralinojs: `npm install -g @neutralinojs/neu`
2. Run `0_Prepare.bat` to add the Neutralinojs files to the G/G/c/K+G simulator folder.
3. Run `1_Test.bat` to test the standalone app or `2_Build.bat` to build the app. The exe file will appear in the root folder (one level up).
4. Run `3_Clean.bat` to delete the Neutralinojs files created in step 2.