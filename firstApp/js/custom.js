
$(document).ready(function(){

  $('#action').val('add');

  // get the data from server asa page loads

  $.ajax({
    url : 'http://localhost:9090/readAll',
    type : 'GET',
    beforeSend : function(){
      console.log("Requesting for data from mongo");
    },
    success : function(data){
      
      console.log("Data recieved : "+data);
      var obj = JSON.parse(data);
      var html = "";
      var count = 0;
      $.each(obj, function(key, userObj){
        count += 1;
        html += "<tr><td>"+count+"</td><td>"+userObj.fname+"</td><td>"+userObj.lname+"</td><td>"+userObj.email+"</td><td>"+userObj.contact+"</td><td>"+userObj.password+"</td><td><img src = '"+userObj.path+"' width = '100' heigth = '90' class = 'thumbnail'></td><td><button class = 'btn btn-warning iEdit' id = '"+userObj._id+"'>Edit</button></td><td><button class = 'btn btn-danger iDel' id = '"+userObj._id+"'>Delete</button></td></tr>";
      });

      $('#tbody').html(html);

    },
    error : function(err){
      alert("Error : "+err);
    },
    complete : function(){
      console.log("Server responded");
    }
  });

  $("#file").change(function(){
        $('#preview').css('display','block');
        readImage(this);
    });


  // using the live method here because the elements with these classes are built dynamically and will be available in future

  // delete user when clicked on span of class - spnDel
   
  $(document).delegate('.iDel', 'click', function(){

    // ask user for confirmation

    var ans = confirm("Are you sure you want to delete this user permanently ?");
    if(ans){

      var userID = $(this).attr('id');

      $.ajax({
        url : 'http://localhost:9090/deleteUser?id='+userID,
        type : 'GET',
        beforeSend : function(){
          console.log("Deleting user of id : "+userID);
        },
        success : function(data){
          console.log("Data recieved is : "+data);
          var html = '';
          if(data.error){
            html += "<div class = 'alert alert-danger'><center>"+message+"</center></div>";
          }
          else {
           html += "<div class = 'alert alert-success'><center>"+message+"</center></div>"; 
          }

          $('#message').html(html);

        },
        error : function(err){
          alert("Error : "+err);
        }
      })

    }

  });

  // edit

  $(document).delegate('.iEdit', 'click', function(){

    $('.table').hide();

    $('#action').val("edit");
    $('#idToEdit').val($(this).attr("id"));

    $('#register').html("Save Record");
    $('#register').append("<button type = 'button' class = 'btn btn-danger'>Cancel</button>");

    console.log("Edit clicked");

    var parentTD = $(this).parent();

    var row = $(this).closest('tr');

    var src = row.find('td:eq(6)').children('img').attr('src');

    var arr = [];

    arr = row.find('td').map(function(){
     return this.innerHTML;
    }).get().join(",");

    /*arr = arr.split(',');
    var id = arr[0];
    var name = arr[1];
    var gender = arr[2]; */
    // this array contains all the data of this row
    console.log("Array is : "+arr);

    arr = arr.split(",");

    

    $('#preview').css('display','block');

    var fname = arr[1];
    var lname = arr[2];
    var email = arr[3];
    var contact = arr[4];
    var password = arr[5];
    

    $('#fname').val(fname);
    $('#lname').val(lname);
    $('#email').val(email);
    $('#contact').val(contact);
    $('#password').val(password);
    $('#preview').attr('src', src);


  });

  // address (add and remove)
    $('#addMore').on('click', function(){
        
        var count = $('#count').val();
        var c = ++count;
        
        $("#remove").prop("disabled", false);
        
        var html = "<div class = 'form-group'><input type = 'text' name = 'address[]' class = 'form-control address' id = 'address"+c+"'><span class = 'help-block' style = 'color : red' id = 'address"+c+"Error'></span></div>";
        $('#count').val(c);
        $('#header').append(html);

    });
    
    if($(".address").length == 1){
            $('#remove').prop("disabled", true);    
        }
        else
        {
            $('#remove').prop("disabled", false);
        }
    

    // remove the address field
    $('#remove').on('click', function(){
        
        
        
        if($('.address').length > 1) {
            $('#header .form-group').last().remove();
            $('#count').val($('#count').val() - 1);
        }
        else
            $(this).prop("disabled", true);
    });
   
    
    
   $('#registerForm').on('submit', function(event){
       
       event.preventDefault();

       var fname = $('#fname').val();
       var lname = $('#lname').val();
       var email = $('#email').val();
       var contact = $('#contact').val();
       
       var pwd = $('#password').val();
       
       if(checkPassword(pwd)) {

       
       
       if(checkEmpty(fname))
       {
           if(checkEmpty(lname))
           {
               if(checkEmpty(email))
               {
                   if(isValidEmailAddress(email))
                   {
                       if(checkEmpty(contact))
                       {
                          // send to server

                          var frm = $('#registerForm');
                          var url = '';
                          if($('#action').val() === 'add'){

                              url = "http://localhost:9090/register";                        

                          }
                          else if($('#action').val() === 'edit'){

                              url = "http://localhost:9090/updateUser";
                          }

                          if(url != ''){
                            $.ajax({
                              url : url,
                              type : 'POST',
                              data : new FormData(this),
                              contentType: false,
                              cache: false,
                              processData:false,
                              beforeSend : function(){
                                console.log("Sending data to server : ");
                              },
                              success : function(data)
                              { 
                                console.log("Response recieved is : "+data);
                                var obj = JSON.parse(data);
                                if(obj.error){
                                  var html = "<div class = 'alert alert-danger'><center>"+obj.message+"</center></div>";
                                }
                                else {
                                  var html = "<div class = 'alert alert-success'><center>"+obj.message+"</center></div>";
                                }
                                $('#message').html(html);  

                                setTimeout(function(){
                                  $('#message').html("");  
                                  // location.reload();
                                }, 2000);
                                
                              },
                              error : function(err)
                              {
                                alert("Error : "+err);
                              },
                              complete : function(){
                                console.log("AJAX complete");
                              }

                            });
                          }
                       }
                       else
                       {
                           $('#contactError').html("* Required");
                           $('#contact').css("border","1px dashed red");
                       }
                   }
                   else
                   {
                       $('#emailError').html("Not a Valid Email");
                       $('#email').css("border","1px dashed red");
                   }
               }
               else
               {
                   $('#emailError').html("* Required");
                   $('#email').css("border","1px dashed red");
               }
           }
           else
           {
               $('#lnameError').html("* Required");
               $('#lname').css("border","1px dashed red");
           }
       }
       else
       {
           $('#fnameError').html("* Required");
           $('#fname').css("border","1px dashed red");
       }

     }
     else{
        $('#password').css("border","1px dashed red");
        $('#passwordError').html("Password must satisfy all conditions")
     }
       
    }); 
   
   // allow only digits
   
   $("#contact, #tel").keypress(function (e) {
     //if the letter is not digit then display error and don't type anything
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
         if($(this).attr("id") == "contact"){
            $("#contactError").html("Please enter only digits");
                return false;
         }
         else if($(this).attr("id") == "tel"){
            $("#telError").html("Please enter only digits");
                return false;
         }
    }
    else
    {
        $("#contactError").html("");
    }
   });
   
    $("input").on('click', function(){
       $('span[id*="Error"]').html("");
       $("input, textarea, select").css('border','1px solid #d2d6de');
       $(this).css("border","1px solid #ccc");
    });
    
    
    
    
  
});  // document.ready ends
 

// function to show the preview of the image
function readImage(input) {
    
    if (input.files && input.files[0]) {
        
        var reader = new FileReader;
        
        reader.onload = function (e) {
            $('#preview').show();
            $('#preview').attr('src', e.target.result);
        }
            
        reader.readAsDataURL(input.files[0]);
    }
}

function checkEmpty(data)
{
      if($.trim(data).length > 0)
      {
          return true;
      }
      return false;
}

// function to validate email
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}


// function to checkLength of entered text
// usage : onkeydown = "checkLength(this.value, event, length)"
function checkLength(val, e, length) {
    if (val.length >= length) 
        if ( !(e.which == '46' || e.which == '8' || e.which == '13') ) // backspace/enter/del
            e.preventDefault();
}

// function for password validation
/*
1. Must be at least 8 characters
2. At least 1 number, 1 lowercase, 1 uppercase letter
3. At least 1 special character from @#$%&
*/
function checkPassword(password){
    var pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/;
    if(pattern.test(password)){
        return true;
    }else{
        return false;
    }
}