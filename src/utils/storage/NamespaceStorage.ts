export class NamespaceStorage implements Storage {
  constructor(public namespace: string = "") {}

  get length(): number {
    return this.keys().length;
  }

  /** Don't use. Required by the Storage interface */
  public key(index: number): string | null {
    const key = this.keys()[index];
    if (key == null) return null;
    return window.localStorage.getItem(key);
  }

  public getItem(key: string): string | null {
    return window.localStorage.getItem(this.namespace + ":" + key);
  }

  public setItem(key: string, value: any): void {
    window.localStorage.setItem(this.namespace + ":" + key, value);
  }

  public removeItem(key: string): void {
    window.localStorage.removeItem(this.namespace + ":" + key);
  }

  /** Clears all items in the namespace */
  public clear(): void {
    for (const key of this.keys()) {
      window.localStorage.removeItem(key);
    }
  }

  /** Returns a list of keys with the namespace */
  private keys(): string[] {
    return Object.keys(window.localStorage) //
      .filter((key) => key.startsWith(this.namespace + ":"));
  }
}
