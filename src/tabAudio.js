//NOT IN USE, AND PROBABLY NOT WORKING, BUT KEEPING FOR REFERENCE
export default class tabAudio {
  #tabAudioMap
  constructor() {
    this.#tabAudioMap = new WeakMap();
    this.#tabAudioMap.set('audioContext', null);
    this.#tabAudioMap.set('source', null);
    this.#tabAudioMap.set('comp', null);
    this.#tabAudioMap.set('gain', null);
    this.#tabAudioMap.set('state', null);
  }
  clear() {
    this.#tabAudioMap = new WeakMap();
  }
  delete(key) {
    return this.#tabAudioMap.delete(key);
  }
  get(key) {
    return this.#tabAudioMap.get(key);
  }
  has(key) {
    return this.#tabAudioMap.has(key);
  }
  set(key, value) {
    this.#tabAudioMap.set(key, value);
    return this.#tabAudioMap.get(key);
  }
}