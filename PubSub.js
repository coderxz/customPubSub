(function (window) {
  let callbackContainer = {}//制定容器
  let id = 0

  class PubSub {
// 1.消息订阅:token PubSub.subscribe('Name',callback),一般在mounted钩子内用
    static subscribe = function (msg, callback) {
      let callbacks = callbackContainer[msg] = {}
      if (!callbacks) {
        callbacks = {}
        callbackContainer[msg] = callbacks
      }
      const token = 'uid_' + ++id
      callbacks[token] = callback
      return token
    }
// 2.异步消息发布:PubSub.publish('Name',需要发布的消息)
    static publish = function (msg, data) {
      const callbacks = callbackContainer[msg]
      if (callbacks) {
        Object.values(callbacks).forEach(callback => {
          setTimeout(() => {
            callback(msg, data)
          })
        })
      }
    }
// 3.同步消息发布:PubSub.publishSync('Name',需要发布的消息)
    static publishSync = function (msg, data) {
      const callbacks = callbackContainer[msg]
      if (callbacks) {
        Object.values(callbacks).forEach(callback => {
          callback(msg, data)
        })
      }
    }
// 4.取消订阅:PubSub.unsubscribe(flag),一般在beforeDestroy钩子内用
    static unsubscribe = function (flag) {
      //  4.1:没有指定flag则取消所有消息订阅
      if (flag === undefined) {
        callbackContainer = {}
      }
      //  4.2:flag是token，取消对应的一个消息订阅
      else if (typeof flag === 'string' && flag.indexOf('uid_') === 0) {
        Object.values(callbackContainer).forEach(callvacks => {
          delete callvacks[flag]
        })
        //  4.3:flag是msgName,取消对应的所有消息订阅
      } else {
        delete callbackContainer[flag]
      }

    }

  }

  window.PubSub = PubSub
})(window)