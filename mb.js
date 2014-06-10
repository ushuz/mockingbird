var mb = angular.module('mb', []);
var x2js = new X2JS();

var text_xml =
"<xml>"+
  "<ToUserName><![CDATA[olxdj1234567890]]></ToUserName>"+
  "<FromUserName><![CDATA[gh_abcdefghijk]]></FromUserName>"+
  "<CreateTime>"+parseInt(new Date().getTime()/1000)+"</CreateTime>"+
  "<MsgType><![CDATA[text]]></MsgType>"+
  "<Content><![CDATA[这是个测试！]]></Content>"+
"</xml>"

var singlenews = "<xml><ToUserName><![CDATA[{{ to.fr }}]]></ToUserName><FromUserName><![CDATA[{{ to.to }}]]></FromUserName><CreateTime>{{ int(time.time()) }}</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>1</ArticleCount><Articles><item><Title><![CDATA[点击「欢迎」 了解更多]]></Title><Description><![CDATA[指南]]></Description><PicUrl><![CDATA[http://mmsns.qpic.cn/mmsns/QhYwSe3HJUSOOGDRsia7Y5EvUJ7WmanZUgxvuos2NLytiaQZxLRaiaZOg/0]]></PicUrl><Url><![CDATA[http://mp.weixin.qq.com/mp/appmsg/show?__biz=MjM5NzA3NTUwMQ==&appmsgid=10000004&itemidx=1&sign=f225ba1c6bc27f8094c866a9180a2e3a]]></Url></item></Articles></xml>"

var news3 = "<xml><ToUserName><![CDATA[{{ to.fr }}]]></ToUserName><FromUserName><![CDATA[{{ to.to }}]]></FromUserName><CreateTime>{{ int(time.time()) }}</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>3</ArticleCount><Articles><item><Title><![CDATA[点击「欢迎」 了解更多]]></Title><Description><![CDATA[指南]]></Description><PicUrl><![CDATA[http://mmsns.qpic.cn/mmsns/QhYwSe3HJUSOOGDRsia7Y5EvUJ7WmanZUgxvuos2NLytiaQZxLRaiaZOg/0]]></PicUrl><Url><![CDATA[http://mp.weixin.qq.com/mp/appmsg/show?__biz=MjM5NzA3NTUwMQ==&appmsgid=10000004&itemidx=1&sign=f225ba1c6bc27f8094c866a9180a2e3a]]></Url></item><item><Title><![CDATA[新功能 · 敬请期待]]></Title><Description><![CDATA[新功能]]></Description><PicUrl><![CDATA[http://mmsns.qpic.cn/mmsns/QhYwSe3HJUSOOGDRsia7Y5EvUJ7WmanZUJOU0w0GlpHIBWED0af4Pdg/0]]></PicUrl><Url><![CDATA[]]></Url></item><item><Title><![CDATA[新功能 · 敬请期待]]></Title><Description><![CDATA[新功能]]></Description><PicUrl><![CDATA[http://mmsns.qpic.cn/mmsns/QhYwSe3HJUSOOGDRsia7Y5EvUJ7WmanZUJOU0w0GlpHIBWED0af4Pdg/0]]></PicUrl><Url><![CDATA[]]></Url></item></Articles></xml>"

var news2 = "<xml><ToUserName><![CDATA[{{ to.fr }}]]></ToUserName><FromUserName><![CDATA[{{ to.to }}]]></FromUserName><CreateTime>{{ int(time.time()) }}</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>3</ArticleCount><Articles><item><Title><![CDATA[点击「欢迎」 了解更多]]></Title><Description><![CDATA[指南]]></Description><PicUrl><![CDATA[http://mmsns.qpic.cn/mmsns/QhYwSe3HJUSOOGDRsia7Y5EvUJ7WmanZUgxvuos2NLytiaQZxLRaiaZOg/0]]></PicUrl><Url><![CDATA[http://mp.weixin.qq.com/mp/appmsg/show?__biz=MjM5NzA3NTUwMQ==&appmsgid=10000004&itemidx=1&sign=f225ba1c6bc27f8094c866a9180a2e3a]]></Url></item><item><Title><![CDATA[新功能 · 敬请期待]]></Title><Description><![CDATA[新功能]]></Description><PicUrl><![CDATA[http://mmsns.qpic.cn/mmsns/QhYwSe3HJUSOOGDRsia7Y5EvUJ7WmanZUJOU0w0GlpHIBWED0af4Pdg/0]]></PicUrl><Url><![CDATA[]]></Url></item></Articles></xml>"

var xml2json = function (xml) {
    if (typeof(xml) === "string") {
        return x2js.xml_str2json(xml).xml;
    } else {
        return x2js.xml2json(xml).xml;
    }
}

// var wrap = function (msg) {
    // msg.ToUserName = {__cdata: msg.ToUserName};
    // msg.FromUserName = {__cdata: msg.FromUserName};
    // msg.MsgType = {__cdata: msg.MsgType};
    // msg.Content = {__cdata: msg.Content};
    // return msg;
// }

var json2xml = function (json) {
    if (!json) {
        return;
    };

    // wrap() will prevent messages from being displayed
    // json = wrap(json);

    return x2js.json2xml_str({xml: json})
}

var scrollToBottom = function () {
    var t = $(".chatScroll")[0];
    t.scrollTop = t.scrollHeight;
}

// make ng-model work on contenteditable element
mb.directive('contenteditable', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ctrl) {
        if (!ctrl) {
            return;
        };

        // view -> model
        element.on('blur', function() {
            scope.$apply(function() {
                ctrl.$setViewValue(element.html());
            });
        });

        // model -> view
        ctrl.$render = function(value) {
            element.html(value);
        };

        // load init value from DOM
        ctrl.$setViewValue(element.html());
    }
  };
});

conversations = [
        {owner: "me", content: xml2json(text_xml)},
        {owner: "you", content: xml2json(text_xml)},
        // {owner: "you", content: xml2json(singlenews)},
        // {owner: "you", content: xml2json(news2)},
        // {owner: "you", content: xml2json(news3)},
    ];

mb.controller("ConversationCtrl",["$scope", "$http", function (scope, http) {
    scope.conversations = conversations;

    scope.date = function () {
        return new Date();
    };

    scope.isTextMsg = function (item) {
        if (item.content.MsgType.toString() === "text") {
            return true;
        };
        return false;
    };

    scope.isSingleNews = function (item) {
        if (item.content.MsgType.toString() === "news" && item.content.ArticleCount === "1") {
            return true;
        }
        return false;
    };

    scope.isMultiNews = function (item) {
        if (item.content.MsgType.toString() === "news" && item.content.ArticleCount !== "1") {
            return true;
        };
        return false;
    };

    scope.isMusicMsg = function (item) {
        if (item.content.MsgType.toString() === "music") {
            return true;
        };
        return false;
    };

    scope.getOwnerName = function (item) {
        if (item.owner === "me") {
            return scope.meName;
        };
        if (item.owner === "you") {
            return scope.mpName;
        };
    };

    scope.request = function (msgToSend) {
        scrollToBottom();
        payload = json2xml(msgToSend);
        // $http will fire OPTION first so we turn to jQuery.ajax
        $.ajax({
            method: "POST",
            url: scope.Handler,
            data: payload,
            // The 'contentType' property sets the 'Content-Type' header.
            // The JQuery default for this property is
            // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
            // a preflight. If you set this value to anything other than
            // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
            // you will trigger a preflight request.
            contentType: "text/plain"
        }).success(function (data) {
            scope.conversations.push({owner: "you", content: xml2json(data)});
            scope.$apply();
            scrollToBottom();
        })
    }

    scope.submit = function () {
        if (!scope.textInput) {
            return
        }
        msgToSend = {
            ToUserName: scope.mpId,
            FromUserName: scope.meId,
            CreateTime: parseInt(new Date().getTime()/1000),
            MsgType: "text",
            Content: scope.textInput,
            // 16-digit random
            MsgId: String(Math.random()).slice(3)
        };
        scope.conversations.push({owner:"me", content: msgToSend});
        console.log(scope.conversations);
        scope.request(msgToSend);
    };
}])
