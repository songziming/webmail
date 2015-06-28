/**
 * Created by wungcq on 15/6/28.
 */
define(function(require, exports, module) {

	/**
	 * @class Map
	 * @constructor
	 * @param {Array} iterable
	 **/
	function Map (iterable) {
		/**
		 * @property keys
		 * @readonly
		 * @type {Array}
		 * @default []
		 **/
		this.keys = [];

		/**
		 * @property values
		 * @readonly
		 * @type {Array}
		 * @default []
		 **/
		this.values = [];

		if (iterable) {
			for (var i = -1, l = iterable.length; ++i < l;) {
				this.set(iterable[i][0], iterable[i][1]);
			}
		}
	}

	/**
	 * @property size
	 * @readonly
	 * @type {Number}
	 * @default 0
	 **/
	Object.defineProperty(Map.prototype, 'size', {
		configurable: true,
		get: function size () {
			return this.keys.length;
		}
	});

	/**
	 * @method get
	 * @param {any} key
	 * @return {any}
	 **/
	Map.prototype.get = function (key) {
		return this.values[indexOf(this.keys, key)];
	};

	/**
	 * @method set
	 * @chainable
	 * @param {any} key
	 * @param {any} value
	 * @return {Map}
	 **/
	Map.prototype.set = function (key, value) {
		var index = indexOf(this.keys, key);

		if (~index) {
			this.values[index] = value;
		} else {
			this.keys.push(key);
			this.values.push(value);
		}

		return this;
	};

	/**
	 * @method delete
	 * @param {any} key
	 * @return {Boolean}
	 **/
	Map.prototype.delete = function (key) {
		var index = indexOf(this.keys, key);

		if (~index) {
			this.keys.splice(index, 1);
			this.values.splice(index, 1);

			return true;
		}

		return false;
	};

	/**
	 * @method has
	 * @param {any} key
	 * @return {Boolean}
	 **/
	Map.prototype.has = function (key) {
		return !!~indexOf(this.keys, key);
	};

	/**
	 * @method clear
	 * @chainable
	 * @return {Map}
	 **/
	Map.prototype.clear = function () {
		this.keys.splice(0);
		this.values.splice(0);

		return this;
	};

	/**
	 * @method forEach
	 * @chainable
	 * @param {Function} callback
	 * @param {Object} context
	 * @return {Map}
	 **/
	Map.prototype.forEach = function (callback, context) {
		for (var i = -1, l = this.keys.length; ++i < l;) {
			callback.call(context, this.values[i], this.keys[i], this);
		}

		return this;
	};


	// 或者通过 module.exports 提供整个接口
	module.exports = Map;
});