/**
 * license inazumatv.com
 * author (at)taikiken / http://inazumatv.com
 * date 2013/12/12 - 17:25
 *
 * Copyright (c) 2011-2013 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */
( function ( window, inazumatv ){
    "use strict";
  var
    _float = parseFloat,
    _int = parseInt,

    navigator = window.navigator,
    _ua = navigator.userAgent,

    _ie6 = !!_ua.match(/msie [6]/i),
    _ie7 = !!_ua.match(/msie [7]/i),
    _ie8 = !!_ua.match(/msie [8]/i),
    _ie9 = !!_ua.match(/msie [9]/i),
    _ie10 = !!_ua.match(/msie [10]/i),
    _ie11 = !!_ua.match(/trident\/[7]/i) && !!_ua.match(/rv:[11]/i),
    _ie = !!_ua.match(/msie/i) || _ie11,
    _legacy = _ie6 || _ie7|| _ie8,

    _ipad = !!_ua.match(/ipad/i),
    _ipod = !!_ua.match(/ipod/i),
    _iphone = !!_ua.match(/iphone/i) && !_ipad && !_ipod,
    _ios = _ipad || _ipod || _iphone,

    _android = !!_ua.match(/android/i),
    _mobile = _ios || _android,

  // for ios chrome
    _crios = !!_ua.match(/crios/i),

    _chrome = !!_ua.match(/chrome/i),
    _firefox = !!_ua.match(/firefox/i),
    _safari = !!_ua.match(/safari/i),
    _android_standard = _android && _safari && !!_ua.match(/version/i),

    _windows = !!_ua.match(/windows/i),
    _mac = !!_ua.match(/mac os x/i),

    _touch = typeof window.ontouchstart !== "undefined",

    _fullScreen = typeof navigator.standalone !== "undefined" ? navigator.standalone : false,

    _android_phone = false,
    _android_tablet = false,
    _ios_version = -1,
    _safari_version = -1,

    _safari_versions = [ -1, 0, 0 ],
    _ios_versions = [ -1, 0, 0 ],

    _android_version = -1,
    _android_versions = [ -1, 0, 0 ],

    _chrome_version = -1,

    _crios_version = -1,

    _canvas = !!window.CanvasRenderingContext2D,

    _transition,
    _transform;

  if ( _android ) {
    _android_phone = !!_ua.match(/mobile/i);

    if ( !_android_phone ) {
      _android_tablet = true;
    }
  }

  if ( _android_standard ) {
    _chrome = false;
    _safari = false;
  }

  if ( _chrome ) {
    _safari = false;
  }

  // ios chrome
  if ( _crios ) {

    _chrome = true;
    _safari = false;
  }
  // private
  // iOS version
  // http://stackoverflow.com/questions/8348139/detect-_ios-version-less-than-5-with-javascript
  /**
   * iOS version detection
   * @for Browser
   * @method _iosVersion
   * @returns {Array} iOS version 配列 3桁
   * @private
   */
  function _iosVersion () {
    var v, versions;

    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    versions = [_int(v[1], 10), _int(v[2], 10), _int(v[3] || 0, 10)];
    _ios_version = _float( versions[ 0 ] + "." + versions[ 1 ] + versions[ 2 ] );

    return versions;
  }

  if ( _ios ) {
    _ios_versions = _iosVersion();
    _mac = false;
  }

  /**
   * Android version detection
   * @for Browser
   * @method _get_androidVersion
   * @returns {Array} Android version 配列 3桁
   * @private
   */
  function _get_androidVersion () {
    var v, versions;
    v = (navigator.appVersion).match(/Android (\d+)\.(\d+)\.?(\d+)?/);
    versions = [_int(v[1], 10), _int(v[2], 10), _int(v[3] || 0, 10)];
    _android_version = _float( versions[ 0 ] + "." + versions[ 1 ] + versions[ 2 ] );

    return versions;
  }

  if ( _android ) {
    _android_versions = _get_androidVersion();
  }

  // Safari version
  /**
   * Safari version detection
   * @returns {Array} Safari version 配列 2桁~3桁
   * @private
   */
  function _safariVersion () {
    var v, versions;

    v = (navigator.appVersion).match(/Version\/(\d+)\.(\d+)\.?(\d+)?/);
    versions = [_int(v[1], 10), _int(v[2], 10), _int(v[3] || 0, 10)];
    _safari_version = _float( versions[ 0 ] + "." + versions[ 1 ] + versions[ 2 ] );
    return versions;
  }

  //if ( _safari && !_mobile ) {
  if ( _safari ) {
    //// not _mobile and _safari
    // _safari, include mobile
    _safari_versions = _safariVersion();
  }

  function _chromeVersion () {
    var v, versions;

    v = (navigator.appVersion).match(/Chrome\/(\d+)\.(\d+)\.(\d+)\.?(\d+)?/);
    versions = [_int(v[1], 10), _int(v[2], 10), _int(v[3], 10), _int(v[4], 10)];
    return versions.join( "." );
  }

  // exclude iOS chrome
  if ( _chrome && !_crios ) {
    _chrome_version = _chromeVersion();
  }

  function _criosVersion () {
    var v, versions;

    v = (navigator.appVersion).match(/CriOS\/(\d+)\.(\d+)\.(\d+)\.?(\d+)?/);
    versions = [_int(v[1], 10), _int(v[2], 10), _int(v[3], 10), _int(v[4], 10)];
    return versions.join( "." );
  }

  if ( _crios ) {

    _crios_version = _criosVersion();
    _chrome_version = _crios_version;
  }

  // transition support
  // http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
  _transition = ( function (){
    var p = document.createElement( "p" ).style;

    return "transition" in p || "WebkitTransition" in p || "MozTransition" in p || "msTransition" in p || "OTransition" in p;

  }() );

  // transform support
  _transform = ( function (){
    var p = document.createElement( "p" ).style;

    return "transform" in p || "WebkitTransform" in p || "MozTransform" in p || "OTransform" in p || "msTransform" in p;

  }() );

  /**
   * Browser 情報を管理します
   * @class Browser
   * @constructor
   */
  var Browser = function () {
    throw "Browser cannot be instantiated";
  };

  /**
   *
   * @type {{iOS: {is: Function, number: Function, major: Function, version: Function}, Android: {is: Function, number: Function, major: Function, version: Function}, IE: {is: Function, version: Function}, Chrome: {is: Function}, Safari: {is: Function}, Firefox: {is: Function}, _ie: Function, _ie6: Function, _ie7: Function, _ie8: Function, _ie9: Function, _ie10: Function, _ie11: Function, _chrome: Function, _firefox: Function, _safari: Function, _legacy: Function, _mobile: Function, _ios: Function, _ios_version: Function, _android_version: Function, _android_version_major: Function, _android_version_num: Function, _android: Function, _iphone: Function, _ipad: Function, _ipod: Function, hideURLBar: Function}}
   */
  Browser = {
    // new version
    /**
     * iOS に関する情報
     * @for Browser
     * @property iOS
     * @type Object
     * @static
     */
    iOS: {
      /**
       * @for Browser.iOS
       * @method is
       * @returns {boolean} iOS か否かを返します
       * @static
       */
      is: function (){
        return _ios;
      },
      /**
       * @for Browser.iOS
       * @method number
       * @returns {Array} iOS version number を返します [ major, minor, build ]
       * @static
       */
      number: function (){
        return _ios_versions;
      },
      /**
       * @for Browser.iOS
       * @method major
       * @returns {Number} iOS major version number を返します
       * @static
       */
      major: function (){
        return _ios_versions[ 0 ];
      },
      /**
       * @for Browser.iOS
       * @method version
       * @returns {Number} iOS version を返します 9.99
       * @static
       */
      version: function (){
        return _ios_version;
      },
      /**
       * @for Browser.iOS
       * @method iPhone
       * @returns {Boolean} iPhone か否かを返します
       * @static
       */
      iPhone: function (){
        return _iphone;
      },
      /**
       * @for Browser.iOS
       * @method iPad
       * @returns {Boolean} iPad か否かを返します
       * @static
       */
      iPad: function (){
        return _ipad;
      },
      /**
       * @for Browser.iOS
       * @method iPod
       * @returns {Boolean} iPod か否かを返します
       * @static
       */
      iPod: function (){
        return _ipod;
      },
      /**
       * @for Browser.iOS
       * @method fullScreen
       * @returns {boolean} standalone mode か否かを返します
       * @static
       */
      fullScreen: function (){
        return _fullScreen;
      }
    },
    /**
     * Android に関する情報
     * @for Browser
     * @property Android
     * @type Object
     * @static
     */
    Android: {
      /**
       * @for Browser.Android
       * @method is
       * @returns {boolean} Android か否かを返します
       * @static
       */
      is: function (){
        return _android;
      },
      /**
       * @for Browser.Android
       * @method number
       * @returns {Array} Android version number を返します [ major, minor, build ]
       * @static
       */
      number: function (){
        return _android_versions;
      },
      /**
       * @for Browser.Android
       * @method major
       * @returns {Number} Android major version number を返します
       * @static
       */
      major: function (){
        return _android_versions[ 0 ];
      },
      /**
       * @for Browser.Android
       * @method version
       * @returns {Number} Android version を返します 9.99
       * @static
       */
      version: function (){
        return _android_version;
      },
      /**
       * @for Browser.Android
       * @method phone
       * @returns {boolean} Android Phone か否かを返します
       * @static
       */
      phone: function (){
        return _android_phone;
      },
      /**
       * @for Browser.Android
       * @method tablet
       * @returns {boolean} Android Tablet か否かを返します
       * @static
       */
      tablet: function (){
        return _android_tablet;
      },
      /**
       * @for Browser.Android
       * @method standard
       * @returns {boolean} Android standard Browser か否かを返します
       * @static
       */
      standard: function () {
        return _android_standard;
      }
    },
    /**
     * IE に関する情報
     * @for Browser
     * @property IE
     * @type Object
     * @static
     */
    IE: {
      /**
       * @for Browser.IE
       * @method is
       * @returns {boolean} IE か否かを返します
       * @static
       */
      is: function (){
        return _ie;
      },
      /**
       * @for Browser.IE
       * @method is6
       * @returns {boolean} IE 6 か否かを返します
       */
      is6: function (){
        return _ie6;
      },
      /**
       * @for Browser.IE
       * @method is7
       * @returns {boolean} IE 7 か否かを返します
       */
      is7: function (){
        return _ie7;
      },
      /**
       * @for Browser.IE
       * @method is8
       * @returns {boolean} IE 8 か否かを返します
       */
      is8: function (){
        return _ie8;
      },
      /**
       * @for Browser.IE
       * @method is9
       * @returns {boolean} IE 9 か否かを返します
       */
      is9: function (){
        return _ie9;
      },
      /**
       * @for Browser.IE
       * @method is10
       * @returns {boolean} IE 10 か否かを返します
       */
      is10: function (){
        return _ie10;
      },
      /**
       * @for Browser.IE
       * @method is11
       * @returns {boolean} IE 11 か否かを返します
       */
      is11: function (){
        return _ie11;
      },
      /**
       * @for Browser.IE
       * @method _legacy
       * @returns {boolean} IE 6 or 7 or 8 か否かを返します
       */
      legacy: function (){
        return _legacy;
      },
      /**
       * @for Browser.IE
       * @method version
       * @returns {Number} IE version を返します int 6 ~ 11, IE 6 ~ IE 11 でない場合は -1 を返します
       * @static
       */
      version: function (){
        var v = -1;
        if ( _ie11 ) {
          v = 11;
        } else if ( _ie10 ) {
          v = 10;
        } else if ( _ie9 ) {
          v = 9;
        } else if ( _ie8 ) {
          v = 8;
        } else if ( _ie7 ) {
          v = 7;
        } else if ( _ie6 ) {
          v = 6;
        }
        return v;
      }
    },
    /**
     * Chrome に関する情報
     * @for Browser
     * @property Chrome
     * @type Object
     * @static
     */
    Chrome: {
      /**
       * @for Browser.Chrome
       * @method is
       * @returns {boolean} Chrome か否かを返します
       * @static
       */
      is: function (){
        return _chrome;
      },
      /**
       * @for Browser.Chrome
       * @method version
       * @returns {string|number}
       */
      version: function () {
        return _chrome_version;
      }
    },
    /**
     * Safari に関する情報
     * @for Browser
     * @property Safari
     * @type Object
     * @static
     */
    Safari: {
      /**
       * @for Browser.Safari
       * @method is
       * @returns {boolean} Safari か否かを返します
       * @static
       */
      is: function (){
        return _safari;
      },
      /**
       * @for Browser.Safari
       * @method number
       * @returns {Array} Safari version number を返します [ major, minor, build ]
       * @static
       */
      number: function (){
        return _safari_versions;
      },
      /**
       * @for Browser.Safari
       * @method major
       * @returns {Number} Safari major version number を返します
       * @static
       */
      major: function (){
        return _safari_versions[ 0 ];
      },
      /**
       * @for Browser.Safari
       * @method version
       * @returns {Number} Safari version を返します 9.99
       * @static
       */
      version: function (){
        return _safari_version;
      }
    },
    /**
     * Firefox に関する情報
     * @for Browser
     * @property Firefox
     * @type Object
     * @static
     */
    Firefox: {
      /**
       * @for Browser.Firefox
       * @method is
       * @returns {boolean} Firefox か否かを返します
       * @static
       */
      is: function (){
        return _firefox;
      }
    },
    /**
     * Touch action に関する情報
     * @for Browser
     * @property Touch
     * @type Object
     * @static
     */
    Touch: {
      /**
       * @for Browser.Touch
       * @method is
       * @returns {boolean} Touch 可能か否かを返します
       * @static
       */
      is: function (){
        return _touch;
      }
    },
    /**
     * Mobile action に関する情報
     * @for Browser
     * @property Mobile
     * @type Object
     * @static
     */
    Mobile: {
      /**
       * @for Browser.Mobile
       * @method is
       * @returns {boolean} mobile(smart phone) か否かを返します
       * @static
       */
      is: function (){
        return _mobile;
      },
      /**
       * iPhone, Android phone. URL bar 下へスクロールさせます。<br>
       * window.onload 後に実行します。<br>
       * iOS 7 mobile Safari, Android Chrome and iOS Chrome では動作しません。
       *
       *     function onLoad () {
             *          window.removeEventListener( "load", onLoad );
             *          Browser.Mobile.hideURLBar();
             *     }
       *     window.addEventListener( "load", onLoad, false );
       *
       * @for Browser.Mobile
       * @method hideURLBar
       * @static
       */
      hideURLBar : function (){
        setTimeout( function (){ scrollBy( 0, 1 ); }, 0);
      },
      /**
       * @for Browser.Mobile
       * @method phone
       * @returns {boolean} Smart Phone(include iPod)か否かを返します
       * @static
       */
      phone: function (){
        return _ipod || _iphone || _android_phone;
      },
      /**
       * @for Browser.Mobile
       * @method tablet
       * @returns {boolean} tablet か否かを返します
       * @static
       */
      tablet: function (){
        return _ipad || _android_tablet;
      }
    },
    /**
     * Canvas に関する情報
     * @for Browser
     * @property Canvas
     * @type Object
     * @static
     */
    Canvas: {
      /**
       * @for Browser.Canvas
       * @method is
       * @returns {boolean} canvas 2D が使用可能か否かを返します
       * @static
       */
      is: function (){
        return _canvas;
      },
      /**
       * @for Browser.Canvas
       * @method webgl
       * @returns {boolean} canvas webgl 使用可能か否かを返します
       * @static
       */
      webgl: function (){
        if ( !_canvas ) {
          return false;
        }

        try {
          return !!window.WebGLRenderingContext && !!document.createElement( 'canvas' ).getContext( 'experimental-webgl' );
        } catch( e ) {
          return false;
        }
      }
    },
    Mac: {
      /**
       * @for Browser.Mac
       * @method is
       * @return {boolean} Mac OS X or not
       * @static
       */
      is: function () {
        return _mac;
      }
    },
    Windows: {
      /**
       * @for Browser.Windows
       * @method is
       * @return {boolean} Windows or not
       */
      is: function () {
        return _windows;
      }
    },
    Transition: {
      /**
       * @for Browser.Transition
       * @method is
       * @return {boolean} CSS3 transition support or not
       */
      is: function () {

        return _transition;
      }
    },
    Transform: {
      /**
       * @for Browser.Transition
       * @method is
       * @return {boolean} CSS3 transition support or not
       */
      is: function () {

        return _transform;
      }
    }
  };

  inazumatv.Browser = Browser;

  // below for compatibility to older version of inazumatv.util
  inazumatv.browser = Browser;

}( window, this.inazumatv || {} ) );