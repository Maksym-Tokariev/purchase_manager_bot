export function getContext(instance: any): string {
    if (typeof instance === "string") {
        return instance;
    }
    if (!instance || !instance.constructor.name) {
        return 'Unknown';
    }
    return instance.constructor.name;
}