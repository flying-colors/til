    // 学校名サジェスト
    class SchoolSuggest {
        constructor() {
            this.dataList = [];
            this.dataListIsEmpty = true;
            this.init();
        }
        init(){
            this.$seachSchool = $('.searchPanelFreeWord__inputSearch');
            this.bindEvent();
        }

        // 全件データを取得
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

                console.log(this.dataList);
                
            })
        }

        createSchoolList() {
            if(this.dataListIsEmpty){
                $('.schoolList').show();
                for (let i = 0; i < this.dataList.length; i++) {
                    // 「専門職大学」ありの場合
                    if(this.dataList[i].semmonshokuKbn !== null){
                        $('.schoolList').append(`
                            <li class="schoolList__item">
                                <a href="http://shingakunet.com/gakko/${this.dataList[i].gakkoCd}" class="schoolList__link" target="_blank">
                                    <span class="schoolList__name">${this.dataList[i].gakkoNm}</span>
                                    <span class="schoolList__info">専門職大学・専門職短期大学 / ${this.dataList[i].koshuCategoryMNm} / ${this.dataList[i].dispLocationNm}</span>
                                </a>
                            </li>
                        `)
                    // 「専門職大学」なしの場合
                    } else {
                        $('.schoolList').append(`
                            <li class="schoolList__item">
                                <a href="http://shingakunet.com/gakko/${this.dataList[i].gakkoCd}" class="schoolList__link" target="_blank">
                                    <span class="schoolList__name">${this.dataList[i].gakkoNm}</span>
                                    <span class="schoolList__info">${this.dataList[i].koshuCategoryMNm} / ${this.dataList[i].dispLocationNm}</span>
                                </a>
                            </li>
                        `)
                    }
                }
            }
        }

        deleteSchoolList() {
            $('.schoolList__item').remove();
            $('.schoolList').hide();
        }

        setInputKeyword() {
            const setKeyword = $(this).find('span').text();
            this.$seachSchool.val(setKeyword);
        }

        shapedDataListFlag() {
            this.dataListIsEmpty = !this.dataListIsEmpty;
        }

        sendLogFwSearch() {
            const s2 = s_gi(s_account);
            // クリックログ送信
            s2.tl(this, 'o', 'header_FW_search');
        }

        sendLogFwDone() {
            const s2 = s_gi(s_account);
            // クリックログ送信
            s2.tl(this, 'o', 'header_FW_done');
        }

        bindEvent(){
            this.$seachSchool.on('keyup',(e)=>{
                const searchKey = $(e.target).val();
                console.log(searchKey);
                this.getSchoolDataList();
                console.log(this.dataList);
                
                this.createSchoolList();
                if(!searchKey.length){
                    this.deleteSchoolList();
                    this.dataList = [];
                }
                this.shapedDataListFlag();
                this.sendLogFwSearch();
            });
            $(document).on('click','.schoolList__item', (e)=>{
                const searchWord = $(e.target).find('.schoolList__name').text();
                this.$seachSchool.val(searchWord);
                this.sendLogFwDone();
            });
        }
    }
    new SchoolSuggest();
