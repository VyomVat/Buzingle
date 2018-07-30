(function() {

    var output = PUBNUB.$('output'), 
        input = PUBNUB.$('input'), 
        button = PUBNUB.$('button'),
        avatar = PUBNUB.$('avatar'),
        presence = PUBNUB.$('presence');

    var channel = 'mchat';
    
    // Assign a random avatar in random color
    avatar.className = 'face-' + ((Math.random() * 13 + 1) >>> 0) + ' color-' + ((Math.random() * 10 + 1) >>> 0);

    var p = PUBNUB.init({
        subscribe_key: 'sub-c-f762fb78-2724-11e4-a4df-02ee2ddab7fe',
        publish_key:   'pub-c-156a6d5f-22bd-4a13-848d-b5b4d4b36695'
    });

    p.subscribe({
        channel  : channel,
        callback : function(m) { 
            output.innerHTML = '<p><i class="' + m.avatar + '"></i><span>' +  m.text.replace( /[<>]/ig, '' ) + '</span></p>' + output.innerHTML; 
        },
        presence: function(m){
            if(m.occupancy > 1) {
                presence.textContent = m.occupancy + ' people online';
            } else {
                presence.textContent = 'Nobody else is online';
            }
        }
    });

    p.bind('keyup', input, function(e) {
        (e.keyCode || e.charCode) === 13 && publish()
    });

    p.bind('click', button, publish);

    function publish() {
        p.publish({
            channel : channel, 
            message : {avatar: avatar.className, text: input.value}, 
            x : (input.value='')
        });
    }

    $('ul.tabs li').mousemove(function () {
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    });

    $('div.tab-content').mouseleave(function () {
        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');
    });


    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');


    //Build Tabs from configured values
    $.getJSON("config.json", function (result) {
        $.each(result.pics, function (i, field) {
            //alert(i);
            $("#picList").append("<div class='pickDiv' onclick='setMode(2,&quot;" + field.main + "&quot;)'><img class='pickDiv' id='" + field.id + "' src='img/" + field.thumb + "'/></div>");
        });
        $.each(result.sprites, function (i, field) {
            $("#spriteList").append("<div class='pickDiv' onclick='setMode(3,&quot;" + field.main + "&quot;," + field.jw + "," + field.jh + "," + field.jc + ")'><img class='pickDiv' id='" + field.id + "' src='img/" + field.thumb + "'/></div>");
        });
        $.each(result.sounds, function (i, field) {
            $("#soundList").append("<div class='pickDiv' style='background:yellow' onclick='setMode(4,&quot;" + field.main + "&quot;)'>" + field.name + "</div>");
        });
    });

})();