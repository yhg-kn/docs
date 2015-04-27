(function(d) {
	function l() {
		(function($) {
			if ($('.chkWrap')[0]) {
				$('.chkWrap,#chkWrap-js,#easychkjs,#chkGA-js').remove();
			} else {
				var siteDomain = location.hostname;
				var htmlData = $('html').html();

				// リンク先がテスト環境に向いてないかチェック
				// テストサイトなどはパラメータにはいっている場合もあるので除外設定
				$('a[href]:not([href*="?"])').each(function(){
					console.log($(this).html() + ':' + siteDomain + $(this).attr('href'));
					if($(this).attr('href').indexOf('kannart.jp') != -1){
						alert('リンク先にkannart.jpがまぎれてます');
						return false;
					}else if($(this).attr('href').indexOf('chuo-ad.jp') != -1){
						alert('リンク先にchuo-ad.jpがまぎれてます');
						return false;
					}else if($(this).attr('href').indexOf('stg') != -1){
						alert('リンク先にstgがまぎれてます');
						return false;
					}
				});

				//  画像パスがテスト環境に向いていないかチェック
				$('body img:not([src*="?"])').each(function(){
					if($(this).attr('src').indexOf('kannart.jp') != -1){
						alert('画像パスにkannart.jpがまぎれてます');
						//return false;
					}else if($(this).attr('src').indexOf('chuo-ad.jp') != -1){
						alert('画像パスにchuo-ad.jpがまぎれてます');
						return false;
					}else if($(this).attr('src').indexOf('stg') != -1){
						alert('画像パスにstgがまぎれてます');
						return false;
					}
				});

				// if (htmlData.indexOf('  ') != -1) {
				// 	alert('半角スペースが2連続になってるよ！');
				// }

				// sub環境でサイトカタリストチェック
				if(siteDomain.match(/^sub./)){
					var subCheck = 'SUBのURL -> ' + (htmlData.match(/:\/\/sub/)?'発見':'無し');
					var sTopCheck = 'sc_toptag -> ' +(htmlData.match(/\/s_code.js/)?'発見':'無し');
					var sBtmCheck = 'sc_bottomtag -> ' +(htmlData.match(/\(s_code\)/)?'発見':'無し');
					alert(subCheck + '\n' + sTopCheck + '\n' + sBtmCheck);
				}

				var winW = $(window).width();
				var debugWrap = '<div class="chkWrap"><table></table></div>';
				$('body').append(debugWrap);

				// META情報取得
				$('.chkWrap table').append('<tr><th colspan="2">META情報一覧</th></tr>');
				var meta = {
					'タイトル':document.title,
					'キーワード':$('meta[name=keywords]').attr('content'),
					'ディスクリプション':$('meta[name=description]').attr('content'),
					'文字コード':$('meta[http-equiv=Content-Type]').attr('content')||$('meta').attr('charset')
				};
				for(var metaData in meta){
					metaData = '<tr><td class="chkWrap-leftCol">' + metaData + '</td><td class="chkWrap-rightCol">' + meta[metaData] + '</td></tr>';
					$('.chkWrap table').append(metaData);
				}

				// OGP情報取得
				if (htmlData.indexOf('<meta property') != -1) {
					$('.chkWrap table').append('<tr><th colspan="2">OGP情報一覧</th></tr>');
					var metaOG = {
						'OGサイト名':$('meta[property="og:site_name"]').attr('content'),
						'OGタイトル':$('meta[property="og:title"]').attr('content'),
						'OGディスクリプション':$('meta[property="og:description"]').attr('content'),
						'OG画像':$('meta[property="og:image"]').attr('content')+'<br><img src="'+ $('meta[property="og:image"]').attr('content') +'" width="100">',
						'OGURL':$('meta[property="og:url"]').attr('content'),
						'OGタイプ':$('meta[property="og:type"]').attr('content')
					};
					for(var metaOGData in metaOG){
						metaOGData = '<tr><td class="chkWrap-leftCol">' + metaOGData + '</td><td class="chkWrap-rightCol">' + metaOG[metaOGData] + '</td></tr>';
						$('.chkWrap table').append(metaOGData);
					}
				}

				// 画像情報取得
				$('.chkWrap table').append('<tr><th colspan="2">画像情報一覧</th></tr>');
				$('img').each(function() {
					var imgData = {
						w: $(this).attr('width'),
						h: $(this).attr('height'),
						nw: $(this).get(0).naturalWidth,
						nh: $(this).get(0).naturalHeight,
						a: $(this).attr('alt'),
						p: $(this).attr('src')
					};
					var imgSrc = '<img src="' + imgData.p + '">';
					var imgSize = '<li>' + imgData.w + ' × ' + imgData.h + '</li>';
					imgData.p = '<li>' + imgData.p + '</li>';

					// altが空もしくは無しの場合
					if(imgData.a === ""){
						imgData.a = '<li style="color:#3366cc">altタグは空です</li>';
					}else if(imgData.a === undefined){
						imgData.a = '<li style="color:#ff96ac">altタグがありません</li>';
					}else{
						imgData.a = '<li>' + imgData.a + '</li>';
					}

					// 画像サイズがオリジナルと違う場合
					if ((imgData.w != imgData.nw) || (imgData.h != imgData.nh)) {
						imgNaturalSize = '<li class="bold-red">' + imgData.nw + ' × ' + imgData.nh + '（オリジナルサイズ）</li>';
					} else {
						imgNaturalSize = '<li>' + imgData.nw + ' × ' + imgData.nh + '（オリジナルサイズ）</li>';
					}

					// 画像情報を代入
					var leftCol = '<td class="chkWrap-leftCol"><div class="chkWrap-leftCol-div">' + imgSrc + '</div></td>';
					var rightCol = '<td class="chkWrap-rightCol"><ul>' + imgData.a + imgSize + imgNaturalSize + imgData.p + '</ul></td>';

					// 画像サイズの縦横どちらかが1pxを含んでいる場合は出力しない
					if (!(imgData.nw == 1 || imgData.nh == 1)) {
						$('.chkWrap table').append('<tr>' + leftCol + rightCol + '</tr>');
					}

				});

				// ダミーリンクチェック
				if($('a').attr('href') == '#'){
					$('.chkWrap table').append('<tr class="dummylinknav"><th colspan="2">ダミーリンクチェック</th></tr>');
					var navBtn = '<p class="chkWrap-btn chkWrap-nav"><span>ダミーリンクチェックへ</span></p>';
					$('.chkWrap').append(navBtn);
				}
				$('a[href]').each(function(){
					var dummyAnc = $(this).attr('href');
					var ancTxt = $(this).html();
					var dummyAncWrap = '<tr><td class="chkWrap-leftCol bold-red">' + ancTxt + '</td><td class="chkWrap-rightCol bold-red">' + dummyAnc + '</td></tr>';
					if(dummyAnc == '#'){
						$('.chkWrap table').append(dummyAncWrap);
					}
				});

				// ダミーリンクチェックエリアへスクロール
				$('.chkWrap-nav').click(function(){
					var position = $('.dummylinknav').offset().top;
					$('body,html').animate({scrollTop:position}, 400, 'swing');
				});

				// プリントボタンの設置
				var prtbtn = '<p class="chkWrap-btn chkWrap-print"><span>印刷する</span></p>';
				$('.chkWrap').append(prtbtn);
				$('.chkWrap-print').click(function(){
					ga('send', 'event', 'print', 'click', siteDomain);
					print();
				});

				// メール送信ボタンの設置
				var pageTtl = document.title;
				var currentURL = location.href;
				var returnTag = '■■■■';
				var mailbtn = '<p class="chkWrap-btn chkWrap-mail"><a href="mailto:?subject=チェックのお願い&amp;body=' + pageTtl + returnTag + currentURL +'">送信する</a></p>';
				$('.chkWrap').append(mailbtn);
				$('.chkWrap-mail').click(function(){
					ga('send', 'event', 'mail', 'click', siteDomain);
				});

				//整形用CSS
				$('.chkWrap').css({
					position: 'absolute',
					top: 0,
					left: 0,
					width: winW,
					background: '#fafafa',
					fontFamily: '"メイリオ"',
					zIndex: 1000000
				});
				$('.chkWrap .bold-red').css({
					fontWeight: 'bold',
					color: '#f00'
				});
				$('.chkWrap li').css({
					listStyle: 'none'
				});
				$('.chkWrap table').css({
					width: '100%',
					borderCollapse: 'collapse'
				});
				$('.chkWrap table tr').css({
					overflow: 'auto'
				});
				$('.chkWrap table tr:odd').css({
					background: '#eaeaea'
				});
				$('.chkWrap table th').css({
					padding: '5px',
					borderTop: '5px solid #cccccc',
					background: '#f2dede',
					textAlign: 'center',
					verticalAlign: 'middle',
					fontFamily: '"メイリオ"',
					fontSize: '16px'
				});
				$('.chkWrap table td').css({
					width: winW / 2 + 'px',
					padding: '5px',
					textAlign: 'left',
					verticalAlign: 'middle',
					fontFamily: '"メイリオ"',
					fontSize: '14px'
				});
				$('.chkWrap-leftCol').css({
					textAlign: 'right'
				});
				$('.chkWrap-leftCol-div').css({
					width: winW / 2 + 'px',
					overflow: 'auto'
				});
				$('.chkWrap-leftCol-div img').css({
					display: 'inline',
					width: 'auto',
					height: 'auto'
				});
				$('.chkWrap-btn').css({
					position: 'fixed',
					left: '50px',
					borderRadius: '3px',
					color: '#ffffff',
					opacity: '0.6',
					cursor: 'pointer'
				});
				$('.chkWrap-print').css({
					top: '20px',
					background: '#3366CC',
				});
				$('.chkWrap-mail').css({
					top: '70px',
					background: '#3366CC',
				});
				$('.chkWrap-nav').css({
					top: '120px',
					background: '#3366CC',
				});
				$('.chkWrap-btn a,.chkWrap-btn span').css({
					display: 'block',
					padding: '10px',
					color: '#ffffff',
					textDecoration: 'none'
				});

				// 印刷用のCSS
				var printCSS = '<style rel="stylesheet" media="print">.chkWrap table{width:1040px !important;}.chkWrap td,.chkWrap td>div{width:540px !important;}.chkWrap-btn{display:none;}</style>';
				$('.chkWrap').append(printCSS);

				var gas = d.createElement('script');
				gas.type = 'text/javascript';
				gas.src = 'https://kannart.jp/tool/eazyCheck/ga.js';
				gas.id = 'chkGA-js';
				$('body').append(gas);

			}
			window.scrollTo(0, 0);
		})(jQuery);
	}
	if (typeof jQuery == 'undefined') {
		var j = d.createElement('script');
		j.type = 'text/javascript';
		j.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js';
		j.id = 'chkWrap-js';
		d.body.appendChild(j);
		j.onload = l;
	} else {
		l();
	}
})(document);

