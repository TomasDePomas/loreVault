export const singletonConstructor = <TClass>(
  instance: TClass,
  classDefinition: { new (): TClass; [key: string]: any },
  constructor?: (instance: TClass) => TClass,
) => {
  const instanceKey = `_${classDefinition.name}singletonInstance`
  if (classDefinition[instanceKey]) {
    return classDefinition[instanceKey]
  }

  if (constructor) {
    instance = constructor(instance)
  }
  classDefinition[instanceKey] = instance

  return instance
}

export default class Singleton<TClass = any> {
  constructor(
    classObject: { new (): TClass; [key: string]: any },
    constructor?: (instance: TClass) => TClass,
  ) {
    return singletonConstructor<TClass>(
      this as unknown as TClass,
      classObject,
      constructor,
    )
  }
}
