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
        events: [],
        active: false
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
            search.reset();
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
                case 'こども':
                    return '#008D56';
                case 'スポーツ':
                    return '#008E74';
                case '音楽':
                    return '#007655';
                case '歴史':
                    return '#007F89';
                case '食・健康':
                    return '#006D4D';
                case '文化・芸術':
                    return '#007D7A';
                case '自然・環境':
                    return '#3F7735';
                case '観光・祭り':
                    return '#20604F';
                case '講座・セミナー':
                    return '#007B43';
                default:
                    return '#22825D';
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