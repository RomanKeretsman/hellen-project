// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/slider.js":[function(require,module,exports) {
'use strict';

var slideShow = function () {
  return function (selector, config) {
    var _slider = document.querySelector(selector),
        // основный элемент блока
    _sliderContainer = _slider.querySelector('.slider-items'),
        // контейнер для .slider-item
    _sliderItems = _slider.querySelectorAll('.slider-item'),
        // коллекция .slider-item
    _sliderControls = _slider.querySelectorAll('.slider-control'),
        // элементы управления
    _currentPosition = 0,
        // позиция левого активного элемента
    _transformValue = 0,
        // значение трансформации .slider_wrapper
    _transformStep = 100,
        // величина шага (для трансформации)
    _itemsArray = [],
        // массив элементов
    _timerId,
        _indicatorItems,
        _indicatorIndex = 0,
        _indicatorIndexMax = _sliderItems.length - 1,
        _stepTouch = 50,
        _config = {
      isAutoplay: false,
      // автоматическая смена слайдов
      directionAutoplay: 'next',
      // направление смены слайдов
      delayAutoplay: 7000,
      // интервал между автоматической сменой слайдов
      isPauseOnHover: true // устанавливать ли паузу при поднесении курсора к слайдеру

    }; // настройка конфигурации слайдера в зависимости от полученных ключей


    for (var key in config) {
      if (key in _config) {
        _config[key] = config[key];
      }
    } // наполнение массива _itemsArray


    for (var i = 0, length = _sliderItems.length; i < length; i++) {
      _itemsArray.push({
        item: _sliderItems[i],
        position: i,
        transform: 0
      });
    } // переменная position содержит методы с помощью которой можно получить минимальный и максимальный индекс элемента, а также соответствующему этому индексу позицию


    var position = {
      getItemIndex: function getItemIndex(mode) {
        var index = 0;

        for (var i = 0, length = _itemsArray.length; i < length; i++) {
          if (_itemsArray[i].position < _itemsArray[index].position && mode === 'min' || _itemsArray[i].position > _itemsArray[index].position && mode === 'max') {
            index = i;
          }
        }

        return index;
      },
      getItemPosition: function getItemPosition(mode) {
        return _itemsArray[position.getItemIndex(mode)].position;
      }
    }; // функция, выполняющая смену слайда в указанном направлении

    var _move = function _move(direction) {
      var nextItem,
          currentIndicator = _indicatorIndex;
      ;

      if (direction === 'next') {
        _currentPosition++;

        if (_currentPosition > position.getItemPosition('max')) {
          nextItem = position.getItemIndex('min');
          _itemsArray[nextItem].position = position.getItemPosition('max') + 1;
          _itemsArray[nextItem].transform += _itemsArray.length * 100;
          _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
        }

        _transformValue -= _transformStep;
        _indicatorIndex = _indicatorIndex + 1;

        if (_indicatorIndex > _indicatorIndexMax) {
          _indicatorIndex = 0;
        }
      } else {
        _currentPosition--;

        if (_currentPosition < position.getItemPosition('min')) {
          nextItem = position.getItemIndex('max');
          _itemsArray[nextItem].position = position.getItemPosition('min') - 1;
          _itemsArray[nextItem].transform -= _itemsArray.length * 100;
          _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
        }

        _transformValue += _transformStep;
        _indicatorIndex = _indicatorIndex - 1;

        if (_indicatorIndex < 0) {
          _indicatorIndex = _indicatorIndexMax;
        }
      }

      _sliderContainer.style.transform = 'translateX(' + _transformValue + '%)';

      _indicatorItems[currentIndicator].classList.remove('active');

      _indicatorItems[_indicatorIndex].classList.add('active');
    }; // функция, осуществляющая переход к слайду по его порядковому номеру


    var _moveTo = function _moveTo(index) {
      var i = 0,
          direction = index > _indicatorIndex ? 'next' : 'prev';

      while (index !== _indicatorIndex && i <= _indicatorIndexMax) {
        _move(direction);

        i++;
      }
    }; // функция для запуска автоматической смены слайдов через промежутки времени


    var _startAutoplay = function _startAutoplay() {
      if (!_config.isAutoplay) {
        return;
      }

      _stopAutoplay();

      _timerId = setInterval(function () {
        _move(_config.directionAutoplay);
      }, _config.delayAutoplay);
    }; // функция, отключающая автоматическую смену слайдов


    var _stopAutoplay = function _stopAutoplay() {
      clearInterval(_timerId);
    }; // функция, добавляющая индикаторы к слайдеру


    var _addIndicators = function _addIndicators() {
      var indicatorsContainer = document.createElement('ol');
      indicatorsContainer.classList.add('slider-indicators');

      for (var i = 0, length = _sliderItems.length; i < length; i++) {
        var sliderIndicatorsItem = document.createElement('li');

        if (i === 0) {
          sliderIndicatorsItem.classList.add('active');
        }

        sliderIndicatorsItem.setAttribute("data-slide-to", i);
        indicatorsContainer.appendChild(sliderIndicatorsItem);
      }

      _slider.appendChild(indicatorsContainer);

      _indicatorItems = _slider.querySelectorAll('.slider-indicators > li');
    };

    var _isTouchDevice = function _isTouchDevice() {
      return !!('ontouchstart' in window || navigator.maxTouchPoints);
    }; // функция, осуществляющая установку обработчиков для событий


    var _setUpListeners = function _setUpListeners() {
      var _startX = 0;

      if (_isTouchDevice()) {
        _slider.addEventListener('touchstart', function (e) {
          _startX = e.changedTouches[0].clientX;

          _startAutoplay();
        });

        _slider.addEventListener('touchend', function (e) {
          var _endX = e.changedTouches[0].clientX,
              _deltaX = _endX - _startX;

          if (_deltaX > _stepTouch) {
            _move('prev');
          } else if (_deltaX < -_stepTouch) {
            _move('next');
          }

          _startAutoplay();
        });
      } else {
        for (var i = 0, length = _sliderControls.length; i < length; i++) {
          _sliderControls[i].classList.add('slider-control-show');
        }
      }

      _slider.addEventListener('click', function (e) {
        if (e.target.classList.contains('slider-control')) {
          e.preventDefault();

          _move(e.target.classList.contains('right-control') ? 'next' : 'prev');

          _startAutoplay();
        } else if (e.target.getAttribute('data-slide-to')) {
          e.preventDefault();

          _moveTo(parseInt(e.target.getAttribute('data-slide-to')));

          _startAutoplay();
        }
      });

      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === "hidden") {
          _stopAutoplay();
        } else {
          _startAutoplay();
        }
      }, false);

      if (_config.isPauseOnHover && _config.isAutoplay) {
        _slider.addEventListener('mouseenter', function () {
          _stopAutoplay();
        });

        _slider.addEventListener('mouseleave', function () {
          _startAutoplay();
        });
      }
    }; // добавляем индикаторы к слайдеру


    _addIndicators(); // устанавливаем обработчики для событий


    _setUpListeners(); // запускаем автоматическую смену слайдов, если установлен соответствующий ключ


    _startAutoplay();

    return {
      // метод слайдера для перехода к следующему слайду
      next: function next() {
        _move('next');
      },
      // метод слайдера для перехода к предыдущему слайду
      left: function left() {
        _move('prev');
      },
      // метод отключающий автоматическую смену слайдов
      stop: function stop() {
        _config.isAutoplay = false;

        _stopAutoplay();
      },
      // метод запускающий автоматическую смену слайдов
      cycle: function cycle() {
        _config.isAutoplay = true;

        _startAutoplay();
      }
    };
  };
}();

slideShow('.slider', {
  isAutoplay: true
});
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63704" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/slider.js"], null)
//# sourceMappingURL=/slider.d16eec5e.js.map