/*global plupload */
/*global qiniu */

//把全部的<tr></tr><td></td>改成了<ul></ul><li></li>
function FileProgress(file, targetID) {
    this.fileProgressID = file.id;
    this.file = file;

    this.opacity = 100;
    this.height = 0;
    this.fileProgressWrapper = $('#' + this.fileProgressID);
    if (!this.fileProgressWrapper.length) {
        // <div class="progress">
        //   <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">
        //     <span class="sr-only">20% Complete</span>
        //   </div>
        // </div>

        this.fileProgressWrapper = $('<ul></ul>');
        var Wrappeer = this.fileProgressWrapper;
        Wrappeer.attr('id', this.fileProgressID).addClass('progressContainer green');

        var progressText = $("<li/>");
        progressText.addClass('progressName');//.text(file.name);//注釋掉了


        var fileSize = plupload.formatSize(file.size).toUpperCase();
        var progressSize = $("<li/>");
        progressSize.addClass("progressFileSize");//.text(fileSize);//注釋掉了



        var progressBarTd = $("<li/>");
        var progressBarBox = $("<div/>");
        progressBarBox.addClass('info');
        var progressBarWrapper = $("<div/>");
        progressBarWrapper.addClass("progress progress-striped");

        var progressBar = $("<div/>");
        progressBar.addClass("progress-bar progress-bar-info")
            .attr('role', 'progressbar')
            .attr('aria-valuemax', 100)
            .attr('aria-valuenow', 0)
            .attr('aria-valuein', 0)
            .width('0%');

        var progressBarPercent = $('<span class=sr-only />');
        progressBarPercent.text(fileSize);

        var progressCancel = $('<a href=javascript:; />');
        progressCancel.show().addClass('progressCancel').text('×');

        progressBar.append(progressBarPercent);
        progressBarWrapper.append(progressBar);
        progressBarBox.append(progressBarWrapper);
        progressBarBox.append(progressCancel);

        var progressBarStatus = $('<div class="status text-center"/>');
        progressBarBox.append(progressBarStatus);
        progressBarTd.append(progressBarBox);

        Wrappeer.append(progressText);
        Wrappeer.append(progressSize);
        Wrappeer.append(progressBarTd);



        $('#' + targetID).append(Wrappeer);
    } else {
        this.reset();
    }

    this.height = this.fileProgressWrapper.offset().top;
    this.setTimer(null);
}

FileProgress.prototype.setTimer = function(timer) {
    this.fileProgressWrapper.FP_TIMER = timer;
};

FileProgress.prototype.getTimer = function(timer) {
    return this.fileProgressWrapper.FP_TIMER || null;
};

FileProgress.prototype.reset = function() {
    this.fileProgressWrapper.attr('class', "progressContainer");
    this.fileProgressWrapper.find('li .progress .progress-bar-info').attr('aria-valuenow', 0).width('0%').find('span').text('');
    this.appear();
};

FileProgress.prototype.setChunkProgess = function(chunk_size) {
    var chunk_amount = Math.ceil(this.file.size / chunk_size);
    if (chunk_amount === 1) {
        return false;
    }

    var viewProgess = $('<button class="btn btn-default yc">查看分块上传进度</button>');//增加一個yc  class;

    var progressBarChunkTr = $('<ul class="chunk-status-tr"><li colspan=3></li></ul>');
    var progressBarChunk = $('<div/>');
    for (var i = 1; i <= chunk_amount; i++) {
        var col = $('<div class="col-md-2"/>');
        var progressBarWrapper = $('<div class="progress progress-striped"></div>');

        var progressBar = $("<div/>");
        progressBar.addClass("progress-bar progress-bar-info text-left")
            .attr('role', 'progressbar')
            .attr('aria-valuemax', 100)
            .attr('aria-valuenow', 0)
            .attr('aria-valuein', 0)
            .width('0%')
            .attr('id', this.file.id + '_' + i)
            .text('');

        var progressBarStatus = $('<span/>');
        progressBarStatus.addClass('chunk-status').text();

        progressBarWrapper.append(progressBar);
        progressBarWrapper.append(progressBarStatus);

        col.append(progressBarWrapper);
        progressBarChunk.append(col);
    }

    if(!this.fileProgressWrapper.find('li:eq(2) .btn-default').length){
        this.fileProgressWrapper.find('li>div').append(viewProgess);
    }
    progressBarChunkTr.hide().find('li').append(progressBarChunk);
    progressBarChunkTr.insertAfter(this.fileProgressWrapper);

};

FileProgress.prototype.setProgress = function(percentage, speed, chunk_size) {
    this.fileProgressWrapper.attr('class', "progressContainer green");

    var file = this.file;
    var uploaded = file.loaded;

    var size = plupload.formatSize(uploaded).toUpperCase();
    var formatSpeed = plupload.formatSize(speed).toUpperCase();
    var progressbar = this.fileProgressWrapper.find('li .progress').find('.progress-bar-info');
    if (this.fileProgressWrapper.find('.status').text() === '取消上传'){
        return;
    }
    this.fileProgressWrapper.find('.status').text("已上传: " + size + " 上传速度： " + formatSpeed + "/s");
    percentage = parseInt(percentage, 10);
    if (file.status !== plupload.DONE && percentage === 100) {
        percentage = 99;
    }

    progressbar.attr('aria-valuenow', percentage).css('width', percentage + '%');

    if (chunk_size) {
        var chunk_amount = Math.ceil(file.size / chunk_size);
        if (chunk_amount === 1) {
            return false;
        }
        var current_uploading_chunk = Math.ceil(uploaded / chunk_size);
        var pre_chunk, text;

        for (var index = 0; index < current_uploading_chunk; index++) {
            pre_chunk = $('#' + file.id + "_" + index);
            pre_chunk.width('100%').removeClass().addClass('alert-success').attr('aria-valuenow', 100);
            text = "块" + index + "上传进度100%";
            pre_chunk.next().html(text);
        }

        var currentProgessBar = $('#' + file.id + "_" + current_uploading_chunk);
        var current_chunk_percent;
        if (current_uploading_chunk < chunk_amount) {
            if (uploaded % chunk_size) {
                current_chunk_percent = ((uploaded % chunk_size) / chunk_size * 100).toFixed(2);
            } else {
                current_chunk_percent = 100;
                currentProgessBar.removeClass().addClass('alert-success');
            }
        } else {
            var last_chunk_size = file.size - chunk_size * (chunk_amount - 1);
            var left_file_size = file.size - uploaded;
            if (left_file_size % last_chunk_size) {
                current_chunk_percent = ((uploaded % chunk_size) / last_chunk_size * 100).toFixed(2);
            } else {
                current_chunk_percent = 100;
                currentProgessBar.removeClass().addClass('alert-success');
            }
        }
        currentProgessBar.width(current_chunk_percent + '%');
        currentProgessBar.attr('aria-valuenow', current_chunk_percent);
        text = "块" + current_uploading_chunk + "上传进度" + current_chunk_percent + '%';
        currentProgessBar.next().html(text);
    }

    this.appear();
};

FileProgress.prototype.setComplete = function(up, info) {
    var li = this.fileProgressWrapper.find('li:eq(2)'),
        tdProgress = li.find('.progress');

    var res = $.parseJSON(info);
    var url;
    if (res.url) {
        url = res.url;
        str = "<div name='imgUrlDiv'><strong>文件鏈接:</strong><a href=" + res.url + " target='_blank' > " + res.url + "</a></div>" +
            "<div class=hash><strong>Hash:</strong>" + res.hash + "</div>";

    } else {
        var domain = up.getOption('domain');
        url = domain + encodeURI(res.key);
        var link = domain + res.key;
        str = "<div name='imgUrlDiv' class=hash><strong>文件鏈接:</strong><a href=" + url + " target='_blank' > " + link + "</a></div>" +
            "<div class=hash><strong>Hash:</strong>" + res.hash + "</div>"+
            "<div class=hash><strong>已上傳的文件名稱:</strong>&nbsp;&nbsp;&nbsp;"+ encodeURI(res.key)+"</div>";
    }

    tdProgress.html(str).removeClass().next().next('.status').hide();
    li.find('.progressCancel').hide();

    var progressNameTd = this.fileProgressWrapper.find('.progressName');
    var imageView = '?imageView2/1/w/200/h/100';

    var isImage = function(url) {
        var res, suffix = "";//建立一个图像对象
        var imageSuffixes = ["png", "jpg", "jpeg", "gif", "bmp"];//全部图片格式类型
        var suffixMatch = /\.([a-zA-Z0-9]+)(\?|\@|$)/;

        if (!url || !suffixMatch.test(url)) {
            return false;
        }
        res = suffixMatch.exec(url);
        suffix = res[1].toLowerCase();
        for (var i = 0, l = imageSuffixes.length; i < l; i++) {
            if (suffix === imageSuffixes[i]) {
                return true;
            }
        }
        return false;
    };
    var isImg = isImage(url);

    var Wrapper = $('<div class="Wrapper"/>');
    var imgWrapper = $('<div class="imgWrapper col-md-3"/>');
    var del = '<div class=file-panel><span class=cancel>删除</span> </div>';//小陰影
    var linkWrapper = $('<a class="linkWrapper" target="_blank"/>');
    var showImg = $('<img src="../images/loading.gif"/>');//加載圖標


    progressNameTd.append(Wrapper);
    if (!isImg) {
        var domain = up.getOption('domain');
        url = domain + encodeURI(res.key);
        var link = domain + res.key;
        showImg.attr('src', url+'?vframe/jpg/offset/2/w/200/h/100');//視頻截圖

        linkWrapper.attr('href', url).attr('title', '查看原图');
       // Wrapper.addClass('default');

        linkWrapper.append(showImg);
        imgWrapper.append(linkWrapper);
        imgWrapper.append(del);//添加小陰影
        Wrapper.append(imgWrapper);

        //imgWrapper.append(showImg);
        //Wrapper.append(imgWrapper);


    } else {
        linkWrapper.append(showImg);
        imgWrapper.append(linkWrapper);
        imgWrapper.append(del);//添加小陰影
        Wrapper.append(imgWrapper);

        var img = new Image();
        if (!/imageView/.test(url)) {
            url += imageView;

        }
        $(img).attr('src', url);


        var height_space = 340;
        $(img).on('load', function() {
            showImg.attr('src', url);

            var domain = up.getOption('domain');//若注釋掉這兩行，則小圖片外面的鏈接地址爲小圖片的地址。否側就是上傳之後的圖片地址
            url = domain + encodeURI(res.key);//若注釋掉這兩行，則小圖片外面的鏈接地址爲小圖片的地址。否側就是上傳之後的圖片地址
            linkWrapper.attr('href', url).attr('title', '查看原图');//小圖片外面的鏈接地址

            function initImg(url, key, height) {
                $('#myModal-img').modal();
                var modalBody = $('#myModal-img').find('.modal-body');
                if (height <= 300) {
                    $('#myModal-img').find('.text-warning').show();
                }
                var newImg = new Image();
                modalBody.find('img').attr('src', 'loading.gif');
                newImg.onload = function() {
                    console.log(url)
                    modalBody.find('img').attr('src', url).data('key', key).data('h', height);
                    modalBody.find('.modal-body-wrapper').find('a').attr('href', url);//找到modal-body-wrapper的子節點A然後給它添加一個href的屬性參數是url
                    modalBody.find('.modal-body-wrapper').find('a').find('img').attr('style','max-width:100%');
                };
                newImg.src = url;
            }

            var infoWrapper = $('<b class="infoWrapper col-md-6"></b>');



            var fopLink = $('<a class="fopLink"/>');
            fopLink.attr('data-key', res.key).text('查看处理效果');
            infoWrapper.append(fopLink);
            fopLink.on('click', function() {
                var key = $(this).data('key');
                var height = parseInt($(this).parents('.Wrapper').find('.origin-height').text(), 10);
                if (height > $(window).height() - height_space) {
                    height = parseInt($(window).height() - height_space, 10);
                } else {
                    height = parseInt(height, 10) || 300;
                    //set a default height 300 for ie9-
                }
                var fopArr = [];
                fopArr.push({
                    fop: 'imageView2',
                    mode: 3,
                    h: height,
                    q: 100,
                    format: 'png'
                });
                fopArr.push({
                    fop: 'watermark',
                    mode: 1,
                    //image: 'http://www.haoliwoo.com/css/front/images/LOGO-01.png',//添加水印的第一個圖片
                    dissolve: 100,
                    gravity: 'SouthEast',
                    dx: 100,
                    dy: 100
                });
                var url = Qiniu.pipeline(fopArr, key);
                $('#myModal-img').on('hide.bs.modal', function() {
                    $('#myModal-img').find('.btn-default').removeClass('disabled');
                    $('#myModal-img').find('.text-warning').hide();
                }).on('show.bs.modal', function() {
                    $('#myModal-img').find('.imageView').find('a:eq(0)').addClass('disabled');
                    $('#myModal-img').find('.watermark').find('a:eq(3)').addClass('disabled');
                    $('#myModal-img').find('.text-warning').hide();
                });

                initImg(url, key, height);

                return false;
            });

            var ie = Qiniu.detectIEVersion();
            if (!(ie && ie <= 9)) {
                var exif = Qiniu.exif(res.key);
                if (exif) {
                    var exifLink = $('<a href="" target="_blank">查看exif</a>');
                    exifLink.attr('href', url + '?exif');
                    //infoWrapper.append(exifLink);
                }

                var imageInfo = Qiniu.imageInfo(res.key);
                var infoArea = $('<div/>');
                var infoInner = '<div>格式：<span class="origin-format">' + imageInfo.format + '</span></div>' +
                    '<div>宽度：<span class="orgin-width">' + imageInfo.width + 'px</span></div>' +
                    '<div>高度：<span class="origin-height">' + imageInfo.height + 'px</span></div>';
                //infoArea.html(infoInner);//注釋掉了圖片的寬高格式
                //infoWrapper.append(infoArea);//注釋掉了包裹寬高的div

            }
            Wrapper.find('.file-panel').prepend(infoWrapper);//查看處理效果

            //Wrapper.append(infoWrapper);//注釋掉了查看處理結果


        }).on('error', function() {
            showImg.attr('src', 'default.png');
            Wrapper.addClass('default');
        });
    }

};
FileProgress.prototype.setError = function() {
    this.fileProgressWrapper.find('li:eq(2)').attr('class', 'text-warning');
    this.fileProgressWrapper.find('li:eq(2) .progress').css('width', 0).hide();
    this.fileProgressWrapper.find('button').hide();
    this.fileProgressWrapper.next('.chunk-status-tr').hide();
};

FileProgress.prototype.setCancelled = function(manual) {
    var progressContainer = 'progressContainer';
    if (!manual) {
        progressContainer += ' red';
    }
    this.fileProgressWrapper.attr('class', progressContainer);
    this.fileProgressWrapper.find('li .progress').remove();
    this.fileProgressWrapper.find('li:eq(2) .btn-default').hide();
    this.fileProgressWrapper.find('li:eq(2) .progressCancel').hide();
};

FileProgress.prototype.setStatus = function(status, isUploading) {
    if (!isUploading) {
        this.fileProgressWrapper.find('.status').text(status).attr('class', 'status text-left');
    }
};

// 绑定取消上传事件
FileProgress.prototype.bindUploadCancel = function(up) {
    var self = this;
    if (up) {
        self.fileProgressWrapper.find('li:eq(2) .progressCancel').on('click', function(){
            self.setCancelled(false);
            self.setStatus("取消上传");
            self.fileProgressWrapper.find('.status').css('left', '0');
            up.removeFile(self.file);
            $(this).parents('.progressContainer').remove();//點擊取消上傳時移除點擊的那個progressContainer
        });
    }

};

FileProgress.prototype.appear = function() {
    if (this.getTimer() !== null) {
        clearTimeout(this.getTimer());
        this.setTimer(null);
    }

    if (this.fileProgressWrapper[0].filters) {
        try {
            this.fileProgressWrapper[0].filters.item("DXImageTransform.Microsoft.Alpha").opacity = 100;
        } catch (e) {
            // If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
            this.fileProgressWrapper.css('filter', "progid:DXImageTransform.Microsoft.Alpha(opacity=100)");
        }
    } else {
        this.fileProgressWrapper.css('opacity', 1);
    }

    this.fileProgressWrapper.css('height', '');

    this.height = this.fileProgressWrapper.offset().top;
    this.opacity = 100;
    this.fileProgressWrapper.show();

};

//encodeURI(res.key)+'?vframe/jpg/offset/2';//上傳視頻時視屏的截圖名稱
//encodeURI(res.key)+ imageView;//上傳圖片時縮略圖的名稱
