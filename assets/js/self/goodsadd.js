tool.gologin();
/*Logo上传*/
function selfUpload() {
    $("#image_upload").css("display", "block");
    window.frames["image_upload_iframe"].getToken(folderName);
    image_upload_iframe.window.document.getElementById("controlId").value = "editLogo";
}
function save() {
    if($("input[name='name']").val()==""){
        alert("商品名不能为空!!!");
        return;
    }
    var $originalPrice = $("input[name='originalPrice']").val();
    if($originalPrice==""){
        alert("商品原价不能为空!!!");
        return;
    }
    if(parseInt($originalPrice) < 0){
        alert("商品原价不能小于0!!!");
        return;
    }
    if($("input[name='price']").val()==""){
        alert("商品实价不能为空!!!");
        return;
    }
    if($("input[name='stock']").val()==""){
        alert("商品数量不能为空!!!");
        return;
    }
    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    $.ajax({
        cache: true,
        type: "POST",
        url:baseUrl+"/goods/add",
        data:$('#popupForm').serialize(),// 你的formid
        async: false,
        error: function(request) {
            alert("Connection error");
        },
        success: function(data) {
            if(data.code == 200){
                alert("新增商品成功!");
                parent.layer.close(index);
            }else {
                alert(data.msg);
                return;
            }
        }
    });
}
function cancel() {
    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    parent.layer.close(index);
}