var Tag = false;
var i = 0;
var Settings = {
    selector: false,
    zoomHover: false,
    altPic: false,
    ctrlPic: false
};
chrome.action.onClicked.addListener(function(thisTab) {
    Tag = !Tag;
    chrome.tabs.sendMessage(thisTab.id, {
        command: "insertElement",
        showEle: Tag
    }, () => chrome.runtime.lastError);
});

