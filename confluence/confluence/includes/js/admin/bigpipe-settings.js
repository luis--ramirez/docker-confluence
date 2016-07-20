require(['jquery'], function($) {
    $(document).ready(function() {
        $('a[name=bpFormButton]').each(function(i, el){
            var link = $(el);
            link.click(function(e){
                e.preventDefault();
                link.parent('form').submit();
            });
        });
    });
});

