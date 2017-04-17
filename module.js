/**
 * 不考虑加载的module，只包括define，use;
 * exp:
 * define(moduleName, [], fn);
 * define(moduleName, fn);
 * use(moduleName)
 */
(function(root, doc){
    var _array = [],
        _noop = function(){},
        _push = _array.push;
    root.Mini = {
        moduleMap: {},
        fileMap: {},
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
                for(var i=0; i<deps.length; i++) {
                    var dep = deps[i],
                        depEnity = _this.moduleMap[dep].entity;
                    if(depEnity) {
                        _push.call(args, depEnity);
                    } else {
                        _push.call(args, _this.use(dep));
                    }
                }
                module.entity = module.factory.apply(_noop, args)
            }
            return module.entity;
        },
        require: function(paths, callback) {
            var head = doc.getElementsByTagName('head')[0],
                isIE = document.all && document.compatMode,
                _this = this;
            for(var i=0; i<paths.length; i++) {
                var path = paths[i];
                if(!this.fileMap[path]) {
                    var script = doc.createElement('script');
                    script.type = 'text/javascript';
                    script.async = true;
                    script.src = path+'.js';
                    if(isIE) {
                        script.onreadystatechange = function(){
                            if(script && (/(loaded|complete)/).test(script.readyState)) {
                                loadedFn();
                            }
                        }
                    } else {
                        script.onload = function(){
                            loadedFn();
                        }
                    }
                    
                    function loadedFn() {
                        _this.fileMap[path] = true;
                        checkAllLoaded();
                        head.removeChild(script);
                        script = null;
                    }

                    head.appendChild(script);
                }
            }

            function checkAllLoaded() {
                var allLoaded = true;
                for(var i=0;i<paths.length;i++) {
                    var path = paths[i];
                    if(!_this.fileMap[path]) {
                        allLoaded = false;
                        break;
                    }
                }

                if(allLoaded) {
                    callback && callback.call(_noop);
                }
            }
        }
    }
})(typeof window !== 'undefined' ? window : this, document);


