@echo off
setlocal

:: Define paths
set "BACKUP_DIR=G:\My Drive\Badminton_Backups"
set "TIMESTAMP=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"
set "BACKUP_FILE=%BACKUP_DIR%\mongo_backup_%TIMESTAMP%.archive"

:: Ensure the backup directory exists in Google Drive
if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
)

echo Starting MongoDB backup...
:: Create a backup archive inside the Mongo container
docker exec btf-mongo mongodump --archive=/tmp/backup.archive

:: Copy the archive from the container to Google Drive
echo Copying backup to Google Drive: %BACKUP_FILE%
docker cp btf-mongo:/tmp/backup.archive "%BACKUP_FILE%"

:: Clean up the temporary file inside the container
docker exec btf-mongo rm /tmp/backup.archive

echo.
echo Backup completed successfully!
echo Saved to: %BACKUP_FILE%
pause

