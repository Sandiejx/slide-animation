# slide-animation
slide component for both pc &amp; mobile

* 轮播动画；
> 支持自动播放
  支持两侧图片缩小展示
  支持左右两个方向循环播放
  支持pc端按钮控制切换图片
  支持移动端滑动控制切换图片
  支持动画参数修改
  支持指定默认展示的图片

### HTML
```html
   <section class="mod-test">
        <div class="testlistwrapper show-animate-item">
            <ul class="test-list clearfix" id="testlist">
                <li class="test-item item1">111111</li>
                <li class="test-item item2">222222</li>
                <li class="test-item item3">333333</li>
                <li class="test-item item4">444444</li>
            </ul>
        </div>
        <div class="control-btns">
            <span class="prev-btn js-prev">&lt;</span>
            <span class="next-btn js-next">&gt;</span>
        </div>
    </section>
```

### CSS
```css
    .testlistwrapper{
        max-width: 100%;
        width: 420px;        /* 可视范围的宽高 */
        height: 420px;
        margin: 100px auto;
        overflow: hidden;    /* 使得ul.test-list元素宽度超出部分隐藏 */ 
    }
    .testlistwrapper .test-list{
        width: 600%;         
        height: 420px;
        transition: all 0.5s ease-out;
    }
    /*
    if(loop == true){
        listLength = test-item.length + 2;
    }else{
        listLength = test-item.length;
    }
    width = 100% * listLength;
    */

    .testlistwrapper .test-list .test-item{
        float: left;
        width: 16.6666%;
        height: 100%;
    }
    /* width = 100% / listLength; */

```
### JavaScript
```javascript

   //new 一个轮播动画实例
   new SlideAnimation({
        listId: 'testlist',                  //unordered list id
        listItem: '.test-item',              //list item class
        prevBtn: '.js-prev',                 //上一张按钮
        nextBtn: '.js-next',                 //下一张按钮
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

        /*后续可增加动画切换方式，目前默认滑动，后续会增加fadein fadeout 等动画效果*/
    });
```
