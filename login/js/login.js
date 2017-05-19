jQuery(document).ready(function() {



    $('.page-container form .username, .page-container form .password').keyup(function(){
        $(this).parent().find('.error').fadeOut('fast');
    });
});

function login() {
    var url=baseUrl+"/manage/login/loginIn";
    var username = $(this).find('.username').val();
    var password = $(this).find('.password').val();
    if(username == '') {
        $(this).find('.error').fadeOut('fast', function(){
            $(this).css('top', '27px');
        });
        $(this).find('.error').fadeIn('fast', function(){
            $(this).parent().find('.username').focus();
        });
        return false;
    }
    if(password == '') {
        $(this).find('.error').fadeOut('fast', function(){
            $(this).css('top', '96px');
        });
        $(this).find('.error').fadeIn('fast', function(){
            $(this).parent().find('.password').focus();
        });
        return false;
    }
    $.ajax({
        type: "POST",
        url:url,
        data: {username:username, password:password},
        dataType: "json",
        success: function(data){
            var html = '';
            $.each(data, function(commentIndex, comment){
                // html += '<div class="comment"><h6>' + comment['username']
                //     + ':</h6><p class="para"' + comment['content']
                //     + '</p></div>';
                console.log(data);
            });
        }
    });
}

