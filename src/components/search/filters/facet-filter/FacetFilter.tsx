import * as React from "react";

import {FacetFilterProps, FacetFilterPropTypes} from "./FacetFilterProps"

import {
  FacetAccessor, SearchkitComponent, ISizeOption,
  FastClick, renderComponent, FieldOptions
} from "../../../../core"

import {CheckboxItemList, Panel} from "../../../ui"

import {defaults} from "lodash"
import {identity} from "lodash"

export class FacetFilter<T extends FacetFilterProps> extends SearchkitComponent<T, any> {
  accessor: FacetAccessor

  static propTypes = FacetFilterPropTypes

  static defaultProps = {
    listComponent: CheckboxItemList,
    containerComponent: Panel,
    size: 50,
    collapsable: false,
    showCount: true,
    showMore: true,
    bucketsTransform:identity
  }

  constructor(props){
    super(props)
    this.toggleViewMoreOption = this.toggleViewMoreOption.bind(this)
  }
  getAccessorOptions(){
    const {
      field, id, operator, title, include, exclude,
      size, translations, orderKey, orderDirection, fieldOptions
    } = this.props
    return {
      id, operator, title, size, include, exclude, field,
      translations, orderKey, orderDirection, fieldOptions
    }
  }
  defineAccessor() {
    return new FacetAccessor(
      this.props.field, this.getAccessorOptions())
  }

  defineBEMBlocks() {
    var blockName = this.props.mod || "sk-refinement-list"
    return {
      container: blockName,
      option: `${blockName}-option`
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.operator != this.props.operator) {
      this.accessor.options.operator = this.props.operator
      this.searchkit.performSearch()
    }
  }

  toggleFilter(key) {
    this.accessor.state = this.accessor.state.toggle(key)
    this.searchkit.performSearch()
  }

  setFilters(keys) {
    this.accessor.state = this.accessor.state.setValue(keys)
    this.searchkit.performSearch()
  }

  toggleViewMoreOption(option: ISizeOption) {
    this.accessor.setViewMoreOption(option);
    this.searchkit.performSearch()
  }

  hasOptions(): boolean {
    return this.accessor.getBuckets().length != 0
  }

  getSelectedItems(){
    return this.accessor.state.getValue()
  }

  getItems(){
    return this.props.bucketsTransform(this.accessor.getBuckets())
  }

  render() {
    const { listComponent, containerComponent, showCount, title, id, countFormatter } = this.props
    const items = this.getItems();
    // console.log('this props')
    // console.log(this.props)
    if(this.props.customFieldsOption){
      //console.log(this.props.skManager);
      if(this.props.skManager){
        const skManager = this.props.skManager
        //console.log('getManager')
        //console.log(skManager.results);
        if(skManager.results){
          //console.log(this.props.skManager.results.aggregations)
          Object.keys(skManager.results.aggregations).forEach(function(key,index) {
            if(key.indexOf('topic')>-1 && items.length <= 1){ //&& skManager.results.aggregations[key]['topic'].buckets.length > 0){
              items[0].doc_count = skManager.results.aggregations[key]['topic.raw'].buckets.length;
              skManager.results.aggregations[key]['topic.raw'].buckets.map(menuItem => {
                items.push(menuItem);
              })
            }
            // if(key.indexOf('unit')>-1 && items.length <= 1 && skManager.results.aggregations[key]['unit'].buckets.length > 0){
            //   items[0].doc_count = skManager.results.aggregations[key]['unit'].buckets.length;
            //   skManager.results.aggregations[key]['unit'].buckets.map(menuItem => {
            //     items.push(menuItem);
            //   })
            // }
            // if(key.indexOf('subject')>-1 && items.length <= 1 && skManager.results.aggregations[key]['subject'].buckets.length > 0){
            //   items[0].doc_count = skManager.results.aggregations[key]['subject'].buckets.length;
            //   skManager.results.aggregations[key]['subject'].buckets.map(menuItem => {
            //     items.push(menuItem);
            //   })
            // }
          })
          console.log('topic items!!!')
          console.log(items);
        }
        //console.log(Object.keys(this.props.skManager.results));
        // if((Object.keys(this.props.skManager.results.aggregations)).indefOf('topic')>-1){
        //   console.log(this.props.skManager.results.aggregations[])
        // }
      }

      return renderComponent(containerComponent, {
        title,
        className: id ? `filter--${id}` : undefined,
        disabled: !this.hasOptions()
      }, [
        renderComponent(listComponent, {
          key:"listComponent",
          items: items,
          itemComponent: this.props.itemComponent,
          selectedItems: this.getSelectedItems(),
          toggleItem: this.toggleFilter.bind(this),
          setItems: this.setFilters.bind(this),
          docCount: this.accessor.getDocCount(),
          showCount,
          customFieldsOption: this.props.customFieldsOption,
          select2Module: this.props.select2Module,
          translate:this.translate,
          countFormatter
        }),
        this.renderShowMore()
      ]);
    }else{
      return renderComponent(containerComponent, {
          title,
          className: id ? `filter--${id}` : undefined,
          disabled: !this.hasOptions()
        }, [
          renderComponent(listComponent, {
            key:"listComponent",
            items: this.getItems(),
            itemComponent:this.props.itemComponent,
            selectedItems: this.getSelectedItems(),
            toggleItem: this.toggleFilter.bind(this),
            setItems: this.setFilters.bind(this),
            docCount: this.accessor.getDocCount(),
            select2Module: this.props.select2Module,
            showCount,
            translate:this.translate,
            countFormatter
          }),
          this.renderShowMore()
      ]);
    }
  }

  renderShowMore() {
    const option = this.accessor.getMoreSizeOption()

    if (!option || !this.props.showMore) {
        return null;
    }

    return (
      <FastClick handler={() => this.toggleViewMoreOption(option) } key="showMore">
        <div data-qa="show-more" className={this.bemBlocks.container("view-more-action") }>
          {this.translate(option.label) }
        </div>
      </FastClick>
    )
  }
}
