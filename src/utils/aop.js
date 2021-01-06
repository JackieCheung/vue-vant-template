// Helping function used to get all methods of an object
const getObjMethods = obj => Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(property => typeof obj[property] === 'function')

// Replace the original method with a custom function that will call our aspect when the advice dictates
const interceptObjMethod = (target, methodName, aspect, advice) => {
  const originalCode = target[methodName]
  target[methodName] = (...args) => {
    if (['before', 'around'].includes(advice)) {
      aspect.apply(target, args)
    }
    const returnedValue = originalCode.apply(target, args)
    if (['after', 'around'].includes(advice)) {
      aspect.apply(target, args)
    }
    if (advice === 'afterReturning') {
      return aspect.apply(target, [returnedValue])
    } else {
      return returnedValue
    }
  }
}

exports = {
  // Main method exported: inject the aspect on our target when and where we need to
  inject: (target, aspect, advice, pointcut, methodNames = null) => {
    if (pointcut === 'method') {
      if (methodNames && methodNames.length) {
        interceptObjMethod(target, Array.isArray(methodNames) ? methodNames[0] : methodNames, aspect, advice)
      } else {
        throw new Error('Try to add an aspect to a method, but no method specified!')
      }
    } else if (pointcut === 'methods') {
      const methods = getObjMethods(target);
      (Array.isArray(methodNames) ? methodNames.filter(item => methods.includes(item)) : methods).forEach(m => {
        interceptObjMethod(target, m, aspect, advice)
      })
    }
  }
}
