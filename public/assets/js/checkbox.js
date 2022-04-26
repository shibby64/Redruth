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
