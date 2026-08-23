---
title: 分享一下我的PowerShell Profile
published: 2025-07-26
description: 'PowerShell 配置文件'
image: ''
tags: ['PowerShell','配置文件']
category: ''
draft: false 
lang: ''
order: 0
aiLevel: "润色"
---

# 分享一下我的PowerShell Profile

## 为什么需要自定义Profile？
Windows默认的PowerShell体验存在：
- 提示符不显示完整路径
- 缺少常用命令别名（如`apt`对应`winget`）
- 环境变量更新需重启终端

本配置实现了：
- ✅ Kali Linux风格提示符（含用户/路径）  
- ✅ 一键重载环境变量（`reenv`命令）  
- ✅ 跨平台命令兼容（`apt`→`winget`）  
- ✅ 好用的网站测试工具（`web-test`命令）

## 效果展示
![效果展示](https://jiashu.jsdmirror.com/gh/0x6768/src/PixPin_2025-07-26_22-15-54.png)

## 怎么使用？
1. 打开PowerShell
2. 执行`notepad $PROFILE`
3. 复制本配置文件内容到打开的文件中
4. 保存并关闭文件
5. 重启PowerShell

## 脚本需要的第三方工具
- [scoop](https://scoop.sh/)
- [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/)
- [uv](https://github.com/astral-sh/uv)
- [tcping](https://tcping.org)

> 怎么安装？看你们自己吧，大多数都很简单的

## 配置文件内容
```powershell
# ================================
# Note
# This script needs to be run in the PROFILE to achieve the best results.
# For more information, see https://learn.microsoft.com/powershell/scripting/learn/shell/creating-profiles?view=powershell-5.1
# ================================

# You Powershell, why are you so like bash
# This is the author idle nothing is written, please don't care, but he is really useful!

# Clear screen on startup
Clear-Host
# Define some variables that don't work
$osName = (Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion" -Name ProductName).ProductName
$buildLabEx = (Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion" -Name BuildLabEx).BuildLabEx
$architecture = Get-WmiObject -Class Win32_Processor | Select-Object -ExpandProperty Architecture
switch ($architecture) {
    0 { $cpuArch = "x86" }
    1 { $cpuArch = "MIPS" }
    2 { $cpuArch = "Alpha" }
    3 { $cpuArch = "PowerPC" }
    5 { $cpuArch = "ARM" }
    6 { $cpuArch = "Itanium" }
    9 { $cpuArch = "x86_64" }
    12 { $cpuArch = "ARM64" }
    default { $cpuArch = "Unknown" }
}
# Ubuntu-style welcome message
Write-Host "Welcome to $osName ($buildLabEx $cpuArch)`n"
Write-Host "   *  Documentation:`thttps://learn.microsoft.com/windows/"
Write-Host "   *  Management:`thttps://endpoint.microsoft.com/"
Write-Host "   *  Support:`t`thttps://support.microsoft.com/`n`n"
# Clean up temporary variables
Remove-Variable osName, buildLabEx, architecture, cpuArch -ErrorAction SilentlyContinue
# Kali-style Prompt
function prompt{
    $userHost = "$env:USERNAME@$env:COMPUTERNAME"
    $currentPath = "$(Get-Location)"
    
    # First line
    Write-Host "┌──(" -NoNewLine -ForegroundColor Blue
    Write-Host "$userHost" -NoNewLine -ForegroundColor Red
    Write-Host ")-[" -NoNewLine -ForegroundColor Blue
    Write-Host "$currentPath" -NoNewLine -ForegroundColor White
    Write-Host "]" -ForegroundColor Blue

    # Second line
    Write-Host -NoNewLine "└─" -ForegroundColor Blue
    Write-Host -NoNewLine "#" -ForegroundColor Red

    return " "
}

# Reload environment variables (especially PATH)
function Reload-Environment {
    param(
        [switch]$NoOutput,
        [switch]$v
    )
    $machinePath = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')

    # Merge and deduplicate PATH entries
    $newPath = ($machinePath, $userPath -split ';' | Where-Object { $_ -and $_ -ne '' } | Select-Object -Unique) -join ';'
    $env:Path = $newPath

    if ($v) {
        Write-Host "[Verbose]" -ForegroundColor Cyan
        Write-Host "System path: $machinePath" -ForegroundColor DarkGray
        Write-Host "User Path: $userPath" -ForegroundColor DarkGray
        Write-Host "Post-merger: $newPath" -ForegroundColor Yellow
    }

    if (-not $NoOutput) {
        Write-Host "[√] Environment reloaded! (Unique entries: $($newPath.Split(';').Count))" -ForegroundColor Green
    }
}


function global:fuckpip {
    param(
        [Parameter(Mandatory=$false, Position=0)]
        [string]$PackageName,
        
        [Parameter(Position=1)]
        [switch]$u,
        
        [Parameter(Position=2)]
        [string]$ver,
        
        # 新增的卸载参数
        [Parameter(Position=3)]
        [switch]$un
    )
    
    # 显示帮助信息
    if (-not $PackageName) {
        Write-Host "`nfuckpip - 让你骂一骂Python包管理工具" -ForegroundColor Cyan
        Write-Host "=" * 40
        Write-Host ""
        Write-Host "使用方法：" -ForegroundColor Yellow
        Write-Host "  fuckpip <包名>                重新安装指定包" -ForegroundColor Green
        Write-Host "  fuckpip <包名> -u            更新指定包到最新版" -ForegroundColor Green
        Write-Host "  fuckpip <包名> -ver <版本>   安装指定版本" -ForegroundColor Green
        Write-Host "  fuckpip <包名> -un           直接卸载指定包" -ForegroundColor Green
        Write-Host ""
        Write-Host "示例：" -ForegroundColor Yellow
        Write-Host "  fuckpip requests             # 重新安装requests" -ForegroundColor White
        Write-Host "  fuckpip requests -u          # 更新requests到最新版" -ForegroundColor White
        Write-Host "  fuckpip requests -ver 2.28.0 # 安装requests 2.28.0版本" -ForegroundColor White
        Write-Host "  fuckpip requests -un         # 卸载requests包" -ForegroundColor White
        Write-Host ""
        Write-Host "注意：-u、-ver、-un 参数不能同时使用" -ForegroundColor Red
        return
    }
    
    # 参数冲突检查
    $paramsUsed = @($u, $ver, $un) | Where-Object { $_ } | Measure-Object
    if ($paramsUsed.Count -gt 1) {
        Write-Host "错误：不能同时使用多个操作参数！" -ForegroundColor Red
        Write-Host "只能选择以下一个参数：-u（更新）、-ver（指定版本）、-un（卸载）" -ForegroundColor Yellow
        Write-Host "请使用 'fuckpip' 查看完整用法" -ForegroundColor Yellow
        return
    }
    
    # 执行操作
    if ($u) {
        Write-Host "正在更新 $PackageName 到最新版..." -ForegroundColor Yellow
        pip install $PackageName --upgrade
        Write-Host "更新完成！" -ForegroundColor Cyan
    }
    elseif ($ver) {
        Write-Host "正在安装 $PackageName 版本 $ver..." -ForegroundColor Yellow
        pip install $PackageName==$ver
        Write-Host "指定版本安装完成！" -ForegroundColor Cyan
    }
    elseif ($un) {
        Write-Host "正在卸载 $PackageName..." -ForegroundColor Red
        pip uninstall $PackageName -y
        Write-Host "卸载完成！" -ForegroundColor Cyan
    }
    else {
        Write-Host "正在卸载 $PackageName..." -ForegroundColor Yellow
        pip uninstall $PackageName -y
        
        Write-Host "正在重新安装 $PackageName..." -ForegroundColor Green
        pip install $PackageName
        
        Write-Host "重新安装完成！" -ForegroundColor Cyan
    }
}
function Git-CommitPush {
    <#
    .SYNOPSIS
    交互式 Git 提交和推送助手
    .DESCRIPTION
    引导用户完成 Git 提交和推送的完整流程
    .EXAMPLE
    Git-CommitPush
    #>
    
    Write-Host "=== Git 提交推送助手 ==="
    Write-Host ""
    
    # 1. 检查是否在 Git 仓库
    try {
        git status 2>&1 | Out-Null
    }
    catch {
        Write-Host "错误: 当前目录不是 Git 仓库" -ForegroundColor Red
        return
    }
    
    # 2. 显示当前状态
    Write-Host "当前状态:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    
    # 3. 检查是否有更改
    $changes = git status --porcelain
    if ([string]::IsNullOrEmpty($changes)) {
        Write-Host "提示: 没有检测到任何更改" -ForegroundColor Yellow
        return
    }
    
    # 4. 询问提交信息
    $commitMessage = Read-Host "请输入提交信息"
    
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        Write-Host "错误: 提交信息不能为空" -ForegroundColor Red
        return
    }
    
    # 5. 询问是否添加所有文件
    $addChoice = Read-Host "是否添加所有更改? (y/n)"
    
    if ($addChoice -eq 'y' -or $addChoice -eq 'Y') {
        Write-Host "正在添加所有更改..." -ForegroundColor Green
        git add .
    } else {
        Write-Host "请手动选择要添加的文件" -ForegroundColor Yellow
        
        # 显示修改的文件列表
        Write-Host "`n已修改的文件:" -ForegroundColor Cyan
        $modifiedFiles = git status --short | Where-Object { $_ -match '^\s*M' }
        if ($modifiedFiles) {
            $modifiedFiles | ForEach-Object { Write-Host "  $_" }
        }
        
        # 显示新增的文件列表
        Write-Host "`n新增的文件:" -ForegroundColor Cyan
        $newFiles = git status --short | Where-Object { $_ -match '^\?\?' }
        if ($newFiles) {
            $newFiles | ForEach-Object { Write-Host "  $_" }
        }
        
        Write-Host ""
        $fileChoice = Read-Host "输入要添加的文件路径(空格分隔多个)，或按回车跳过"
        
        if (-not [string]::IsNullOrWhiteSpace($fileChoice)) {
            $files = $fileChoice -split '\s+'
            foreach ($file in $files) {
                git add $file
                Write-Host "已添加: $file" -ForegroundColor Green
            }
        } else {
            Write-Host "未添加任何文件" -ForegroundColor Yellow
            return
        }
    }
    
    # 6. 确认提交
    Write-Host "`n提交信息: $commitMessage" -ForegroundColor Cyan
    $confirm = Read-Host "确认提交? (y/n)"
    
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        Write-Host "正在提交..." -ForegroundColor Green
        git commit -m $commitMessage
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "提交成功!" -ForegroundColor Green
        } else {
            Write-Host "提交失败" -ForegroundColor Red
            return
        }
    } else {
        Write-Host "已取消提交" -ForegroundColor Yellow
        return
    }
    
    # 7. 询问是否推送
    Write-Host ""
    $pushChoice = Read-Host "是否推送到远程仓库? (y/n)"
    
    if ($pushChoice -eq 'y' -or $pushChoice -eq 'Y') {
        # 获取当前分支
        $currentBranch = git branch --show-current
        
        if ([string]::IsNullOrWhiteSpace($currentBranch)) {
            Write-Host "错误: 无法获取当前分支" -ForegroundColor Red
            return
        }
        
        Write-Host "正在推送到分支: $currentBranch" -ForegroundColor Green
        
        # 尝试推送
        git push origin $currentBranch
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "推送成功!" -ForegroundColor Green
        } else {
            Write-Host "推送失败，尝试设置上游分支..." -ForegroundColor Yellow
            git push --set-upstream origin $currentBranch
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "推送成功!" -ForegroundColor Green
            } else {
                Write-Host "推送失败" -ForegroundColor Red
                
                # 询问是否使用代理重试
                Write-Host ""
                $proxyChoice = Read-Host "是否使用代理重试? (y/n) "
                
                if ($proxyChoice -eq 'y' -or $proxyChoice -eq 'Y') {
                    Write-Host "正在设置代理..." -ForegroundColor Yellow
                    
                    # 设置代理
                    git config --global http.proxy http://127.0.0.1:7890
                    git config --global https.proxy http://127.0.0.1:7890
                    
                    Write-Host "代理已设置，正在尝试推送..." -ForegroundColor Green
                    git push origin $currentBranch
                    
                    # 取消代理设置
                    Write-Host "正在取消代理设置..." -ForegroundColor Yellow
                    git config --global --unset http.proxy
                    git config --global --unset https.proxy
                    
                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "推送成功!" -ForegroundColor Green
                    } else {
                        Write-Host "即使使用代理，推送仍然失败" -ForegroundColor Red
                        Write-Host "建议检查网络连接或代理设置" -ForegroundColor Yellow
                    }
                } else {
                    Write-Host "已取消代理重试" -ForegroundColor Yellow
                }
            }
        }
    } else {
        Write-Host "已取消推送" -ForegroundColor Yellow
    }
}
# 创建别名
Set-Alias -Name gcp -Value Git-CommitPush
 
function Test-WebsiteSpeed {
    param (
        [Parameter(Mandatory=$false)]
        [string]$Url,
        [int]$Port
    )
        if (-not $Url) {
        Write-Host @"
Test-WebsiteSpeed - HTTP/HTTPS & TCP 网络测试工具

用法:
  Test-WebsiteSpeed <URL> [端口]

示例:
  Test-WebsiteSpeed http://example.com          # 测试 HTTP (默认端口 80)
  Test-WebsiteSpeed https://example.com         # 测试 HTTPS (默认端口 443)
  Test-WebsiteSpeed http://localhost:8080       # 测试自定义端口
  Test-WebsiteSpeed http://example.com 8080     # 显式指定端口

输出信息:
  [+] TCP Latency (Avg): XX ms         # TCP 平均延迟
  [-] TCP Ping Failed (Port XX unreachable)  # TCP 连接失败
  [-] Testing HTTP/HTTPS...            # 开始 HTTP 测试
  [!] Skipping HTTP test (TCP failed)  # TCP 失败时跳过 HTTP 测试
"@
        return
    }


    # 提取主机名
    if ($Url -match '^(?:https?:\/\/)?([^\/:]+)') {
        $hostname = $matches[1]
    } else {
        Write-Host "[X] Invalid URL format!" -ForegroundColor Red
        return
    }

    # 自动判断端口
    if ($Url -match '^(?:https?:\/\/)?[^\/:]+:(\d+)') {
    $Port = [int]$matches[1]  # 如果 URL 带端口，直接使用
    } elseif (-not $Port) {
        $Port = if ($Url -match '^https:\/\/') { 443 } else { 80 }  # 否则用默认端口
    }
    # 1. 获取 tcping 输出
    $tcpingOutput = tcping $hostname $Port

    # 2. 检查是否全部失败（关键！）
    $isFailed = ($tcpingOutput -match "0 successful") -or ($tcpingOutput -match "Was unable to connect")

    if ($isFailed) {
        # 从 tcping 输出提取实际测试的端口（避免误报）
        $probedPort = ($tcpingOutput -match "Probing .*?(\d+)/tcp")[0] -replace '.*?(\d+)/tcp.*', '$1'
        Write-Host "[X] TCP Ping Failed (Port $probedPort unreachable)" -ForegroundColor Red
        $averageRtt = "Timeout"
    } else {
        # 3. 暴力提取平均延迟（最后一行）
        $averageLine = ($tcpingOutput | Select-Object -Last 1)
        $averageRtt = ($averageLine -split 'Average = ')[1] -replace 'ms.*' -replace ',', ''
        Write-Host "[+] TCP Latency (Avg): $averageRtt ms" -ForegroundColor Green
    }

    # 4. 测试 HTTP/HTTPS 性能
    Write-Host "`n[-] Testing HTTP/HTTPS..." -ForegroundColor Cyan
    if ($averageRtt -eq "Timeout") {
        Write-Host "[!]  Skipping HTTP test (TCP failed)" -ForegroundColor Yellow
    } else {
        curl.exe -s -o NUL -w "TCP Latency: $averageRtt ms`nDNS Lookup: %{time_namelookup}s`nConnect Time: %{time_connect}s`nSSL Handshake: %{time_appconnect}s`nTTFB: %{time_starttransfer}s`nTotal Time: %{time_total}s`n" $Url
    }
}
function Get-ExecutionTime {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, Position=0, ValueFromRemainingArguments=$true)]
        [string[]]$Command
    )
    
    if (-not $Command) {
        Write-Host "usage: time <command>" -ForegroundColor Red
        return
    }
    
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $proc = Get-Process -Id $PID
    
    # 记录开始时的 CPU 时间
    $startUserTime = $proc.UserProcessorTime
    $startKernelTime = $proc.PrivilegedProcessorTime
    
    # 构建命令字符串
    $cmdString = $Command -join ' '
    
    # 执行命令
    $output = $null
    $errorOccurred = $false
    
    try {
        # 尝试执行命令
        $output = Invoke-Expression $cmdString
    }
    catch {
        $errorOccurred = $true
        Write-Error $_.Exception.Message
    }
    finally {
        $stopwatch.Stop()
        
        # 获取结束时的 CPU 时间
        $proc = Get-Process -Id $PID
        $endUserTime = $proc.UserProcessorTime
        $endKernelTime = $proc.PrivilegedProcessorTime
        
        # 计算 CPU 时间
        $userTime = ($endUserTime - $startUserTime).TotalSeconds
        $sysTime = ($endKernelTime - $startKernelTime).TotalSeconds
        $realTime = $stopwatch.Elapsed.TotalSeconds
        
        # 输出格式完全仿照 Linux time
        Write-Host ""
        Write-Host "real`t" -NoNewline
        Write-Host ("{0:F3}" -f $realTime)
        
        Write-Host "user`t" -NoNewline
        Write-Host ("{0:F3}" -f $userTime)
        
        Write-Host "sys`t" -NoNewline
        Write-Host ("{0:F3}" -f $sysTime)
    }
    
    # 返回原命令的输出
    Write-Host `n
    if (-not $errorOccurred) {
        $output
    }
}
function fuck {
    $history = (Get-History -Count 1).CommandLine;
    if (-not [string]::IsNullOrWhiteSpace($history)) {
        $fuck = $(thefuck $args $history);
        if (-not [string]::IsNullOrWhiteSpace($fuck)) {
            if ($fuck.StartsWith("echo")) { $fuck = $fuck.Substring(5); }
            else { iex "$fuck"; }
        }
    }
    [Console]::ResetColor()
}


Set-Alias -Name reenv -Value Reload-Environment
Set-Alias -Name web-test -Value Test-WebsiteSpeed
Set-Alias -Name time -Value Get-ExecutionTime
```

## 仓库
::github{repo="0x6768/pwsh-profile"}