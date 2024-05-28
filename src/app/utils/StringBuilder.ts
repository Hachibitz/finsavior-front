export class StringBuilder {
  private parts: string[];

  constructor(initialValue: string = "") {
    this.parts = [initialValue];
  }

  append(value: string): StringBuilder {
    this.parts.push(value);
    return this; // Permite o encadeamento de métodos
  }

  toString(): string {
    return this.parts.join("");
  }

  clear(): void {
    this.parts = [];
  }
}
