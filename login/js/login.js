jQuery(document).ready(function () {
    $('.username, .password').focus(function () {
        console.log("keyup");
        $(".form").parent().find('.error').fadeOut('fast');
        $('.msg').delay("slow").fadeOut({ duration: 3000 });
    });
});

function login() {
    var url = baseUrl + "/login/loginIn";
    var username = $(".form").find('.username').val();
    var password = $(".form").find('.password').val();
    console.log(username);
    console.log(password);
    if (!username) {
        console.log("username" +username);
        $(".form").find('.error').fadeOut('fast', function () {
            $(".form").css('top', '27px');
        });
        $(".form").find('.error').fadeIn('fast', function () {
            $(".form").parent().find('.username').focus();
        });
        return false;
    }
    if (!password) {
        $(".form").find('.error').fadeOut('fast', function () {
            $(".form").css('top', '96px');
        });
        $(".form").find('.error').fadeIn('fast', function () {
            $(".form").parent().find('.password').focus();
        });
        return false;
    }
    var data={userName: username, password: password};
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            if (data.code==200){
                sessionStorage.setItem("token",data.result.token);
                sessionStorage.setItem("userInfo",JSON.stringify(data.result));
                sessionStorage.setItem("token",data.result.token);
                sessionStorage.setItem("userInfo",JSON.stringify(data.result));
                window.location.href="index.html";
            }else {
                $(".form").parent().find('.msg').css({"display":"block"});
                $(".form").parent().find('.msg').html(data.msg);
            }
        }
    });
}

