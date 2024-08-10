//页面注入任务表单
var isClicked = false;
var showCursor = false;
var setTimeOutTag = null;
var i = 0;
var timeNum = 1;
var targetSelected = false; //光标定位元素获取location
var isClicked = false;
var autoClickTag = false;
var Settings = {
    widthIpt: 600,
    heightIpt: 800,
    crxHover: false,
    selector: false,
    zoomHover: false,
    shortcutKeyT: '17',
    shortcut: false,
    nodeFilter: false,
    nodeFilterT: '',
    blacklist: false,
    onlyShowBigPics: '',
    neverShowBigPics: '',
};
let position = {
    x: -1,
    y: -1,
};
var html = `
            <div id="secKillForm">
                <div class="secKill-filed secKill-filed-2">
                    <span class="secKill-name">选 择 器 ：</span>
                    <div class="selectorClass">
                        <input type="checkbox" name="selector" id="rb1" value="jQuery" checked="checked"/>
                        <label for="rb1">jQuery</label>
                        <input type="checkbox" name="selector" id="rb2" value="xPath" disabled/>
                        <label for="rb2">xPath</label>
                    </div>
                </div>
                <div class="secKill-filed secKill-filed-3">
                    <span class="secKill-name">选 取 值 ：</span>
                    <input type="text" name="location" class="secKill-input-text1" id="location" value="" placeholder="元素路径"/>
                </div>
                <div class="secKill-filed secKill-filed-time">
                    <span class="secKill-name">随 机 值 ：</span>
                    <input type="text" name="time" class="secKill-input-text1" id="time1" value="3" placeholder="3" />  
                    <input type="text" name="time" class="secKill-input-text1" id="time2" value="5" placeholder="5" />
                    <div class="chkC chkk">
                        <input type="checkbox" name="selector" id="chk2" />
                        <label for="chk2">启用</label>                     
                    </div>
                </div>        
                <div class="secKill-filed secKill-filed-6">
                    <span class="secKill-name">循 环 值 ：</span>
                    <input type="number" name="count" class="secKill-input-number1 secKill-count1" id="count" value="100" placeholder="尝试次数"/>
                    <div class="chkC">
                        <input type="checkbox" name="selector" id="chk1" />
                        <label for="chk1">自动</label>      
                    </div>
                </div>  
                <div class="secKill-filed secKill-filed-7">
                    <span class="secKill-name">间隔(秒)：</span>
                    <input type="text" name="count" class="secKill-input-number secKill-count" id="count1" value="3"  placeholder="默认1"/>
                </div>  
                <div class="secKill-filed secKill-filed-8">
                    <span class="secKill-name">点 击 数 ：</span>
                    <input type="text" name="count" class="secKill-input-number secKill-count" id="count2" value="0" placeholder="间隔时间"  disabled/>
                </div>                
                <div class="buttonC">
                    <div class="secKill-button secKill-rechoose" id="reset">重选</div>
                    <div class="secKill-button secKill-close" id="close"> 关闭 </div>
                    <div class="secKill-button secKill-fn" id="startFunc">执行Fn </div>
                </div>
            </div>`;
setData(Settings);

function setData(data) {
    chrome.storage.local.get('DataSettings', function(result) {
        if (!result.DataSettings) {
            chrome.storage.local.set({
                DataSettings: data,
            });
        }
    });
}

function getDataFromStorage0() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('DataSettings', (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                var dataSettings = result.DataSettings;
                var settings = {};
                if (dataSettings) {
                    // 更新Settings对象
                    settings.widthIpt = dataSettings.widthIpt || 600;
                    settings.heightIpt = dataSettings.heightIpt || 800;
                    settings.crxHover = dataSettings.crxHover || false;
                    settings.selector = dataSettings.selector || false;
                    settings.zoomHover = dataSettings.zoomHover || false;
                    settings.shortcut = dataSettings.shortcut || false;
                    settings.shortcutKeyT = dataSettings.shortcutKeyT || '17';
                    settings.nodeFilter = dataSettings.nodeFilter || false;
                    settings.nodeFilterT = dataSettings.nodeFilterT || '';
                    settings.blacklist = dataSettings.blacklist || false;
                    var dataOSBP = Array.from(new Set(dataSettings.onlyShowBigPics.split('\n'))).join('\n');
                    var dataNSBP = Array.from(new Set(dataSettings.neverShowBigPics.split('\n'))).join('\n');
                    settings.onlyShowBigPics = dataOSBP || '';
                    settings.neverShowBigPics = dataNSBP || '';
                }
                resolve(settings);
            }
        });
    });
}
async function getDataFromStorage() {
    try {
        // 使用 Promise 封装 chrome.storage.local.get
        const result = await new Promise((resolve, reject) => {
            chrome.storage.local.get('DataSettings', (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result);
                }
            });
        });
        // 处理结果
        var dataSettings = result.DataSettings;
        var settings = {};
        if (dataSettings) {
            // 更新Settings对象
            settings.widthIpt = dataSettings.widthIpt || 600;
            settings.heightIpt = dataSettings.heightIpt || 800;
            settings.crxHover = dataSettings.crxHover || false;
            settings.selector = dataSettings.selector || false;
            settings.zoomHover = dataSettings.zoomHover || false;
            settings.shortcut = dataSettings.shortcut || false;
            settings.shortcutKeyT = dataSettings.shortcutKeyT || '17';
            settings.nodeFilter = dataSettings.nodeFilter || false;
            settings.nodeFilterT = dataSettings.nodeFilterT || '';
            settings.blacklist = dataSettings.blacklist || false;
            // 处理 onlyShowBigPics 和 neverShowBigPics，去除重复并转换回字符串
            settings.onlyShowBigPics = Array.from(new Set(dataSettings.onlyShowBigPics.split('\n'))).join('\n') || '';
            settings.neverShowBigPics = Array.from(new Set(dataSettings.neverShowBigPics.split('\n'))).join('\n') || '';
        }
        return settings;
    } catch (error) {
        // 处理错误，例如通过抛出错误或返回默认值
        throw error; // 或者可以返回 null, {} 或其他默认值
    }
}
(function() {
    showPics();
    if (window.location == window.parent.location) {
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (sender.id == chrome.runtime.id) {
                if (request.command == 'insertElement') {
                    if ($('#secKillForm').length === 0) {
                        showCursor = true;
                        $('html').prepend(html);
                        targetSelected = false;
                        draghxdFn('#secKillForm', 'html');
                        $('#secKillForm').bind('contextmenu', function() {
                            return false;
                        });
                    } else if ($('#secKillForm').length > 0) {
                        showCursor = false;
                        $('#secKillForm #close').click();
                        var node = document.getElementById('secKillForm');
                        node.parentNode.removeChild(node); // 删除节点
                    }
                }
                return true;
            }
        });
    }
    window.onmousemove = function(e) {
        if ($('#secKillForm').length > 0) runSecKillFunc(e);
    };
    $(document).on('click', '#rb1', function(e) {
        if (this.checked) {
            $('#rb2').prop('disabled', true);
            $('#rb1').prop('disabled', false);
            randomIntervalTimer(0, 3, 5, false);
            targetSelected = false;
        } else {
            $('#rb1').prop('disabled', false);
            $('#rb2').prop('disabled', false);
            $('#location').val('');
            $('.secKillTarget').removeClass('secKillTarget');
            targetSelected = true;
        }
        $('#chk1').prop('checked', false);
        i = 0;
        $('#count2').val(0);
    });
    //xpath
    $(document).on('click', '#rb2', function(e) {
        if (this.checked) {
            $('#rb1').prop('disabled', true);
            $('#rb2').prop('disabled', false);
            randomIntervalTimer(0, 3, 5, false);
            targetSelected = false;
        } else {
            $('#rb2').prop('disabled', false);
            $('#rb1').prop('disabled', false);
            $('#location').val('');
            $('.secKillTarget').removeClass('secKillTarget');
            targetSelected = true;
        }
        $('#chk1').prop('checked', false);
        i = 0;
        $('#count2').val(0);
    });
    $(document).on('dblclick', '#location', function(e) {
        var $temp = $('<input>');
        $('body').append($temp);
        $temp.val($(this).val()).select();
        document.execCommand('copy');
        $temp.remove();
        Toast('元素路径已复制！', 2000);
    });
    $(document).on('input', '#count1,#time1,#time2', function(e) {
        if (/^\d+(\.\d*)?$/.test($(this).val())) {
            timeNum = $(this).val();
        } else {
            timeNum = 1;
            $(this).val('');
        }
        $('#chk1').prop('checked', false);
        randomIntervalTimer(0, 3, 5, false);
        i = 0;
        $('#count2').val(0);
    });
    //是否自动点击
    $(document).on('click', '#chk1', function(e) {
        var min = $('#time1').val() > 0 ? $('#time1').val() : 3;
        var max = $('#time2').val() > 0 ? $('#time2').val() : 5;
        i = 0;
        this.checked ? $(document).on('click', '#secKillForm #startFunc', clickStartFunc) : $(document).off('click', '#secKillForm #startFunc');
        randomIntervalTimer(i, min, max, this.checked);
    });
    //关闭任务表单
    $(document).on('click', '#secKillForm #close', function(e) {
        $('.secKillTarget').removeClass('secKillTarget');
        $('#secKillForm').remove();
        targetSelected = true;
    });
    //执行自定义函数
    $(document).on('click', '#secKillForm #startFunc', clickStartFunc);
})();

function runSecKillFunc(e) {
    if (!targetSelected) {
        $('.secKillTarget').removeClass('secKillTarget');
        $(e.target).addClass('secKillTarget');
    }
    $(e.target).click(function(e) {
        if ($(this).attr('id') == 'reset') { //重选
            if ($('#secKillForm input[name=selector]:checked').length > 0) {
                $('.secKillTarget').removeClass('secKillTarget');
                $('#secKillForm #location').val('');
                $('#chk1').prop('checked', false);
                randomIntervalTimer(0, 3, 5, false);
                i = 0;
                $('#count2').val(0);
                targetSelected = false;
                return false;
            } else {
                Toast('选择器未勾选！', 2000);
            }
        }
    });
    $(e.target).contextmenu(function(eve) { //右键选中目标
        if (!targetSelected) {
            targetSelected = true;
            var selector = $('#secKillForm input[name=selector]:checked').val();
            if (selector == 'jQuery') {
                var path = getDomPath(eve.target);
                $('#secKillForm #location').val(path.join(' > '));
            } else if (selector == 'xPath') {
                var path = getXPathTo(eve.target);
                $('#secKillForm #location').val(path);
            }
            Toast($('#secKillForm input[name=selector]:checked').length > 0 ? '目标已选中！' : '选择器未勾选！', 2000);
            eve.preventDefault();
        }
    });
}
async function showBigPicsFlag(callback) {
    try {
        const data = await getDataFromStorage(); // 等待异步操作完成
        let shouldShowBigPics = true; // 初始化为true，除非有特定条件使其为false
        // 检查黑名单
        if (data.neverShowBigPics && data.neverShowBigPics.length > 0) {
            const arr1 = Array.from(new Set(data.neverShowBigPics.split('\n'))).filter((url) => url !== null && url !== undefined && url !== '');
            for (let neverBigPics of arr1) {
                if (window.location.href.match(globStringToRegex(neverBigPics))) {
                    shouldShowBigPics = false; // 如果URL在黑名单中，则不显示大图片
                    break; // 找到匹配项后立即退出循环
                }
            }
        }
        // 如果黑名单没有匹配且白名单不为空，则检查白名单
        if (shouldShowBigPics && data.onlyShowBigPics && data.onlyShowBigPics.length > 0) {
            const arr = Array.from(new Set(data.onlyShowBigPics.split('\n'))).filter((url) => url !== null && url !== undefined && url !== '');
            const isMatchFound = arr.some((pattern) => {
                return window.location.href.match(globStringToRegex(pattern));
            });
            if (!isMatchFound) {
                shouldShowBigPics = false; // 如果URL不在白名单中，则不显示大图片（仅当黑名单没有匹配时）
            }
        }
        // 调用回调函数
        callback(shouldShowBigPics, data);
    } catch (error) {
        console.log('Error:', error);
    }
}

function globStringToRegex(str) {
    return preg_quote(str).replace(/\\\*/g, '\\S*').replace(/\\\?/g, '.');
}

function preg_quote(str, delimiter) {
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

function isCtrl(event, keyCodes) {
    if (event.type === 'keydown' || event.type === 'mousemove') {
        if (typeof keyCodes === 'string') {
            keyCodes = keyCodes.split(' ').map(Number);
        }
        return keyCodes.includes(event.keyCode);
    }
    return false;
}

function imageUrl(e, pos, nodeStr) {
    if ($('#dashixiong_preview').length <= 0) {
        addPicHtml();
    }
    const promises = showPicture(pos, nodeStr).map((imageUrl) => {
        return getImageWidth(imageUrl).then(([width, height]) => {
            if (!(width < 14 && height < 14)) {
                return [imageUrl, width, height];
            }
        }).catch((error) => {
            return null;
        });
    });
    Promise.all(promises).then((results) => {
        let result = results.filter(
            (url) => url !== null && url !== undefined && url !== '');
        let arr = [];
        let coordsArr = [];
        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                arr.push(result[i][0]);
            }
            coordsArr = result.map((subArray) => subArray.slice(1));
        }
        const arrImages = arr.filter(
            (url) => url !== null && url !== undefined && url !== '');
        addImagesToPreview(e, arrImages, pos, coordsArr);
    }).catch((error) => {
        // 如果 Promise.all 中的任何一个 Promise 出错，这里会捕获到错误
        console.log('An error occurred while processing images:', error);
    });
}

function clickStartFunc(e) {
    var getPath = $('#secKillForm #location').val();
    var selector = $('#secKillForm input[name=selector]:checked').val();
    if (getPath.trim() == '') {
        Toast('还未选择要操作的元素,或页面中不存在该元素！', 3000);
        if (!$('#chk1').is(':checked')) {
            $('#chk1').click();
            $('#count2').val(0);
        }
        return false;
    }
    if (selector == 'jQuery') {
        if ($(getPath).length < 1) {
            Toast('页面中不存在该元素的jQuery路径！', 3000);
            return false;
        }
        //$(getPath)[0].click();
        if (chrome.runtime.lastError) {}
        $(getPath).click();
        /* $(getPath).each(function(e) {
                 this.click();
             });*/
    } else {
        if ($(getElementsByXPath(getPath)).length < 1) {
            Toast('页面中不存在该元素xPath路径，或为非元素节点！', 3000);
            return false;
        }
        $(getElementsByXPath(getPath)).click();
        /*    $(getElementsByXPath(getPath)).each(function(e) {
                    this.click();
                });*/
    }
}

function randomIntervalTimer(i, min, max, bool) {
    if (!bool) {
        // 确保setTimeOutTag是一个有效的定时器ID
        if (setTimeOutTag) {
            clearTimeout(setTimeOutTag);
        }
        i = 0;
        $('#count2').val(i);
        return;
    }
    setTimeOutTag = setTimeout(function() {
        if (!$('#chk1').is(':checked') || !bool) {
            clearTimeout(setTimeOutTag);
            i = 0;
            $('#count2').val(i);
        }
        if (i >= $('#count').val()) {
            i = 0;
            $('#chk1').prop('checked', false);
            $('#count2').val(i);
            $(document).off('click', '#secKillForm #startFunc');
            clearTimeout(setTimeOutTag);
        } else {
            $('#secKillForm #startFunc').click();
            i++;
            $('#count2').val(i);
            randomIntervalTimer(i, min, max, bool);
        }
    }, getRandomInt(min, max) * 1000);
}

function getRandomInt(min, max) {
    min = parseFloat(min);
    max = parseFloat(max);
    var num = Math.random() * (max - min) + min;
    return Number(num.toFixed(4));
    //return Math.floor(Math.random() * (max - min + 1)) + min; // 包含最大值，含两端点
}
/**
 * 根据点击元素 获取Jquery path
 * @param el
 * @returns {Array.<*>}
 */
function getDomPath(el) {
    var stack = [];
    while (el.parentNode != null) {
        var sibCount = 0;
        var sibIndex = 0;
        for (var i = 0; i < el.parentNode.childNodes.length; i++) {
            var sib = el.parentNode.childNodes[i];
            if (sib.nodeName == el.nodeName) {
                if (sib === el) {
                    sibIndex = sibCount;
                }
                sibCount++;
            }
        }
        var isIdNumeric = /^\d+$/.test(el.id);
        if (el.hasAttribute('id') && el.id != '') {
            stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
        } else if (sibCount > 1) {
            stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
        } else {
            stack.unshift(el.nodeName.toLowerCase());
        }
        el = el.parentNode;
    }
    return stack.slice(1);
}
/**
 * 根据点击元素 获取 xPath
 * @param element
 * @returns {string}
 */
function getXPathTo(element) {
    // 特殊情况处理：如果元素有ID，直接返回ID选择器
    if (element.id !== '') {
        return 'id("' + element.id + '")';
    }
    // 特殊情况处理：如果元素是文档的body，返回body标签名
    if (element === document.body) {
        return element.tagName.toLowerCase();
    }
    // 获取父节点的所有子节点
    var siblings = element.parentNode.childNodes;
    var xpath = '';
    // 递归向上构建XPath
    for (var ancestor = element.parentNode; ancestor !== null; ancestor = ancestor.parentNode) {
        // 初始化索引
        var index = 1;
        // 遍历当前父节点的所有子节点
        for (var i = 0; i < ancestor.childNodes.length; i++) {
            var node = ancestor.childNodes[i];
            // 跳过非元素节点
            if (node.nodeType !== 1) {
                Toast('当前为非元素节点！', 2000);
                continue;
            }
            // 如果找到当前元素节点，则构建XPath片段
            if (node === element) {
                xpath = '/' + node.tagName.toLowerCase() + '[' + index + ']' + (xpath ? xpath : '');
                element = ancestor; // 移动到上一级父节点
                break;
            }
            // 如果遇到与当前元素相同标签名的节点，则增加索引
            if (node.tagName === element.tagName) {
                index++;
            }
        }
    }
    // 返回根元素
    return xpath.length ? xpath : '/' + document.documentElement.tagName.toLowerCase();
}
/**
 * 根据xPath查询节点
 * @param STR_XPATH
 * @returns {Array}
 */
function getElementsByXPath(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while ((xres = xresult.iterateNext())) {
        xnodes.push(xres);
    }
    return xnodes;
}
/*
      dragObj:  拖拽对象
      parent:   指定区域           
    */
function draghxdFn(dragObj, parent) {
    //拖拽
    var oldTimeTag;
    var flagTag = false;
    $(dragObj).mousedown(function(e) {
        var _this = $(this);
        var parent_h = $(parent)[0].offsetHeight, //表示网页的高度
            parent_w = $(parent)[0].offsetWidth, //表示网页的宽度
            drag_h = $(this)[0].offsetHeight,
            drag_w = $(this)[0].offsetWidth;
        var dragX = e.clientX - $(this)[0].offsetLeft;
        var dragY = e.clientY - $(this)[0].offsetTop;
        // 当前拖拽对象层级优先
        isClicked = true;
        flagTag = true;
        $(this).css('z-index', '999999999'); //.siblings().css('z-index', '1');
        oldTimeTag = new Date().getTime();
        $(dragObj).css('cursor', 'move');
        $(document).mousemove(function(eve) {
            var _h = window.innerHeight - _this[0].offsetHeight;
            var _w = window.innerWidth - _this[0].offsetWidth;
            var l1 = eve.clientX - dragX;
            var t1 = eve.clientY - dragY;
            t1 = Math.min(Math.max(0, t1), _h);
            l1 = Math.min(Math.max(0, l1), _w);
            if (flagTag) {
                _this.css({
                    left: l1 + 'px',
                    top: t1 + 'px',
                });
            }
            newTimeTag = new Date().getTime();
            dTime = newTimeTag - oldTimeTag;
            Math.abs(dTime) > 40 ? (isClicked = false) : (isClicked = true);
        });
        //防止拖拽对象内的文字被选中
        $(dragObj).onselectstart = function() {
            return false;
        };
    });
    $(document).mouseup(function(e) {
        e.stopPropagation();
        flagTag = false;
        newTimeTag1 = new Date().getTime();
        Math.abs(newTimeTag1 - oldTimeTag) > 40 ? (isClicked = false) : (isClicked = true);
        isClicked = false;
        $(this).off('mousemove');
        $(dragObj).css('cursor', 'pointer');
    });
}

function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = `
                    max-width:60%;
                    min-width: 150px;
                    padding: 0px 2px 0px 13px;
                    height: 40px;
                    color: rgb(255, 255, 255);
                    line-height: 42px;
                    text-align: center;
                    border-radius: 4px;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1999102209999;
                    background: #ce1584;
                    font-size: 16px;`;
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() {
            document.body.removeChild(m);
        }, d * 1000);
    }, duration);
}

function getImagesFromPosition(position, maxParentDepth = 1, maxChildDepth = 1) {
    const imageSet = new Set();
    const mainElement = document.elementFromPoint(position.x, position.y);
    if (!mainElement) return [];
    // 辅助函数：递归遍历子元素
    function traverseChildren(element, depth = 0) {
        if (depth > maxChildDepth) return;
        // 处理当前元素的图片和背景图片
        processElement(element);
        // 遍历子元素
        for (const child of element.children) {
            traverseChildren(child, depth + 1);
        }
    }
    // 辅助函数：递归遍历父元素
    function traverseParents(element, depth = 0) {
        if (depth > maxParentDepth) return;
        // 处理当前元素的图片和背景图片
        processElement(element);
        // 如果有父元素，继续遍历
        if (element.parentElement) {
            traverseParents(element.parentElement, depth + 1);
        }
    }
    // 辅助函数：处理元素的图片和背景图片
    function processElement(e) {
        if (typeof e.src !== 'undefined') {
            imageSet.add(e.src);
        }
        if (e.tagName.toLowerCase() === 'picture') {
            imageSet.add(...parsePictureNode(e).filter((url) => url !== undefined));
        }
        imageSet.add(...parseSrcSet(e).filter((url) => typeof url !== undefined));
        const style = window.getComputedStyle(e, false);
        if (typeof style !== 'undefined') {
            const bg = style['background-image'] || '';
            const regex = /url\(["']?([^"']*)["']?\)/;
            const image = bg.match(regex);
            if (image && image[1] && isImageLink(image[1])) {
                imageSet.add(image[1]);
            }
        }
    }
    // 遍历主元素
    traverseChildren(mainElement);
    traverseParents(mainElement);
    // 遍历主元素的前后兄弟元素
    const siblings = Array.from(mainElement.parentNode.children);
    const mainIndex = siblings.indexOf(mainElement);
    for (let i = Math.max(0, mainIndex - 2); i <= Math.min(siblings.length - 1, mainIndex + 2); i++) {
        traverseChildren(siblings[i]);
    }
    let imghxd = Array.from(imageSet).filter(
        (url) => url !== undefined && url !== null && url !== '');
    return imghxd;
}

function showPicture(position, nodeStr) {
    let images = new Set();
    let image1 = new Set();
    let eleTarget = null;
    let nodeStr1 = nodeStr.nodeFilterT;
    let arrNode = nodeStr1.trim().length == 0 ? [] : nodeStr1.trim().length == 1 ? [nodeStr1.trim()] : nodeStr1.split(' ').filter(
        (arr) => arr !== undefined && arr !== null && arr !== '');
    const element = document.elementFromPoint(position.x, position.y);
    if (element == null || element == '') return [];
    [element].filter((e) => {
        const rect = e.getBoundingClientRect();
        return (rect.left < position.x && position.x < rect.right && rect.top < position.y && position.y < rect.bottom);
    }).forEach((e) => {
        if (arrNode.includes(e.tagName.toLowerCase()) && nodeStr.nodeFilter) {
            return [];
        }
        if (typeof e.src !== 'undefined') {
            image1.add(e.src);
        } else if (e.tagName.toLowerCase() === 'picture') {
            image1.add(...parsePictureNode(e).filter((url) => url !== undefined));
            image1.add(...parseSrcSet(e).filter((url) => typeof url !== undefined));
        } else {
            const style = window.getComputedStyle(e, false);
            if (typeof style !== 'undefined') {
                const bg = style['background-image'] || '';
                const regex = /url\(["']?([^"']*)["']?\)/;
                const image = bg.match(regex);
                if (image && image[1] && isImageLink(image[1])) {
                    image1.add(image[1]);
                }
            }
        }
    });
    [...document.querySelectorAll('*')].filter((e) => {
        const rect = e.getBoundingClientRect();
        return (rect.left < position.x && position.x < rect.right && rect.top < position.y && position.y < rect.bottom);
    }).forEach((e) => {
        if (e.id == 'secKillForm') {
            eleTarget = e.id;
        }
        //console.log(arrNode,e.tagName.toLowerCase(),arrNode.includes(e.tagName.toLowerCase()))
        if (arrNode.includes(e.tagName.toLowerCase()) && nodeStr.nodeFilter) {
            return [];
        }
        if (typeof e.src !== 'undefined') {
            images.add(e.src);
        } else if (e.tagName.toLowerCase() === 'picture') {
            images.add(...parsePictureNode(e).filter((url) => url !== undefined));
            images.add(...parseSrcSet(e).filter((url) => typeof url !== undefined));
        } else {
            const style = window.getComputedStyle(e, false);
            if (typeof style !== 'undefined') {
                const bg = style['background-image'] || '';
                const regex = /url\(["']?([^"']*)["']?\)/;
                const image = bg.match(regex);
                if (image && image[1] && isImageLink(image[1])) {
                    images.add(image[1]);
                }
            }
        }
    });
    let imghxd = Array.from(images).filter(
        (url) => url !== undefined && url !== null && url !== '');
    let imghxd1 = Array.from(image1).filter(
        (url) => url !== undefined && url !== null && url !== '');
    if (eleTarget == 'secKillForm') return [];
    if (imghxd1.length > 0) {
        if (imghxd.includes(imghxd1[0])) {
            return imghxd1;
        } else {
            return imghxd;
        }
    } else {
        return imghxd;
    }
}

function getImageWidth(img_url) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.src = img_url;
        img.onload = function() {
            resolve([img.width, img.height]);
        };
        img.onerror = function(e) {
            //console.log('Failed to load image.--'+e);
            reject(new Error('Failed to load image.'));
        };
    });
}

function parseSrcSet(element) {
    if (!element || !element.srcset) return []; // 如果element或srcset不存在，返回空数组
    const urls = new Set();
    const srcsetParts = element.srcset.trim().split(',').map((part) => part.trim()); // 先按逗号分割，再去除空格
    srcsetParts.forEach((src) => {
        // 使用正则表达式来匹配URL（这只是一个简单的示例，实际的URL匹配可能更复杂）
        const match = src.match(/^(https?:\/\/[^\s]+)/);
        if (match && match[1]) {
            urls.add(match[1]); // 只有当匹配到有效的URL时才添加到Set中
        }
    });
    return Array.from(urls.values());
}

function parsePictureNode(element) {
    const urls = new Set();
    // 遍历元素的子节点
    element.childNodes.forEach((childNode) => {
        // 假设 parseSrcSet 返回一个数组，并且数组中的元素都是有效的URL字符串
        const srcsetUrls = parseSrcSet(childNode); // 移除这里的括号
        // 遍历返回的URLs数组，并添加非空字符串到Set中
        srcsetUrls.forEach((url) => {
            if (typeof url === 'string' && url.trim() !== '') {
                urls.add(url);
            }
        });
    });
    // 将Set转换为数组并返回
    return Array.from(urls.values());
}

function isImageLink(str) {
    // 使用正则表达式来匹配常见的图片格式（不局限于扩展名）
    const imageExtensionsRegex = /\b(gimg1|gimg3|Fgips3|himg|bdimg|img|image|jpeg|jpg|png|gif|webp|svg|gips0|autime=|size=|fm=|data:image|lhimg)\b/i;
    return imageExtensionsRegex.test(str);
}

function addPicHtml() {
    var picHtml = `
            <div id='dashixiong_preview'
                 style='display:none;
                    pointer-events:none;
                    padding:0px;
                    margin:0px;
                    left:0px;
                    top:0px;
                    background-color:#00000000;
                    position:fixed;
                    z-index:9999999998;'>
            </div>`;
    $(document.body).append(picHtml); //弹出一个div里面放着图片
}

function getImageSize(url, callback) {
    var img = new Image();
    img.onload = function() {
        callback(this.width, this.height);
    };
    img.src = url;
}

function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (window.attachEvent) {
        element.attachEvent('on' + eventName, callback);
    } else {
        element['on' + eventName] = callback;
    }
}
var pos = {
    x: -1,
    y: -1,
};
var zoom_lastMouseMoveEvent;

function showPics() {
    addPicHtml();
    addEvent(document, 'mousemove', eventHandlerFunc);
    addEvent(document, 'mousewheel', eventHandlerFunc);
    addEvent(document, 'wheel', eventHandlerFunc);
    addEvent(document, 'mouseleave', eventHandlerFunc);
    addEvent(document, 'keyup', eventHandlerFunc);
    addEvent(document, 'keydown', eventHandlerFunc);
}

function eventHandlerFunc(event) {
    switch (event.type) {
        case 'mousemove':
            handleMouseMove(event);
            break;
        case 'mouseleave':
        case 'mousewheel':
        case 'wheel':
        case 'mouseout':
            removeNode();
            break;
        case 'keydown':
            handleKeyDown(event);
            break;
        case 'keyup':
            handleKeyUp(event);
            break;
    }
}
async function handleMouseMove(event) {
    showBigPicsFlag((flag, setting) => {
        if (!setting.zoomHover) return;
        const window_height = $(window).height();
        const window_width = window.innerWidth || $(window).width();
        const isNearEdge = event.clientX <= 5 || event.clientY <= 5 || event.clientX >= window_width - 5 || event.clientY >= window_height - 5;
        if (isNearEdge) removeNode();
        const pos = {
            x: event.clientX,
            y: event.clientY,
        };
        localStorage['position'] = JSON.stringify(pos);
        zoom_lastMouseMoveEvent = event;
        if (setting && flag && !setting.shortcut && !isCtrl(event, setting.shortcutKeyT) && setting.crxHover) {
            imageUrl(event, pos, setting);
        }
    });
}
async function handleKeyDown(event) {
    showBigPicsFlag((flag, setting) => {
        if (!setting.shortcut) return;
        const posi = localStorage['position'];
        const posit = JSON.parse(posi);
        if (setting && flag && isCtrl(event, setting.shortcutKeyT) && setting.crxHover) {
            imageUrl(zoom_lastMouseMoveEvent, posit, setting);
        }
    });
}

function handleKeyUp(event) {
    getDataFromStorage().then((settings) => {
        if (settings.shortcut) {
            removeNode();
        }
    }).catch((error) => console.log('Error:', error));
}

function isNotNullNode(nodeStr) {
    let arrNode = nodeStr.trim().length == 0 ? [] : nodeStr.trim().length == 1 ? [nodeStr.trim()] : nodeStr.split(' ').filter(
        (arr) => arr !== undefined && arr !== null && arr !== '');
    return arrNode.length <= 0 ? false : true;
}

function removeNode() {
    $('#dashixiong_preview').remove();
}
let activeImageUrl = '';

function addImagesToPreview(e, imgArr, position, coords) {
    if (!Array.isArray(imgArr) || imgArr.length === 0) {
        removeNode();
        return;
    }
    let imgArray = [];
    let tempActiveImageUrl = '';
    if (imgArr.length == 1) {
        imgArray = imgArr;
        tempActiveImageUrl = imgArr;
    } else if (imgArr.length == 2) {
        if (coords[0][0] <= coords[1][0] || coords[0][1] <= coords[1][1]) {
            imgArray = [imgArr[1]];
        } else {
            imgArray = [imgArr[0]];
        }
    } else {
        let maxVal = imgArr[0][0]; // 假设第一个元素是最大的
        let maxIndex = 0;
        for (var i = 0; i < imgArr.length; i++) {
            if (imgArr[i][0] > maxVal) {
                maxVal = imgArr[i][0];
                maxIndex = i;
            }
        }
        imgArray = [imgArr[maxIndex]];
    }
    tempActiveImageUrl = imgArray;
    if (imgArray.length == 0) return;
    var img = $('<img>'); // 创建一个新的img元素
    var mWidth, mHeight;
    var ratio = coords[0][0] / coords[0][1]; //宽高比
    const emptyTag = activeImageUrl !== tempActiveImageUrl;
    if (emptyTag) {
        activeImageUrl = tempActiveImageUrl;
    }
    if (ratio <= 1.2 && ratio >= 0.85) {
        mWidth = coords[0][0] <= 400 ? 400 : 550;
        mHeight = mWidth;
        showImage(e, img, mWidth, mHeight, activeImageUrl[0], emptyTag);
    } else {
        setWidthHeight(coords[0]).then((newCoords) => {
            mWidth = newCoords[0];
            mHeight = newCoords[1];
            showImage(e, img, mWidth, mHeight, activeImageUrl[0], emptyTag);
        }).catch((error) => {
            console.log('width and height设置失败 : ------>', error);
        });
        return;
    }
}

function showImage(e, img, mWidth, mHeight, imageUrl, empty = false) {
    img.css({
        width: mWidth,
        height: mHeight,
    }).attr('src', imageUrl);
    if (empty) $('#dashixiong_preview').empty();
    $('#dashixiong_preview').append(img);
    $('#dashixiong_preview').show();
    let imgw = $('#dashixiong_preview').width();
    let imgh = $('#dashixiong_preview').height();
    setImagePosition(e, imgw, imgh);
    //setMainImageLocation(e,imgw,imgh);
}

function setWidthHeight(coords) {
    return new Promise((resolve, reject) => {
        getDataFromStorage().then(function(settings) {
            var maxWidth = settings.widthIpt; // 最大允许宽度，可以根据需要调整这个值
            var maxHeightViewportRatio = 0.85; // 最大允许高度占视口高度的比例
            var viewportHeight = window.innerHeight || document.documentElement.clientHeight; // 获取浏览器窗口的可见高度（不包括工具栏和滚动条）
            var maxHeight = Math.min(maxHeightViewportRatio * viewportHeight, settings.heightIpt); // 最大允许高度，同时考虑视口高度和固定值
            var originalWidth = coords[0];
            var originalHeight = coords[1];
            var scaleWidth = maxWidth / originalWidth; // 计算等比缩放的比例
            var scaleHeight = maxHeight / originalHeight;
            var scale = Math.min(scaleWidth, scaleHeight); // 使用较小的比例来保持等比缩放
            var newWidth = originalWidth * scale; // 应用比例到原始宽度和高度
            var newHeight = originalHeight * scale;
            newWidth = Math.round(newWidth); // 四舍五入到整数
            newHeight = Math.round(newHeight);
            //console.log(settings.widthIpt,settings.heightIpt,newWidth,newHeight)
            resolve([newWidth, newHeight]); // 使用resolve返回新的宽度和高度数组
        }).catch((error) => {
            console.log('Error:', error);
            reject(error); // 在发生错误时，使用reject传递错误
        });
    });
}

function setImagePosition(e, img_width, img_height) {
    let $preview = $('#dashixiong_preview');
    if (!$preview.length) return; // 确保预览元素存在
    const jianxi = 10; // 边界间隙
    let window_height = $(window).height();
    let window_width = window.innerWidth || $(window).width();
    let centerX = window_width / 2;
    let centerY = window_height / 2;
    let maxTop = window_height - img_height - jianxi;
    let minTop = jianxi;
    let maxLeft = window_width - img_width - jianxi;
    let minLeft = jianxi;
    let newTop, newLeft;
    if (e.clientX < centerX && e.clientY < centerY) { // 左上区域
        newLeft = e.clientX + jianxi + 2;
        if (e.clientY + img_height > window_height) {
            newTop = window_height - img_height - jianxi - 10;
        } else {
            newTop = e.clientY + jianxi - 10;
        }
    } else if (e.clientX > centerX && e.clientY < centerY) { // 右上区域
        newLeft = e.clientX - img_width - jianxi - 7;
        if (e.clientY + img_height > window_height) {
            newTop = window_height - img_height - jianxi - 10;
        } else {
            newTop = e.clientY + jianxi - 10;
        }
    } else if (e.clientX < centerX && e.clientY > centerY) { // 左下区域
        newTop = e.clientY - img_height - jianxi + 4;
        if (e.clientX + img_width > window_width) {
            newLeft = window_width - img_width - jianxi + 5;
        } else {
            newLeft = e.clientX + jianxi - 7;
        }
    } else { // 右下区域
        newLeft = e.clientX - img_width - jianxi - 7;
        newTop = e.clientY - img_height;
    } // 确保图片不会超出页面边界
    newTop = Math.max(minTop, Math.min(newTop, maxTop));
    newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
    $preview.css({
        top: newTop + 'px',
        left: newLeft + 'px'
    });
    $preview.find('img').css({
        border: '3px solid #cc33ff',
        'border-radius': '5px',
        background: '#ebeff9',
        padding: '5px',
    });
}

function setMainImageLocation(e, img_width, img_height) {
    let $preview = $('#dashixiong_preview');
    if (!$preview.length) return; // 确保预览元素存在
    let imgWidth = img_width;
    let imgHeight = img_height;
    let maxWidth = document.body.clientWidth - 15;
    let maxHeight = window.innerHeight - 15;
    let x = e.clientX;
    let y = e.clientY;
    if (x + imgWidth > maxWidth) {
        if (imgWidth < maxWidth) {
            x = x - imgWidth < 0 ? maxWidth - imgWidth : x - imgWidth;
        } else {
            x = 0;
        }
    }
    if (y + imgHeight > maxHeight) {
        if (imgHeight < maxHeight) {
            y = y - imgHeight < 0 ? maxHeight - imgHeight : y - imgHeight;
        } else {
            y = -5;
        }
    }
    $preview.css({
        // 应用新位置到图片元素
        top: y + 10 + 'px',
        left: x + 10 + 'px',
    });
    $preview.find('img').css({
        border: '3px solid #cc33ff',
        'border-radius': '5px',
        background: '#ebeff9',
        padding: '5px',
    });
}