$(function () {
    "use strict";
    // 学校名サジェスト
    class SchoolSuggest {
        constructor() {
            this.dataList = [];
            this.schoolData = {};
            this.shapedDataList = [];
            this.shapedDataIsEmpty = true;
            this.init();
        }
        init(){
            this.$seachSchool = $('[name="keyword"]');
            this.getSchoolDataList();
            this.bindEvent();
        }

        // 全件データを取得
        getSchoolDataList(){
            $.ajax({
                url: './js/data.json'
            }).then((data)=>{
                this.dataList = data.data;
            })
        }

        getShapedDataList(searchKey){
            // 検索欄が空白の時はnull
			if (searchKey === '') {
                searchKey = null;
            }
            if (this.shapedDataIsEmpty) {
                for (let i = 0; i < this.dataList.length; i++) {
                    const gakkoHiraganaNm = this.dataList[i].gakkoHiraganaNm,
                    gakkoNm = this.dataList[i].gakkoNm;
                    
                    if (gakkoHiraganaNm.indexOf(searchKey) === 0 || gakkoNm.indexOf(searchKey) === 0 ) {
                        this.schoolData = {
                            dispLocationNm: this.dataList[i].dispLocationNm,
                            gakkoCd: this.dataList[i].gakkoCd,
                            gakkoNm: this.dataList[i].gakkoNm,
                            gakkoHiraganaNm: this.dataList[i].gakkoHiraganaNm,
                            koshuCategoryMNm: this.dataList[i].koshuCategoryMNm
                        }
                        this.shapedDataList.push(this.schoolData);
                    }
                }
            }
        }
        
        createSchoolList() {
            if(this.shapedDataIsEmpty){
                $('.schoolList').show();
                for (let i = 0; i < this.shapedDataList.length; i++) {
                    $('.schoolList').append(`
                        <li class="schoolList__item">
                            <a href="http://shingakunet.com/gakko/${this.shapedDataList[i].gakkoCd}" class="schoolList__link" target="_blank">
                                <span class="schoolList__name">${this.shapedDataList[i].gakkoNm}</span>
                                <span class="schoolList__info">${this.shapedDataList[i].koshuCategoryMNm} / ${this.shapedDataList[i].dispLocationNm}</span>
                            </a>
                        </li>
                    `)
                }
            }
        }

        deleteSchoolList() {
            $('.schoolList__item').remove();
            $('.schoolList').hide();
        }

        setInputKeyword() {
            const setKeyword = $(this).find('span').text();
            console.log(setKeyword);
            this.$seachSchool.val(setKeyword);
        }

        shapedDataListFlag() {
            if(!this.shapedDataList.length){
                this.shapedDataIsEmpty = true;
            } else {
                this.shapedDataIsEmpty = false;
            }
        }

        bindEvent(){
            this.$seachSchool.on('keyup',(e)=>{
                const searchKey = $(e.target).val();
                this.getShapedDataList(searchKey);
                this.createSchoolList();
                if(!searchKey.length){
                    this.deleteSchoolList();
                    this.shapedDataList = [];
                }
                this.shapedDataListFlag();
            });

            $(document).on('click','.schoolList__link', ()=>{
                this.$seachSchool.val($(e.target).find('.schoolList__name').text().trim());
                this.setInputKeyword();
            });            
        }
    }
    new SchoolSuggest();
});
