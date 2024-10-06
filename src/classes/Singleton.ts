export const singletonConstructor = <TClass>(
  instance: TClass,
  classDefinition: { new (): TClass; [key: string]: any },
  constructor?: (instance: TClass) => void,
) => {
  const instanceKey = `_${classDefinition.name}singletonInstance`
  if (classDefinition[instanceKey]) {
    return classDefinition[instanceKey]
  }
  classDefinition[instanceKey] = instance

  if (constructor) {
    constructor(instance)
  }
}

export default class Singleton<TClass = any> {
  constructor(
    classObject: { new (): TClass; [key: string]: any },
    constructor?: (instance: TClass) => void,
  ) {
    singletonConstructor<TClass>(
      this as unknown as TClass,
      classObject,
      constructor,
    )
  }
}
