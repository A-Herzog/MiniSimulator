!define PrgName "G/G/c/K+G simulator"
!define PrgTempPathName "MiniSimulator"
!define PrgFileName "MiniSimulator"
!define PrgIcon "..\docs\favicon.ico"
!define Copyright "Alexander Herzog"

Name "${PrgName}"
Caption "${PrgName}"
Icon "${PrgIcon}"
OutFile "${PrgFileName}.exe"

VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "${PrgName}"
VIAddVersionKey "FileDescription" "${PrgName}"
VIAddVersionKey "LegalCopyright" "${Copyright}"
VIAddVersionKey "CompanyName" "${Copyright}"
VIAddVersionKey "FileVersion" "1.0"
VIAddVersionKey "InternalName" "${PrgName}"

ManifestDPIAware true

SilentInstall silent
AutoCloseWindow true
ShowInstDetails nevershow
;ShowInstDetails show

RequestExecutionLevel user

Section ""
  SetOutPath "$TEMP\${PrgTempPathName}"

  File "..\dist\MiniSimulator\MiniSimulator-win_x64.exe"
  File "..\dist\MiniSimulator\resources.neu"
  ;File "..\dist\MiniSimulator\WebView2Loader.dll"

  ExecWait "$TEMP\${PrgTempPathName}\MiniSimulator-win_x64.exe"

  RmDir /r "$TEMP\${PrgTempPathName}"
SectionEnd