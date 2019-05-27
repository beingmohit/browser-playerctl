class YoutubeMusic extends MprisBase {
    constructor() {
        console.log('YoutubeMusic', 'constructor')
        super('Youtube Music');
    }

    init() {
        console.log('YoutubeMusic', 'init')
        this.update()

        setInterval(() => this.update(), 2000)
    }

    getPosition(callback) {
        console.log('YoutubeMusic', 'getPosition', arguments)

        if (!$('ytmusic-player-bar .time-info').length)
            return callback(0);

        var text = $('ytmusic-player-bar .time-info').text();

        text = text.split('/');

        if (text.length != 2)
            return 0;

        callback(this.microSeconds(text[0].trim()));
    }

    setRate(callback) {
        // Not supported 
    }

    setVolume(callback) {
        
    }

    setShuffle(callback, value) {

    }

    setLoopStatus(callback, value) {

    }

    setFullscreen(callback) {
        // Not supported 
    }

    next(callback) {
        console.log('YoutubeMusic', 'next', arguments)

        if ($('[aria-label="Next song"]').length)
            $('[aria-label="Next song"]').click()
        
        callback()
        this.update()
    }

    previous(callback) {
        console.log('YoutubeMusic', 'previous', arguments)

        if ($('[aria-label="Previous song"]').length)
            $('[aria-label="Previous song"]').click()

        callback()
        this.update()
    }

    playPause(callback) {
        console.log('YoutubeMusic', 'playPause', arguments)

        if ($('[title="Pause"]').length)
            $('[title="Pause"]').click()

        if ($('[title="Play"]').length)
            $('[title="Play"]').click()
        
        callback()
        this.update()
    }

    pause(callback) {
        console.log('YoutubeMusic', 'pause', arguments)

        if ($('[title="Pause"]').length)
            $('[title="Pause"]').click()

        callback()
        this.update()
    }

    play(callback) {
        console.log('YoutubeMusic', 'play', arguments)

        if ($('[title="Play"]').length)
            $('[title="Play"]').click()
        
        callback()
        this.update()
    }

    update(callback) {
        if ($('[title="Play"]').length) {
            if ($('[title="Play"]').prop('disabled')) 
                this.media.PlaybackStatus = 'Stopped'
            else 
                this.media.PlaybackStatus = 'Paused'
        } else if ($('[title="Pause"]').length) {
            this.media.PlaybackStatus = 'Playing'
        }

        if ($('[aria-label="Next song"]').length && ! $('[aria-label="Next song"]').prop('disabled'))
            this.media.CanGoNext = true
        else 
            this.media.CanGoNext = false

        if ($('[aria-label="Previous song"]').length && ! $('[aria-label="Previous song"]').prop('disabled'))
            this.media.CanGoPrevious = true
        else 
            this.media.CanGoPrevious = false    
            
        if ($('ytmusic-player-bar .content-info-wrapper .title').length) {
            this.media.Metadata["mpris:trackid"] = $('ytmusic-player-bar .content-info-wrapper .title').text()
            this.media.Metadata["xesam:title"] = $('ytmusic-player-bar .content-info-wrapper .title').text()
        }

        if ($('ytmusic-player-bar .image').length)
            this.media.Metadata["mpris:artUrl"] = $('ytmusic-player-bar .image').attr("src");

        this.media.Metadata["xesam:url"] = location.href

        if ($('ytmusic-player-bar .content-info-wrapper .subtitle').length && $('ytmusic-player-bar .content-info-wrapper .subtitle').text() && $('ytmusic-player-bar .content-info-wrapper .subtitle').text().split('•').length > 2) {
            this.media.Metadata["xesam:album"] = $('ytmusic-player-bar .content-info-wrapper .subtitle').text().split('•')[1].trim()
            this.media.Metadata["xesam:artist"] = [$('ytmusic-player-bar .content-info-wrapper .subtitle').text().split('•')[0].trim()]
            this.media.Metadata["xesam:albumArtist"] = [$('ytmusic-player-bar .content-info-wrapper .subtitle').text().split('•')[0].trim()]
        }
            
        if ($('ytmusic-player-bar .time-info').length) {
            var timestamp = $('ytmusic-player-bar .time-info').text().split('/');

            if (timestamp.length == 2) {
                this.media.Metadata["mpris:length"] = this.microSeconds(timestamp[1].trim())
            }    
        }
        
        console.log('this.media', this.media);

        if(! _.isEqual(this.oldMedia, this.media)){
            this.oldMedia = _.cloneDeep(this.media);
            this.changed(this.media)
        }
    }

    microSeconds(position) {
        position = position.split(':');

        if (position.length != 2)
            return 0;

        position = parseInt(position[0]) * 60 + parseInt(position[1])
        position = position * 1e6
        return position
    }
}

var youtubeMusic = new YoutubeMusic()

var checkExist = setInterval(function() {
    if ($("ytmusic-player-bar").length) {
       console.log('YoutubeMusic', 'checkExist', arguments)
       clearInterval(checkExist);
       youtubeMusic.init()
    }
 }, 100); 

