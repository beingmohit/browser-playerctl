class PlayMusic extends MprisBase {
    constructor() {
        console.log('PlayMusic', 'constructor')
        super('Google Play Music');
    }

    init() {
        console.log('PlayMusic', 'init')
        this.update()

        setInterval(() => this.update(), 2000)
    }

    getPosition(callback) {
        console.log('PlayMusic', 'getPosition', arguments)

        if (!$('#time_container_current').length)
            return callback(0);

        callback(this.microSeconds($('#time_container_current').text()));
    }

    setRate(callback) {
        // Not supported 
    }

    setVolume(callback) {
        
    }

    setShuffle(callback, value) {
        if (value && $('[aria-label="Shuffle songs"]').length)
            $('[aria-label="Shuffle songs"]').click();

        if (!value && !$('[aria-label="Turn off shuffle songs"]').length)
            $('[aria-label="Turn off shuffle songs"]').click();
    }

    setLoopStatus(callback, value) {

    }

    setFullscreen(callback) {
        // Not supported 
    }

    next(callback) {
        console.log('PlayMusic', 'next', arguments)

        if ($('[aria-label="Next song"]').length)
            $('[aria-label="Next song"]').click()
        
        callback()
        this.update()
    }

    previous(callback) {
        console.log('PlayMusic', 'previous', arguments)

        if ($('[aria-label="Previous song"]').length)
            $('[aria-label="Previous song"]').click()

        callback()
        this.update()
    }

    playPause(callback) {
        console.log('PlayMusic', 'playPause', arguments)

        if ($('[aria-label="Pause"]').length)
            $('[aria-label="Pause"]').click()

        if ($('[aria-label="Play"]').length)
            $('[aria-label="Play"]').click()
        
        callback()
        this.update()
    }

    pause(callback) {
        console.log('PlayMusic', 'pause', arguments)

        if ($('[aria-label="Pause"]').length)
            $('[aria-label="Pause"]').click()

        callback()
        this.update()
    }

    play(callback) {
        console.log('PlayMusic', 'play', arguments)

        if ($('[aria-label="Play"]').length)
            $('[aria-label="Play"]').click()
        
        callback()
        this.update()
    }

    update(callback) {
        if ($('[aria-label="Play"]').length) {
            if ($('[aria-label="Play"]').prop('disabled')) 
                this.media.PlaybackStatus = 'Stopped'
            else 
                this.media.PlaybackStatus = 'Paused'
        } else if ($('[aria-label="Pause"]').length) {
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
            
        if ($('#currently-playing-title').length) {
            this.media.Metadata["mpris:trackid"] = $('#currently-playing-title').attr("title");
            this.media.Metadata["xesam:title"] = $('#currently-playing-title').attr("title");
        }

        if ($('#playerBarArt').length)
            this.media.Metadata["mpris:artUrl"] = $('#playerBarArt').attr("src");

        this.media.Metadata["xesam:url"] = location.href

        if ($('.player-album').length)
            this.media.Metadata["xesam:album"] = $('.player-album').text()

        if ($('#player-artist').length) {
            this.media.Metadata["xesam:artist"] = [$('#player-artist').text()]
            this.media.Metadata["xesam:albumArtist"] = [$('#player-artist').text()]
        }

        if ($('#time_container_duration').length) {
            this.media.Metadata["mpris:length"] = this.microSeconds($('#time_container_duration').text())
        }

        this.changed(this.media)
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

var playMusic = new PlayMusic()

var checkExist = setInterval(function() {
    if ($("audio").length) {
       console.log('PlayMusic', 'checkExist', arguments)
       clearInterval(checkExist);
       playMusic.init()
    }
 }, 100); 

