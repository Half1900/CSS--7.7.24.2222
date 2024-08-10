var Settings = {
    widthIpt:600,
    heightIpt:800,
    crxHover: false,
    selector: false,
    zoomHover: false,
    shortcutKeyT:"17",
    shortcut: false,
    nodeFilter:false,
    nodeFilterT:"",
    blacklist: false,
    onlyShowBigPics: "",
    neverShowBigPics: ""
};
var WBListFlag = false;
var currentUrl;
chrome.tabs.query({
    active: true,
    currentWindow: true
}, function(tabs) {
    if (tabs.length > 0) currentUrl = tabs[0].url;
});

function showSettings(data) {
    document.getElementsByTagName("textarea")[0].focus();
    document.getElementById("selector").checked = data.selector;
    document.getElementById("zoomHover").checked = data.zoomHover;
    document.getElementById("shortcut").checked = data.shortcut;
    document.getElementById("nodeFilter").checked = data.nodeFilter;
    document.getElementById("blacklist").checked = data.blacklist;
    document.getElementById("crxHover").checked = data.crxHover;
    data.crxHover ?   $('label[for="crxHover"]').text("已启用插件") : $('label[for="crxHover"]').text("已禁用插件");
    data.crxHover ?   $("#options").css("display", "block") : $("#options").css("display", "none");
    
    data.selector ?   $("#li-top").css("display", "block") : $("#li-top").css("display", "none");
    data.selector ?   $('label[for="selector"]').text("已启用CSS元素选择器") : $('label[for="selector"]').text("已禁用CSS元素选择器");
    
    data.zoomHover ?  $('label[for="zoomHover"]').text("已启用鼠标悬停显示大图") : $('label[for="zoomHover"]').text("已禁用鼠标悬停显示大图");
   
    data.shortcut ?    $('label[for="shortcut"]').text("已启用快捷键显示图片功能") : $('label[for="shortcut"]').text("已禁用快捷键显示图片功能");
    data.shortcut ?    $('#shortcutKeyLi').css("display", "block") : $("#shortcutKeyLi").css("display", "none");
    
    data.nodeFilter ? $('label[for="nodeFilter"]').text("已启用元素节点筛选") : $('label[for="nodeFilter"]').text("已禁用元素节点筛选");
    data.nodeFilter ? $("#nodeFilterLi").css("display", "block") : $("#nodeFilterLi").css("display", "none");
        
    data.widthIpt ?  document.getElementById("widthIpt").value = data.widthIpt : "";
    data.heightIpt ? document.getElementById("heightIpt").value = data.heightIpt : "";
    data.shortcutKeyT ? document.getElementById("shortcutKeyT").value = data.shortcutKeyT : "";
    data.nodeFilterT  ? document.getElementById("nodeFilterT").value  = data.nodeFilterT  : "";
    
    data.blacklist ? $('label[for="blacklist"]').text("已显示悬浮显示图片黑白名单设置") : $('label[for="blacklist"]').text("已隐藏悬浮显示图片黑白名单设置");
    data.blacklist ? $("#wlists").css("display", "block") : $("#wlists").css("display", "none");
    
    data.neverShowBigPics ? document.getElementById('neverShowBigPics').value = data.neverShowBigPics : "";
    data.onlyShowBigPics  ? document.getElementById('onlyShowBigPics').value  = data.onlyShowBigPics  : "";
}

function getData(callback) {
    // 从chrome.storage.local获取数据
    chrome.storage.local.get('DataSettings', function(result) {
        var dataSettings = result.DataSettings;
        var settings = {};
        if (dataSettings) {
            // 更新Settings对象
            Settings.widthIpt = dataSettings.widthIpt || 600;
            Settings.heightIpt = dataSettings.heightIpt || 800;            
            Settings.crxHover = dataSettings.crxHover || false;
            Settings.selector = dataSettings.selector || false;
            Settings.zoomHover = dataSettings.zoomHover || false;
            Settings.shortcut = dataSettings.shortcut || false;
            Settings.shortcutKeyT = dataSettings.shortcutKeyT || "17";
            Settings.nodeFilter = dataSettings.nodeFilter|| false;
            Settings.nodeFilterT = dataSettings.nodeFilterT || "";
            Settings.blacklist = dataSettings.blacklist || false;
            var dataOSBP, dataNSBP;
            if (dataSettings.onlyShowBigPics.trim().length > 0) {
                dataOSBP = (Array.from(new Set(dataSettings.onlyShowBigPics.split("\n")))).join("\n");
            } else {
                dataOSBP = dataSettings.onlyShowBigPics;
            }
            if (dataSettings.neverShowBigPics.trim().length > 0) {
                dataNSBP = (Array.from(new Set(dataSettings.neverShowBigPics.split("\n")))).join("\n");
            } else {
                dataNSBP = dataSettings.neverShowBigPics;
            }
            Settings.onlyShowBigPics = dataOSBP || "";
            Settings.neverShowBigPics = dataNSBP || "";
        }
        // 调用回调函数，并传递获取到的数据
        callback(Settings);
    });
}
// 封装chrome.storage.local.get为返回Promise的函数  
function getStorageLocal(keys) {  
    return new Promise((resolve, reject) => {  
        chrome.storage.local.get(keys, function(result) {  
            if (chrome.runtime.lastError) {  
                reject(chrome.runtime.lastError);  
            } else {  
                resolve(result);  
            }  
        });  
    });  
}  
  
// 使用async/await的getData函数  
async function getData0() {  
    try {  
        const result = await getStorageLocal('DataSettings');  
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
            settings.shortcutKeyT = dataSettings.shortcutKeyT || "17";  
            settings.nodeFilter = dataSettings.nodeFilter || false;  
            settings.nodeFilterT = dataSettings.nodeFilterT || "";  
            settings.blacklist = dataSettings.blacklist || false;  
  
            var dataOSBP, dataNSBP;  
            if (dataSettings.onlyShowBigPics.trim().length > 0) {  
                dataOSBP = (Array.from(new Set(dataSettings.onlyShowBigPics.split("\n")))).join("\n");  
            } else {  
                dataOSBP = dataSettings.onlyShowBigPics;  
            }  
  
            if (dataSettings.neverShowBigPics.trim().length > 0) {  
                dataNSBP = (Array.from(new Set(dataSettings.neverShowBigPics.split("\n")))).join("\n");  
            } else {  
                dataNSBP = dataSettings.neverShowBigPics;  
            }  
  
            settings.onlyShowBigPics = dataOSBP || "";  
            settings.neverShowBigPics = dataNSBP || "";  
  
            // 这里可以根据需要处理settings，或者返回它  
            return settings;  
        }  
  
        // 如果没有dataSettings，可以返回一个空对象或null  
        return {};  
    } catch (error) {  
        // 错误处理  
        console.error('Failed to retrieve settings from local storage:', error);  
        // 可以根据需要抛出错误或返回null/空对象  
        return null;  
    }  
}  
  

function setData(data) {
    chrome.storage.local.get('DataSettings', function(result) {
        if (!result.DataSettings) {
            chrome.storage.local.set({
                'DataSettings': data
            });
        }
    });
}

function setSetting(setting, value) {
    Settings[setting] = value;
    chrome.storage.local.set({
        'DataSettings': Settings
    });
}
$(document).ready(function() {
    setData(Settings);
    getData(function(settings) {
        showSettings(settings);
    });
   
    showBigPicsSettings();
    var Tag = false;
    $("#addNewTask").click(function() {
        Tag = !Tag;
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                command: "insertElement",
                showEle: Tag
            }, () => chrome.runtime.lastError);
        });
    });
    document.getElementById("crxHover").addEventListener('change', function(e) {
        e.preventDefault();
        this.checked ? $("#options").css("display", "block"): $("#options").css("display", "none");
        setSetting("crxHover", this.checked);
    });
    document.getElementById("zoomHover").addEventListener('change', function(e) {
        e.preventDefault();
        this.checked ? $('label[for="zoomHover"]').text("已启用鼠标悬停显示大图") : $('label[for="zoomHover"]').text("已禁用鼠标悬停显示大图");
        setSetting("zoomHover", this.checked);
    });


    document.getElementById("shortcut").addEventListener('change', function(e) {
        e.preventDefault();
        this.checked ? $('label[for="shortcut"]').text("已启用快捷键显示图片功能") : $('label[for="shortcut"]').text("已禁用快捷键显示图片功能");
        this.checked ? $('#shortcutKeyLi').css("display","block") : $('#shortcutKeyLi').css("display","none");
        setSetting("shortcut", this.checked);
    });


    document.getElementById("nodeFilter").addEventListener('change', function(e) {
        e.preventDefault();
        this.checked ? $('label[for="nodeFilter"]').text("已启用元素节点筛选") : $('label[for="nodeFilter"]').text("已禁用元素节点筛选");
        this.checked ? $('#nodeFilterLi').css("display","block") : $('#nodeFilterLi').css("display","none");
        setSetting("nodeFilter", this.checked);
    });

    document.getElementById("selector").addEventListener('change', function(e) {
        e.preventDefault();
        this.checked ? $('label[for="selector"]').text("已启用CSS元素选择器") : $('label[for="selector"]').text("已禁用CSS元素选择器");
        this.checked ? $("#li-top").css("display", "block") : $("#li-top").css("display", "none");
        setSetting("selector", this.checked);
    });


    document.getElementById("blacklist").addEventListener('change', function(e) {
        e.preventDefault();
        this.checked ? $('label[for="blacklist"]').text("已显示悬浮显示图片黑白名单设置") : $('label[for="blacklist"]').text("已隐藏悬浮显示图片黑白名单设置");
        this.checked ? $("#wlists").css("display", "block") : $("#wlists").css("display", "none");
        setSetting("blacklist", this.checked);
    });

    createLimitationOptionList();

    document.getElementById("widthIpt").addEventListener('input', function(e) {
        e.preventDefault();
        var widthIptV = document.getElementById('widthIpt').value;
        var val = widthIptV.trim()=="" ? 600 : widthIptV.trim();
        setSetting("widthIpt", val);
    });
    document.getElementById("heightIpt").addEventListener('input', function(e) {
        e.preventDefault();
        var heightIptV = document.getElementById('heightIpt').value;
        var val = heightIptV.trim()=="" ? 800 : heightIptV.trim();
        setSetting("heightIpt", val);
    });

    document.getElementById("onlyShowBigPics").addEventListener('input', function(e) {
        e.preventDefault();
        setSetting("onlyShowBigPics", document.getElementById('onlyShowBigPics').value);
    });

    document.getElementById("neverShowBigPics").addEventListener('input', function(e) {
        e.preventDefault();
        setSetting("neverShowBigPics", document.getElementById('neverShowBigPics').value);
    });

    document.getElementById("shortcutKeyT").addEventListener('input', function(e) {
        e.preventDefault();
        var keyT = document.getElementById('shortcutKeyT').value;
        setSetting("shortcutKeyT", keyT.trim());
    });

    document.getElementById("nodeFilterT").addEventListener('input', function(e) {
        e.preventDefault();
        var val = document.getElementById('nodeFilterT').value;
        setSetting("nodeFilterT", val.trim());
    });

    document.getElementById("shortcutKeyT").addEventListener('focus', function(e) {
        e.preventDefault();
        var keyT = document.getElementById('shortcutKeyT').value;
        setSetting("shortcutKeyT", keyT.trim());
    });

    document.getElementById("nodeFilterT").addEventListener('focus', function(e) {
        e.preventDefault();
        var val = document.getElementById('nodeFilterT').value;
        setSetting("nodeFilterT", val.trim());
    });

    document.getElementById("onlyBtn").addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('onlyShowBigPics').value = "";
        setSetting("onlyShowBigPics", document.getElementById('onlyShowBigPics').value);
    });
    document.getElementById("neverBtn").addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('neverShowBigPics').value = "";
        setSetting("neverShowBigPics", document.getElementById('neverShowBigPics').value);
    });
});

function truncateString(str, maxLength) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength - 3) + '...'; // 减去3个字符来添加省略号  
    }
    return str;
}

function extractDomain(url) {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname; // Gets the domain name
}

function getLimitationOptions() {
    var listOfLimitationOptions = [];
    listOfLimitationOptions.push({
        "type": "+ 添加以下限制类型",
        "value": "select"
    });
    let url = currentUrl; // truncateString(currentUrl,37);
    if (url) {
        if (url.indexOf('?') > 0) {
            listOfLimitationOptions.push({
                "type": "Page With Params",
                "value": url
            });
            url = url.split('?')[0];
        }
        listOfLimitationOptions.push({
            "type": "Page",
            "value": url
        });
        host = extractDomain(url);
        listOfLimitationOptions.push({
            "type": "Site",
            "value": host
        });
        splitHost = host.split('.')
        if (splitHost.length > 2) {
            const withoutFirst = splitHost.slice(1);
            domain = withoutFirst.join('.');
            listOfLimitationOptions.push({
                "type": "Domain",
                "value": domain
            });
        }
    }
    return listOfLimitationOptions;
}

function renderLimitationSelector(target) {
    const listOfLimitationOptions = getLimitationOptions();
    let htmlContent = '';
    for (index in listOfLimitationOptions) {
        htmlContent += '<option id="optC" value="' + listOfLimitationOptions[index].value + '">' + listOfLimitationOptions[index].type + '</option>';
    }
    const targetElement = document.getElementById(target);
    targetElement.innerHTML = htmlContent;
    targetElement.addEventListener('click', function(e) {})
}

function createLimitationOptionList() {
    renderLimitationSelector('globalLimitationShowBigPics');
    document.getElementById('globalLimitationShowBigPics').addEventListener('change', function(e) {
        document.getElementById('onlyShowBigPics').value += e.target.value + '\n';
        e.target.value = "select";
        setSetting("onlyShowBigPics", document.getElementById('onlyShowBigPics').value);
    })
    renderLimitationSelector('globalLimitationDontShowBigPics');
    document.getElementById('globalLimitationDontShowBigPics').addEventListener('change', function(e) {
        document.getElementById('neverShowBigPics').value += e.target.value + '\n';
        e.target.value = "select";
        setSetting("neverShowBigPics", document.getElementById('neverShowBigPics').value);
    })
}

function showBigPicsSettings() {
    if (Settings.neverShowBigPics && Settings.neverShowBigPics.length > 0) {
        var sbp = Settings.neverShowBigPics.split(" ");
        var uniqueArray = (Array.from(new Set(sbp))).join("\n");
        document.getElementById("neverShowBigPics").value = uniqueArray;
    }
    if (Settings.onlyShowBigPics && Settings.onlyShowBigPics.length > 0) {
        var osbp = Settings.onlyShowBigPics.split(" ");
        var uniqueArray1 = (Array.from(new Set(osbp))).join("\n");
        document.getElementById("onlyShowBigPics").value = uniqueArray1;
    }
}
