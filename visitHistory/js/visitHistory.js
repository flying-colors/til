(function () {
    "use strict";
    // モーダル
    const $modal = $('.modal'),
    $modalInner = $('.modal__inner');

    $('[data-modal="open"]').on('click',()=>{
        // 閲覧履歴が0件の場合は無効
        if(!$('[data-btn="delete"]').length) {
            return false;
        }
        $modal.fadeIn();
        // 親ビューのスクロールをロックする
		$('body').css({
			'position': 'fixed',
			'width': '100%',
			'height': '100%',
			'top': -1 * $(window).scrollTop(),
			'overflow': 'hidden'
        });
    });

    $modal.on('click',(e)=>{
        $(e.target).fadeOut();
        // 親ビューのスクロールロック解除
        $('body').removeAttr('style');
    });
    $modalInner.on('click',(e)=>{
        e.stopPropagation();
        return false;
    });

    // 閲覧履歴
    const data = visitSchoolData;
    const key = 'rireki';

    if(data.length){
        const rirekiData = localStorage.getItem(key) || '';
        let rirekiDataNew = [];

        if(rirekiData !== ''){
            rirekiDataNew = JSON.parse(rirekiData);
        }
        
        rirekiDataNew.push({
            gakkoCd: data[0].gakkoCd,
            gakkoNm: data[0].gakkoNm,
            gakubuGakkaNm: data[0].gakubuGakkaNm,
            address: data[0].address,
            closestStation: data[0].closestStation,
            gakuhi: data[0].gakuhi,
            expire: ''
        });
        
        localStorage.setItem(key, JSON.stringify(rirekiDataNew));

        for (let i = 0; i < rirekiDataNew.length; i++) {
            $('.visitHistory__list').append(`
            <li class="visitHistory__listItem">
                <span class="visitHistory__btnDelete" data-btn="delete"></span>
                <ul class="visitHistory__listItemDetail">
                    <li class="visitHistory__schoolData">
                        <img src="https://dummyimage.com/120x100/ccc/fff.png" alt="" class="visitHistory__schoolImage">
                    </li>
                    <li class="visitHistory__schoolData">
                        <span class="visitHistory__name">${rirekiDataNew[i].gakkoNm}</span>
                    </li>
                    <li class="visitHistory__schoolData">
                        <span class="visitHistory__name">${rirekiDataNew[i].gakubuGakkaNm}</span>
                    </li>
                    <li class="visitHistory__schoolData">${rirekiDataNew[i].address}</li>
                    <li class="visitHistory__schoolData">${rirekiDataNew[i].closestStation}</li>
                    <li class="visitHistory__schoolData">${rirekiDataNew[i].gakuhi}</li>
                    <li class="visitHistory__schoolData">
                        <a href="" class="visitHistory__btnAddCart">資料請求カート追加</a>
                    </li>
                </ul>
            </li>`
            );
        }
    }

    // 個社を削除
    const $delete = $('[data-btn="delete"]');
    $('[data-btn="delete"]').on('click', function(){
        $(this).closest('li').remove();
        if(!$delete.length) {
            $modalInner.hide();
            $modal.fadeOut();
        }
        // const index = $('[data-btn="delete"]').index(this);
        const $this = $(this);
        let index = $delete.index($this);
        console.log(index);
        
        const currentRireki = JSON.parse(localStorage.getItem(key));
        const modifyRereki = currentRireki.splice(index, 1);
        console.log(modifyRereki);
        
        localStorage.setItem(key, JSON.stringify(modifyRereki));
    });
})();
