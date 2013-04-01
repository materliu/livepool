:: Created by npm, please don't edit manually.
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\livepool.js" %*
) ELSE (
  node "livepool.js" %*
)