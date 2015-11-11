
$(document).ready(function() {
	setTimeout(function(){
		$('body').addClass('loaded');
		$('.entry-header').remove();
	}, 1000);
});