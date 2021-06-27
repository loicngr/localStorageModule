import { Cookie, devLog } from './utils'

const Storage = {
  data: null,

  initPolyfill () {
    function setData (_data) {
      _data = JSON.stringify(_data)

      Cookie.create('localStorage', _data, 365)
    }

    function clearData () {
      Cookie.create('localStorage', '', 365)
    }

    function getData () {
      const _data = Cookie.read('localStorage')
      return _data ? JSON.parse(_data) : {}
    }

    const localStorageMock = (() => {
      let data = getData()

      return {
        length: 0,
        getItem (key) {
          return data[key] === undefined ? null : data[key]
        },
        key: function (i) {
          let ctr = 0
          for (const k in data) {
            if (
              ctr === i
              && data.hasOwnProperty(k)
            ) return k

            else ctr++
          }
          return null
        },
        setItem (key, value) {
          data[key] = value.toString()
          this.length++
          setData(data)
        },
        removeItem (key) {
          delete data[key]
          this.length--
          setData(data)
        },
        clear () {
          data = {}
          this.length = 0
          clearData()
        }
      }
    })()

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    })
  },

  exists () {
    const check = () => {
      try {
        const storage = window['localStorage'],
          x = '__storage_test__'
        storage.setItem(x, x)
        storage.removeItem(x)
        return true
      } catch (e) {
        devLog(e)
        return false
      }
    }

    if (!check()) {
      this.initPolyfill()
    }

    return check()
  },
  clearData () {
    this.data = null
  },
  get (key) {
    this.clearData()

    if (
      !this.exists()
      || (!key || !key.length)
      || !window.localStorage.getItem(key)
    ) return this.data

    this.data = window.localStorage.getItem(key)
    return JSON.parse(this.data)
  },
  add (key, data) {
    this.clearData()

    if (
      !this.exists()
      || (!key || !key.length)
      || !data
    ) return

    this.data = JSON.stringify(data)
    window.localStorage.setItem(key, this.data)
    return { key, data }
  },
  remove (key) {
    this.clearData()

    if (
      !this.exists()
      || (!key || !key.length)
      || !window.localStorage.getItem(key)
    ) return this.data

    window.localStorage.removeItem(key)
  },
  wipe () {
    this.clearData()

    if (!this.exists()) return
    window.localStorage.clear()
  }
}

export default Storage
