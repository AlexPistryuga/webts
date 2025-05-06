export const cleanStringFields = <T extends object>(data: T): T => {
    return (Object.keys(data) as (keyof typeof data)[]).reduce((acc, key) => {
        const value = data[key]

        if (typeof value === 'string') {
            acc[key] = value.trim() as typeof value
        } else {
            acc[key] = value
        }

        return acc
    }, {} as T)
}
