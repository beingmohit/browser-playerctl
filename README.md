# browser-playerctl

Implements [MPRIS](https://specifications.freedesktop.org/mpris-spec/latest/) interface for chrome, which allows you to control things like play/pause, next/previous, shuffle, etc from command line, allowing you to map keyword shortcuts. You can also fetch information of currently playing video/song and display in status bar for example. 

Supported Sites:
* [YouTube](https://youtube.com)
* [YouTube Music](https://music.youtube.com)
* [Google Play Music](https://play.google.com)
* [Spotify Web Player](https://www.spotify.com/in)
* More comming soon!

Supported Browsers:
* Chrome
* Chromium

## Installation 
1. Install [chrome extension](https://chrome.google.com/webstore/detail/browser-playerctl/ojjjidifjmbbckdjfiagdfdepbcmnicg)
2. `git clone https://github.com/beingmohit/browser-playerctl.git`
3. `cd browser-playerctl`
4. `./install.py`

## Use
After following above installation instructions, you can use any MPRIS2 controller/tool/library, some examples:
* Command line: [playerctl](https://github.com/acrisci/playerctl)
* Command line: [mpris-ctl](https://github.com/mariusor/mpris-ctl)
* i3wm status bar: [py3status mpris module](https://github.com/ultrabug/py3status) 

## Credits
Fork of https://github.com/otommod/browser-mpris2
