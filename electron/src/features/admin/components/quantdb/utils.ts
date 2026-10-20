// 前端隐藏的数据集：1分/5分/Tick 体积大、日常训练/回测不用，面板不展示、
// 不参与默认勾选/同步（后端接口仍保留，预览/按需调用不受影响）。
export const HIDDEN_DATASETS = new Set([
    'min1_kline',
    'min5_kline',
    'tick_data',
]);

/** 把接口错误转成可读文本：带 HTTP 状态码与接口路径；404 特判为后端版本过旧。 */
export function describeError(error: unknown): string {
    const resp = (error as { response?: { data?: { detail?: string } } })?.response;
    const url = (error as { config?: { url?: string } })?.config?.url;
    const detail = resp?.data?.detail ?? (error instanceof Error ? error.message : undefined);
    const status = httpStatusOf(error);
    if (status === 404) {
        return `接口不存在（HTTP 404）：${url ?? '未知接口'}。后端版本可能过旧或未部署该功能，请升级后端后重试`;
    }
    if (status !== undefined) {
        return url ? `HTTP ${status} ${url}：${detail ?? '未知错误'}` : `HTTP ${status}：${detail ?? '未知错误'}`;
    }
    if ((error as { code?: string })?.code === 'ERR_NETWORK') {
        return '网络连接失败，请检查网络或后端服务是否可达';
    }
    return detail || '未知错误';
}

/** 取 axios 错误里的 HTTP 状态码（无响应时返回 undefined）。 */
export function httpStatusOf(error: unknown): number | undefined {
    return (error as { response?: { status?: number } } | undefined)?.response?.status;
}

/** YYYYMMDD → YYYY-MM-DD；非 8 位原样返回。 */
export function formatPartitionDate(raw?: string): string {
    if (!raw || raw.length !== 8) return raw ?? '—';
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

export function formatSize(sizeMb: number): string {
    if (typeof sizeMb !== 'number' || !Number.isFinite(sizeMb)) return '0 MB';
    if (sizeMb >= 1024) return `${(sizeMb / 1024).toFixed(2)} GB`;
    return `${sizeMb.toFixed(1)} MB`;
}
