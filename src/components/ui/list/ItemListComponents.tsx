import * as React from "react";

import { ItemComponent, CheckboxItemComponent } from "./ItemComponents"
import { ListProps } from "./ListProps"
import { PureRender } from "../../../core/react/pure-render"

let block = require("bem-cn")

import {map} from "lodash"
import {includes} from "lodash"
import {defaults} from "lodash"
import {identity} from "lodash"

export interface ItemListProps extends ListProps {
  itemComponent?: any
}

@PureRender
export class AbstractItemList extends React.Component<ItemListProps, {}> {
  static defaultProps: any = {
    mod: "sk-item-list",
    showCount: true,
    itemComponent: CheckboxItemComponent,
    translate:identity,
    multiselect: true,
    selectItems: [],
    countFormatter:identity
  }

  isActive(option){
    const { selectedItems, multiselect } = this.props;
    if (multiselect){
      if (typeof option.key === "number" && typeof selectedItems[0] === "string") {
        option.key = option.key + ""
      }
      return includes(selectedItems, option.key)
    } else {
      if (selectedItems.length == 0){
        return null
      }
      if (typeof option.key === "number" && typeof selectedItems[0] === "string"){
         return selectedItems[0] == option.key + ""
      }
      return selectedItems[0] == option.key
    }
  }

  render() {
    const {
      mod, itemComponent, items, selectedItems = [], translate,
      toggleItem, setItems, multiselect, countFormatter,
      disabled, showCount, className, docCount, customFieldsOption
    } = this.props

    // console.log(this.props)
    // children:null
    // countFormatter:ƒ uc(t)
    // customFieldsOption:(2) [{…}, {…}]
    // docCount:0
    // itemComponent:ƒ e()
    // items:[{…}]
    // mod:"sk-item-list"
    // multiselect:true
    // selectItems:[]
    // selectedItems:["$all"]
    // setItems:ƒ ()
    // showCount:true
    // toggleItem:ƒ ()
    // translate:ƒ ()
    // key:(...)
    const bemBlocks = {
      container: block(mod),
      option: block(`${mod}-option`)
    }

    const toggleFunc = multiselect ? toggleItem : (key => setItems([key]))





    if (customFieldsOption && customFieldsOption != 'headered') {
      var allHeaders = [];
      var hederedList = [];
      //console.log('customFieldsOption');
      //console.log(customFieldsOption);
      const completeList = customFieldsOption.map(field => {
        items.map(item => {
          if (item.key == field.text) {
            field.key = item.key;
            //if (typeof item.key == 'number') {console.log("number");  field.key = field.key*1};
            field.doc_count = item.doc_count;
          }
          return field;
        })
        return field;
      })
      if(completeList.length>0 && completeList[0].hasOwnProperty('header')){
        completeList.map(menuItem=>{
          if(allHeaders.indexOf(menuItem.header)==-1){
            allHeaders.push(menuItem.header)
          }
        })
        allHeaders.map(header=>{
          var filteredItemsByHeader = completeList.filter(menuItem=>{
            return menuItem.header == header
          })
          hederedList.push({header:header,items:filteredItemsByHeader})
        })
      }
      //console.log('hederedList')
      //console.log(hederedList)
      //console.log('all filtering done');
      //console.log(completeList)
      const actions = completeList.map((option) => {
        const label = option.title || option.label || option.key || option.text
        // doc_count:92
        // key:"Английский язык"
        //console.log('actions')
        //console.log(actions)
        let origKey = option.key
        if (option.key == undefined){
          origKey = label || option.addText
        }
        return React.createElement(itemComponent, {
          label: translate(label),
          onClick: () => toggleFunc(option.key),
          bemBlocks: bemBlocks,
          key: origKey,
          itemKey: option.key,
          count: countFormatter(option.doc_count),
          rawCount: option.doc_count,
          listDocCount: docCount,
          disabled: option.disabled,
          customFieldsOption,
          showCount,
          icon: option.icon,
          addText: option.addText,
          category: option.category,
          active: this.isActive(option)
        })
      })
      if(hederedList.length>0){
        var actionsTwoLevels = hederedList.map(header=>{
          // console.log('header')
          // console.log(header)
          var actionLowLevel = header.items.map((option) => {
            // console.log('actionLowLevel')
            // console.log(option)
            const label = option.title || option.label || option.key || option.text
            if(option.hasOwnProperty('doc_count') == false){
              return ''
            }else{
              return React.createElement(itemComponent, {
                label: translate(label),
                onClick: () => toggleFunc(option.key),
                bemBlocks: bemBlocks,
                key: option.key,
                itemKey: option.key,
                count: countFormatter(option.doc_count),
                rawCount: option.doc_count,
                listDocCount: docCount,
                disabled: option.disabled,
                customFieldsOption,
                showCount,
                icon: option.icon,
                addText: option.addText,
                category: option.category,
                active: this.isActive(option)
              })
            }
          })
          actionLowLevel = actionLowLevel.filter(item=>{
            return item != ""
          })
          // console.log('actionLowLevel')
          // console.log(actionLowLevel)
          if(actionLowLevel.length<=0){
            return ''
          }else{
            return (
              <div className='menuHeader' key={header.header}>
                <h2>{header.header}</h2>
                {actionLowLevel}
              </div>
            )
          }
        })
        return (
          <div data-qa="options" className={bemBlocks.container().mix(className).state({ disabled }) }>
            {actionsTwoLevels}
          </div>
        )
      }
      return (
        <div data-qa="options" className={bemBlocks.container().mix(className).state({ disabled }) }>
          {actions}
        </div>
      )

    }else{
      // console.log('customFieldsOption off')
      // console.log(this.props);
      const actions = map(items, (option) => {
        const label = option.title || option.label || option.key
        // console.log(option)
        // doc_count:92
        // key:"Английский язык"
        return React.createElement(itemComponent, {
          label: translate(label),
          onClick: () => toggleFunc(option.key),
          bemBlocks: bemBlocks,
          key: option.key,
          itemKey: option.key,
          count: countFormatter(option.doc_count),
          rawCount:option.doc_count,
          listDocCount: docCount,
          disabled:option.disabled,
          customFieldsOption,
          showCount,
          active: this.isActive(option)
        })
      })
    return (
      <div data-qa="options" className={bemBlocks.container().mix(className).state({ disabled }) }>
        {actions}
      </div>
    )
  };
  }
}

export class ItemList extends AbstractItemList {
    static defaultProps = defaults({
      itemComponent: ItemComponent
    }, AbstractItemList.defaultProps)
}

export class CheckboxItemList extends AbstractItemList {
    static defaultProps = defaults({
        itemComponent: CheckboxItemComponent
    }, AbstractItemList.defaultProps)
}

export class Toggle extends AbstractItemList {
    static defaultProps = defaults({
        itemComponent: ItemComponent,
        mod: 'sk-toggle',
        showCount: false,
    }, AbstractItemList.defaultProps)
}

export class Tabs extends AbstractItemList {
    static defaultProps = defaults({
        itemComponent: ItemComponent,
        mod: 'sk-tabs',
        showCount: false,
        multiselect: false,
    }, AbstractItemList.defaultProps)
}
