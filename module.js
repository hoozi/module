/**
 * 不考虑加载的module，包括define，use;
 */
(function(root){
    var _array = [],
        _push = _array.push;
    root.module = {
        moduleMap: {},
        define: function(name, deps, factory) {
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
                module.entity = module.factory.apply(null, args)
            }
            return module.entity;
        }
    }
})(typeof window !== 'undefined' ? window : this)