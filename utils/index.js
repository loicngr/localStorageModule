/**
 * Print log
 * @param args
 */
export const devLog = (...args) => {
  const [message, ...rest] = args
  if (window.showLogs) {
    const logLevels = ['error', 'log', 'warn', 'info']
    const mth = logLevels.indexOf(message) !== -1 ? message : null
    const _args = typeof message === 'string' && mth === null
      ? ['[DEV] ' + message, ...rest]
      : ['[DEV]', ...args]
    console[(mth || 'info')](..._args)
  }
}

export const Cookie = {
  create: (name, value, days) => {
    let date
    let expires

    if (days) {
      date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      expires = '; expires=' + date.toUTCString()
    } else {
      expires = ''
    }
    document.cookie = name + '=' + value + expires + '; path=/'
  },

  read: (name) => {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    let i
    let c

    for (i = 0; i < ca.length; i++) {
      c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length)
      }

      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length)
      }
    }
    return null
  }
}
