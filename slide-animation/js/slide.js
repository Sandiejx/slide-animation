
new SlideAnimation({
    listId: 'testlist',
    listItem: '.test-item',
    prevBtn: '.js-prev',
    nextBtn: '.js-next',
    isScale: false,
    scale: 1,
    scaleBig: 'scale3d(1, 1, 1)', 
    scaleSmall: 'scale3d(1, 1, 1)',
    transition: 'all 0.5s ease-out',
    defaultIndex: 1,
    maxIndex: 5,
    minIndex: 0,
    listLength: 6,
    loop: true,
    autoplay: true,
    autoDirection: true,
    durTime: 0.5,  //s
    stayTime: 3000 //ms
});