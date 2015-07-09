/**
 * Created by wungcq on 15/7/8.
 */
(function (scope) {
	scope.ALERT = function (title, content,callback) {
		var d = new Date().getTime();
		var select = '#g-alert-' + d;
		var str = [ '<div class="g-alert init" id="g-alert-', d, '">',
			'<div class="alert-title">', title, '</div>',
			'<div class="alert-content">', content, '</div>',
			'</div>' ].join("");

		var hide = function () {
			$(select).addClass("finish");
			var t = setTimeout(function () {
				$(select).unbind("click");
				$(select).remove();
				clearTimeout(t);
				callback&&callback();
			}, 800);
		};

		$("body").append(str);
		var ss = setTimeout(function(){
			$(select).removeClass("init");
			clearTimeout(ss);
		},300);

		var s = setTimeout(function () {
			hide();

			clearTimeout(s);
		}, 5000);
		$(select).on("click", function () {
			hide();
		});
	}
})(window);