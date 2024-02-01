export const appendCookieConsent = (element, options = {}) => {
    options = {
        ignoreAttributeName: '',
        delay: 0,
        ...options
    }

    const script = document.createElement('script')

    ;[...element.attributes].forEach(({ specified, name, value }) => {
        if (specified && name.includes(options.ignoreAttributeName) && name.includes('type')) {
            script.setAttribute(name, value)
        }
    })

    script.innerHTML = element.innerHTML

    setTimeout(() => {
        (element.closest('head') ? document.head : document.body).appendChild(script)

        element.remove()
    }, options.delay)
}

export const unsetCookieConsent = () => {
    document.cookie.split(';').forEach(c => {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    })
}

export const setCookieConsent = (type, options) => {
    options = {
        name: 'lib-cookieconsent',
        expire: 31556926 * 1000,
        setItem: (key, value) => localStorage.setItem(key, value),
        getItem: (key, value) => localStorage.getItem(key),
        ...options
    }

    return new Promise(resolve => {
        options.setItem(options.name, JSON.stringify(type))
        options.setItem(`${options.name}-expire`, (Date.now() + options.expire).toString())

        if (type.length > 0) {
            resolve(type)
        } else {
            options.setItem(options.name, JSON.stringify([]))
            unsetCookieConsent()
            resolve([])
        }
    })
}
