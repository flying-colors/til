$(function () {
    // カウントダウン文言
    class Popup {
        constructor() {
            this.countRemainNum = $('.js-countDown').data('remain-num');
            this.allShiryoCdList = []; // 全資料コードリスト
            this.init();
        }
        // 初期化
        init() {
            this.setPopup();
            this.pushAddedShiryoCd();
            this.pushInputShiryoCd();
            this.calcRemainNum();
            this.updateRemainNum();
            this.bindEvent();
        }
        // カウントダウン文言を表示
        setPopup(){
            if($('.output').length){
                $('.popup').show().insertAfter('.output:last');
            }
        };
        // 前画面で入力済みの資料コードをリストに追加
        pushAddedShiryoCd() {
            const addedShiryoCd = $('[name="addedShiryoCd"]').val();
            const arrAddedShiryoCd = addedShiryoCd !== ""  ? addedShiryoCd.split(',')  : '';
            if(addedShiryoCd !== ''){
                arrAddedShiryoCd.forEach((value)=>{
                    this.allShiryoCdList.push(value);
                });
            }
        }
        // 入力した資料コードをリストに追加
        pushInputShiryoCd() {
            $('[data-shiryocd]').each((index,elm)=>{
                const shiryoCd = $(elm).data('shiryocd').toString();
                // 有料校を除外
                if($(elm).data('yuryoflag') === 0){
                    this.allShiryoCdList.push(shiryoCd);
                }
            });
        }
        // プレゼントに必要な応募校数を計算
        calcRemainNum() {
            // 全資料コードリストの重複を削除
            const setShiryoCd = new Set(this.allShiryoCdList);
            this.countRemainNum -= setShiryoCd.size;
        }
        // プレゼントに必要な応募校数を表示
        updateRemainNum() {
            if(this.countRemainNum > 0){
                $('.js-countDown').text(this.countRemainNum);
            } else {
                $('.js-countDown').text('0');
                $('.popup').addClass('is-full');
                return false;
            }
        };
        // イベントをバインド
        bindEvent(){
            $('.js-addSchool').on('click',()=>{
                if($('.input').val() === ''){
                    return false;
                }
            });
        }
    }
    new Popup();
});
