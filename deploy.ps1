Write-Host "Building..."
npm run build

Write-Host "Deploying..."
Copy-Item .\dist\tv-planner-card.js "J:\www\tv-planner-card.js" -Force
Copy-Item .\dist\tv-planner-card.js.map "J:\www\tv-planner-card.js.map" -Force
Copy-Item .\channel-icons.json "J:\www\channel-icons.json" -Force

Write-Host "Done."