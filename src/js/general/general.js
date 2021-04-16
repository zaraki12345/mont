$(document).ready(function() {

    var selectedtype="";
  
    $(".btn").click(function(){
        $(this).addClass('btn-active').siblings().removeClass('btn-active');
        selectedtype = $(this).attr('data-type');
        if(selectedtype == "all"){
            setTimeout(function(){
                $(".intro__box").fadeIn();
            },500);
        }
        else {
        $(".intro__boxes").fadeTo(100,0.1);
        $(".intro__box").not("."+selectedtype).fadeOut();
        setTimeout(function(){
            $("."+selectedtype).fadeIn();
            $(".intro__boxes").fadeTo(500,1);
        },500);
        }
        });
  });
  