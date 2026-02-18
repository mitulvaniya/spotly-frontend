# 🛠️ Troubleshooting Guide

## 1. PowerShell Script Error
If you see an error saying `npm.ps1 cannot be loaded because running scripts is disabled`, run this command in your PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Type **`Y`** when prompted, then try `npm run dev` again.

## 2. Alternate: Use Command Prompt (CMD)
If PowerShell is still giving you trouble, click the **`+`** icon in the VS Code terminal and select **Command Prompt**. CMD does not have this restriction.

## 3. Port Already in Use
If it says `Port 3000 is already in use`, try running:
```bash
npx kill-port 3000
```
Then run `npm run dev` again.
