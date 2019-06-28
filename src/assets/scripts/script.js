/* Dont Remove These two lines */	 
 var height = $('.main-body').height();
    $('.left-nav').height(height + 120);
	/* Dont Remove This Ends*/

/* Below Codes can be used or removed as per requirement*/
/* Search Box */
$('.search-icon').click(function(e) {
    $('.search-box').show();
	
});


$('.head-user-info .acc-info').click(function(e) {
    $('.header-dropdown-menu').show();
	
});

$(document).mouseup(function(e) { var container = $(".header-dropdown-menu"); 
if (!container.is(e.target) && container.has(e.target).length === 0) { container.hide(); } });

/* Table Header Highlight */

$('.dash-tableHead-btns ul li').click(function(e) {
	 $(this).addClass('highlight').siblings().removeClass('highlight');
	
 
});
/* View More */
$('.view-more-wrap').click(function(e) {
    $('.progres-table-info').css('overflow-y','auto');
	$('.view-more-wrap').hide();
	
});

	/* Audience Segment Highlight */

$('.seg-iconInfo-row ul li').click(function(e) {
	 $(this).toggleClass('active');
	
 
});
$('.seg-icon-col .seg-icon').click(function(e) {
	$(this).addClass('active').siblings().removeClass('active');
	
	
 
});

/*Campaign Icons  Tab*/
	$('.camp-info-tabs ul li').click(function(e) {
		$('.camp-info-tabs ul li').removeClass('active');
    $(this).toggleClass('active');
	
	
});
/*Campaign-1 selection*/
$('.camp-2 ul.cta-btns li').click(function(e) {
		
    $(this).addClass('active').siblings().removeClass('active');
	
	
});
/*Campaign-2b Icons  Tab*/
$('.camp2-box-wrap .camp2-box').click(function(e) {
		
    $(this).toggleClass('active');
	
	
});

/* Funnel */
$('.edit-del-icon .edit-icon').click(function(e) {
		
    $(this).closest('.funnel-rhs-box').find('.saved-funel-name input').prop('disabled', false); 
	$(this).closest('.funnel-rhs-box').find('.saved-funel-name input').focus();
	
	
});

$('.edit-del-icon .delete-icon').click(function(e) {
		
    $(this).closest('.funnel-rhs-box').hide(1000);
	
	
});

$('.funnel-lhs-box .delete-icon').click(function(e) {
		
    $(this).closest('.funnel-lhs-box').hide(1000);
	
	
});
/* Funnel Ends*/

/* Campaign 4 */
$('.camp-4 .saved-segment-box').click(function(e) {
$(this).find('.check-container').toggleClass('inp-check');

});

/* Campaign 4 Ends*/