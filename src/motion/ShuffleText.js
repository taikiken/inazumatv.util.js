/**
 * license inazumatv.com
 * author (at)taikiken / http://inazumatv.com
 * date 2013/12/13 - 16:58
 *
 * Copyright (c) 2011-2013 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */
/**
 * ShuffleText by Yasunobu Ikeda. Feb 3, 2012
 * Visit http://clockmaker.jp/ for documentation, updates and examples.
 *
 *
 * Copyright (c) 2012 Yasunobu Ikeda
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
// -----------------------------------
//  original code by clockMaker's  ShuffleText.js
//  http://clockmaker.jp/blog/2012/02/html5_shuffletext/
//
//  modified by (at)taikiken
// -----------------------------------
( function ( inazumatv ){
  "use strict";

  var
    rand = Math.random,
    floor = Math.floor,

    FPSManager = inazumatv.FPSManager,
    EventDispatcher = inazumatv.EventDispatcher,
    EventObject = inazumatv.EventObject;

  /**
   * テキストをシャッフルし表示します
   * @class ShuffleText
   * @constructor
   */
  function ShuffleText () {
    /**
     * フレームレート
     * @property fps
     * @default 60
     * @type {number}
     */
    this.fps = 60;
    /**
     * ランダムテキストに用いる文字列
     * @property randomChar
     * @default "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
     * @type {string}
     */
    this.randomChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    /**
     * 空白に用いる文字列
     * @property emptyCharacter
     * @default "*"
     * @type {string}
     */
    this.emptyCharacter = "*";
    /**
     * 再生中かどうかを示すブール値
     * @property isRunning
     * @default false
     * @type {boolean}
     */
    this.isRunning = false;
    /**
     * @property duration
     * @default 500
     * @type {number}
     */
    this.duration = 500;
    /**
     * エフェクトの実行時間(millisecond)
     * @property _boundUpdate
     * @type {function(this:ShuffleText)|*}
     * @private
     */
    this._boundUpdate = this.update.bind( this );
    /**
     * 60fps で処理します
     * @property _fps
     * @type {null|FPSManager}
     * @private
     */
    this._fps = null;
    /**
     * @property _originalStr
     * @type {string}
     * @private
     */
    this._originalStr = "";
    /**
     * @property _originalLength
     * @type {string}
     * @private
     */
    this._originalLength = "";
    /**
     * @property _intervalId
     * @type {number}
     * @private
     */
    this._intervalId = 0;
    /**
     * @property _timeCurrent
     * @type {number}
     * @private
     */
    this._timeCurrent = 0;
    /**
     * @property _timeStart
     * @type {number}
     * @private
     */
    this._timeStart = 0;
    /**
     * @property _randomIndex
     * @type {Array}
     * @private
     */
    this._randomIndex = [];
    /**
     * @property _keep
     * @type {boolean}
     * @private
     */
    this._keep = false;
    /**
     * @property _endStr
     * @type {string}
     * @private
     */
    this._endStr = "";
    /**
     * @property _element
     * @type {null} HTMLElement
     * @private
     */
    this._element = null;
  }

  /**
   * @event CHANGE
   * @static
   * @type {string}
   */
  ShuffleText.CHANGE = "shuffleTextChange";
  /**
   * @event COMPLETE
   * @static
   * @type {string}
   */
  ShuffleText.COMPLETE = "shuffleTextComplete";

  var p = ShuffleText.prototype;

  EventDispatcher.initialize( p );

  p.constructor = ShuffleText;

  /**
   * 初期処理
   * @method initialize
   * @param {*|HTMLElement} element DOMElement
   * @return ShuffleText
   */
  p.initialize = function ( element ){
    this._element = element;
    this._fps = new FPSManager( this.fps );

    return this;
  };

  /**
   * @method setDuration
   * @param {Number} ms millisecond
   * @return ShuffleText
   */
  p.setDuration = function ( ms ){
    this.duration = ms;
    return this;
  };

  /**
   * 置き換え文字列（テキスト）を設定します。
   * @method setText
   * @param {string} text
   * @return ShuffleText
   */
  p.setText = function ( text ) {
    this._originalStr = text;
    this._originalLength = text.length;

    return this;
  };
  /**
   * フレームレートを設定します
   * @method setFPS
   * @param {number} fps
   * @return {ShuffleText}
   */
  p.setFPS = function ( fps ) {
    this.fps = fps;

    return this;
  };
  /**
   * ランダムテキストに用いる文字列を置き換えます
   * @method setRandomChar
   * @param {string} char
   * @return {ShuffleText}
   */
  p.setRandomChar = function ( char ) {
    this.randomChar = char;
    return this;
  };

  /**
   *
   * 再生を開始します。
   * @method start
   * @param {boolean=false} [is_keep]
   * */
  p.start = function ( is_keep ) {
    var
      element = this._element,
      str = "",
      random_index,
      empty_char = this.emptyCharacter,
      origin_length = this._originalLength,
      i, _fps, rate;

    if ( typeof element === "undefined" || element === null ) {
      return;
    }

    is_keep = !!is_keep;

    this._keep = is_keep;

    if ( this.isRunning ) {
      this.stop( true );
    }

    this._randomIndex = [];
    random_index = this._randomIndex;

    //var str = "",
    //  random_index = this._randomIndex,
    //  empty_char = this.emptyCharacter,
    //  origin_length = this._originalLength;


    this._endStr = this._originalStr;

    for ( i = 0; i < origin_length; i++ ) {

      rate = i / origin_length;

      random_index[ i ] = rand() * ( 1 - rate ) + rate;

      str += empty_char;
    }

    _fps = this._fps;

    _fps.changeFPS( this.fps );
    _fps.addEventListener( FPSManager.FPS_FRAME, this._boundUpdate );

    this.isRunning = true;

    if ( !is_keep ) {
      element.innerHTML = str;
    }

    this._timeStart = new Date().getTime();
    _fps.start();
  };

  /**
   * 停止します。
   * @method stop
   * */
  p.stop = function ( strong ) {
    strong = !!strong;

    if ( this.isRunning ) {

      this._fps.removeEventListener( FPSManager.FPS_FRAME, this._boundUpdate );
      this._fps.stop();

      if ( strong ) {

        this._element.innerHTML = this._endStr;
      }
    }

    this.isRunning = false;
  };

  /**
   *
   * @method update
   */
  p.update = function () {
    var
      timeCurrent = new Date().getTime() - this._timeStart,
      percent = timeCurrent / this.duration,
      random_index = this._randomIndex,
      origin_str = this._originalStr,
      empty_char = this.emptyCharacter,
      random_char = this.randomChar,
      random_char_length = random_char.length,
      is_keep = this._keep,
      str = "",
      i, limit;

    for ( i = 0, limit = this._originalLength; i < limit; i++ ) {

      if ( percent >= random_index[ i ] ) {

        str += origin_str.charAt(i);

      } else {
        if ( !is_keep ) {
          if ( percent < random_index[ i ] / 3 ) {

            str += empty_char;
          } else {

            str += random_char.charAt( floor( rand() * ( random_char_length ) ) );
          }
        } else {

          if ( percent < random_index[ i ] / 3 ) {

            str += origin_str.charAt(i);
          } else {

            str += random_char.charAt( floor( rand() * ( random_char_length ) ) );
          }
        }
      }
    }

    this._element.innerHTML = str;
    this.onChange( str );
    this.dispatchEvent( new EventObject( ShuffleText.CHANGE, [ str ] ), this );

    if ( percent > 1 ) {

      this.stop( true );
      this.onComplete();
      this.dispatchEvent( new EventObject( ShuffleText.COMPLETE, [] ), this );
    }
  };

  /**
   * shuffle 終了 callback 関数, override して使用します
   * @method onComplete
   */
  p.onComplete = function () {

  };

  /**
   * shuffle update callback 関数, override して使用します
   * @method onChange
   * @param {string} str 変更された文字
   */
  p.onChange = function ( str ) {

  };

    inazumatv.ShuffleText = ShuffleText;

}( this.inazumatv ) );