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
        beforeKeyword: '',
        keyword: '',
        step: 10
    },
    methods: {
        setStep: function(step){
            eventList.currentPage = 0;
            this.step = step;
        },
        reset: function(){
            if(this.beforeKeyword!=this.keyword){
                eventList.currentPage = 0;
                this.beforeKeyword = this.keyword;
                scrollTo(0, 0);
            }
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
            search.reset();
            return this.events.filter(
                    event => 
                    (
                        event.event_name.indexOf(search.keyword)>=0 ||
                        ('#' + event.category).indexOf(search.keyword)>=0 ||
                        event.description.indexOf(search.keyword)>=0 ||
                        event.contact.indexOf(search.keyword)>=0 ||
                        event.event_place.indexOf(search.keyword)>=0 ||
                        event.transportation.indexOf(search.keyword)>=0 ||
                        event.remarks.indexOf(search.keyword)>=0 ||
                        event.address.indexOf(search.keyword)>=0
                    ) &&
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
        categoryColor: function(category){
            switch(category){
                case 'こども': //黄
                    return 'rgb(230, 200, 40)';
                case 'スポーツ': //橙
                    return 'rgb(255, 180, 100)';
                case '音楽': //桃
                    return 'rgb(255, 160, 200)';
                case '歴史': //茶
                    return 'rgb(180, 120, 120)';
                case '食・健康': // 黄緑
                    return 'rgb(120, 220, 20)';
                case '文化・芸術': //水
                    return 'rgb(100, 220, 220)';
                case '自然・環境': //緑
                    return 'rgb(100, 160, 100)';
                case '観光・祭り': //赤
                    return 'rgb(255, 160, 160)';
                case '講座・セミナー': //青
                    return 'rgb(180, 180, 255)';
                default: //灰
                    return 'rgb(160, 160, 160)';
            }
        },
        searchCategory: function(event){
            search.keyword = '#' + event.category;
        }
    }
})

var zoomEvent = new Vue({
    el: '#zoomEvent',
    data: {
        zoomEvent: null,
        isZoom: false,
        onZoom: false
    },
    methods: {
        cancel: function(){
            if(!this.onZoom)
                this.isZoom = false;
            else
                this.onZoom = false;
        },
        cancelCancel: function(){
            this.onZoom = true;
        },
        status: eventList.status,
        categoryColor: eventList.categoryColor
    }
})