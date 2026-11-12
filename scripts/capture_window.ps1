param(
  [Parameter(Mandatory=$true)][string]$TitleSubstring,
  [Parameter(Mandatory=$true)][string]$OutPath
)

Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinCap {
  public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr hWnd, IntPtr hdcBlt, uint nFlags);
  [DllImport("dwmapi.dll")] public static extern int DwmGetWindowAttribute(IntPtr hwnd, int dwAttribute, out RECT pvAttribute, int cbAttribute);

  [StructLayout(LayoutKind.Sequential)]
  public struct RECT { public int Left, Top, Right, Bottom; }

  public static IntPtr FindWindowByTitle(string sub) {
    IntPtr found = IntPtr.Zero;
    EnumWindows((h, l) => {
      if (!IsWindowVisible(h)) return true;
      var sb = new StringBuilder(512);
      GetWindowText(h, sb, sb.Capacity);
      if (sb.ToString().Contains(sub)) {
        found = h;
        return false;
      }
      return true;
    }, IntPtr.Zero);
    return found;
  }
}
"@
Add-Type -AssemblyName System.Drawing

$hwnd = [IntPtr]::Zero
for ($i = 0; $i -lt 15; $i++) {
  $hwnd = [WinCap]::FindWindowByTitle($TitleSubstring)
  if ($hwnd -ne [IntPtr]::Zero) { break }
  Start-Sleep -Milliseconds 100
}

if ($hwnd -eq [IntPtr]::Zero) {
  Write-Error "Window not found for title substring: $TitleSubstring"
  exit 2
}

[WinCap]::ShowWindow($hwnd, 9) | Out-Null
[WinCap]::SetForegroundWindow($hwnd) | Out-Null
Start-Sleep -Milliseconds 120

$winRect = New-Object WinCap+RECT
[WinCap]::GetWindowRect($hwnd, [ref]$winRect) | Out-Null
$w = $winRect.Right - $winRect.Left
$h = $winRect.Bottom - $winRect.Top
if ($w -le 0 -or $h -le 0) {
  Write-Error "Invalid window rect: ${w}x${h}"
  exit 3
}

$fullBmp = New-Object System.Drawing.Bitmap($w, $h)
$gfx = [System.Drawing.Graphics]::FromImage($fullBmp)
$hdc = $gfx.GetHdc()
$ok = [WinCap]::PrintWindow($hwnd, $hdc, 2)
$gfx.ReleaseHdc($hdc)
$gfx.Dispose()

$dwmRect = New-Object WinCap+RECT
$hr = [WinCap]::DwmGetWindowAttribute($hwnd, 9, [ref]$dwmRect, [System.Runtime.InteropServices.Marshal]::SizeOf($dwmRect))

$finalBmp = $fullBmp
if ($hr -eq 0) {
  $cropX = [Math]::Max(0, $dwmRect.Left - $winRect.Left)
  $cropY = [Math]::Max(0, $dwmRect.Top - $winRect.Top)
  $cropW = [Math]::Min($w - $cropX, $dwmRect.Right - $dwmRect.Left)
  $cropH = [Math]::Min($h - $cropY, $dwmRect.Bottom - $dwmRect.Top)
  if ($cropW -gt 100 -and $cropH -gt 100) {
    $rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
    $finalBmp = $fullBmp.Clone($rect, $fullBmp.PixelFormat)
    $fullBmp.Dispose()
  }
}

$dir = Split-Path -Parent $OutPath
if ($dir -and !(Test-Path $dir)) {
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
}
$finalBmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
$finalBmp.Dispose()
Write-Output "Captured ($TitleSubstring) PrintWindow=$ok -> $OutPath"

