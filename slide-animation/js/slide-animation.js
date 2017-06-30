/**
 * Design platform global rotation animation
 * Author: Sandyxjiang 
 * Date: 2017/06/17
 * version 1.0
 */

/**
 * 轮播组件
 * pc端首页广告位
 * 移动端详情页推荐文章模块
 */

/** 
 * new 一个轮播动画实例
 * 目前默认滑动
 * 后续会增加fadein fadeout 等动画效果
 */

/*new SlideAnimation({
    listId: 'testlist',                  //unordered list id
    listItem: '.test-item',              //list item class
    isScale: false,                      //item是否需要缩小
    scale: 0.8,                          //缩小的比例值 (0-1]，相对于可视范围的比例
                                            //为了显示左右两边的元素，以示可滑动查看
    scaleBig: 'scale3d(1, 1, 1)',        //当前元素缩放比例
    scaleSmall: 'scale3d(0.9, 0.9, 1)',  //除当前元素以外的元素的缩放比例
    transition: 'all 0.5s ease-out',     //轮播动画的过度参数
    defaultIndex: 1,                     //默认显示的item的index，
                                            //如果 loop == true，defaultIndex = 1;表示第一个item
                                            //否则 defaultIndex = 0; 表示第一个item
    maxIndex: 5,                         //如果 loop == true，maxIndex要在实际items maxIndex+2
    minIndex: 0,                         //minIndex 从 0 开始计
    listLength: 6,                       //如果 loop == true，listLength要在实际items长度+2
    loop: true,                          //是否需要左右循环无缝轮播
    autoplay: false,                     //是否需要自动切换轮播
    autoDirection: true,                 //初始轮播的方向，true表示向右，false表示向左 
    durTime: 0.5,  //s                   //动画时间，默认0.5s
    stayTime: 3000 //ms                  //自动轮播切换间隔时间，默认3000ms
});*/

function SlideAnimation(opts){

    var that = this;

    this.defaults = {
        listId: 'list',
        listItem: '.related-item',
        prevBtn: '.js-prev',
        nextBtn: '.js-next',
        isScale: false,
        scale: 1,
        scaleBig: 'scale3d(1, 1, 1)', 
        scaleSmall: 'scale3d(1, 1, 1)',
        transition: 'all 0.5s ease-out',
        defaultIndex: 1,
        maxIndex: 4,
        minIndex: 0,
        listLength: 5,
        loop: true,
        autoplay: true,
        autoDirection: true,
        durTime: 0.5,  //s
        stayTime: 3000 //ms
    };
    this.timer = 'listTimer';

    /**
     * touch event => get touchstart position
     */
    this.startXY = { X : 0, Y : 0 };

    /**
     * touch event => get touchend position
     */
    this.endXY = { X : 0, Y : 0 };

    /**
     * touchMove direction
     * true = right
     * false = left
     */
    this.slideDirection = true;
    this.autoDirection = true;

    this.eachItemWidth = function(){
        let eachPercent = 100/this.defaults.listLength;
        return eachPercent;
    };

    /**
     * current item index
     * start from 0
     * 0, 1, 2, 3, 4
     */
    this.curIndex = 0;

    /**
     * get list element by id from this.defaults.listId
     */
    this.getListEl = function(){
        return document.getElementById(this.defaults.listId);
    };

    this.getPrevBtn = function(){
        return document.querySelectorAll(this.defaults.prevBtn)[0];
    };
    this.getNextBtn = function(){
        return document.querySelectorAll(this.defaults.nextBtn)[0];
    };

    /**
     * get list items by classname from this.defaults.listItem
     */
    this.getLiItems = function(){
        return document.querySelectorAll(this.defaults.listItem);
    };

    this.getItemWidth = function(el){
        return el.getBoundingClientRect().right - el.getBoundingClientRect().left;
    };
    
    /**
     * clone the first item of ul-list for temporary last item
     */
    this.createLiItem = function(){

        let cloneFirstItem = this.getLiItems()[0].cloneNode(true),
            cloneLastItem = this.getLiItems()[this.defaults.listLength - 3].cloneNode(true);
        
        this.getListEl().appendChild(cloneFirstItem);
        this.getListEl().insertBefore(cloneLastItem, this.getLiItems()[0]);
    };

    /**
     * remove last item of ul-list
     */
    this.removeLiItem = function(){
        let lastItem = this.getLiItems()[Number(this.defaults.maxIndex+1)];

        this.getListEl().removeChild(lastItem);
    };

    this.setTransition = function(el, style){
        el.style.transition = style;
    };

    this.setTransform = function(el, style){
        el.style.transform = style;
    };
    
    /**
     * update current translateX position precent
     */
    this.updateCurTrans = function(el, opts){

        let transX = -( opts.scale * this.curIndex - (1/2 - opts.scale/2) ) / (opts.listLength * opts.scale) * 100;

        this.setTransform(el, `translate3d(${transX}%,0,0)`);
    };

     /**
     * update slide direction, only trigger by slide action not by autoplay
     */
    this.updateDirection = function(diffX, diffY){

        //previous one
        if(diffX >= 10 && diffY < 5){

            this.slideDirection = false;
            this.doSlide(this.slideDirection, this.defaults);

        }else if(diffX <= -10 && diffY < 5){
        //next one
            this.slideDirection = true;
            this.doSlide(this.slideDirection, this.defaults);

        }else{
            this.touchCancelHandler();
        }

    };

    /**
     * update current item index
     */
    this.updateCurIndex = function(direction){
        //next one
        if(direction){

            if(this.curIndex < this.defaults.maxIndex){
                this.curIndex++;

            }else if(this.curIndex == this.defaults.maxIndex  && this.defaults.loop){
                this.curIndex = this.defaults.minIndex+2;
            }

        }else{
        //previous one
            if(this.curIndex > this.defaults.minIndex){
                this.curIndex--;
            }else if(this.curIndex == this.defaults.minIndex  && this.defaults.loop){
                this.curIndex = this.defaults.maxIndex-2;
            }
        }
    };

    /**
     * check slide direction
     */
    this.checkSlideDirection = function(el){

        if(this.curIndex == this.defaults.maxIndex){

            /* 在进行translate的时候，一定要同时更新curIndex */

            this.curIndex = this.defaults.minIndex + 1;

            this.slideLoop(el);

        }
        if(this.curIndex == this.defaults.minIndex){

            /* 在进行translate的时候，一定要同时更新curIndex */

            this.curIndex = this.defaults.maxIndex - 1;

            this.slideLoop(el);
        }
    };

    /**
     * special handler for slide loop
     */
    this.slideLoop = function(el){

            setTimeout(function(){

                that.setTransition(el, 'none');

                that.updateCurTrans(el, that.defaults);

                setTimeout(function(){

                    that.setTransition(el, that.defaults.transition);

                },100);

            },that.defaults.durTime*1000);

    };

    /**
     * do slide animation function
     */
    this.doSlide = function(direction, opts){

        //listen touchEnd and then update curIndex
        this.updateCurIndex(direction);

        //perform animation
        this.slide(opts);

    };

    /**
     * list slide animation for translate3d(x, 0, 0);
     */
    this.slide = function(opts){

        if(this.defaults.isScale){

            let idxarr = [];

            /**
             * deal with the loop scale problem 
             * if curIndex == maxIndex || minIndex, then scale two item at the same time
             * 
             */
            if(this.curIndex == this.defaults.maxIndex){
                idxarr = [this.curIndex, this.defaults.minIndex + 1];
            }
            else if(this.curIndex == this.defaults.minIndex){
                idxarr = [this.curIndex, this.defaults.maxIndex - 1];
            }else{
                idxarr = [this.curIndex];
            }

            this.scale(idxarr);
        }

        this.updateCurTrans(this.getListEl(), opts);
        

        if(this.defaults.loop){
           this.checkSlideDirection(this.getListEl());
        }

    };

    /**
     * list item aniamtion for scale3d();
     */
    this.scale = function(idxArr){

        /*idxArr 可同时scale多个元素*/
        let els = this.getLiItems();
        
        for(let i = 0; i < this.defaults.listLength; i++){

            //setTimeout(function(){ console.log(slideAnimation.getItemWidth(els[i])) },0);

            if(idxArr.includes(i)){
                els[i].style.transform = this.defaults.scaleBig;
            }else{
                els[i].style.transform = this.defaults.scaleSmall;
            }
        }
    };

    /**
     * defaults.autoplay == true
     */
    this.autoplay = function(opts){

        this.timer = setInterval(function(){

            that.doSlide(that.autoDirection, opts);

        }, this.defaults.stayTime);

    };

    /**
     * defaults.autoplay == true;
     * clearInterval and autoplay;
     */
    this.checkIsAutoplay = function(){
        //autoplay == true
        if(that.defaults.autoplay){
            clearInterval(that.timer);
            that.autoplay(that.defaults);
        }
    };

    /**
     * click prev btn event handler
     */
    this.prevHandler = function(event){

        if(that.defaults.autoplay){
            clearInterval(that.timer);
        }

        that.slideDirection = false;
        that.doSlide(that.slideDirection, that.defaults);

        that.checkIsAutoplay();
    };

    /**
     * click next btn event handler
     */
    this.nextHandler = function(event){

        if(that.defaults.autoplay){
            clearInterval(that.timer);
        }

        that.slideDirection = true;
        that.doSlide(that.slideDirection, that.defaults);
        
        that.checkIsAutoplay();
    };

    /**
     * touchstart event handler
     */
    this.touchStartHandler = function(event){

        if(that.defaults.autoplay){
            clearInterval(that.timer);
        }

        let touches = event.changedTouches;
        that.startXY = { X: touches[0].pageX, Y: touches[0].pageY };
    };

    /**
     * touchmove event handler
     */
    this.touchMoveHandler = function(event){
        event.preventDefault();
    };

    /**
     * touchEnd event handler
     */
    this.touchEndHandler = function(event){

        let touches = event.changedTouches;

        that.endXY = { X: touches[0].pageX, Y: touches[0].pageY };

        let diffX = that.endXY.X - that.startXY.X,
            diffY = that.endXY.Y - that.startXY.Y;
        
        that.updateDirection(diffX, diffY);

        that.checkIsAutoplay();

    };

    /**
     * touchEnd event handler
     */
    this.touchCancelHandler = function(event){
        that.checkIsAutoplay();
    }

    /**
     * 
     */
    this.resizeHandler = function(){

    };

    /**
     * addEventListener to list
     */
    this.setupListener = function(){

        var el = this.getListEl();
        if(el){
            el.addEventListener('touchstart', this.touchStartHandler, false);
            el.addEventListener('touchmove', this.touchMoveHandler, false);
            el.addEventListener('touchend', this.touchEndHandler, false);
            el.addEventListener('touchcancel', this.touchCancelHandler, false);
        }

        var prevBtn = this.getPrevBtn(),
            nextBtn = this.getNextBtn();

        if(prevBtn){
            prevBtn.addEventListener('click', this.prevHandler, false);
        }
        if(nextBtn){
            nextBtn.addEventListener('click', this.nextHandler, false);
        }

        window.addEventListener('resize', this.resizeHandler, false);
    };
    
    /**
     * initial
     */
    this.init = function(opts){
        
        //合并覆盖默认参数, opts 覆盖this.defaults，并返回this.defaults
        this.defaults = extend({},this.defaults, opts);
        /*$.extend(true, this.defaults, opts);*/

        this.setupListener();

        /* update curIndex from defaults.defaultIndex */
        this.curIndex = this.defaults.defaultIndex;

        /* loop == true, add item for ul-list */
        if(this.defaults.loop){
            this.createLiItem();
        }
        
        /**
         * initial item scale
         * scale should be after createLiItem
         */
        if(this.defaults.isScale){
            this.scale([this.defaults.defaultIndex]);
        }

        /* initial list translateX */
        this.slide(this.defaults);

        if(this.defaults.autoplay){
            this.autoDirection = this.defaults.autoDirection;
            this.autoplay(this.defaults);
        }

    };
    
    this.init(opts);

}

/**
 * 原生Javascript 实现 $.extend方法
 */
function extend(){
    
    var _extend = function me(dest, source){
        for(var name in dest){
            //当前睡醒是否为对象，如果为对象，则进行递归
            if( (dest[name] instanceof Object ) && ( source[name] instanceof Object) ){
                me(dest[name], source[name]);
            }

            //检测该属性是否存在
            if(source.hasOwnProperty(name)){
                continue;
            }else{
                source[name] = dest[name];
            }
        }
    }
    
    var _result = {},
        arr = arguments;

    //遍历属性，从后往前
    if(!arr.length) return {};

    for(var i = arr.length-1; i>= 0;i--){
        _extend(arr[i], _result);
    };

    arr[0] = _result;

    return _result;

}