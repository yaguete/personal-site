const { readFileSync } = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

// Run the actual TS modules with Node's test runner, without another runtime
// dependency. Each loader gets a fresh cache so fixtures cannot leak across tests.
function createLoader(overrides = {}) {
  const root = path.resolve(__dirname, '../..')
  const cache = new Map()

  function load(relativePath) {
    const filename = path.join(root, relativePath)
    if (cache.has(filename)) return cache.get(filename).exports
    const module = { exports: {} }
    cache.set(filename, module)
    const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    })
    const localRequire = (id) => {
      if (Object.hasOwn(overrides, id)) return overrides[id]
      if (id === 'server-only') return {}
      if (id.startsWith('@/')) return load(`${id.slice(2)}.ts`)
      return require(id)
    }
    new Function('require', 'module', 'exports', outputText)(
      localRequire,
      module,
      module.exports,
    )
    return module.exports
  }

  return load
}

module.exports = { createLoader }
