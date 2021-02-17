export const SF_ADDRESS = window.location.hostname

export const isLocalhost = () => {
    //@ts-ignore
    if (SF_ADDRESS === 'localhost') {
        return '192.168.0.51'
    } else {
        return '192.168.0.51'
    }
}

export const SF_ENDPOINT = `http://${isLocalhost()}:8299`
export const SF_ENDPOINT_EXCEL = `http://${isLocalhost()}:8399`
export const SF_ENDPOINT_ADMIN = `http://${isLocalhost()}:8286/api`
export const SF_ENDPOINT_FILE = `http://${isLocalhost()}:8099`
export const SF_ENDPOINT_RESOURCE = `http://${isLocalhost()}:8285/`
