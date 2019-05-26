cmp = function(x, y){
    if(x < y)
        return 1;
    if(x > y)
        return -1;
    return 0;
}

dateCmp = function(date1, date2){
    if(cmp(date1[0], date2[0]) != 0)
        return cmp(date1[0], date2[0]);
    if(cmp(date1[1], date2[1]) != 0)
        return cmp(date1[1], date2[1]);
    return cmp(date1[2], date2[2]);
}

var search = new Vue({
    el: '#searchForm',
    data: {
        keyword: '',
        step: 10
    },
    methods: {
        setStep: function(step){
            eventList.currentPage = 0;
            this.step = step;
        }
    }
})

var eventList = new Vue({
    el: '#contents',
    data: {
        currentPage: 0,
        events: []
    },
    mounted: function(){
            axios.get('https://raw.githubusercontent.com/jigjp/intern_exam/master/fukui_event.json')
            .then(function(res){
                eventList.events = res.data;
            });
    },
    methods: {
        matchEvents: function(){
            return this.events.filter(
                    event => 
                    (event.event_name.indexOf(search.keyword)>=0 ||
                    event.category.indexOf(search.keyword)>=0) &&
                    this.status(event) != '終了'
            );
        },
        activeEvents: function(){
            if(search.step > 0)
                return this.matchEvents().slice(search.step*this.currentPage, search.step*(this.currentPage+1));
            else
                return this.matchEvents();
        },
        maxPage: function(){
            if(search.step > 0)
                return this.matchEvents().length%search.step == 0 ? this.matchEvents().length/search.step : Math.ceil(this.matchEvents().length / search.step);
            else
                return 1;
        },
        isBegin: function(){
            return this.currentPage == 0 || search.step == -1;
        },
        isEnd: function(){
            return this.currentPage == this.maxPage()-1 || search.step == -1;
        },
        back: function(){
            if(!this.isBegin()){
                this.currentPage -= 1;
                scrollTo(0, 0);
            }
        },
        next: function(){
            if(!this.isEnd()){
                this.currentPage += 1;
                scrollTo(0, 0);
            }
        },
        status: function(event){
            var nowDate = [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()];
            var eventStartDate = event.start_date.split('/');
            var eventEndDate = event.end_date.split('/');

            if(dateCmp(eventStartDate, nowDate) < 0)
                return '開催予定';
            if(dateCmp(nowDate, eventEndDate) < 0)
                return '終了';
            return '開催中';
        },
        zoom: function(event){
            zoomEvent.zoomEvent = event;
            zoomEvent.isZoom = true;
        },
        categoryColor: function(event){
            switch(event.category){
                case 'こども': //黄
                    return {background: 'rgb(255, 255, 0)'};
                case 'スポーツ': //橙
                    return {background: 'rgb(255, 127, 0)'};
                case '音楽': //桃
                    return {background: 'rgb(255, 0, 127)'};
                case '歴史': //茶
                    return {background: 'rgb(127, 0, 0)'};
                case '食・健康': // 黄緑
                    return {background: 'rgb(127, 255, 0)'};
                case '文化・芸術': //水
                    return {background: 'rgb(0, 255, 255)'};
                case '自然・環境': //緑
                    return {background: 'rgb(0, 127, 0)'};
                case '観光・祭り': //赤
                    return {background: 'rgb(255, 0, 0)'};
                case '講座・セミナー': //青
                    return {background: 'rgb(0, 0, 255)'};
                default: //灰
                    return {background: 'rgb(127, 127, 127)'};
            }
        }
    }
})

var zoomEvent = new Vue({
    el: '#zoomEvent',
    data: {
        zoomEvent: null,
        isZoom: false
    },
    methods: {
        cancel: function(){
            this.isZoom = false;
        },
        status: function(event){
            var nowDate = [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()];
            var eventStartDate = event.start_date.split('/');
            var eventEndDate = event.end_date.split('/');

            if(dateCmp(eventStartDate, nowDate) < 0)
                return '開催予定';
            if(dateCmp(nowDate, eventEndDate) < 0)
                return '終了';
            return '開催中';
        },
        categoryColor: function(event){
            switch(event.category){
                case 'こども': //黄
                    return {background: 'rgb(255, 255, 0)'};
                case 'スポーツ': //橙
                    return {background: 'rgb(255, 127, 0)'};
                case '音楽': //桃
                    return {background: 'rgb(255, 0, 127)'};
                case '歴史': //茶
                    return {background: 'rgb(127, 0, 0)'};
                case '食・健康': // 黄緑
                    return {background: 'rgb(127, 255, 0)'};
                case '文化・芸術': //水
                    return {background: 'rgb(0, 255, 255)'};
                case '自然・環境': //緑
                    return {background: 'rgb(0, 127, 0)'};
                case '観光・祭り': //赤
                    return {background: 'rgb(255, 0, 0)'};
                case '講座・セミナー': //青
                    return {background: 'rgb(0, 0, 255)'};
                default: //灰
                    return {background: 'rgb(127, 127, 127)'};
            }
        }
    }
})