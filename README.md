# browser-playerctl
Implements the MPRIS2 interface for Chrome and Firefox.

Currently, the following sites are supported with almost all of the capabilities MPRIS2 allows:
* [YouTube](https://youtube.com)
* [Google Play Music](https://play.google.com)
* More comming soon!

## Installation 
1. First, in Chrome, go to `Tools > Extensions` (or `chrome://extensions`), enable `Developer mode` and `Load unpacked extension...` with the root of this repo.  Notice, the extension ID.
2. Next, place [chrome-mpris2](native/chrome-mpris2) somewhere in your `$PATH` and run [install-chrome.py](native/install-chrome.py) giving it the extension ID and optionally the path (not just the directory) of your just-installed chrome-mpris2 (defaults to `~/bin/chrome-mpris2`).  This will check that you have all the dependencies and tell Chrome about chrome-mpris2 (so that the plugin can use it).
3. ???
4. Profit

## Credits
* Shamelessly copied and extended from [browser-mpris2](https://github.com/otommod/browser-mpris2) 
