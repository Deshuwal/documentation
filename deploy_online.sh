
rm dist.zip
rm -r dist
ng --prod build
mv db_backup.sql dist/
zip -r dist.zip dist/
scp  -i ~/234code.pem  dist.zip  ubuntu@3.15.19.255:~/
echo "uploaded"

