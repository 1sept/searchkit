import * as React from "react";

import {
  FastClick,
  ReactComponentType,
  PureRender
} from "../../../"

import { ItemProps } from './ListProps'

export interface ItemComponentProps extends ItemProps {
  showCheckbox: boolean
}

function itemRenderer(props: ItemComponentProps) {
  const {
    bemBlocks, onClick, active, disabled, style, itemKey,
    label, count, showCount, showCheckbox, icon, addText, category} = props;
  const block = bemBlocks.option
  const className = block()
    .state({ active, disabled })
    .mix(bemBlocks.container("item"))
    .mix(itemKey === undefined ? "inactive" : "")
  // console.log('render item, console className')
  // console.log(className);
  const hasCount = showCount && (count != undefined) && (count != null)
  return (
    <FastClick handler={itemKey === undefined ? ('') : onClick}>
      <div className={className} data-qa="option" data-key={itemKey} data-type={category}>
        {showCheckbox ? <input type="checkbox" data-qa="checkbox" checked={active} readOnly className={block("checkbox").state({ active })} data-type={category}></input> : undefined}
        <div data-qa="label" className={block("text")}><span className={icon ? icon : ''}></span>{label}<span className="classText">{addText ? addText : ''}</span></div>
        {hasCount ? < div data-qa="count" className={block("count") }>{count}</div> : undefined}
      </div>
    </FastClick>
  )
}

@PureRender
export class ItemComponent extends React.Component<ItemComponentProps, any>{

  static defaultProps = {
    showCount: true,
    showCheckbox:false
  }

  render() {
    return itemRenderer(this.props)
  }
}

@PureRender
export class CheckboxItemComponent extends React.Component<ItemComponentProps, any>{

  static defaultProps = {
    showCount: true,
    showCheckbox:true
  }

  render() {
    return itemRenderer(this.props)
  }
}
