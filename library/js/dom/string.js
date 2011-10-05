/**
 * Module contains some utility functions for Strings operations
 * @module string Module contains some utility functions for Strings operations
 */
define(function() {
	var selectorCaseCashe = {};
	return {
		/**
		 * Build a new string from arguments
		 * @method build
		 * @param {varargs} strings to concatenate into one
		 * @return {String} String that was created
		 */
		build: function(var_args) {
			return Array.prototype.join.call(arguments, '');
		},
		/**
		 * @method selectorCase Returns the string as selector viable case (i.e. background-color becomes backgroundColor)
		 * @param {String} String to change
		 */
		selectorCase: function(str) {
			return selectorCaseCashe[str] || (selectorCaseCashe[str] = String(str).replace(/([A-Z])/g, '-$1').toLowerCase());
		},
		/**
		 * @method isAlpha Tests if the string contains only letters returns boolean
		 * @param {String} String to test
		 */
		isAlpha: function(str) {
			return !/[^a-zA-Z]/.test(str);
		},
		isNumeric: function(str) {
			return !/[^0-9]/.test(str);
		},
		isAlNum: function(str) {
			return !/[^a-zA-Z0-9]/.test(str);
		},
		/**
		 * @method stripNewLine Removes new lines from text
		 * @param {String} String to remove the new lines from
		 */
		stripNewLine: function(str) {
			return str.replace(/(\r\n|\r|\n)+/g, ' ');
		},
		/**
		 * @method normalizeWhiteSpace Remplaces musltiple white spaces with one
		 * @param {String} String to clean
		 */
		normalizeWhiteSpace: function(str) {
			return str.replace(/\xa0|\s/g, ' ');
		},
		htmlize: function(str) {
			return str.replace(/(\r\n|\r|\n)/g, opt_xml ? '<br />' : '<br>');
		},
		textilize: function(str) {
			return str.replace(/(<br>|<BR>|<br\ \/>)/g, '\n');
		},
		toNumber: function(str) {
			var num = Number(str);
			if (num == 0 && this.isEmpty(str)) {
				return NaN;
			}
			return num;
		},
		/**
		 * @method isEmpty Returns boolean, true if the string is empty
		 * @param {String} The string to test
		 */
		isEmpty: function(str) {
			return /^[\s\xa0]*$/.test(str);		
		},
		/**
		 * @method shrink Shrinks a string to fit the length required
		 * @param {String} String to shrink
		 * @param {Number} Desired length
		 */
		shrink: function(str, l) {
			l = parseInt(l, 10);
			if (str.length > l) {
				return str.substring(0, l - 4) + ' ...';
			}
			return str;
		},
		camelCase: function(str) {
			return str.replace(/-\D/g, function(match) {
				return match.charAt(1).toUpperCase();
			});
		},
		trim: function(str) {
			return str.replace(/^\s+|\s+$/g, '');
		},
		clean: function(str) {
			return this.trim(str.replace(/\s+/g, ' '));
		},
		contains: function(str, string, separator) {
			return (separator) ? (separator + str + separator).indexOf(separator + string + separator) > -1 : str.indexOf(string) > -1;
		},
		makeSafe: function(obj) {
			return obj == null ? '' : String(obj);
		},
		substitute: function(str, object, regexp ) {

			return str.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
				if (match.charAt(0) == '\\') return match.slice(1);
				return (object[name] != null) ? object[name] : '';
			});
		}
	};
});
