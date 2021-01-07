export const SF_ADDRESS = window.location.hostname

const isLocalhost = () => {
    if (SF_ADDRESS === 'localhost') {
        return '203.234.183.22'
    } else {
        return SF_ADDRESS
    }
}

export const SF_ENDPOINT = `http://${isLocalhost()}:8299`
export const SF_ENDPOINT_EXCEL = `http://${isLocalhost()}:8399`
export const SF_ENDPOINT_ADMIN = `http://${isLocalhost()}:8286/api`
export const SF_ENDPOINT_FILE = `http://${isLocalhost()}:8099`
