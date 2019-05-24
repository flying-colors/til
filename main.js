const $ = require('jquery'),
    SssLocalstorage = require('./SssLocalstorage.js');
$(function () {
    const sss = new SssLocalstorage;
    
    const $searchFw = $('[data-search-freeword="wrapper"]'),
        $formFw = $('form[name=searchFreeWord]'),
        $inputSearch = $('#freeWord'),
        $openBtn = $('[data-search-freeword="openBtn"]'),
        $closeBtn = $('[data-search-freeword="closeBtn"]'),
        $history = $('[data-search-freeword="historyList"]'),
        maxLength = 10;
    
    let storage = JSON.parse(localStorage.getItem('sss')) || {},
        searchWords = storage.searchWords || [];
    
    // 検索窓をスライドイン
    $openBtn.on('click', () => {
        $inputSearch.focus();
        $searchFw.addClass('is-active');
        const s2 = s_gi(s_account);

        // クリックログ送信
        s2.tl(this, 'o', 'header_FW');
    });

    // 検索窓をスライドアウト
    $closeBtn.on('click', () => {
        $searchFw.removeClass('is-active');
    });

    const submitKeywordSearch = () => {
        const inputKeyword = $inputSearch.val();

        // 検索キーワードとページIDをローカルストレージに保存
        sss.setSearchHistory(inputKeyword);     

        // 送信実行
        $formFw.submit();
    }

    // 検索窓から検索
    $inputSearch.on('keypress', (event) => {
        if (event.which == 13) {
            if ($inputSearch.val() !== '') {
                event.preventDefault();
                const s2 = s_gi(s_account);

                // クリックログ送信
                s2.tl(this, 'o', 'header_FW_done');
                submitKeywordSearch();
            } else {
                return false;
            }
        }
    });

    // 検索履歴から直接検索
    $(document).on('click', '[data-keyword=keyword]', (event) => {
        $inputSearch.val(event.currentTarget.innerText);
        event.preventDefault();
        const s2 = s_gi(s_account);

        // クリックログ送信
        s2.tl(this, 'o', 'header_FW_rireki_done');
        submitKeywordSearch();
    });

    // 検索履歴を消去
    $(document).on('click', '.searchPanelFreeWord__deleteItem', (event) => {
        // 検索履歴を削除
        $($history).empty();
        // localstrageをクリア
        sss.deleteSearchWord();
        // 検索履歴削除ボタンを削除
        event.currentTarget.remove();
        $(`<li class="searchPanelFreeWord__item searchPanelFreeWord__item--nohistory">検索履歴はありません</li>`).prependTo($history);
    })

    // 検索履歴がない場合
    if (searchWords.length === 0) {
        $(`<li class="searchPanelFreeWord__item searchPanelFreeWord__item--nohistory">検索履歴はありません</li>`).prependTo($history);

        // 検索履歴がある場合
    } else {
        for (let i = 0; i < searchWords.length; i++) {
            $(`<li class="searchPanelFreeWord__item" data-keyword="keyword">${searchWords[i]}</li>`).prependTo($history);
        }
        // 検索履歴削除ボタンを表示
        $history.after(`<div class="searchPanelFreeWord__history searchPanelFreeWord__deleteItem">検索履歴を消去</div>`);
    }

    // 最新の10件まで検索履歴を表示
    if (searchWords.length > maxLength) {
        $(`.searchPanelFreeWord__item:gt(${maxLength - 1})`).remove();
        // 最古の検索キーワードを削除
        searchWords.shift();
    }

    // 学校名サジェスト
    class SchoolSuggest {
        constructor() {
            this.dataList = [];
            this.keywordArr = [];
            this.shapedDataList = [];
            this.init();
        }
        init(){
            this.$seachSchool = $('.searchPanelFreeWord__inputSearch');
            this.bindEvent();
        }
        getSchoolDataList(){
            $.ajax({
                url: '/smp/fwSuggest/gakkoNmSearch/',
                type: 'POST',
                data: {
                    keyword: $('[name="keyword"]').val()
                }
            }).then((data)=>{
                const dataList = JSON.parse(data);
                this.dataList = dataList.data;
                // console.log(this.dataList);
                for (let i = 0; i < this.dataList.length; i++) {
                    this.keywordArr.push(this.dataList[i].gakkoNm);
                    $('.schoolList').append(`
                        <li class="schoolList__item">
                            <a href="http://shingakunet.com/gakko/${this.dataList[i].gakkoCd}" class="schoolList__link" target="_blank">
                                ${this.dataList[i].gakkoNm}
                                <span class="schoolList__info">${this.dataList[i].koshuCategoryMNm} / ${this.dataList[i].dispLocationNm}</span>
                            </a>
                        </li>
                        `)
                }
            })
        }

        getKeywordSuggest() {
			this.viewSchoolList();
        }

        getShapedDataList(searchKey){
            // 検索欄が空白の時はnull
			if (searchKey === '') {
				searchKey = null;
            }
            // console.log(this.dataList.length);

            for (let i = 0; i < this.dataList.length; i++) {
                // if (searchKey.length > 1) {
                //     const data = {
                //         dispLocationNm: this.dataList[i].dispLocationNm,
                //         gakkoCd: this.dataList[i].gakkoCd,
                //         gakkoNm: this.dataList[i].gakkoNm,
                //         koshuCategoryMNm: this.dataList[i].koshuCategoryMNm
                //     }
                //     this.shapedDataList.push(data);
                    
                // } else if (searchKey = null){
                //     return false;
                // }
                const data = {
                    dispLocationNm: this.dataList[i].dispLocationNm,
                    gakkoCd: this.dataList[i].gakkoCd,
                    gakkoNm: this.dataList[i].gakkoNm,
                    koshuCategoryMNm: this.dataList[i].koshuCategoryMNm
                }
                this.shapedDataList.push(data);
            }
            console.log(this.shapedDataList);
            this.viewSchoolList();
            
        }
        
        viewSchoolList() {
            for (let i = 0; i < this.shapedDataList.length; i++) {
                $('.schoolList').append(`
                    <li class="schoolList__item">
                        <a href="http://shingakunet.com/gakko/${this.shapedDataList[i].gakkoCd}" class="schoolList__link" target="_blank">
                            ${this.shapedDataList[i].gakkoNm}
                            <span class="schoolList__info">${this.shapedDataList[i].koshuCategoryMNm} / ${this.shapedDataList[i].dispLocationNm}</span>
                        </a>
                    </li>
                `)
            }
        }

        bindEvent(){
            this.$seachSchool.on('keyup',(e)=>{
                this.shapedDataList = [];
                const searchKey = $(e.target).val();
                this.getSchoolDataList();
                this.getShapedDataList();
            });
            this.$seachSchool.on('blur',()=>{
                $('.schoolList__item').remove();
                this.shapedDataList = [];
            });
        }
    }
    new SchoolSuggest();

    // ドロワーメニュー
    class DrowerMenu {
        constructor() {
            this.init();
        }
        init() {
            this.$drawerMenuTrigger = $('.js-drawerMenu');
            this.$drawerMenu = $('.drawerMenu');
            this.$container = $('.js-container');
            this.bindEvent();
        }
        openDrowerMenu() {
            this.$drawerMenu.fadeIn();
            this.$container.addClass('is-show');
            $('html, body').css('overflow', 'hidden');
        }
        closeDrowerMenu() {
            this.$drawerMenu.fadeOut();
            this.$container.removeClass('is-show');
            $('html, body').css('overflow', '');
        }
        bindEvent() {
            this.$drawerMenuTrigger.on('click',()=>{
                this.openDrowerMenu();
            });
            this.$drawerMenu.on('click',()=>{
                this.closeDrowerMenu();
            });
            this.$container.on('click',(e)=>{
                e.stopPropagation();
            });
        }
    }
    new DrowerMenu();

    // 閲覧履歴
    class SchoolHistory {
        constructor() {
            this.dataList = [];
            this.getSchoolData();
        }
        getSchoolData(){
            $.ajax({
                url: '/smp/history/gakkoReadHistorySearch'
            }).then((data)=>{
                const dataList = JSON.parse(data);
                this.dataList = dataList.data;
                
                if(this.dataList.length){
                    $('.js-container').prepend(`
                    <div class="drawerMenu__heading">閲覧履歴</div>
                    <ul class="drawerMenu__historyList"></ul>
                    `)

                    for (let i = 0; i < 3; i++) {
                        $('.drawerMenu__historyList').append(`
                            <li class="drawerMenu__historyListItem" onclick="var s2=s_gi(s_account);s2.tl(this,'o','header_menu_rireki_kosya')">
                                <a href="/smp/gakko/top/${this.dataList[i].gakkoCd}/" class="">
                                <img src="/school/${this.dataList[i].rootProductCd}/images/${this.dataList[i].gakkoPhoto}" alt="" class="drawerMenu__historySchoolImage">
                                </a>
                                <p class="drawerMenu__historySchoolName"><a href="/smp/gakko/top/${this.dataList[i].gakkoCd}/" class="">${this.dataList[i].gakkoNm}</a></p>
                            </li>
                        `)
                    }
                    if(this.dataList.length > 3){
                        $('.drawerMenu__historyList').after(`
                            <p class="drawerMenu__more">
                                <a href="/smp2/cart/list" class="drawerMenu__moreLink">もっと見る</a>
                            </p>
                        `)
                    } 
                }
            })
        }
    }
    new SchoolHistory();
});
