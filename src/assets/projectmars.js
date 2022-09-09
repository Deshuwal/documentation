 
    function preventPaste(id, context){ 
         
        $("#"+id).on("cut copy paste",function(e) {
            e.preventDefault();
            context.showError("Pasting not allowed", "type the password directly");
        });

        console.log("preventing paste now");
 

    }


function scrollToBottom(){
  window.scrollTo(0, document.body.scrollHeight);
}


function strengthWatch(id){

    console.log("watching strength");
    var password = document.getElementById(id);
password.addEventListener('keyup', function() {

  var pwd = password.value

  // Reset if password length is zero
  if (pwd.length === 0) {
    document.getElementById("progresslabel").innerHTML = "";
    document.getElementById("progress").value = "0";
    return;
  }

  // Check progress
  var prog = [/[$@$!%*#?&]/, /[A-Z]/, /[0-9]/, /[a-z]/]
    .reduce((memo, test) => memo + test.test(pwd), 0);

  // Length must be at least 8 chars
  if(prog > 2 && pwd.length > 7){
    prog++;
  }

  // Display it
  var progress = "";
  var strength = "";
  switch (prog) {
    case 0:
    case 1:
    case 2:
      strength = "25%";
      progress = "25";
      break;
    case 3:
      strength = "50%";
      progress = "50";
      break;
    case 4:
      strength = "75%";
      progress = "75";
      break;
    case 5:
      strength = "100% - Password strength is good";
      progress = "100";
      break;
  }
  document.getElementById("progresslabel").innerHTML = strength;
  document.getElementById("progress").value = progress;

}); 

}
    

 
  function payWithPaystack(amount, callBackObject){
    const amountHandle = amount.toString().split('.');
    const wholeAmount = parseInt(amountHandle[0]);
    const decimalAmount = amountHandle[1] ? parseInt(amountHandle[1]) : 0;

    var handler = PaystackPop.setup({
      key: 'pk_test_1b6c7aa3d3fa1f5f751d2191151a1e748a17a493',
      email: 'psirs@gov.ng',
      amount: (wholeAmount * 100) + decimalAmount,
      currency: "NGN",
      ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      metadata: {
         custom_fields: [
            {
                display_name: "Mobile Number",
                variable_name: "mobile_number",
                value: "+2348012345678"
            }
         ]
      },
      callback: function(response){ 
        if(typeof callBackObject.paymentSucceeded == 'function') {
          callBackObject.paymentSucceeded(response);
        }
      },
      onClose: function(){
        if(typeof callBackObject.paymentCanceled == 'function') {
          callBackObject.paymentCanceled();
        }
      }
    });
    handler.openIframe();
  }
   


function makeRPayment(orderId, rrr, mKey, returnUrl, callbackObject) {
    var form = document.querySelector("#payment-form");
    var paymentEngine = RmPaymentEngine.init({
    key:mKey,
    processRrr: true,
    transactionId: orderId,
    extendedData: { 
        customFields: [ 
          { 
          name: "rrr", 
          value: rrr
          
        } 
      ]
    },
        onSuccess: function (response) { 

            console.log('callback Successful Response', response);

           callbackObject.verifyRemitaPayment(rrr, orderId);
        },
        onError: function (response) {
          window.href=returnUrl;
           console.log('callback Error Response', response);
        },
        onClose: function () {
          window.href=returnUrl;
          console.log("closed");
        }
    });

     console.log(paymentEngine);
     paymentEngine.showPaymentWidget();
}
