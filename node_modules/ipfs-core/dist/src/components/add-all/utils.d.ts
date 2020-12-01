export type FixedChunkerOptions = {
    chunker: 'fixed';
    maxChunkSize?: number | undefined;
};
export type RabinChunkerOptions = {
    chunker: 'rabin';
    avgChunkSize: number;
    minChunkSize?: number | undefined;
    maxChunkSize?: number | undefined;
};
/**
 * Parses chunker string into options used by DAGBuilder in ipfs-unixfs-engine
 */
export type ChunkerOptions = FixedChunkerOptions | RabinChunkerOptions;
export type RabinChunkerSettings = {
    avgChunkSize: number;
    minChunkSize?: number | undefined;
    /**
     * Parses rabin chunker string
     */
    maxChunkSize?: number | undefined;
};
/**
 *
 * @param {string} str
 * @param {string} name
 * @returns {number}
 */
export function parseChunkSize(str: string, name: string): number;
/**
 * @typedef {Object} RabinChunkerSettings
 * @property {number} avgChunkSize
 * @property {number} [minChunkSize]
 * @property {number} [maxChunkSize]
 *
 * Parses rabin chunker string
 *
 * @param  {string}   chunker - Chunker algorithm supported formats:
 * "rabin"
 * "rabin-{avg}"
 * "rabin-{min}-{avg}-{max}"
 *
 * @returns {RabinChunkerSettings}   rabin chunker options
 */
export function parseRabinString(chunker: string): RabinChunkerSettings;
/**
 * @typedef {Object} FixedChunkerOptions
 * @property {'fixed'} chunker
 * @property {number} [maxChunkSize]
 *
 * @typedef {Object} RabinChunkerOptions
 * @property {'rabin'} chunker
 * @property {number} avgChunkSize
 * @property {number} [minChunkSize]
 * @property {number} [maxChunkSize]
 *
 * @typedef {FixedChunkerOptions|RabinChunkerOptions} ChunkerOptions
 *
 * Parses chunker string into options used by DAGBuilder in ipfs-unixfs-engine
 *
 *
 * @param  {string} [chunker] - Chunker algorithm supported formats:
 * "size-{size}"
 * "rabin"
 * "rabin-{avg}"
 * "rabin-{min}-{avg}-{max}"
 *
 * @returns {ChunkerOptions}   Chunker options for DAGBuilder
 */
export function parseChunkerString(chunker?: string | undefined): ChunkerOptions;
//# sourceMappingURL=utils.d.ts.map