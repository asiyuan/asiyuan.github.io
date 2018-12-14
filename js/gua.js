/**
 * Created by asy on 2018-12-3.
 */
var log = function () {
    console.log.apply(console, arguments)
};

var e = function (selector) {
    return document.querySelector(selector)
}

var getAllE = function (selector) {
    return document.querySelectorAll(selector)
}

var bindEvent = function (element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var bindAll = function (elements,eventName,callback) {
    for (var i = 0; i < elements.length; i++) {
        bindEvent(elements[i],eventName,callback)
    }
}



// 滚轮事件  2018/12/3
//ie/chrome
var wheelBind = function (callback) {
    //ie/chrome
    document.onmousewheel = function (event) {

        clearTimeout(timeId)
        timeId = setTimeout(function () {
            scrollMove(event,callback)
        },200)
    }
    //firefox
    if(document.addEventListener){
        document.addEventListener('DOMMouseScroll',function (event) {
            clearTimeout(timeId)
            timeId = setTimeout(function () {
                scrollMove(event,callback)
            },200)
        });
    }
}

function scrollMove(event, callback) {
    event = event || window.event;
    var flag = '';
    if(event.wheelDelta){
        //ie/chrome
        if(event.wheelDelta > 0){
            //上
            flag = 'up';
        }else {
            //下
            flag = 'down'
        }
    }else if(event.detail){
        //firefox
        if(event.detail < 0){
            //上
            flag = 'up';
        }else {
            //下
            flag = 'down'
        }
    }

    switch (flag){
        case 'up':

            if (callback && typeof callback['wheelUp'] == 'function') {
                callback.wheelUp()
            }
            break;
        case 'down':
            if (callback && typeof callback['wheelDown'] == 'function') {
                callback.wheelDown()
            }
            break;
    }

    //取消默认行为
    event.preventDefault && event.preventDefault();
    return false;
}

// 2018.12.05 自己撸的 canvas 画气泡 （正弦，余弦，正切）
// canvas 类
var Canvas = function (width, height, bgColor) {
    // 默认为 400
    this.width = width || 400
    this.height = height || 400
    this.bgColor = bgColor || 'gray'
}
//初始化 canvas 画布
Canvas.prototype.init = function () {
    var canvas = document.createElement("canvas")
    canvas.innerHTML = 'Sorry, 您的浏览器不支持Canvas'
    canvas.width = this.width
    canvas.height = this.height
    canvas.style.background = this.bgColor
    canvas.style.position = 'absolute'
    return canvas
}
// 初始化气泡放入数组
Canvas.prototype.initBubblt = function () {
    var arr = []
    var self = this;
    setInterval(function () {
        var obj = {}
        obj.x = Math.floor(Math.random()*self.width)
        obj.y = self.height + 10
        // 气泡的半径
        obj.r = Math.random()*8+2
        obj.red = Math.random()*255
        obj.green = Math.random()*255
        obj.blue = Math.random()*255
        // 气泡的透明度
        obj.a = 1
        // 做曲线运动的需要的属性
        obj.deg = 0
        obj.startX = obj.x
        obj.startY = obj.y
        obj.scale = Math.floor(Math.random()*30) + 20
        arr.push(obj)
    },1000/20)
    return arr
}
// 在画布上画气泡
Canvas.prototype.drawImage = function (canvas,arr) {
    var ctx = canvas.getContext("2d")
    var self = this
    setInterval(function () {
        ctx.clearRect(0,0,self.width,self.height)
        // 重新绘制气泡的信息
        for (var j = 0; j < arr.length; j++) {
            if (arr[j].y < 0) {
                arr.splice(j, 1)
            }
            arr[j].deg++
            arr[j].x = arr[j].startX + (Math.sin(arr[j].deg*Math.PI/180))*arr[j].scale
            arr[j].y = arr[j].startY - (arr[j].deg*Math.PI/180)*arr[j].scale * 4
        }

        for (var i = 0; i < arr.length; i++) {
            ctx.beginPath()
            ctx.arc(arr[i].x,arr[i].y,arr[i].r,0,2*Math.PI)
            ctx.fillStyle = `rgba(${arr[i].red},${arr[i].green},${arr[i].blue},${arr[i].a})`
            ctx.fill()
        }
    }, 1000/100)
}


// 2018/12/10   生成不规则的canvas图案
var beautifulCanvas = function () {
        document.addEventListener('touchmove', function (e) {
            e.preventDefault()
        })
        var c = document.getElementsByTagName('canvas')[0],
            x = c.getContext('2d'),
            pr = window.devicePixelRatio || 1,
            w = window.innerWidth,
            h = window.innerHeight,
            f = 90,
            q,
            m = Math,
            r = 0,
            u = m.PI*2,
            v = m.cos,
            z = m.random
        c.width = w*pr
        c.height = h*pr
        x.scale(pr, pr)
        x.globalAlpha = 0.6
        function i(){
            x.clearRect(0,0,w,h)
            q=[{x:0,y:h*.7+f},{x:0,y:h*.7-f}]
            while(q[1].x<w+f) d(q[0], q[1])
        }
        function d(i,j){
            x.beginPath()
            x.moveTo(i.x, i.y)
            x.lineTo(j.x, j.y)
            var k = j.x + (z()*2-0.25)*f,
                n = y(j.y)
            x.lineTo(k, n)
            x.closePath()
            r-=u/-50
            x.fillStyle = '#'+(v(r)*127+128<<16 | v(r+u/3)*127+128<<8 | v(r+u/3*2)*127+128).toString(16)
            x.fill()
            q[0] = q[1]
            q[1] = {x:k,y:n}
        }
        function y(p){
            var t = p + (z()*2-1.1)*f
            return (t>h||t<0) ? y(p) : t
        }
        document.onclick = i
        document.ontouchstart = i
        i()
    }
