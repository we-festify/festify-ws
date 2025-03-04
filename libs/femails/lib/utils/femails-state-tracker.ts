/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFemails } from '@femails-react/types/femails';

export function getDiffKeys(
  obj1: Record<string, any>,
  obj2: Record<string, any>,
): string[] {
  const diffKeys: Set<string> = new Set();

  function compareObjects(
    o1: Record<string, any>,
    o2: Record<string, any>,
    prefix: string = '',
  ) {
    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);

    // Check keys that are in obj1 but not in obj2
    keys1.forEach((key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (!(key in o2)) {
        diffKeys.add(fullKey);
      } else if (
        typeof o1[key] === 'object' &&
        typeof o2[key] === 'object' &&
        o1[key] !== null &&
        o2[key] !== null
      ) {
        compareObjects(o1[key], o2[key], fullKey); // Recursive call for nested objects
      }
    });

    // Check keys that are in obj2 but not in obj1
    keys2.forEach((key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (!(key in o1)) {
        diffKeys.add(fullKey);
      }
    });
  }

  compareObjects(obj1, obj2);
  return Array.from(diffKeys);
}

class SerializeDeserialize {
  #replacer(_: string, value: any) {
    return value;
  }

  #reviver(_: string, value: any) {
    return value;
  }

  serialize(obj: any): string {
    return JSON.stringify(obj, this.#replacer);
  }

  deserialize(serialized: string): any {
    return JSON.parse(serialized, this.#reviver);
  }

  toStaticObject(obj: any): any {
    return this.deserialize(this.serialize(obj));
  }
}

const serializer = new SerializeDeserialize();

export class FemailsStateTracker {
  private readonly femailsInstance: IFemails;
  private readonly subscribers: Map<string, Set<() => void>>;
  private previousState: any;

  constructor(femailsInstance: IFemails) {
    this.subscribers = new Map();
    this.femailsInstance = this.createProxy(femailsInstance);
    this.previousState = serializer.toStaticObject(femailsInstance);
  }

  getInstance(): IFemails {
    return this.femailsInstance;
  }

  subscribe(path: string, callback: () => void): () => void {
    if (!this.subscribers.has(path)) {
      this.subscribers.set(path, new Set());
    }
    this.subscribers.get(path)?.add(callback);
    this.subscribers.get('*')?.add(callback);

    return () => {
      this.subscribers.get(path)?.delete(callback);
      this.subscribers.get('*')?.delete(callback);
    };
  }

  private notify(): void {
    const currentState = serializer.toStaticObject(this.femailsInstance);
    const diffKeys = getDiffKeys(this.previousState, currentState);

    const keys = new Set<string>();
    diffKeys.forEach((path) => {
      const parts = path.split('.');
      let currentPath = '';
      parts.forEach((part) => {
        currentPath += currentPath ? `.${part}` : part;
        keys.add(currentPath);
      });
    });

    this.previousState = currentState;

    keys.forEach((key) => {
      console.log('[notify]', key);
      this.subscribers.get(key)?.forEach((callback) => callback());
    });
  }

  private createProxy(target: any, path: string[] = []): any {
    const proxy = new Proxy(target, {
      get: (obj, prop: string) => {
        const value = Reflect.get(obj, prop);
        const currentPath = [...path, prop];

        if (typeof value === 'function') {
          const notifyChange = this.notify.bind(this);
          // get the current femails instance
          return function (this: any, ...args: any[]) {
            const result = value.apply(this === proxy ? obj : this, args);
            notifyChange();
            return result;
          };
        }

        if (value && typeof value === 'object') {
          return this.createProxy(value, currentPath);
        }

        return value;
      },

      set: (obj, prop: string, value: any) => {
        const result = Reflect.set(obj, prop, value);
        this.notify();
        return result;
      },

      deleteProperty: (obj, prop: string) => {
        const result = Reflect.deleteProperty(obj, prop);
        this.notify();
        return result;
      },
    });

    return proxy;
  }
}
