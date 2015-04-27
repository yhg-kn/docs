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

