import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const macRegex: RegExp = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/

export function isInstanceOfMac(value: unknown): value is string {
    if (typeof value !== 'string') return false

    return macRegex.test(value)
}

export function getSelectedMacFromPath() {
    const cleanPath = window.location.pathname.split('?')[0]

    if (!cleanPath) return

    const segments = cleanPath.split('/')

    const candidate = segments[segments.length - 1]

    if (isInstanceOfMac(candidate)) return candidate

    return
}

export function useParamMac() {
    const [selectedMac, setSelectedMac] = useState(getSelectedMacFromPath())
    const { pathname } = useLocation()

    useEffect(() => {
        setSelectedMac(getSelectedMacFromPath())
    }, [pathname])

    return { selectedMac }
}

export function decodeSelectedMacsFromPath(): string[] {
    const searchParams = new URLSearchParams(window.location.search)

    const macsParam = searchParams.get('macs')

    if (!macsParam) return []

    const macs: string[] = []

    const decodedParam = decodeURIComponent(macsParam).split(',')

    for (const mac of decodedParam) {
        const trimmedMac = mac.trim()
        isInstanceOfMac(trimmedMac) && macs.push(trimmedMac)
    }

    return macs
}

export const isComposerPath = () => window.location.pathname.startsWith('/devices/compare')
