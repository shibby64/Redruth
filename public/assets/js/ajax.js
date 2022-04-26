$.ajax({
    url: '/saved',
    complete: function(data) {
        console.log(data.responseJSON);
        var object = data.responseJSON
        const node = document.createElement("p");
        document.getElementById("saved").append(node);
        $(document).ready(function () {
            
            $.each(object.adminData, function (key, value) {
                $('p').append(key + ': ' + value + '<br />');
            });
        });
    }
  });