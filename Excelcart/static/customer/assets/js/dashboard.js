
$(document).ready(function() {
    $('.dashboard-right .content').hide();
    $('#dashboard-pill-content').show();

    $('.list-btn.active').trigger('click');

    $('.list-btn').click(function() {        
        var buttonId = $(this).attr('id');
        $('.dashboard-right .content').hide();
        $('#' + buttonId + '-content').show();
        $('.list-btn').removeClass('active');$(this).addClass('active');
    });
});
