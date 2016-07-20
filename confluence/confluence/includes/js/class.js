// TODO CONFDEV-4208 - note, this is forked from JIRA code as of r142772 - it should be in AUI soon. dT
// See https://atlaseye.atlassian.com/browse/jira/jira/trunk/jira-components/jira-webapp/src/main/webapp/includes/lib/class/Class.js
// for the original.

// Inspired by base2 and Prototype
define('confluence/class', [
    'jquery'
], function(
    $
) {
    var begetObject = function (obj)
    {
        var f = function()
        {};
        f.prototype = obj;
        return new f();
    };

    var initializing = false;
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    var Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function() {

        var prop;
        var _super = this.prototype;

        if (arguments.length > 1) {

            var interfaces = $.makeArray(arguments);

            prop = interfaces.pop();

            var completeInterface;

            $.each(interfaces, function (i, inter) {
                if (completeInterface) {
                    completeInterface = completeInterface.extend(inter);
                } else {
                    completeInterface = inter;
                }
            });

            return completeInterface.extend(this.prototype).extend(prop);

        } else {
            prop = arguments[0];
        }


        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function

            if (prototype[name] = typeof prop[name] === "function" &&
                            typeof _super[name] === "function" && fnTest.test(prop[name])) {
                prototype[name] = (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]);
            } else if (typeof _super[name] === "object") {
                var newObj = begetObject(prop[name]);

                $.each(_super[name], function (name, obj) {
                    if (!newObj[name]) {
                        newObj[name] = obj;
                    } else if (typeof newObj[name] === "object") {
                        var newSubObj = begetObject(newObj[name]);
                        $.each(obj, function (subName, subObj) {
                            if (!newSubObj[subName]) {
                                newSubObj[subName] = subObj;
                            }
                        });
                        newObj[name] = newSubObj;
                    }
                });

                prototype[name] = newObj;
            } else {
                prototype[name] = prop[name];
            }
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init) {
                this.init.apply(this, arguments);
            }
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };

    return Class;
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/class', 'Class');