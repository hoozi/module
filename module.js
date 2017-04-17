/**
 * 不考虑加载的module，只包括define，use;
 * exp:
 * define(moduleName, [], fn);
 * define(moduleName, fn);
 * use(moduleName);
 */
(function(root){
    var _array = [],
        _noop = function(){},
        _push = _array.push;
    root.module = {
        moduleMap: {},
        define: function(name, deps, factory) {
            var args = arguments;
            if(args.length == 2) {
                factory = deps;
                deps = [];
            }
            if(!this.moduleMap[name]) {
                var module = {
                    name: name,
                    deps: deps,
                    factory: factory
                }
                this.moduleMap[name] = module;
            }
            return this.moduleMap[name];
        },
        use: function(name) {
            var module = this.moduleMap[name];
            if(!module.entity) {
                var args = [],
                    deps = module.deps,
                    _this = this;
                deps.forEach(function(dep) {
                    var depEnity = _this.moduleMap[dep].entity;
                    if(depEnity) {
                        _push.call(args, depEnity);
                    } else {
                        _push.call(args, _this.use(_this.moduleMap(dep)));
                    }
                });
                module.entity = module.factory.apply(_noop, args)
            }
            return module.entity;
        }
    }
})(typeof window !== 'undefined' ? window : this)