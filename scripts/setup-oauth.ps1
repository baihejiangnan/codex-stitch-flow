param(
  [Parameter(Mandatory = $true)]
  [string] $ProjectId
)

$ErrorActionPreference = "Stop"

$gcloud = Get-Command gcloud -ErrorAction SilentlyContinue
if (-not $gcloud) {
  $candidatePaths = @(
    "D:\Google Clound CLI\google-cloud-sdk\bin\gcloud.cmd",
    "D:\Google Cloud CLI\google-cloud-sdk\bin\gcloud.cmd",
    "C:\Program Files\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd",
    "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
  )

  $gcloudPath = $candidatePaths | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

  if (-not $gcloudPath) {
    Write-Error "gcloud was not found. Install Google Cloud CLI first: https://cloud.google.com/sdk/docs/install"
  }
} else {
  $gcloudPath = $gcloud.Source
}

Write-Host "Using Google Cloud project: $ProjectId"
& $gcloudPath config set project $ProjectId
& $gcloudPath auth application-default set-quota-project $ProjectId
& $gcloudPath auth application-default login

Write-Host ""
Write-Host "OAuth ADC setup completed."
Write-Host "For this PowerShell session, run:"
Write-Host "`$env:GOOGLE_CLOUD_PROJECT=`"$ProjectId`""
Write-Host "npm run verify:stitch"
