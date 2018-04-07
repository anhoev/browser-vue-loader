import { ModuleNamespace } from 'es-module-loader/core/loader-polyfill'

export default class BaseProcessor {
  constructor (loader) {
    this._loader = loader
  }

  getModuleByKey = (key) => this._loader.registry.get(key)

  sendToRouter = async (name, key, source, ...extra) => this._loader.router.routeTo(name, key, source, ...extra)

  registerModuleNamespace = (key, module) => this._loader.registry.set(key, new ModuleNamespace(module))

  registerEsSourceCode(key, source) {
    const register = (...args) => this._loader.register(key, ...args)
    const registerDynamic = (...args) => this._loader.registerDynamic(key, ...args)
    function evalFunction() {
      // This variable is needed for evaluating the transformed code.
      const System = {register, registerDynamic}
      eval(source)
    }
    evalFunction.call({})
  }

}
