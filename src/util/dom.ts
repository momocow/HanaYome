export default function(selector: string): NodeListOf<Element>{
  return document.querySelectorAll(selector)
}

export function _$(selector: string): Element{
  return document.querySelector(selector)
}

export function $id(id: string): HTMLElement{
  return document.getElementById(id)
}

export function $name(name: string): NodeListOf<HTMLElement>{
  return document.getElementsByName(name)
}

export function $class(classname: string): HTMLCollectionOf<Element>{
  return document.getElementsByClassName(classname)
}

export function $tag(tag: string): NodeListOf<Element>{
  return document.getElementsByTagName(tag)
}
