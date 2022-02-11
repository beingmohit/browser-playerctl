// @ts-check
/// <reference path="../jquery.d.ts" />

/**
 * @typedef {("Track"|"Playlist"|"None")} LoopStatus
 */

class Soundcloud extends MprisBase {
  constructor() {
    super("Soundcloud");
    console.log("Soundcloud", "constructor");
  }

  init() {
    console.log("Soundcloud", "init");
    this.update();

    setInterval(() => this.update(), 2000);
  }

  /**
   * @param {Function} callback
   */
  getPosition(callback) {
    var selector = ".playbackTimeline__timePassed span";
    if (!$(selector).last().length) return callback(0);

    callback(this.microSeconds($(selector).last().text()));
  }

  /**
   * @param {Function} _callback
   * @param {number} value
   */
  setVolume(_callback, value) {
    var currentVol = Number($(".volume__sliderWrapper").attr("aria-valuenow"));
    if (
      (value === 0.0 && currentVol !== 0) ||
      (value > 0.0 && currentVol === 0)
    ) {
      $(".volume__button").click();
    }
  }

  /**
   * @param {Function} _callback
   * @param {boolean} enable
   */
  setShuffle(_callback, enable) {
    var shuffleEl = $(".shuffleControl");
    var isShuffling = $(".shuffleControl").hasClass("m-shuffling");
    if ((enable && !isShuffling) || (!enable && isShuffling)) {
      shuffleEl.click();
    }
    this.update();
  }

  /**
   *  @param {Function} _callback
   *  @param {LoopStatus} value
   */
  setLoopStatus(_callback, value) {
    var repeatButton = $(".repeatControl");
    var isLoopDisabled = repeatButton.hasClass("m-none");
    var isLoopTrack = repeatButton.hasClass("m-one");
    var isLoopPlaylist = repeatButton.hasClass("m-all");

    if (value === "Playlist") {
      if (isLoopDisabled) {
        repeatButton.click();
        setTimeout(() => repeatButton.click(), 100);
      } else if (isLoopTrack) {
        repeatButton.click();
      }
    } else if (value === "Track") {
      if (isLoopDisabled) {
        repeatButton.click();
      } else if (isLoopPlaylist) {
        repeatButton.click();
        setTimeout(() => repeatButton.click(), 100);
      }
    } else if (value === "None") {
      if (isLoopTrack) {
        repeatButton.click();
        setTimeout(() => repeatButton.click(), 100);
      } else if (isLoopPlaylist) {
        repeatButton.click();
      }
    }

    this.update();
  }

  /**
   * @param {Function} callback
   */
  next(callback) {
    var buttonEl = $(".skipControl__next.playControls__next");

    if (buttonEl.length > 0) {
      buttonEl.click();
    }

    callback();
    this.update();
  }

  /**
   * @param {Function} callback
   */
  previous(callback) {
    var buttonEl = $(".skipControl__previous.playControls__prev");

    if (buttonEl.length > 0) {
      buttonEl.click();
    }

    callback();
    this.update();
  }

  /**
   * @param {Function} callback
   */
  playPause(callback) {
    var buttonEl = $(".playControl.playControls__control.playControl");

    buttonEl.click();

    callback();
    this.update();
  }

  /**
   * @param {Function} callback
   */
  pause(callback) {
    var buttonEl = $(".playControl.playControls__control.playControl");

    if (buttonEl.length > 0 && buttonEl.hasClass("playing")) {
      buttonEl.click();
    }

    callback();
    this.update();
  }

  /**
   * @param {Function} callback
   */
  play(callback) {
    var buttonEl = $(".playControl.playControls__control.playControl");

    if (buttonEl.length > 0 && !buttonEl.hasClass("playing")) {
      buttonEl.click();
    }

    callback();
    this.update();
  }

  /**
   * @param {Function} callback
   */
  stop(callback) {
    var playPauseButton = $(".playControls__play");
    var isPlaying = playPauseButton.hasClass("playing");

    if (isPlaying) {
      playPauseButton.click();
    }
    this.seek(callback, 0);

    callback();
    this.update();
  }

  /**
   * @param {Function=} _callback
   */
  update = (_callback) => {
    var playPauseButton = $(".playControl.playControls__control.playControl");
    var title = $(".playbackSoundBadge__titleLink");
    var artist = $(".playbackSoundBadge__lightLink");
    var length = $(".playbackTimeline__duration span").last();
    var volume = $(".volume__sliderWrapper");
    var isShuffling = $(".shuffleControl").hasClass("m-shuffling");
    var repeatButton = $(".repeatControl");
    var isLoopDisabled = repeatButton.hasClass("m-none");
    var isLoopTrack = repeatButton.hasClass("m-one");
    var isLoopPlaylist = repeatButton.hasClass("m-all");
    var avatar = $(
      ".playControls__soundBadge .image.image__lightOutline > span"
    );

    if (playPauseButton.length > 0 && playPauseButton.hasClass("playing")) {
      this.media.PlaybackStatus = "Playing";
    } else if (
      playPauseButton.length > 0 &&
      !playPauseButton.hasClass("playing")
    ) {
      this.media.PlaybackStatus = "Paused";
    } else {
      this.media.PlaybackStatus = "Stopped";
    }

    this.media.CanGoNext = true;
    this.media.CanGoPrevious = true;

    if (title.get(0)) {
      this.media.Metadata["mpris:trackid"] = title.attr("title");
      this.media.Metadata["xesam:title"] = title.attr("title");
    }

    if (avatar.get(0)) {
      var image = avatar.css("background-image");
      image = image.substring(5, image.length - 2).replace("50x50", "250x250"); // rip out url function
      this.media.Metadata["mpris:artUrl"] = image;
    }

    if (title.get(0) && title.attr("href")) {
      this.media.Metadata["xesam:url"] =
        "https://soundcloud.com" + title.attr("href");
    }

    if (artist.get(0)) {
      this.media.Metadata["xesam:artist"] = [artist.first().text()];
    }

    if (length.get(0)) {
      this.media.Metadata["mpris:length"] = this.microSeconds(length.text());
    }

    if (volume.get(0)) {
      this.media.Volume = parseFloat(volume.attr("aria-valuenow"));
    }

    this.media.Shuffle = isShuffling;

    this.media.LoopStatus = isLoopDisabled
      ? "None"
      : isLoopPlaylist
      ? "Playlist"
      : isLoopTrack
      ? "Track"
      : "None";

    if (!_.isEqual(this.oldMedia, this.media)) {
      this.oldMedia = _.cloneDeep(this.media);
      this.changed(this.media);
    }
  };

  /**
   * @param {any} position
   */
  microSeconds(position) {
    position = position.split(":");

    if (position.length != 2) return 0;

    position = parseInt(position[0]) * 60 + parseInt(position[1]);
    position = position * 1e6;
    return position;
  }
}

var soundcloud = new Soundcloud();

var checkExist = setInterval(function () {
  $(window).on("load", function () {
    console.log("Soundcloud", "checkExist", arguments);
    clearInterval(checkExist);
    soundcloud.init();
  });
}, 100);
