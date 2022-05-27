function checkFunction() {
  // Get the checkbox
  var checkBox = document.getElementById("myCheck");
  // Get the output text

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){
    for(i=0; i < document.getElementsByClassName("checked").length; i++){
      document.getElementsByClassName("checked")[i].style.display = "block";
    }
  } else {
    for(i=0; i < document.getElementsByClassName("checked").length; i++){
      document.getElementsByClassName("checked")[i].style.display = "none";
    }
  }
}
function recordFunction() {
  // Get the checkbox checkForm

  for(i=0; i < document.getElementsByClassName("checkForm").length; i++){
    document.getElementsByClassName("checkForm")[i].style.display = "inline-block";
  }
    for(i=0; i < document.getElementsByClassName("recForm").length; i++){
      document.getElementsByClassName("recForm")[i].style.display = "block";
    }

}
function recordReset() {
  // Get the checkbox
  for(i=0; i < document.getElementsByClassName("checkForm").length; i++){
    document.getElementsByClassName("checkForm")[i].style.display = "none";
  }
    for(i=0; i < document.getElementsByClassName("recForm").length; i++){
      document.getElementsByClassName("recForm")[i].style.display = "none";
    }

}