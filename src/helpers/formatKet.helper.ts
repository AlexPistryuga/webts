import type { IDevice } from '@/mst/types'

export function formatKey(key: string): string {
    return key
        .split('_')
        .map((word, index) => {
            if (index === 0) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            }
            return word.toLowerCase()
        })
        .join(' ')
}

export function getCurrentSelection(mac: IDevice['mac_addr']) {
    const selection = localStorage.getItem(`selection_${mac}`)

    if (!selection?.length) return []

    return selection.split(',')
}
