var token="";
var domainUrl="";

    function getToken(folderName){
		$.ajax({
			type: 'POST',
			// url: "http://119.29.216.138:8090/mall/upload/getToken",
            url: baseMallUrl+"/upload/getToken",
			data:"folderName="+folderName,
			success: function(data) {
			    console.log(data);
				token=data.result.token;
				domainUrl=data.result.domain;
				initLoader();
			}
		});
	}

function initLoader() {
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',//上传模式,依次退化
        browse_button: 'pickfiles',//點擊選擇圖片的ID //上传选择的点选按钮，**必需**
        container: 'container',//上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '100mb', //最大文件体积限制
        flash_swf_url: 'js/Moxie.swf', //引入flash,相对路径
        dragdrop: true,////开启可拖曳上传
        chunk_size: '4mb',//分块上传时，每片的体积
		// uptoken_url: '/mall/test01' ,
        uptoken: token,//AJAX返回的token //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        unique_names:true,// 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
        domain: domainUrl, //bucket 域名，下载资源时用到，**必需**
        get_new_uptoken: false,//设置上传文件的时候是否每次都重新获取新的token
        auto_start: true,//选择文件后自动上传，若关闭需要自己绑定事件触发上传
        drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传

    init: {
            'FilesAdded': function (up, files) {// 文件添加进队列后,处理相关的事情
                $('.table').show();
                $('#success').hide();
                $('#statusBar').hide();//增加
                $('.placeholder').css({'background':'none','padding-top':'20px'});//當上傳圖片之後去掉背景圖片和改變内邊距//增加
                $('.webuploader-pick').text("继续添加");//增加
                $('.yc').remove();//移除掉分塊上傳進度按鈕
                $('.chunk-status-tr').remove();//移除掉分塊上傳進度

                plupload.each(files, function (file) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setStatus("等待...");
                    progress.bindUploadCancel(up);
                });
            },
            'BeforeUpload': function (up, file) {// 每个文件上传前,处理相关的事情
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function (up, file) { // 每个文件上传时,处理相关的事情
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function () { // 每个文件上传成功后,处理相关的事情
                var le = $('.progressContainer').length;
                $('#success').show();
                $('#statusBar').show();
                $('.sz').html(le);
                $('.yc').remove();//移除掉分塊上傳進度按鈕
                $('.chunk-status-tr').remove();//移除掉分塊上傳進度
            },
            'FileUploaded': function (up, file, info) {//文件上傳的時候
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);
            },
            'Error': function (up, err, errTip) {//出錯的時候
                $('.table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            }
        }

    });


    uploader.bind('FileUploaded', function () {
        console.log('hello man,a file is uploaded');
    });
    $('#container').on(
        'dragenter',
        function (e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        }
    ).on('drop', function (e) {
            e.preventDefault();
            $('#container').removeClass('draging');
            e.stopPropagation();
        }).on('dragleave', function (e) {
            e.preventDefault();
            $('#container').removeClass('draging');
            e.stopPropagation();
        }).on('dragover', function (e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        });



    $('#show_code').on('click', function () {
        $('#myModal-code').modal();
        $('pre code').each(function (i, e) {
            hljs.highlightBlock(e);
        });
    });


    $('body').on('click', '.table button.btn', function () {
        $(this).parents('ul').next().toggle();
    });


    var getRotate = function (url) {
        if (!url) {
            return 0;
        }
        var arr = url.split('/');
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === 'rotate') {
                return parseInt(arr[i + 1], 10);
            }
        }
        return 0;
    };

    $('#myModal-img .modal-body-footer').find('a').on('click', function () {
        var img = $('#myModal-img').find('.modal-body img');
        var key = img.data('key');
        var oldUrl = img.attr('src');
        var originHeight = parseInt(img.data('h'), 10);
        var fopArr = [];
        var rotate = getRotate(oldUrl);
        if (!$(this).hasClass('no-disable-click')) {
            $(this).addClass('disabled').siblings().removeClass('disabled');
            if ($(this).data('imagemogr') !== 'no-rotate') {
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': rotate,
                    'format': 'png'
                });
            }
        } else {
            $(this).siblings().removeClass('disabled');
            var imageMogr = $(this).data('imagemogr');
            if (imageMogr === 'left') {
                rotate = rotate - 90 < 0 ? rotate + 270 : rotate - 90;
            } else if (imageMogr === 'right') {
                rotate = rotate + 90 > 360 ? rotate - 270 : rotate + 90;
            }
            fopArr.push({
                'fop': 'imageMogr2',
                'auto-orient': true,
                'strip': true,
                'rotate': rotate,
                'format': 'png'
            });
        }

        $('#myModal-img .modal-body-footer').find('a.disabled').each(function () {

            var watermark = $(this).data('watermark');
            var imageView = $(this).data('imageview');
            var imageMogr = $(this).data('imagemogr');

            if (watermark) {
                fopArr.push({
                    fop: 'watermark',
                    mode: 1,// 图片水印
                   // image: 'http://www.haoliwoo.com/css/front/images/LOGO-01.png',// 图片水印的Url，mode = 1 时 **必需**
                    dissolve: 100,// 透明度，取值范围1-100，非必需，下同
                    gravity: watermark,
                    dx: 100,// 横轴边距，单位:像素(px)
                    dy: 100  // 纵轴边距，单位:像素(px)
                });

            }


            if (imageView) {
                var height;
                switch (imageView) {
                    case 'large':
                        height = originHeight;
                        break;
                    case 'middle':
                        height = originHeight * 0.5;
                        break;
                    case 'small':
                        height = originHeight * 0.1;
                        break;
                    default:
                        height = originHeight;
                        break;
                }
                fopArr.push({
                    fop: 'imageView2',
                    mode: 3,
                    h: parseInt(height, 10),
                    q: 100,
                    format: 'png'
                });
            }

            if (imageMogr === 'no-rotate') {
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': 0,
                    'format': 'png'
                });
            }
        });

        var newUrl = Qiniu.pipeline(fopArr, key);

        var newImg = new Image();
        img.attr('src', 'images/image.png'); 
        newImg.onload = function () {
            img.attr('src', newUrl);
            img.parent('a').attr('href', newUrl);
        };
        newImg.src = newUrl;
        return false;
    });
}

function setUploadImgUrl(){	
    var imgUrl="";
    $('#fsUploadProgress').find("div[name='imgUrlDiv']").each(function(a,b){
    	imgUrl+=$(b).find("a:eq(0)").html()+";";
        // alert("imgUrl: "+imgUrl);
    } );              	
    imgUrl=imgUrl.substr(0,imgUrl.length-1);
    console.log("imgUrl: "+imgUrl);
    if(imgUrl.length>0)
    {

        // $(window.parent.$("#"+$("#controlId").val()+"").val(imgUrl.trim()));

        // if($("#controlId").val()=="editLogo"){
	    	// window.parent.setLogoUrl(imgUrl.trim());
        // }else if($("#controlId").val()=="editImg"){
	    	// window.parent.setImgUrl(imgUrl.trim());
        // }else if($("#controlId").val()=="editVideo"){
	    	// window.parent.setVideoUrl(imgUrl.trim());
        // }
        // else{
        //
		// }
    }
    return imgUrl.trim();
}

$(document).ready(function () {
    var folderName="mall-test01";
    getToken(folderName);
});