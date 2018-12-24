$.ajax({
    url:'http://api.douban.com/v2/movie/top250',
    type:'GET',
    data:{
        start:0,
        count:20
    },
    dataType:'jsonp'
}).done(function(ret){
    console.log(ret)
    setData(ret)
    return ret
}).fail(function(){
    console.log('失败')
})

function setData(data){
    data.subjects.forEach(function(movie){
        let template = `
        <div class="item">
            <a href="#">
                <div class="cover">
                    <img src="http://img1.doubanio.com/view/photo/s_ratio_poster/public/p1606727862.jpg" alt="封面">
                </div>
            </a>
            <div class="detail">
                <a href="#">
                    <h2></h2>
                </a>
                <div class="extra">
                    <span class="score"></span><span class="fen">分</span> / <span class="collect"></span>收藏
                </div>
                <div class="extra">
                    <span class="year"></span> / <span class="genres">动画、剧情</span>
                </div>
                <div class="extra">导演：<span class="director">宫崎骏</span></div>
                <div class="extra">主演：<span class="cast">柊瑠美、入野自由</span></div>
            </div>
        </div>
        `
        let $node = $(template)
        $node.find('.item>a').attr('href',movie.alt)
        $node.find('.detail>a').attr('href',movie.alt)
        $node.find('.cover>img').attr('src',movie.images.medium)
        $node.find('h2').text(movie.title)
        $node.find('.score').text(movie.rating.average)
        $node.find('.collect').text(movie.collect_count)
        $node.find('.year').text(movie.year)
        $node.find('.genres').text(movie.genres.join('、'))
        $node.find('.director').text(function(){
            let directorArr = []
            movie.directors.forEach(function(item){
                directorArr.push(item.name)
            })
        return directorArr.join('、')
        })
        $node.find('.cast').text(function(){
            let castArr = []
            movie.casts.forEach(function(item){
                castArr.push(item.name)
            })
            return castArr.join('、')
        })
        
        $('section').eq(0).append($node)
    })
}
$('footer>div').click(function(){
     let index = $(this).index()
     $('section').hide().eq(index).fadeIn()
     $(this).addClass('active').siblings().removeClass('active')
})