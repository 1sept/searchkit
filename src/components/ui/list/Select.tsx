import * as React from "react";
import { ItemComponent, CheckboxItemComponent } from "./ItemComponents"
import { ListProps } from "./ListProps"

import {PureRender} from "../../../core"
let block = require("bem-cn")
import {map} from "lodash"
import {filter} from "lodash"
import {transform} from "lodash"
import {find} from "lodash"
import {identity} from "lodash"
//import * as ReactSelect from 'react-select'

// @PureRender
// export class Test extends React.Component<any>{
//   render() {
//     var options = [
//       { value: 'one', label: 'One' },
//       { value: 'two', label: 'Two' }
//     ];
//     return {
//       <ReactSelect
//         name="form-field-name"
//         value="one"
//         options={options}
//       />
//     };
//   }
// }
declare var $: any;

@PureRender
export class Select extends React.Component<ListProps, any> {

  static defaultProps: any = {
    mod: "sk-select",
    showCount: true,
    translate:identity,
    countFormatter:identity
  }

  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e){
    const { setItems } = this.props
    const key = e.target.value
    setItems([key])
  }
  select2Template(state){
    if (!state.id) {
      return state.text;
    }
    console.log('template');
    console.log(state);
    var baseUrl = "/user/pages/images/flags";
    var $state = $(
      '<span><img src="' + baseUrl + '/' + state.element.value.toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>'
    );
    return $state;
  }

  getSelectedValue(){
    const { selectedItems=[] } = this.props
    if (selectedItems.length == 0) return null
    return selectedItems[0]
  }
  componentDidUpdate(){
    if(this.props.customFieldsOption && this.props.select2Module){
      var $skSelect = $('#'+this.props.select2Module+' select');
      console.log('componentDidUpdate')
      console.log(this.props.customFieldsOption)
      console.log(this.select2Template)
      $skSelect.select2({
        minimumResultsForSearch: Infinity,
        templateSelection: this.select2Template
      });
      $skSelect.off("change");
      $skSelect.on("change", this.onChange);
    }
  }
  componentDidMount(){
    if(this.props.customFieldsOption && this.props.select2Module){
      var $skSelect = $('#'+this.props.select2Module+' select');

      console.log('componentDidMount');
      console.log(this.props.customFieldsOption);
      console.log(this.select2Template)

      $skSelect.select2({
        minimumResultsForSearch: Infinity,
        templateSelection: this.select2Template
      });
      $skSelect.off("change");
      $skSelect.on("change", this.onChange);
    }
  }
  // logChange(val) {
  //   console.log('Selected: ', val);
  // }

  render() {
    const { mod, className, items,
      disabled, showCount, translate, countFormatter, customFieldsOption, select2Module } = this.props
    const bemBlocks = {
      container: block(mod)
    }

    // console.log('customFieldsOption');
    // console.log(customFieldsOption);
    // console.log(this.props.select2Module);
    // console.log('_-_-_-_-_end_-_-_-_-_')

    // var test = (
    //   <ReactSelect
    //     name="form-field-name"
    //     value="one"
    //     options={options}
    //   />
    // )
    //console.log(test);
    //console.log(Test);
    if(customFieldsOption != undefined && select2Module){
      return (
        <div className={bemBlocks.container().mix(className).state({ disabled }) } id={select2Module}>
          <select onChange={this.onChange} value={this.getSelectedValue()}>
            {map(items, ({key, label, title, disabled, doc_count}, idx) => {
              var text = translate(label || title || key)
              console.log('currentItem')
              console.log(key,label,title)
              if(text.indexOf('remove')>-1){
                return ''
              }
              if (select2Module == 'unitSelect') text += ' класс'
              return <option key={key} value={key} disabled={disabled}>{text}</option>
            })}
          </select>
        </div>
      )
    }else{
      return (
        <div className={bemBlocks.container().mix(className).state({ disabled }) }>
          <select onChange={this.onChange} value={this.getSelectedValue()}>
            {map(items, ({key, label, title, disabled, doc_count}, idx) => {
              var text = translate(label || title || key)
              if (showCount && doc_count !== undefined) text += ` (${countFormatter(doc_count)})`
              return <option key={key} value={key} disabled={disabled}>{text}</option>
            })}
            </select>
        </div>
      )
    }
  }
}
