var $ = require('jquery');

$(function () {

	init();
	function init() {
		if (!initCheckFlag && location.hash === '#history') {
			$('[data-listType="history"]').prop('checked', true);
		}else if (!initCheckFlag) {
			$('[data-listType="cart"]').prop('checked', true);
		}
		$('[data-type="selectSchoolCount"]').each(function() {
			$(this).text(getCheckCount());
		});

		if ($('[data-type="matometeFooterViewTrigger"]').length) {
			$(window).bind('scroll', function () {
				var $trigger = $('[data-type="matometeFooterViewTrigger"]');
				if (!$trigger.length) {
					return;
				}
				var scrollMax = $(document).height() - $(this).height();
				var scroll = $(this).scrollTop();
				var triggerY = $trigger.offset().top + $trigger[0].offsetHeight;
				if (scroll > triggerY && scroll < scrollMax) {
					$('[data-type="matometeFooterFix"]').slideDown('middle');
				} else {
					$('[data-type="matometeFooterFix"]').slideUp('middle');
				}
			});
		}

		if ('sessionStorage' in window && window.sessionStorage !== null) {
			var num = sessionStorage.getItem('matomete_list_count');

			var cnt = 0;
			$('[data-listType="cart"]').each(function () {
				cnt++;
			});

			if (num == null || num != cnt) {
				var s2 = s_gi(s_account);
				s2.linkTrackVars = 'eVar27';
				s2.eVar27 = cnt;
				s2.tl(true, 'o', 'まとめてカウント');
				try {
					sessionStorage.setItem('matomete_list_count', cnt);
				} catch (err) {

				}
			}
		}
		checkGanshoAri();
		setAddCartBtnState();
	};

	$('[data-action="deleteMatometeList"]').on('click', function () {
		var s2 = s_gi(s_account);
		s2.tl(this, 'o', 'Smatome_list_delete');

		setCheckData($(document.formtext));
		document.formtext.method = "post";
		document.formtext.action = "/smp2/cart/deleteIkkatsu/";
		document.formtext.submit();
		return false;
	})

	// チェックした学校をカートから削除する
	$(document).on('click', '[data-action="deleteMatometeListAll"]', function () {

		// クリックログ送信
		var s2 = s_gi(s_account);
		s2.tl(this, 'o', 'Smatome_list_delete');

		// チェックした学校のみ削除
		let checkCount = 0;
		const checkDeleteSchoolList = [];
		$('.js-schoolSelect').each((index,elm)=>{
			if($(elm).find('[data-type="school"]').prop('checked')){
				checkCount++;
				let checkDeleteSchoolCode = $(elm).find('[data-type="school"]').data('code').toString(),
				addObj = {
					name: "cartDeleteRootProductCd",
					value: checkDeleteSchoolCode
				}
				checkDeleteSchoolList.push(addObj);
			}
		});
		
		if(checkCount === 0){
			return false;
		}
		$.ajax({
			url: '/smp2/cart/list/deleteClip',
			type: 'POST',
			data: checkDeleteSchoolList,
			traditional: true
		})
		.done( () =>{
			$('.js-schoolSelect').each((index,elm)=>{
				if($(elm).find('[data-type="school"]').prop('checked')){
					$(elm).remove();
				}
			});
			checkGanshoAri();
			setSchoolSelectNum(10);
			// カート0件表示
			if(!$('.js-schoolSelect').length){
				$('.js-caution').remove();
				$(this).closest('.schoolCartList__delete').remove();
				$('.schoolCartList').before(`
					<div class="schoolCartList is-empty">
						<div class="schoolCartList__message">現在資料請求カートに学校はありません。<br>
						<span class="schoolCartList__messageSub">資料請求カートは、最大20校追加可能です。</span></div>
						<a href="/smp/" class="schoolCartList__btnLink" onclick="var s2=s_gi(s_account);s2.tl(this,'o','Smatome_search_top_0hit')">学校探しを続ける（進路トップへ）</a>
					</div>
				`)
				$('.messageArea').hide();
			}
			$('[data-type="selectSchoolCount"]').text(getCheckCountNew());
		})
		.fail( () => {
		})
	});

	$(document).bind('click', '[data-type="school"]', function () {
		$('[data-type="selectSchoolCount"]').each(function () {
			$(this).text(getCheckCount());
		})

		// 図書カードプレゼントまでの残り選択校数を表示
		setSchoolSelectNum(10);
	});

	// 「願書あり」が1校でもあれば注意文言表示
	function checkGanshoAri(){
		$('.schoolCartList__item').each(function() {			
			if ($(this).find('.schoolCartList__labelGansho').length) {
				$('.messageArea').show();
				return false;
			} else {
				$('.messageArea').hide();
			}
		});
	}

	// 資料請求カートが20件の時（チェックなしも含めて）はカート追加ボタンを無効化
	function setAddCartBtnState(){
		$('.js-schoolSelect').each(function() {
			const $addCartBtn = $('[data-cart="button"]');
			if ($('.js-schoolSelect').length >= 20) {
				$addCartBtn.addClass('is-disabled');
			} else {
				$addCartBtn.removeClass('is-disabled');
			}
		});
	}

	// 選択中の学校をカウント
	function getCheckCount() {
		var checkCount = 0;
		var hasPanph = true;
		var hasGansyo = true;

		$('[data-type="school"]').each(function () {
			if (this.checked) {
				if (this.getAttribute('data-hasPanph') === "false" && hasPanph) {
					hasPanph = false;
				} else if (this.getAttribute('data-hasGansyo') === "false" && hasGansyo) {
					hasGansyo = false;
				}
				checkCount++;
			}
		})
		if (hasPanph && checkCount) {
			$(".matometeButtonBox__panph").each(function () {
				$(this).removeClass("matometeButtonBox__panph--disabled");
			})
		} else {
			$(".matometeButtonBox__panph").each(function () {
				$(this).addClass("matometeButtonBox__panph--disabled");
			})
		}
		if (hasGansyo && checkCount) {
			$(".matometeButtonBox__gansyo").each(function () {
				$(this).removeClass("matometeButtonBox__gansyo--disabled");
			})
		} else {
			$(".matometeButtonBox__gansyo").each(function () {
				$(this).addClass("matometeButtonBox__gansyo--disabled");
			})
		}
		return checkCount;
	}

	// 選択中の学校をカウント（キャンペーン対象外校（有料）を除外）
	function getCheckCountNoPay() {
		var checkCount = 0;
		var hasPanph = true;
		var hasGansyo = true;

		$('[data-type="school"]').each(function () {
			const noCpnFlag = $(this).closest('label').find('span').hasClass('schoolCartList__labelNoCampaign');
			if (this.checked && !noCpnFlag) {
				if (this.getAttribute('data-hasPanph') === "false" && hasPanph) {
					hasPanph = false;
				} else if (this.getAttribute('data-hasGansyo') === "false" && hasGansyo) {
					hasGansyo = false;
				}
				checkCount++;
			}
		})
		if (hasPanph && checkCount) {
			$(".matometeButtonBox__panph").each(function () {
				$(this).removeClass("matometeButtonBox__panph--disabled");
			})
		} else {
			$(".matometeButtonBox__panph").each(function () {
				$(this).addClass("matometeButtonBox__panph--disabled");
			})
		}
		if (hasGansyo && checkCount) {
			$(".matometeButtonBox__gansyo").each(function () {
				$(this).removeClass("matometeButtonBox__gansyo--disabled");
			})
		} else {
			$(".matometeButtonBox__gansyo").each(function () {
				$(this).addClass("matometeButtonBox__gansyo--disabled");
			})
		}
		return checkCount;
	}

	function setCheckData($form) {
		$('[data-listType="cart"]').each(function(){
			if (this.checked){
				$form.append($('<input/>', { type:'hidden', name:'cartDeleteRootProductCd', value: this.getAttribute("data-code")}));
			}
		});
		$('[data-listType="history"]').each(function(){
			if (this.checked) {
				$form.append($('<input/>', { type:'hidden', name:'historyDeleteGakkoCd', value: this.value}));
			}
		});
	}

	// 図書カードプレゼントまでの残り選択校数を表示（キャンペーン対象外校は除外）
	const setSchoolSelectNum = (maxSchoolCountNum) => {
		let setSchoolSelectNum = maxSchoolCountNum - getCheckCountNoPay();
		if (setSchoolSelectNum < 0){
			setSchoolSelectNum = 0;
		}
		$('[data-type="selectSchoolRemain"]').text(setSchoolSelectNum);
	}

	// 資料請求ボタン制御
	const getCheckCountNew = ()=> {
        let checkCount = 0,
            hasPanph = true,
			hasGansyo = true;

		const $actionBtn = $(".actionGroupe__btnPanph");
        
        // カート内の学校を検索
		$('[data-type="school"]').each(function() {
			if (this.checked) {
                // 「パンフなし」あり
				if (this.getAttribute('data-hasPanph') === "false" && hasPanph) {
                    hasPanph = false;
                // 「願書なし」あり
				}else if (this.getAttribute('data-hasGansyo') === "false" && hasGansyo) {
					hasGansyo = false;
				}
				checkCount++;
			}
		})
		
		// カート内が0件の場合は資料請求ボタン非活性
		if(!checkCount){
			$actionBtn.addClass("matometeButtonBox__panph--disabled");
        } else if(hasPanph){
			// パンフ・願書の両方請求
			if(hasGansyo){				
				setActionBtnBoth();
			// パンフのみ請求
			}else{
				setActionBtnPamph();
			}
		} else if(!hasPanph){
			// 願書のみ請求
			if(hasGansyo){
				setActionBtnGansho();
			// 請求不可
			} else {
				$actionBtn.addClass("matometeButtonBox__panph--disabled");
			}
		}
		return checkCount;
	}

	// アクションボタンを追加
	const actionBtnDefault = ()=> {
		$('body').append($(`
			<div class="actionGroupe">
				<a href="/rnet/s/campaign/shiryou/index_s.html" class="actionGroupe__link" onclick="var s2=s_gi(s_account);s2.tl(this,'o','Smatome_cpns')">
					あと<span class="actionGroupe__schoolCountRemain" data-type="selectSchoolRemain"></span>校追加で図書カード<span class="">500円分</span>プレゼント!!
				</a>
				<div class="actionGroupe__body">
					<div class="actionGroupe__selectSchoolCount">
						<span class="actionGroupe__selectSchoolCountNum" data-type="selectSchoolCount"></span>あ校選択中
					</div>
				</div>
			</div>`
		));
		// フッターロゴ表示用
		$('body').css('padding-bottom','60px');
	}
	
	// 資料ボタン生成（モーダル表示）
	const setActionBtnBoth = ()=> {
		$('.actionGroupe__btnPanph').remove();
		$('.actionGroupe__body').append($('<a>', {
			href:'javascript:void(0)',
			text:'資料をまとめて請求する',
			class:'actionGroupe__btnPanph matometeButtonBox__panph',
			onclick:"var s2=s_gi(s_account);s2.tl(this,'o','Smatome_action_shiryo')"
		}));
		$('.actionGroupe__btnPanph').attr('data-open-shiryoselect-modal','trigger');
	}

	// 資料ボタン生成（パンフ請求画面へ遷移）
	const setActionBtnPamph = ()=> {
		$('.actionGroupe__btnPanph').remove();
		$('.actionGroupe__body').append($('<a>', {
			href:'#',
			text:'資料をまとめて請求する',
			class:'actionGroupe__btnPanph matometeButtonBox__panph',
			onclick:'set( "/smp2/shiryoSeikyu/list/recommend","01","pamph", "Smatome_action_panf");return false;',
		}));
	}

	// 資料ボタン生成（願書請求画面へ遷移）
	const setActionBtnGansho = ()=> {
		$('.actionGroupe__btnPanph').remove();
		$('.actionGroupe__body').append($('<a>', {
			href:'#',
			text:'資料をまとめて請求する',
			class:'actionGroupe__btnPanph matometeButtonBox__gansyo',
			onclick:'set( "/smp2/shiryoSeikyu/list/recommend","02","gansho", "Smatome_action_gansho");return false;',
		}));
	}

	// ***QA no40*** 
	// カート追加API処理中か判定フラグ
	let isAddClipProcessing = false;

	// 「資料請求カート」ボタン押下時の処理（カートへ追加）
	$('.js-addSchool').on('click', (e)=> {
		e.preventDefault();

		// ***QA no40*** 
		// 最近チェックした学校・レコメンドからの資料請求カート追加時、
		// 既にまとめてリストに追加済みの学校の場合は何もしないようにする。

		// カート追加API処理中の場合は何もしない
		if(isAddClipProcessing === true) {
			return false;
		}

		// これからまとめてリストに追加しようとしているproductCode取得
		const addCode = $(e.currentTarget).data('rootproductcd');
		// まとめてリストのproductCode取得
		let selectedCode = [];
		$('.js-schoolSelect').each((i, element) => {
			selectedCode.push($(element).find('.js-changeSelect').data('code'));
		});
		// これから追加しようとしているproductCodeが既にまとめてリストに存在している場合は何もしない
		if(selectedCode.indexOf(addCode) >= 0) {
			return false;
		}

		// カート追加API処理中フラグをON
		isAddClipProcessing = true;

		$.ajax({
			url: '/smp2/cart/list/addClip',
			type: 'POST',
			dataType: 'json',
			data:{
				rootProductCd: $(e.target).data('rootproductcd')
			}
		}).done((data) =>{
			// 注意文言（吹き出し）を表示（追加機能は無効）
			let countCart = 0;
			$('.js-schoolSelect').each(()=> {
				countCart++;
			});

			// カートが20件の時（画面・DB）は操作不可
			if (countCart >= 20 || data.cartAddOverFlag === '1') {
				alertCartFull(e);
				// ***QA no40*** 
				// カート追加API処理中フラグをOFF
				isAddClipProcessing = false;
				return false;
			} else {

			// カート0件時の内容を削除
			$(e.target).parent('div').addClass('is-added');
			$('.is-empty').remove();

			// カートが0件の場合は注意文言を表示
			if(!$('.js-schoolSelect').length){
				$('.pageListTitle').after(`
				<div class="caution js-caution">
					<span class="caution__text">カートに追加できるのは最大20件です</span>
				</div>
				`);
			}

			// 「チェックした学校をカートから削除する」を表示
			if(!$('.schoolCartList__delete').length){
				$('[name="history"]').after(`
					<div class="schoolCartList__delete">
						<a href="#" data-action="deleteMatometeListAll">チェックした学校をカートから削除する</a>
					</div>`);
			}

			const 
				freePamphAriFlag = data.freePamphAriFlag,
				freeGanshoAriFlag = data.freeGanshoAriFlag,
				gakkoCd = data.gakkoCd,
				gakkoNm = data.gakkoNm,
				gakkoPhoto = data.gakkoPhoto,
				koshuNm = data.koshuNm,
				rootProductCd = data.rootProductCd,
				pamphFlag = data.pamphFlag,
				ganshoFlag = data.ganshoFlag,
				todofukenRnm = data.todofukenRnm;

				// パンフなし＆願書なし（「チェックボックス」なし＆「キャンペーン対象外」表示なし＆「願書あり」表示なし）
				if(pamphFlag === "0" && ganshoFlag === "0"){
					$('.schoolCartList').append(`
						<li class="schoolCartList__school js-schoolSelect is-selected">
						<label class="schoolCartList__item">
							<div class="schoolCartList__checkbox"></div>
							<div class="schoolCartList__schoolInfo">
							<span class="schoolCartList__schoolName">
								<a href="/smp/gakko/top/${gakkoCd}" target="_blank">${gakkoNm}</a>
							</span>
							<div class="schoolCartList__schoolKind">${koshuNm}／${todofukenRnm}</div>
							</div>
							<div class="schoolCartList__schoolPhoto">
							<a href="/smp/gakko/top/${gakkoCd}" target="_blank">
								<img src="/school/${rootProductCd}/images/${gakkoPhoto}" height="49" alt="" width="71">
							</a>
							</div>
						</label>
						</li>`);
					} else {
						//「キャンペーン対象外」表示なし＆「願書あり」表示あり
						if((freePamphAriFlag || freeGanshoAriFlag ) && ganshoFlag === "1"){
							$('.schoolCartList').append(`
								<li class="schoolCartList__school js-schoolSelect is-selected">
									<label class="schoolCartList__item">
									<div class="schoolCartList__checkbox">
										<input type="checkbox" name="gakkoCd" value="${gakkoCd}" data-hasgansyo="false" data-haspanph="true"
										data-type="school" class="schoolCartList__inputCheckbox js-changeSelect" data-listtype="cart" data-code="${rootProductCd}" checked>
										<span class="schoolCartList__checkboxIcon"></span>
									</div>
									<div class="schoolCartList__schoolInfo">
										<span class="schoolCartList__schoolName">
										<a href="/smp/gakko/top/${gakkoCd}" target="_blank">${gakkoNm}</a>
										</span>
										<div class="schoolCartList__schoolKind">${koshuNm}／${todofukenRnm}</div>
										<span class="schoolCartList__labelGansho">願書あり</span>
									</div>
									<div class="schoolCartList__schoolPhoto">
										<a href="/smp/gakko/top/${gakkoCd}" target="_blank">
										<img src="/school/${rootProductCd}/images/${gakkoPhoto}" height="49" alt="" width="71">
										</a>
									</div>
									</label>
								</li>`);
							}
						//「キャンペーン対象外」表示なし＆「願書あり」表示なし
						if((freePamphAriFlag || freeGanshoAriFlag ) && ganshoFlag === "0"){
							$('.schoolCartList').append(`
							<li class="schoolCartList__school js-schoolSelect is-selected">
								<label class="schoolCartList__item">
								<div class="schoolCartList__checkbox">
									<input type="checkbox" name="gakkoCd" value="${gakkoCd}" data-hasgansyo="false" data-haspanph="true"
									data-type="school" class="schoolCartList__inputCheckbox js-changeSelect" data-listtype="cart" data-code="${rootProductCd}" checked>
									<span class="schoolCartList__checkboxIcon"></span>
								</div>
								<div class="schoolCartList__schoolInfo">
									<span class="schoolCartList__schoolName">
									<a href="/smp/gakko/top/${gakkoCd}" target="_blank">${gakkoNm}</a>
									</span>
									<div class="schoolCartList__schoolKind">${koshuNm}／${todofukenRnm}</div>
								</div>
								<div class="schoolCartList__schoolPhoto">
									<a href="/smp/gakko/top/${gakkoCd}" target="_blank">
									<img src="/school/${rootProductCd}/images/${gakkoPhoto}" height="49" alt="" width="71">
									</a>
								</div>
								</label>
							</li>`);
						}
						//「キャンペーン対象外」表示あり＆「願書あり」表示なし
						if((!freePamphAriFlag && !freeGanshoAriFlag ) && ganshoFlag === "0"){
							$('.schoolCartList').append(`
							<li class="schoolCartList__school js-schoolSelect is-selected">
								<label class="schoolCartList__item">
								<div class="schoolCartList__checkbox">
									<input type="checkbox" name="gakkoCd" value="${gakkoCd}" data-hasgansyo="false" data-haspanph="true"
									data-type="school" class="schoolCartList__inputCheckbox js-changeSelect" data-listtype="cart" data-code="${rootProductCd}" checked>
									<span class="schoolCartList__checkboxIcon"></span>
								</div>
								<div class="schoolCartList__schoolInfo">
									<span class="schoolCartList__schoolName">
									<a href="/smp/gakko/top/${gakkoCd}" target="_blank">${gakkoNm}</a>
									</span>
									<div class="schoolCartList__schoolKind">${koshuNm}／${todofukenRnm}</div>
									<span class="schoolCartList__labelNoCampaign">キャンペーン対象外</span>
								</div>
								<div class="schoolCartList__schoolPhoto">
									<a href="/smp/gakko/top/${gakkoCd}" target="_blank">
									<img src="/school/${rootProductCd}/images/${gakkoPhoto}" height="49" alt="" width="71">
									</a>
								</div>
								</label>
							</li>`);
						}
						//「キャンペーン対象外」表示あり＆「願書あり」表示あり
						if((!freePamphAriFlag && !freeGanshoAriFlag ) && ganshoFlag === "1"){
							$('.schoolCartList').append(`
							<li class="schoolCartList__school js-schoolSelect is-selected">
								<label class="schoolCartList__item">
								<div class="schoolCartList__checkbox">
									<input type="checkbox" name="gakkoCd" value="${gakkoCd}" data-hasgansyo="false" data-haspanph="true"
									data-type="school" class="schoolCartList__inputCheckbox js-changeSelect" data-listtype="cart" data-code="${rootProductCd}" checked>
									<span class="schoolCartList__checkboxIcon"></span>
								</div>
								<div class="schoolCartList__schoolInfo">
									<span class="schoolCartList__schoolName">
									<a href="/smp/gakko/top/${gakkoCd}" target="_blank">${gakkoNm}</a>
									</span>
									<div class="schoolCartList__schoolKind">${koshuNm}／${todofukenRnm}</div>
									<span class="schoolCartList__labelGansho">願書あり</span>
									<span class="schoolCartList__labelNoCampaign">キャンペーン対象外</span>
								</div>
								<div class="schoolCartList__schoolPhoto">
									<a href="/smp/gakko/top/${gakkoCd}" target="_blank">
									<img src="/school/${rootProductCd}/images/${gakkoPhoto}" height="49" alt="" width="71">
									</a>
								</div>
								</label>
							</li>`);
						}
					}
				}
				// 選択された学校数をカウント
				getCheckCountNew();
				$('[data-type="selectSchoolCount"]').text(getCheckCountNew());

				// キャンペーンのカウント
				setSchoolSelectNum(10);

				// ボタンを「追加済み」に変更
				setAddCartBtnState();

				// ***QA no40*** 
				// カート追加API処理中フラグをOFF
				isAddClipProcessing = false;
			}).fail(() => {
				// ***QA no40*** 
				// エラーが返ってきた際、カート追加API処理中フラグをOFF
				isAddClipProcessing = false;
			});
		// カートが0件の場合はアクションボタンを生成
		if(!$('.actionGroupe').length){
			actionBtnDefault();
			$('[data-type="selectSchoolCount"]').text(getCheckCountNew());
			setSchoolSelectNum(10);
		}
	});

	getCheckCountNew();
	
	// カートが20件の場合は注意文言（吹き出し）を表示
	const alertCartFull = (e)=>{
		$(e.target).closest('.schoolListCarousel__listItem').find('.js-balloon').fadeIn();
		setTimeout(()=>{
			$('.js-balloon').fadeOut();
		}, 2000);
	}

	// リストから学校を削除
	$('.js-deleteSchool').on('click', (e)=> {
		e.preventDefault();
		$.ajax({
			url: '/smp2/cart/list/deleteClip'
		})
		$('.js-schoolSelect').remove();
	});

	// 図書カードプレゼントまでの残り選択校数を表示
	setSchoolSelectNum(10);

	// 学校リストの背景色トグル
	$('.js-changeSelect').each((index,checkbox) =>{
		if($(checkbox).prop('checked')){
			$(checkbox).closest('li').addClass('is-selected');
		}
	})

	$(document).on('change', '.js-changeSelect', function() {
		getCheckCountNew();
		$(this).closest('li').toggleClass('is-selected');
		var s2 = s_gi(s_account);
		if ($(this).prop('checked')) {
			s2.tl(this, 'o', 'Smatome_check');
		} else {
			s2.tl(this, 'o', 'Smatome_uncheck');
		}
		$('[data-type="selectSchoolCount"]').text(getCheckCountNew());
	});

	// 資料請求選択ボタン用モーダル
	class Modal {
		constructor() {
			this.init();
		}
		init() {
			this.$modal = $('.modalShiryoSelect');
			this.$modalInner = $('.modalShiryoSelect__inner');
			this.$modalTrigger = $('[data-open-shiryoselect-modal=trigger]');
			this.$modalCloseBtn = $('[data-close-shiryoselect-modal=btn]');
			this.bindEvents();
		}
		openModal() {
			this.$modal.fadeIn();
			$('html, body').css('overflow', 'hidden');
		}
		closeModal() {
			this.$modal.fadeOut();
			$('html, body').css('overflow', '');
		}
		uncloseModal() {
			return false;
		}
		// イベントをバインド
		bindEvents() {
			// モーダルを開く
			$(document).on('click', '[data-open-shiryoselect-modal=trigger]', (e) => {
				// ***QA no39*** 
				// ボタンが非活性状態の場合は何もしない
				if($(e.currentTarget).hasClass('matometeButtonBox__panph--disabled')) {
					return false;
				}
				e.preventDefault();
				this.openModal();
			});
			// モーダルを閉じる
			this.$modalCloseBtn.on('click', (e) => {
				e.preventDefault();
				this.closeModal();
			});
			// モーダルの外側をクリックしたら閉じる
			this.$modal.on('click', () => {
				this.closeModal();
			});
			// モーダルの内側をクリックしても何もしない
			this.$modalInner.on('click', (e) => {
				e.stopPropagation();
				this.uncloseModal();
			});
		}
	}
	new Modal();

	// キャンペーン情報を表示
	$(() => {
		// キャンペーンに関する設定が存在しない場合は何もしない
		if (window.recommendCampaignParam == null) {
			return;
		}
		// キャンペーンに関する設定JSONファイルを取得
		const getCampaignJson = () => {
			let deferred = new $.Deferred;
			$.ajax({
				url: window.recommendCampaignParam.url,
				method: 'GET',
				dataType: 'json'
			})
			.done(data => {
				deferred.resolve(data);
			})
			.fail(() => {
				deferred.reject();
			});
			return deferred.promise();
		};

		// キャンペーン情報のJSONを取得
		getCampaignJson()
		.done(data => {
			if(!data.campaign){
				$('.actionGroupe__link').remove();
			} else {
				$('[data-reward="reward"]').text(data.reward);
				$('[data-reward="amount"]').text(data.rewardAmount);
				$('[data-reward="text"]').show();
			}
		})
	});
});
