rm  /usr/src/app/projectmarsfrontend/e2e/test_results/last_test_time.txt
echo $(date) >   /usr/src/app/projectmarsfrontend/e2e/test_results/last_test_time.txt
echo "\r\n" >>  /usr/src/app/projectmarsfrontend/e2e/test_results/last_test_time.txt
./run_tests_cmd.sh  
