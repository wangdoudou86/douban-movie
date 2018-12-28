var Paging = {
    init:function(){
        this.$tabs = $('footer>div') 
        this.$pages = $('main>section')
        this.bind()
    },
    bind(){
        var _this = this  //  !!!!!!!!只是把Paging给赋值过去，不要变成jQ对象！！！！  
        this.$tabs.click(function(){
            var $this = $(this)
            var index = $this.index()
            _this.$pages.hide().eq(index).fadeIn()  
            $this.addClass('active').siblings().removeClass('active')
        })
    }
}

var View = {
    creatNode(movie){
        let template = `
            <div class="item">
                <a href="">
                    <div class="cover">
                        <img src="" alt="封面">
                    </div>
                </a>
                <div class="detail">
                    <a href="">
                        <h2></h2>
                    </a>
                    <div class="extra">
                        <span class="score"></span><span class="fen">分</span> / <span class="collect"></span>收藏
                    </div>
                    <div class="extra">
                        <span class="year"></span> / <span class="genres"></span>
                    </div>
                    <div class="extra">导演：<span class="director"></span></div>
                    <div class="extra">主演：<span class="cast"></span></div>
                </div>
            </div>
            `
            let $node = $(template)
            $node.find('a').attr('href',movie.alt)
            $node.find('.cover>img').attr('src',movie.images.medium)
            $node.find('h2').text(movie.title)
            $node.find('.score').text(movie.rating.average)
            $node.find('.collect').text(movie.collect_count)
            $node.find('.year').text(movie.year)
            $node.find('.genres').text(movie.genres.join('、'))
            $node.find('.director').text(movie.directors.map(v=>v.name).join('、'))
            $node.find('.cast').text(movie.casts.map(v=>v.name).join('、'))  
            return $node
        },
        isToBottom:function($content,$viewport){
            return $content.height() + $content.scrollTop() + 10 > $viewport.height() 
        }
        
}
var Top250 = {
    init(){
        var _this = this
        this.$main = $('main')
        this.$top = $('section.top')
        this.$container = this.$top.find('.container')
        this.number = 0
        this.page = 0
        this.isLoading = false
        this.isFinish = false
        this.count = 10
        this.bind()
        this.getData(function(data){
            _this.render(data)
            _this.page++
        }
        )
    },
    bind(){
        var _this = this
        this.$top.scroll(()=>{
            if(View.isToBottom(this.$top,this.$container) && !this.isLoading && !this.isFinish){
                _this.getData(function(data){
                    _this.render(data)
                    _this.page++
                    if(_this.page * _this.count >= data.total){
                        _this.isFinish = true
                        _this.$top.find('.loading').hide()
                    }
                })
            }
        })
    },
    getData(callback){
        var _this = this
        if(this.isLoading) return
        this.isLoading =true
        this.$top.find('.loading').show()
        $.ajax({
        url:'https://api.douban.com/v2/movie/top250',
        type:'GET',
        data:{
            start:this.count * this.page,
            count:this.count
        },
        dataType:'jsonp'
        }).done(function(ret){
            _this.isLoading = false
            _this.$top.find('.loading').hide()
            callback(ret)  //回调函数
        })
    },
    render(data){
        var _this = this
        data.subjects.forEach(function(movie){
           var $node = View.creatNode(movie)
           _this.$container.append($node)
        })
    }
}


var beimei = {
    init(){
        this.$main = $('main')
        this.$beimei = $('section.beimei')
        this.$container = this.$beimei.find('.container')
        this.isLoading = false
        this.getData()
    },
    getData(){
        var _this = this
        $.ajax({
        url:'//api.douban.com/v2/movie/us_box',
        type:'GET',
        data:{
            start:0,
            count:10
        },
        dataType:'jsonp'
        }).done(function(ret){
            _this.setData(ret)
        })
    },
    setData(data){
        var _this = this
        data.subjects.forEach(function(movie){
           var $node = View.creatNode(movie.subject)
           _this.$container.append($node)
        })
    }
}

var search = {
    init(){
        this.$search = $('section.search')
        this.$box = this.$search.find('.searchBox')
        this.$container = this.$search.find('.container')
        this.page = 0
        this.count = 10
        this.isFinish = false
        this.isLoading = false
        this.bind()
    },
    bind(){
        var _this = this
        this.$search.find('.button').on('click',()=>{
            _this.getData(function(data){
            _this.render(data)
            _this.page++
            })
        })
        this.$search.find('.searchWrapper input').on('keyup',(e)=>{
            if(e.key === 'Enter'){
                _this.getData(function(data){
                _this.render(data)
                _this.page++
                })
            }
        }),
        this.$search.on('scroll',()=>{
            if((this.$search.height() + this.$search.scrollTop() > this.$box.height()) && !this.isLoading && !this.isFinish){
                _this.getData(function(data){
                    _this.render(data)
                    _this.page++
                    if(_this.page * _this.count >= data.total){
                        _this.isFinish = true
                    }
                })
            }
        })
    },
    getData(callback){
        var _this = this
        var keyword = this.$search.find('.searchWrapper input').val()
        this.$search.find('.loading').show()
        this.isLoading = true
        $.ajax({
        url:'http://api.douban.com/v2/movie/search',
        type:'GET',
        data:{
            q:keyword,
            start:this.count * this.page,
            count:this.count
        },
        dataType:'jsonp'
        }).done(function(ret){
            _this.isLoading = false
            _this.$search.find('.loading').hide()
            callback(ret)
        })
    },
    render(data){
        var _this = this
        data.subjects.forEach(function(movie){
            var $node = View.creatNode(movie)
            _this.$container.append($node)
         })
    }
}

var app = {
    init:function(){
        Paging.init()
        Top250.init()
        beimei.init()
        search.init()
    }
}

app.init()





// $('.top').height() + $('.top').scrollTop()  > $('.top .container').height() + 20




// function foo(content,viewport){
//     return content.height() + content.scrollTop()  > viewport.height() + 20
//     }

// foo($('.top'),$('.top .container'))